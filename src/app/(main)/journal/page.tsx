import { getJournalsAction, getJournalsCountAction } from "@/lib/journalActions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { JournalClient } from "@/components/JournalClient";
import { AddJournalEntry } from "./add-journal-entry";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface JournalPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const limit = 20;

  const [logs, totalEntries] = await Promise.all([
    getJournalsAction(page, limit),
    getJournalsCountAction()
  ]);

  const totalPages = Math.ceil(totalEntries / limit);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8 pb-20 px-4 mt-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-start pl-4 border-l-4 border-purple-600 ml-3 pr-2 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Diario de Abordo</h1>
          <p className="text-sm md:text-lg text-zinc-500 font-medium tracking-wide">Bitácora de Pensamientos</p>
        </div>
        <div className="flex flex-col items-center justify-center opacity-80 pt-1">
          <Image src="/rabbit.png" alt="Astryx Logo" width={36} height={36} className="object-contain mix-blend-screen opacity-90 md:w-12 md:h-12 drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">Astryx</span>
        </div>
      </header>
      
      <div className="w-full">
        <AddJournalEntry />
      </div>

      <div className="space-y-12 flex flex-col">
        {logs.map(log => (
          <div key={log.id} className="relative">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <div className="h-px bg-zinc-800 flex-1" />
              <h3 className="text-[10px] md:text-lg font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap bg-zinc-950 px-4 py-1.5 rounded-full border border-zinc-800">
                {format(new Date(log.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
              </h3>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>
            
            <JournalClient 
              initialContent={log.content} 
              dateStr={log.date.toISOString().slice(0, 10)} 
              hideTitle={true} 
            />
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <Image src="/rabbit.png" alt="Empty" width={60} height={60} className="opacity-20 grayscale" />
             <p className="text-zinc-600 text-sm italic">Tu diario está vacío. Registra tu primer pensamiento arriba.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center space-x-6 mt-12 py-10 border-t border-zinc-900">
          {page > 1 ? (
            <Link 
              href={`/journal?page=${page - 1}`}
              className="flex items-center space-x-2 text-zinc-400 hover:text-purple-500 transition-colors font-bold uppercase text-[10px] tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Link>
          ) : (
            <div className="w-20" /> // Placeholder for symmetry
          )}

          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
            Hoja <span className="text-zinc-100">{page}</span> de <span className="text-zinc-100">{totalPages}</span>
          </div>

          {page < totalPages ? (
            <Link 
              href={`/journal?page=${page + 1}`}
              className="flex items-center space-x-2 text-zinc-400 hover:text-purple-500 transition-colors font-bold uppercase text-[10px] tracking-widest"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-20" /> // Placeholder for symmetry
          )}
        </nav>
      )}
    </div>
  );
}
