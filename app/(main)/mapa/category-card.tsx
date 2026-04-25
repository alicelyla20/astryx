"use client";

import { Archive as ArchiveIcon, Layers, Palette } from "lucide-react";
import Link from "next/link";
import { toggleArchiveCategoryAction, updateCategoryColorAction } from "@/lib/mapaActions";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CategoryProps {
  category: {
    id: string;
    name: string;
    colorHex: string;
    _count?: {
      chains: number;
    }
  };
}

export function CategoryCard({ category }: CategoryProps) {
  const [isPending, startTransition] = useTransition();
  const [openColor, setOpenColor] = useState(false);
  const [currentColor, setCurrentColor] = useState(category.colorHex);

  const handleSaveColor = () => {
    startTransition(async () => {
      try {
        await updateCategoryColorAction(category.id, currentColor);
        setOpenColor(false);
        toast.success("Color actualizado.");
      } catch (err) {
        toast.error("Error al actualizar color.");
      }
    });
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg relative group transition-all hover:border-zinc-700/50">
      {/* Dynamic Color Bar */}
      <div 
        className="h-2.5 w-full" 
        style={{ backgroundColor: category.colorHex }} 
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-zinc-50 tracking-tight group-hover:text-purple-400 transition-colors">
            {category.name}
          </h3>
          
          <div className="flex items-center space-x-1">
            {/* Custom Color Picker Dialog */}
            <Dialog open={openColor} onOpenChange={setOpenColor}>
              <DialogTrigger 
                render={
                  <button className="text-zinc-600 hover:text-purple-400 p-1.5 rounded-full hover:bg-zinc-900 transition-colors outline-none">
                    <Palette className="w-5 h-5" />
                  </button>
                }
              />
              <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-[90vw] md:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Personalizar Color</DialogTitle>
                  <DialogDescription>Elige un color único para {category.name}.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-6 py-6">
                  <div 
                    className="w-24 h-24 rounded-full border-4 border-zinc-800 shadow-2xl"
                    style={{ backgroundColor: currentColor }}
                  />
                  <input 
                    type="color" 
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-full h-12 bg-transparent border-none cursor-pointer rounded-xl overflow-hidden"
                  />
                  <button
                    onClick={handleSaveColor}
                    disabled={isPending}
                    className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-black py-4 rounded-xl transition-all shadow-md flex justify-center items-center"
                  >
                    {isPending ? "Guardando..." : "Aplicar Color"}
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Archive Dialog */}
            <AlertDialog>
              <AlertDialogTrigger 
                render={
                  <button className="text-zinc-600 hover:text-yellow-400 p-1.5 rounded-full hover:bg-zinc-900 transition-colors outline-none">
                    <ArchiveIcon className="w-5 h-5" />
                  </button>
                }
              />
              <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-[90vw] md:max-w-[400px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">¿Mandar a reposo?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400 text-base">
                    Esta categoría será ocultada del mapa, pero tus datos permanecerán seguros en el Archivo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl">
                    Cancelar
                  </AlertDialogCancel>
                  <form action={() => toggleArchiveCategoryAction(category.id, true)}>
                    <AlertDialogAction type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl w-full sm:w-auto">
                      Archivar
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-zinc-500 mb-8 px-1">
          <Layers className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide">
            {category._count?.chains ?? 0} {category._count?.chains === 1 ? 'Cadena activa' : 'Cadenas activas'}
          </span>
        </div>

        <Link 
          href={`/mapa/${category.id}`}
          className="w-full bg-zinc-900/60 hover:bg-zinc-800 text-zinc-100 font-bold py-4 px-4 rounded-2xl flex justify-center items-center transition-all shadow-sm active:scale-[0.98] border border-zinc-800/50"
        >
          Explorar Mapa
        </Link>
      </div>
    </div>
  );
}
