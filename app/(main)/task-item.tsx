"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { completeTaskAction } from "@/lib/taskActions";
import { TaskStatus, MotivationType } from "@prisma/client";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    status: TaskStatus;
    motivation: MotivationType | null;
  };
}

export function TaskItem({ task }: TaskItemProps) {
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isCompleted = task.status === TaskStatus.COMPLETED;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked && !isCompleted) {
      setShowMotivationModal(true);
    }
  };

  const handleSelectMotivation = async (motivation: MotivationType) => {
    setIsUpdating(true);
    try {
      await completeTaskAction(task.id, motivation);
      setShowMotivationModal(false);
    } catch (error) {
      console.error("Failed to complete task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3 p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl transition-all hover:bg-zinc-900/60">
        <Checkbox
          id={`task-${task.id}`}
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          disabled={isCompleted || isUpdating}
          className="w-6 h-6 border-zinc-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 transition-colors"
        />
        <label
          htmlFor={`task-${task.id}`}
          className={`text-lg font-medium tracking-tight cursor-pointer select-none transition-all ${
            isCompleted ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-100"
          }`}
        >
          {task.title}
        </label>
        {isCompleted && task.motivation && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full">
            {task.motivation === MotivationType.GENUINE_INTEREST ? "Genuino" : "Obligación"}
          </span>
        )}
      </div>

      <Dialog open={showMotivationModal} onOpenChange={setShowMotivationModal}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-[90vw] md:max-w-md p-8 animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="text-center space-y-4">
            <DialogTitle className="text-2xl font-black tracking-tighter">¿Cómo lo hiciste?</DialogTitle>
            <DialogDescription className="text-zinc-400 text-base font-medium">
              Registra tu intención para esta tarea.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={() => handleSelectMotivation(MotivationType.GENUINE_INTEREST)}
              disabled={isUpdating}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-4 rounded-2xl text-lg font-bold text-zinc-100 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>✨</span>
              <span>Por Gusto / Genuino</span>
            </button>
            
            <button
              onClick={() => handleSelectMotivation(MotivationType.OBLIGATION)}
              disabled={isUpdating}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-4 rounded-2xl text-lg font-bold text-zinc-400 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>⚓</span>
              <span>Por Obligación</span>
            </button>
          </div>
          
          <DialogFooter className="mt-4 sm:justify-center">
            <button 
              onClick={() => setShowMotivationModal(false)}
              className="text-zinc-600 hover:text-zinc-400 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
