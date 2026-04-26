import { getTodayLogAction } from "@/lib/dailyLogActions";
import { getTodayJournalAction } from "@/lib/journalActions";
import { JournalClient } from "@/components/JournalClient";
import { formatDateArg, getNowArg } from "@/lib/dateUtils";
import { TaskItem } from "./task-item";
import { getLatestEventsPerChainAction, getCategoriesAction } from "@/lib/mapaActions";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Zap, Plus, Link as LinkIcon } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";
import { CreateEventDialog } from "./mapa/[categoryId]/create-event-dialog";

export default async function HoyPage() {
  const [dailyLog, journalLog, latestEvents, categories] = await Promise.all([
    getTodayLogAction(),
    getTodayJournalAction(),
    getLatestEventsPerChainAction(),
    getCategoriesAction()
  ]);

  const todayLabel = formatDateArg(getNowArg(), "EEEE, d 'de' MMMM");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12 pb-20 px-1">
      <header className="flex justify-between items-start pl-4 border-l-4 border-purple-600 ml-3 pr-2">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-50 tracking-tighter">Hoy</h1>
          <p className="text-lg md:text-xl text-zinc-400 capitalize font-medium tracking-wide">{todayLabel}</p>
        </div>
        <div className="flex flex-col items-center justify-center opacity-80 pt-1">
          <Image src="/rabbit.png" alt="Astryx Logo" width={36} height={36} className="object-contain mix-blend-screen opacity-90 md:w-16 md:h-16 drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">Astryx</span>
        </div>
      </header>

      {/* Quick Actions Area */}
      <div className="px-4 flex gap-4 overflow-x-auto md:overflow-x-visible pb-4 scrollbar-hide no-scrollbar md:justify-start">
        <CreateTaskDialog 
          trigger={
            <div className="flex-none flex items-center space-x-3 bg-zinc-900 border border-zinc-800 hover:border-purple-600/50 px-6 py-4 md:px-8 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-zinc-300 font-bold transition-all active:scale-95 shadow-xl group whitespace-nowrap cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-600/20 transition-colors">
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
              </div>
              <span className="md:text-xl">Planificar Misión</span>
            </div>
          }
        />
        <CreateEventDialog 
          trigger={
            <div className="flex-none flex items-center space-x-3 bg-zinc-900 border border-zinc-800 hover:border-purple-600/50 px-6 py-4 md:px-8 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-zinc-300 font-bold transition-all active:scale-95 shadow-xl group whitespace-nowrap cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-600/20 transition-colors">
                <LinkIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
              </div>
              <span className="md:text-xl">Añadir Eslabón</span>
            </div>
          }
        />
      </div>

      <div className="px-3 max-w-4xl">
        <JournalClient initialContent={journalLog.content} />
      </div>

      {/* Latest Events (Direct Navigation) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <h2 className="text-xl md:text-3xl font-bold text-zinc-100 tracking-tight">Ecos del Mapa</h2>
          </div>
          <Link href="/mapa" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-purple-400 transition-colors bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">Mapa Global</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {latestEvents.length > 0 ? (
            latestEvents.map((event: any) => (
              <Link 
                key={event.id} 
                href={`/mapa/${event.chain.category.id}?chainId=${event.chain.id}&eventId=${event.id}`}
                className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/60 p-6 md:p-8 rounded-[2rem] hover:border-purple-600/50 transition-all group relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[60px] pointer-events-none" />
                
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <span className="text-[10px] md:text-xs font-bold text-zinc-600 uppercase tracking-[0.1em]">
                    {format(new Date(event.createdAt), "HH:mm 'del' d MMM", { locale: es })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Zap className={`w-3.5 h-3.5 ${event.energyLevel === 'HIGH' ? 'text-red-400' : event.energyLevel === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <div 
                      className="text-[9px] md:text-[11px] font-black px-2.5 py-1 rounded-full border shadow-sm"
                      style={{ 
                        backgroundColor: `${event.chain.category.colorHex}15`, 
                        color: event.chain.category.colorHex,
                        borderColor: `${event.chain.category.colorHex}30`
                      }}
                    >
                      {event.chain.category.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{event.chain.name}</h4>
                    <p className="text-zinc-100 text-base md:text-lg leading-relaxed font-bold tracking-tight whitespace-pre-wrap">
                      {event.content}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full col-span-full py-20 text-center border-2 border-dashed border-zinc-800/50 rounded-[2.5rem]">
              <p className="text-zinc-600 text-lg italic">Sin ecos recientes.</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-12 px-3">
        {categories.length > 0 ? (
          categories.map((category: any) => {
            const categoryTasks = dailyLog.tasks.filter(
              (t: any) => t.chain.category.id === category.id
            );

            return (
              <section key={category.id} className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" style={{ backgroundColor: category.colorHex }} />
                    <h2 className="text-xl md:text-3xl font-bold text-zinc-100 tracking-tight">{category.name}</h2>
                  </div>
                </div>
                <div className="grid gap-4">
                  {categoryTasks.length > 0 ? ( 
                    categoryTasks.map((task: any) => ( <TaskItem key={task.id} task={task} /> )) 
                  ) : (
                    <p className="text-zinc-600 text-base italic px-1">No hay misiones para hoy.</p>
                  )}
                  <div className="pt-2">
                    <CreateTaskDialog 
                      preselectedCategoryId={category.id} 
                      trigger={
                        <button className="w-full flex items-center justify-center space-x-2 py-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-zinc-300 font-black text-xs uppercase tracking-[0.2em] transition-all">
                          <Plus className="w-4 h-4" />
                          <span>Planificar en {category.name}</span>
                        </button>
                      }
                    />
                  </div>
                </div>
              </section>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 bg-zinc-900/10 border border-zinc-800/30 rounded-[3rem] border-dashed">
            <h3 className="text-3xl font-black text-zinc-100 mb-4 tracking-tighter">Comienza tu Mapa Técnico</h3>
            <p className="text-zinc-500 text-lg text-center max-w-sm mb-10 leading-relaxed">
              Define categorías y cadenas en tu mapa para empezar a planificar misiones diarias.
            </p>
            <Link 
              href="/mapa" 
              className="bg-purple-600 hover:bg-purple-500 text-white font-black py-5 px-12 rounded-2xl transition-all shadow-2xl active:scale-95 text-xl tracking-tight"
            >
              Abrir Mapa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
