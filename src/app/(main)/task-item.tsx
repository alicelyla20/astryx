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
import { Heart, Anchor } from "lucide-react";
import { TaskStatus, MotivationType } from "@prisma/client";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    status: TaskStatus;
    motivation: MotivationType | null;
    chain?: {
      id: string;
      name: string;
      category: {
        name: string;
        colorHex: string;
      }
    }
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
      <div className="flex items-center space-x-3 p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl transition-all hover:bg-zinc-800/20 group">
        <Checkbox
          id={`task-${task.id}`}
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          disabled={isCompleted || isUpdating}
          className="w-7 h-7 border-zinc-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 transition-colors"
        />
        
        <div className="flex-1 min-w-0 pr-2">
          <label
            htmlFor={`task-${task.id}`}
            className={`text-base md:text-xl font-bold tracking-tight cursor-pointer select-none transition-all block break-words ${
              isCompleted ? "text-zinc-500 line-through decoration-zinc-600 font-medium" : "text-zinc-100"
            }`}
          >
            {task.title}
          </label>
          
          {task.chain && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[9px] md:text-xs font-black uppercase tracking-widest text-zinc-500">{task.chain.name}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span 
                className="text-[9px] md:text-xs font-black uppercase tracking-widest"
                style={{ color: task.chain.category.colorHex }}
              >
                {task.chain.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isCompleted && task.motivation && (
             <div className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500">
               {task.motivation === MotivationType.GENUINE_INTEREST ? "Genuino" : "Obligatorio"}
             </div>
          )}
        </div>
      </div>

      <Dialog open={showMotivationModal} onOpenChange={setShowMotivationModal}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-[2rem] max-w-[calc(100%-2rem)] md:max-w-md p-8 animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="text-center space-y-4">
            <DialogTitle className="text-2xl font-black tracking-tighter">Misión Cumplida</DialogTitle>
            <DialogDescription className="text-zinc-400 text-base font-medium">
              ¿Esta tarea te acercó más a tu objetivo o fue una obligación?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => handleSelectMotivation(MotivationType.GENUINE_INTEREST)}
              disabled={isUpdating}
              className="w-full bg-zinc-900 hover:bg-purple-600/10 border border-zinc-800 hover:border-purple-600/50 py-5 rounded-2xl text-lg font-black text-zinc-100 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group/btn"
            >
              <Heart className="w-6 h-6 group-hover/btn:scale-125 transition-transform text-purple-400" />
              <span>Por Gusto / Interés</span>
            </button>
            
            <button
              onClick={() => handleSelectMotivation(MotivationType.OBLIGATION)}
              disabled={isUpdating}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-5 rounded-2xl text-lg font-bold text-zinc-500 transition-all active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <Anchor className="w-6 h-6 text-zinc-500" />
              <span>Por Obligación</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
