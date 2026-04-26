"use client";

import { useState } from "react";
import { Plus, Sparkles, Zap, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { createChainAction } from "@/lib/mapaActions";
import { toast } from "sonner";
import { EnergyLevel } from "@prisma/client";
import { useRouter } from "next/navigation";

export function CreateChainDialog({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(EnergyLevel.MEDIUM);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      await createChainAction(categoryId, name, energyLevel);
      setOpen(false);
      toast.success("¡Cadena creada!", { description: "Actualizando el mapa..." });
      setIsRefreshing(true);
      router.refresh();
      // Give router.refresh() time to complete, then hide overlay
      setTimeout(() => setIsRefreshing(false), 2000);
    } catch (err) {
      toast.error("Error al crear la cadena.");
      setIsPending(false);
    }
  };

  return (
    <>
      {/* Full-page loading overlay during refresh */}
      {isRefreshing && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Actualizando mapa...</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <button className="relative overflow-hidden group bg-zinc-900 border border-zinc-800 hover:border-purple-600/50 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus className="w-5 h-5 mr-2 text-purple-500 group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative z-10 text-sm tracking-tight">Nueva Cadena</span>
            </button>
          }
        />

        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[calc(100%-2rem)] md:max-w-[400px] w-full rounded-3xl p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Crear Cadena
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Define una nueva vertiente de desarrollo dentro de esta categoría.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-zinc-500 text-xs font-black uppercase tracking-widest pl-1">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                autoComplete="off"
                className="bg-zinc-900 border-zinc-800 text-zinc-50 focus-visible:ring-purple-600 rounded-2xl h-14 px-5 text-lg"
                placeholder="Backend, UX, Diseño..."
              />
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-500 text-xs font-black uppercase tracking-widest pl-1">Esfuerzo de Energía</Label>
              <Select value={energyLevel} onValueChange={(val) => setEnergyLevel(val as EnergyLevel)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-14 rounded-2xl px-5 flex items-center">
                  <Zap className={`w-4 h-4 mr-2 ${energyLevel === 'HIGH' ? 'text-red-400' : energyLevel === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span className="font-bold">
                    {energyLevel === 'LOW' ? 'Baja' : energyLevel === 'MEDIUM' ? 'Media' : 'Alta'}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-100">
                  <SelectItem value={EnergyLevel.LOW}>Baja (Recupera Energía)</SelectItem>
                  <SelectItem value={EnergyLevel.MEDIUM}>Media (Flujo Normal)</SelectItem>
                  <SelectItem value={EnergyLevel.HIGH}>Alta (Exige Foco Total)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-zinc-50 hover:bg-white text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg disabled:opacity-50 flex justify-center items-center active:scale-[0.98] h-14 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando...
                </>
              ) : "Confirmar Cadena"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
