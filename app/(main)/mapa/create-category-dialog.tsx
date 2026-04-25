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
import { createCategoryAction } from "@/lib/mapaActions";

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#8B5CF6");
  
  // Intercept the action to close the dialog on success
  const handleCreate = async (prevState: any, formData: FormData) => {
    const result = await createCategoryAction(prevState, formData);
    if (result.success) {
      setOpen(false);
    }
    return result;
  };

  const [state, formAction, isPending] = useActionState(handleCreate, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className="w-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 border-dashed text-zinc-300 font-medium py-3 px-4 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
      >
        <Plus className="mr-2 w-5 h-5" />
        Crear Categoría
      </DialogTrigger>
      
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[90vw] md:max-w-[400px] w-full rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Nueva Categoría</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Define un contenedor lógico y asígnale un color para distinguirlo.
          </DialogDescription>
        </DialogHeader>
        
        <form action={formAction} className="space-y-6 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300 font-medium">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoFocus
              autoComplete="off"
              className="bg-zinc-900/50 border-zinc-800 text-zinc-50 focus-visible:ring-purple-600 rounded-xl h-11"
              placeholder="Ej: Programación, Salud, Finanzas..."
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="colorHex" className="text-zinc-300 font-medium">Color Distintivo</Label>
            <div className="flex items-center space-x-4 bg-zinc-900/30 p-2 rounded-2xl border border-zinc-800">
              <input
                type="color"
                id="colorHex"
                name="colorHex"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-full cursor-pointer bg-transparent border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              />
              <span className="text-zinc-400 font-mono text-sm uppercase">{color}</span>
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
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50 flex justify-center items-center active:scale-[0.98]"
          >
            {isPending ? "Guardando..." : "Crear"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
