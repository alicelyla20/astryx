"use client";

import { useState, useTransition } from "react";
import { Trash2, History } from "lucide-react";
import { parseTextWithLinks } from "@/lib/textUtils";
import { deleteCategoryAction, deleteSavePointAction, getCategoryHistoryAction } from "@/lib/mapaActions";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategorySavePoint {
  id: string;
  content: string;
  createdAt: Date;
}

interface CategoryProps {
  category: {
    id: string;
    name: string;
    colorHex: string;
    savePoints: CategorySavePoint[];
  };
}

export function CategoryCard({ category }: CategoryProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<CategorySavePoint[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
    startTransition(async () => {
      const data = await getCategoryHistoryAction(category.id);
      setHistory(data);
    });
  };

  const recentSavePoint = category.savePoints[0];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg relative transition-all">
      {/* Dynamic Color Bar */}
      <div 
        className="h-2.5 w-full" 
        style={{ backgroundColor: category.colorHex }} 
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-2xl font-bold text-zinc-50 tracking-tight">{category.name}</h3>
          
          <AlertDialog>
            <AlertDialogTrigger 
              className="text-zinc-600 hover:text-red-400 p-1.5 rounded-full hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
            >
              <Trash2 className="w-5 h-5" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-[90vw] md:max-w-[400px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400 text-base">
                  Esta acción no se puede deshacer. Eliminará la categoría y todos sus puntos de guardado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl">
                  Cancelar
                </AlertDialogCancel>
                <form action={() => deleteCategoryAction(category.id)}>
                  <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full sm:w-auto">
                    Eliminar
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {recentSavePoint ? (
          <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/60 mb-5 shadow-inner">
            <p className="text-xs text-purple-400 mb-3 font-mono tracking-wider">
              ÚLTIMO GUARDADO: {new Date(recentSavePoint.createdAt).toLocaleDateString('es-AR')}
            </p>
            <div className="text-zinc-300 text-base leading-relaxed break-words whitespace-pre-wrap">
              {parseTextWithLinks(recentSavePoint.content)}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-28 bg-zinc-900/20 border border-zinc-800/30 rounded-2xl border-dashed mb-5">
            <p className="text-zinc-500 italic text-sm font-medium">Sin puntos de guardado aún.</p>
          </div>
        )}

        <button 
          onClick={handleOpenHistory}
          className="w-full bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-semibold py-3 px-4 rounded-xl flex justify-center items-center transition-colors text-sm shadow-sm active:scale-[0.98]"
        >
          <History className="w-4 h-4 mr-2" />
          Ver Historial
        </button>
      </div>

      {/* History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[90vw] md:max-w-md max-h-[85vh] overflow-y-auto rounded-3xl p-6 scrollbar-hide">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold tracking-tight">Historial - {category.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {isPending ? (
              <p className="text-zinc-500 text-center py-8 animate-pulse font-medium">Renderizando memorias...</p>
            ) : history.length > 0 ? (
              history.map((sp) => (
                <div key={sp.id} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 shadow-sm relative">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs text-purple-400 font-mono tracking-wide">
                      {new Date(sp.createdAt).toLocaleString('es-AR')}
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger 
                        className="text-zinc-600 hover:text-red-400 transition-colors focus:ring-2 focus:ring-red-400 outline-none rounded-full p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-[90vw] md:max-w-[400px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">
                            Esta acción no se puede deshacer. Se eliminará este punto de guardado de forma permanente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 rounded-xl">Cancelar</AlertDialogCancel>
                          <form action={async () => {
                            await deleteSavePointAction(sp.id);
                            setHistory(prev => prev.filter(item => item.id !== sp.id));
                          }}>
                            <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full sm:w-auto">Eliminar</AlertDialogAction>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="text-zinc-300 text-base leading-relaxed break-words whitespace-pre-wrap">
                    {parseTextWithLinks(sp.content)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-8 font-medium">Historial vacío.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
