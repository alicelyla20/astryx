"use client";

import { useState, useEffect } from "react";
import { Plus, Zap, Heart, Anchor, Link as LinkIcon, MessageSquareQuote } from "lucide-react";
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
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategoriesWithChainsAction, createChainEventAction } from "@/lib/mapaActions";
import { toast } from "sonner";
import { EnergyLevel, MotivationType } from "@prisma/client";

interface CreateEventDialogProps {
  preselectedChainId?: string;
  trigger?: React.ReactNode;
}

export function CreateEventDialog({ preselectedChainId, trigger }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<string>(preselectedChainId || "");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(EnergyLevel.MEDIUM);
  const [motivation, setMotivation] = useState<MotivationType | "NONE">("NONE");

  useEffect(() => {
    if (open && !preselectedChainId && !categoriesLoaded) {
      getAllCategoriesWithChainsAction().then(data => {
        setCategories(data);
        setCategoriesLoaded(true);
      });
    }
  }, [open, preselectedChainId, categoriesLoaded]);

  useEffect(() => {
    if (preselectedChainId) setSelectedChainId(preselectedChainId);
  }, [preselectedChainId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    const link = formData.get("link") as string;

    if (!selectedChainId || !content) {
      toast.error("Faltan campos obligatorios.");
      setIsPending(false);
      return;
    }

    try {
      const result = await createChainEventAction(
        selectedChainId,
        content,
        energyLevel,
        motivation === "NONE" ? undefined : (motivation as MotivationType),
        undefined, undefined, undefined,
        link || undefined
      );

      if (result.success) {
        toast.success("Eslabón añadido al mapa teórico.");
        setOpen(false);
      }
    } catch (err) {
      toast.error("Error al crear el eslabón.");
    } finally {
      setIsPending(false);
    }
  };

  const allChains = categories.flatMap(cat => 
    cat.chains.map((chain: any) => ({
      ...chain,
      categoryId: cat.id,
      categoryName: cat.name
    }))
  );

  const defaultTrigger = (
    <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 hover:border-purple-600/50 px-4 py-3 rounded-2xl text-zinc-300 font-bold transition-all active:scale-95 shadow-lg cursor-pointer">
      <Plus className="w-4 h-4 text-purple-500" />
      <span>Añadir Eslabón</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger nativeButton={false} render={(trigger as React.ReactElement) ?? defaultTrigger} />

      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[calc(100%-2rem)] md:max-w-[450px] w-full rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90dvh]">
        <DialogHeader className="mb-6">
          <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/20 shadow-inner">
            <Plus className="w-8 h-8 text-purple-500" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight">Nuevo Eslabón</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Registra una nueva acción, aprendizaje o evento en una cadena.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!preselectedChainId && (
            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Cadena Destino</Label>
              <Select value={selectedChainId} onValueChange={(val) => setSelectedChainId(val || "")} required>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-14 rounded-2xl px-5">
                  <SelectValue placeholder="Selecciona una cadena..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-h-[250px]">
                  {allChains.map((chain: any) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-bold">{chain.name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{chain.categoryName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Descripción del Evento</Label>
            <div className="relative">
              <MessageSquareQuote className="absolute top-4 left-4 w-5 h-5 text-zinc-700 pointer-events-none" />
              <Textarea 
                name="content"
                placeholder="¿Qué sucedió? Describe el avance o hallazgo..."
                required
                className="bg-zinc-900 border-zinc-800 text-zinc-100 min-h-[120px] rounded-3xl pl-12 pr-6 py-4 placeholder:text-zinc-700 resize-none text-base font-medium leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Energía</Label>
              <Select value={energyLevel} onValueChange={(val) => setEnergyLevel(val as EnergyLevel)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl">
                  <Zap className={`w-4 h-4 mr-2 ${energyLevel === 'HIGH' ? 'text-red-400' : energyLevel === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span className="font-bold text-sm">
                    {energyLevel === 'LOW' ? 'Baja' : energyLevel === 'MEDIUM' ? 'Media' : 'Alta'}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value={EnergyLevel.LOW}>Baja</SelectItem>
                  <SelectItem value={EnergyLevel.MEDIUM}>Media</SelectItem>
                  <SelectItem value={EnergyLevel.HIGH}>Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Motivación</Label>
              <Select value={motivation} onValueChange={(val) => setMotivation(val as any)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl">
                  {motivation === MotivationType.GENUINE_INTEREST ? <Heart className="w-4 h-4 mr-2 text-purple-400" /> : 
                   motivation === MotivationType.OBLIGATION ? <Anchor className="w-4 h-4 mr-2 text-zinc-500" /> : 
                   <div className="w-4 h-4 mr-2 border border-zinc-700 rounded-full" />}
                  <span className="font-bold text-sm">
                    {motivation === 'NONE' ? 'Ninguna' : motivation === MotivationType.GENUINE_INTEREST ? 'Genuina' : 'Deber'}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value="NONE">Ninguna</SelectItem>
                  <SelectItem value={MotivationType.GENUINE_INTEREST}>Genuina</SelectItem>
                  <SelectItem value={MotivationType.OBLIGATION}>Por Deber</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Enlace Relacionado (Opcional)</Label>
            <div className="relative">
              <LinkIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-zinc-700" />
              <Input
                name="link"
                placeholder="https://..."
                className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl pl-11"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-50 hover:bg-white text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex justify-center items-center h-14 text-lg uppercase tracking-widest active:scale-[0.98] mt-4"
          >
            {isPending ? "Grabando..." : "Sellar Eslabón"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
