"use client";

import { useState, useTransition } from "react";
import { Edit2, Trash2, Layers } from "lucide-react";
import Link from "next/link";
import { updateTemplateAction, deleteTemplateAction } from "@/lib/templateActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface TemplateCardProps {
  template: any;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [isPending, startTransition] = useTransition();
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description || "");

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      try {
        await updateTemplateAction(template.id, name, description);
        toast.success("Plantilla actualizada.");
        setOpenEdit(false);
      } catch (err) {
        toast.error("Error al actualizar la plantilla.");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTemplateAction(template.id);
        toast.success("Plantilla eliminada.");
      } catch (err) {
        toast.error("Error al eliminar la plantilla.");
      }
    });
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg relative group transition-all hover:border-zinc-700/50 flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-zinc-50 tracking-tight group-hover:text-purple-400 transition-colors">
            {template.name}
          </h3>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setOpenEdit(true)}
              className="text-zinc-600 hover:text-purple-400 p-1.5 rounded-full hover:bg-zinc-900 transition-colors outline-none"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <AlertDialog>
              <AlertDialogTrigger nativeButton={false} render={
                <button className="text-zinc-600 hover:text-red-400 p-1.5 rounded-full hover:bg-zinc-900 transition-colors outline-none cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              } />
              <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Esta acción es irreversible y eliminará todas las misiones guardadas en esta plantilla.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {template.description && (
          <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{template.description}</p>
        )}

        <div className="mt-auto flex items-center space-x-2 text-zinc-500 mb-6">
          <Layers className="w-4 h-4" />
          <span className="text-xs font-medium tracking-wide border px-2 py-1 rounded-full border-zinc-800 bg-zinc-900/50">
            {template._count?.items ?? 0} {template._count?.items === 1 ? 'Misión' : 'Misiones'}
          </span>
        </div>

        <Link 
          href={`/templates/${template.id}`}
          className="w-full bg-zinc-900/60 hover:bg-zinc-800 text-zinc-100 font-bold py-3 px-4 rounded-2xl flex justify-center items-center transition-all shadow-sm active:scale-[0.98] border border-zinc-800/50"
        >
          Configurar Misiones
        </Link>
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl">
          <DialogHeader>
            <DialogTitle>Editar Plantilla</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Nombre</label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Descripción</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all mt-4"
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
