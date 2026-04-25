"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTaskAction } from "@/lib/dailyLogActions";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);

  const handleCreate = async (prevState: any, formData: FormData) => {
    const result = await createTaskAction(prevState, formData);
    if (result.success) {
      setOpen(false);
    }
    return result;
  };

  const [state, formAction, isPending] = useActionState(handleCreate, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className="fixed bottom-24 right-5 z-40 w-14 h-14 bg-purple-600 hover:bg-purple-500 active:scale-90 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(147,51,234,0.5)] transition-all ease-in-out duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-600 focus-visible:ring-offset-zinc-950"
        aria-label="Añadir nuevo registro"
      >
        <Plus className="w-7 h-7" />
      </DialogTrigger>

      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[90vw] md:max-w-[400px] w-full rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Nueva Misión</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Añade una rutina o tarea técnica a tu día de hoy.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-6 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-300 font-medium tracking-wide">¿Qué debes hacer?</Label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              autoFocus
              autoComplete="off"
              className="bg-zinc-900/50 border-zinc-800 text-zinc-50 focus-visible:ring-purple-600 rounded-xl h-12 text-lg"
              placeholder="Ej: Caminar 30 mins, Leer repo..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 font-medium tracking-wide">Tipo de Tarea</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="type" value="ROUTINE" className="peer sr-only" defaultChecked />
                <div className="text-center py-3 rounded-xl border border-zinc-800 bg-zinc-900/30 peer-checked:bg-purple-600/20 peer-checked:border-purple-600 peer-checked:text-purple-400 text-zinc-400 font-bold transition-all">
                  Rutina
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="type" value="TECHNICAL" className="peer sr-only" />
                <div className="text-center py-3 rounded-xl border border-zinc-800 bg-zinc-900/30 peer-checked:bg-blue-600/20 peer-checked:border-blue-600 peer-checked:text-blue-400 text-zinc-400 font-bold transition-all">
                  Técnica
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 font-medium tracking-wide">Energía Requerida</Label>
            <div className="grid grid-cols-3 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="energyLevel" value="LOW" className="peer sr-only" />
                <div className="text-center py-2 rounded-xl border border-zinc-800 bg-zinc-900/30 peer-checked:border-zinc-50 peer-checked:text-zinc-50 text-zinc-400 transition-all font-medium">
                  Baja
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="energyLevel" value="MEDIUM" className="peer sr-only" defaultChecked />
                <div className="text-center py-2 rounded-xl border border-zinc-800 bg-zinc-900/30 peer-checked:border-zinc-50 peer-checked:text-zinc-50 text-zinc-400 transition-all font-medium">
                  Media
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="energyLevel" value="HIGH" className="peer sr-only" />
                <div className="text-center py-2 rounded-xl border border-zinc-800 bg-zinc-900/30 peer-checked:border-zinc-50 peer-checked:text-zinc-50 text-zinc-400 transition-all font-medium">
                  Alta
                </div>
              </label>
            </div>
          </div>

          {state?.error && (
            <p className="text-sm font-semibold text-red-500 text-center animate-in fade-in">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-black py-4 rounded-xl transition-all shadow-md disabled:opacity-50 flex justify-center items-center active:scale-[0.98] mt-2 text-lg"
          >
            {isPending ? "Guardando..." : "Crear Misión"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
