import { getTodayLogAction } from "@/lib/dailyLogActions";
import { DailyLogClient } from "./daily-log-client";
import { formatDateArg, getNowArg } from "@/lib/dateUtils";
import { TaskItem } from "./task-item";
import { TaskType } from "@prisma/client";
import { getLatestEventsPerChainAction } from "@/lib/mapaActions";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Zap } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";

export default async function HoyPage() {
  const [dailyLog, latestEvents] = await Promise.all([
    getTodayLogAction(),
    getLatestEventsPerChainAction()
  ]);

  const todayLabel = formatDateArg(getNowArg(), "EEEE, d 'de' MMMM");

  const routineTasks = dailyLog.tasks.filter((t: any) => t.type === TaskType.ROUTINE);
  const technicalTasks = dailyLog.tasks.filter((t: any) => t.type === TaskType.TECHNICAL);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12 pb-20 px-1">
      <header className="pl-4 border-l-4 border-purple-600 ml-3">
        <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Hoy</h1>
        <p className="text-lg text-zinc-400 capitalize font-medium tracking-wide">{todayLabel}</p>
      </header>

      <div className="px-3">
        <DailyLogClient 
          initialLog={{
            socialBattery: dailyLog.socialBattery,
            dissociationLevel: dailyLog.dissociationLevel,
            tranquilityLevel: dailyLog.tranquilityLevel,
            triggersContent: dailyLog.triggersContent,
          }} 
        />
      </div>

      {/* Latest Events (Direct Navigation) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Ecos del Mapa</h2>
          </div>
          <Link href="/mapa" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-purple-400 transition-colors bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">Mapa Global</Link>
        </div>
        
        <div className="flex overflow-x-auto space-x-4 pb-6 scrollbar-hide -mx-4 px-6 pr-12">
          {latestEvents.length > 0 ? (
            latestEvents.map((event: any) => (
              <Link 
                key={event.id} 
                href={`/mapa/${event.chain.category.id}?chainId=${event.chain.id}&eventId=${event.id}`}
                className="flex-[0_0_280px] bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/60 p-6 rounded-[2rem] hover:border-purple-600/50 transition-all group relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[60px] pointer-events-none" />
                
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.1em]">
                    {format(new Date(event.createdAt), "HH:mm 'del' d MMM", { locale: es })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Zap className={`w-3.5 h-3.5 ${event.energyLevel === 'HIGH' ? 'text-red-400' : event.energyLevel === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <div 
                      className="text-[9px] font-black px-2.5 py-1 rounded-full border shadow-sm"
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
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{event.chain.name}</h4>
                    <p className="text-zinc-100 text-base line-clamp-3 leading-relaxed font-bold tracking-tight">
                      {event.content}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full mx-4 py-10 text-center border-2 border-dashed border-zinc-800/50 rounded-3xl">
              <p className="text-zinc-600 text-sm italic">Sin ecos recientes.</p>
            </div>
          )}
        </div>
      </section>

      <div className="space-y-12 px-3">
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Rutina</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {routineTasks.length > 0 ? ( routineTasks.map((task: any) => ( <TaskItem key={task.id} task={task} /> )) ) : (
              <p className="text-zinc-600 text-sm italic px-1">No hay rutinas para hoy.</p>
            )}
            <CreateTaskDialog />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Técnica</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {technicalTasks.length > 0 ? ( technicalTasks.map((task: any) => ( <TaskItem key={task.id} task={task} /> )) ) : (
              <p className="text-zinc-600 text-sm italic px-1">No hay misiones técnicas planeadas.</p>
            )}
            <CreateTaskDialog />
          </div>
        </section>
      </div>
    </div>
  );
}
