import { getTodayLogAction } from "@/lib/dailyLogActions";
import { DailyLogClient } from "../daily-log-client";
import { TaskItem } from "../task-item";
import { TaskType } from "@prisma/client";
import { CalendarClient } from "./calendar-client";
import { formatDateArg, getStartOfDayArg } from "@/lib/dateUtils";

export default async function HistorialPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const dateStr = params.date; // ?date=YYYY-MM-DD
  
  // Use today if no date specified
  const targetDateStr = dateStr || getStartOfDayArg().toISOString().split("T")[0];
  const targetDateObj = new Date(targetDateStr + "T00:00:00");

  const dailyLog = await getTodayLogAction(targetDateStr);
  
  const routineTasks = dailyLog.tasks.filter((t: any) => t.type === TaskType.ROUTINE);
  const technicalTasks = dailyLog.tasks.filter((t: any) => t.type === TaskType.TECHNICAL);

  const displayLabel = formatDateArg(targetDateObj, "EEEE, d 'de' MMMM");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 space-y-10">
      <header className="pl-4 border-l-4 border-purple-600">
        <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Historial Completo</h1>
        <p className="text-lg text-zinc-400 capitalize font-medium tracking-wide">
          {displayLabel}
        </p>
      </header>

      <CalendarClient />

      {/* Metrics & Triggers */}
      <DailyLogClient 
        initialLog={{
          socialBattery: dailyLog.socialBattery,
          dissociationLevel: dailyLog.dissociationLevel,
          tranquilityLevel: dailyLog.tranquilityLevel,
          triggersContent: dailyLog.triggersContent,
        }} 
        dateStr={targetDateStr}
        key={targetDateStr}
      />

      {/* Routine Tasks */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 px-1">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Rutina</h2>
        </div>
        <div className="grid gap-3">
          {routineTasks.length > 0 ? (
            routineTasks.map((task: any) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <p className="text-zinc-600 text-sm italic px-1">No hay rutinas para este día.</p>
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
            technicalTasks.map((task: any) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <p className="text-zinc-600 text-sm italic px-1">No hay tareas técnicas para este día.</p>
          )}
        </div>
      </section>
    </div>
  );
}
