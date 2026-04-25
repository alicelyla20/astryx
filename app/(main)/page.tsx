import { getTodayLogAction } from "@/lib/dailyLogActions";
import { DailyLogClient } from "./daily-log-client";
import { formatDateArg, getNowArg } from "@/lib/dateUtils";
import { TaskItem } from "./task-item";
import { TaskType, TaskStatus } from "@prisma/client";

export default async function HoyPage() {
  const dailyLog = await getTodayLogAction();
  const todayLabel = formatDateArg(getNowArg(), "EEEE, d 'de' MMMM");

  const routineTasks = dailyLog.tasks.filter(t => t.type === TaskType.ROUTINE);
  const technicalTasks = dailyLog.tasks.filter(t => t.type === TaskType.TECHNICAL);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
      <header className="pl-4 border-l-4 border-purple-600">
        <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Hoy</h1>
        <p className="text-lg text-zinc-400 capitalize font-medium tracking-wide">{todayLabel}</p>
      </header>

      {/* Metrics & Triggers */}
      <DailyLogClient 
        initialLog={{
          socialBattery: dailyLog.socialBattery,
          dissociationLevel: dailyLog.dissociationLevel,
          tranquilityLevel: dailyLog.tranquilityLevel,
          triggersContent: dailyLog.triggersContent,
        }} 
      />

      {/* Routine Tasks */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 px-1">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Rutina</h2>
        </div>
        <div className="grid gap-3">
          {routineTasks.length > 0 ? (
            routineTasks.map(task => (
              <TaskItem key={task.id} task={task as any} />
            ))
          ) : (
            <p className="text-zinc-600 text-sm italic px-1">No hay rutinas para hoy.</p>
          )}
        </div>
      </section>

      {/* Technical Tasks */}
      <section className="space-y-4 pb-12">
        <div className="flex items-center space-x-2 px-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Técnica</h2>
        </div>
        <div className="grid gap-3">
          {technicalTasks.length > 0 ? (
            technicalTasks.map(task => (
              <TaskItem key={task.id} task={task as any} />
            ))
          ) : (
            <p className="text-zinc-600 text-sm italic px-1">No hay tareas técnicas para hoy.</p>
          )}
        </div>
      </section>
    </div>
  );
}
