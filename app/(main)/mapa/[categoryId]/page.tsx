import { getCategoryWithChainsAction } from "@/lib/mapaActions";
import { ChainViewer } from "./chain-viewer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { CreateChainDialog } from "./create-chain-dialog";

interface ChainPageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function ChainPage({ params }: ChainPageProps) {
  const { categoryId } = await params;
  const category = await getCategoryWithChainsAction(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-screen overflow-hidden -mt-4 -mx-4 pb-20">
      
      {/* Top Header */}
      <header className="p-6 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Link 
            href="/mapa"
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Mapa</h2>
            <h1 className="text-2xl font-black text-zinc-50 tracking-tighter leading-none">{category.name}</h1>
          </div>
        </div>

        <CreateChainDialog categoryId={categoryId} />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 pt-8">
        {(category as any).chains.length > 0 ? (
          <ChainViewer category={category as any} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-900/50 rounded-full border-2 border-zinc-800 border-dashed flex items-center justify-center">
               <span className="text-4xl">⛓️</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-100 italic">Mapa sin Cadenas</h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Las categorías se expanden a través de cadenas de eventos. Crea una para empezar a trazar el mapa técnico.
              </p>
            </div>
            
            <CreateChainDialog categoryId={categoryId} />
          </div>
        )}
      </div>
    </div>
  );
}
