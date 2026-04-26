import { getJournalsAction } from "@/lib/journalActions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { JournalClient } from "@/components/JournalClient";
import { AddJournalEntry } from "./add-journal-entry";

export default async function JournalPage() {
  const logs = await getJournalsAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8 pb-20 px-4 mt-8">
      <header className="border-l-4 border-purple-600 pl-4 py-1">
        <h1 className="text-3xl font-black text-white tracking-tight">Diario de Abordo</h1>
      </header>
      
      <AddJournalEntry />

      <div className="space-y-6 flex flex-col">
        {logs.map(log => (
          <div key={log.id} className="bg-zinc-900/30 p-2 rounded-2xl border border-zinc-800/50 shadow-sm relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-purple-600/50" />
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 px-3 pt-2">
               {format(new Date(log.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
             </h3>
             <JournalClient 
               initialContent={log.content} 
               dateStr={log.date.toISOString().slice(0, 10)} 
               hideTitle={true} 
             />
          </div>
        ))}
        {logs.length === 0 && <p className="text-zinc-600 text-sm italic">Tu diario está vacío.</p>}
      </div>
    </div>
  );
}
