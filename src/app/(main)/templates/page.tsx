import { getTemplatesAction } from "@/lib/templateActions";
import { CreateTemplateDialog } from "./create-template-dialog";
import { TemplateCard } from "./template-card";
import { ClipboardList } from "lucide-react";

export default async function TemplatesPage() {
  const templates = await getTemplatesAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex justify-between items-start pl-4 border-l-4 border-purple-600 ml-3 pr-2 mb-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Plantillas</h1>
          <p className="text-lg text-zinc-400 font-medium tracking-wide">Misiones Reutilizables</p>
        </div>
      </header>

      <div className="mb-8 max-w-xl mx-auto">
        <CreateTemplateDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        {templates.length > 0 ? (
          templates.map((template: any) => (
            <TemplateCard key={template.id} template={template} />
          ))
        ) : (
          <div className="col-span-full flex flex-col justify-center items-center py-20 px-6 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl border-dashed animate-in fade-in zoom-in-95 duration-700">
            <ClipboardList className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-bold text-2xl text-center max-w-sm leading-tight">
              Aún no tienes plantillas.
            </p>
            <p className="text-zinc-600 text-lg mt-3 text-center max-w-xs">
              Mete conjuntos de misiones aquí para desplegarlas al instante cuando las necesites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
