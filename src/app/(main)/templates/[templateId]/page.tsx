import { getTemplateByIdAction } from "@/lib/templateActions";
import { getAllCategoriesWithChainsAction } from "@/lib/mapaActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { CreateItemDialog } from "./create-item-dialog";
import { TemplateItemCard } from "./item-card";

interface TemplatePageProps {
  params: Promise<{ templateId: string }>;
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { templateId } = await params;
  
  const [template, categories] = await Promise.all([
    getTemplateByIdAction(templateId),
    getAllCategoriesWithChainsAction()
  ]);

  if (!template) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="p-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Link 
            href="/templates"
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em] mb-1 leading-none">Plantilla Activa</h2>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-50 tracking-tighter leading-none">{template.name}</h1>
          </div>
        </div>
        
        <CreateItemDialog templateId={template.id} categories={categories} />
      </header>

      <div className="max-w-4xl mx-auto space-y-4 px-2 pb-24">
        {template.description && (
          <p className="text-zinc-400 mb-8 border-l-2 border-zinc-800 pl-4">{template.description}</p>
        )}

        {template.items.length > 0 ? (
          template.items.map((item: any) => (
            <TemplateItemCard key={item.id} item={item} templateId={template.id} categories={categories} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl border-dashed">
            <ClipboardList className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-bold text-xl text-center max-w-sm leading-tight">
              Esta plantilla está vacía.
            </p>
            <p className="text-zinc-600 text-sm mt-3 text-center max-w-sm">
              Añade misiones preconfiguradas para desplegarlas todas juntas con un solo click.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
