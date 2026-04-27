"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Zap, Heart, Anchor, MessageSquareQuote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategoriesWithChainsAction, createChainEventAction } from "@/lib/mapaActions";
import { toast } from "sonner";
import { EnergyLevel, MotivationType, ChainType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "@/components/searchable-select";
import { energyLevelMap, motivationTypeMap, chainTypeMap } from "@/lib/translations";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedChainId, setSelectedChainId] = useState("");
  const [content, setContent] = useState("");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(EnergyLevel.MEDIUM);
  const [motivation, setMotivation] = useState<MotivationType | "NONE">("NONE");
  const [type, setType] = useState<ChainType>(ChainType.ROUTINE);

  useEffect(() => {
    if (open) {
      getAllCategoriesWithChainsAction().then(setCategories);
    } else {
      // Reset state on close
      setSelectedCategoryId("");
      setSelectedChainId("");
      setContent("");
      setEnergyLevel(EnergyLevel.MEDIUM);
      setMotivation("NONE");
      setType(ChainType.ROUTINE);
    }
  }, [open]);

  const activeChains = categories.find(c => c.id === selectedCategoryId)?.chains || [];

  const handleCreate = () => {
    if (!selectedChainId || !content.trim()) {
      toast.error("Selecciona una cadena y escribe contenido.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createChainEventAction(
          selectedChainId, 
          content,
          energyLevel,
          motivation === "NONE" ? undefined : motivation,
          undefined, undefined, undefined, undefined,
          type
        );
        if (result.success) {
          toast.success("¡Memoria guardada!");
          setOpen(false);
          router.push(`/mapa/${result.categoryId}`);
        }
      } catch (err) {
        toast.error("Error al guardar el evento.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger nativeButton={false} render={
        <button className="fixed bottom-24 right-5 z-40 group outline-none md:bottom-10 md:right-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-40 group-active:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-zinc-950 border border-zinc-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-active:scale-90 group-active:bg-purple-600">
              <Plus className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </div>
        </button>
      } />

      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[calc(100%-2rem)] md:max-w-[450px] w-full rounded-[2.5rem] p-8 pb-32 shadow-2xl overflow-y-auto max-h-[85dvh]">
        <DialogHeader className="mb-6">
          <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/20 shadow-inner">
            <Plus className="w-8 h-8 text-purple-500" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight">Nueva Memoria</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Captura un nuevo eslabón en tu historia personal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Categoría</Label>
            <SearchableSelect 
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              value={selectedCategoryId}
              onSelect={(val) => {
                setSelectedCategoryId(val);
                setSelectedChainId("");
              }}
              placeholder="Buscar categoría..."
              triggerPlaceholder="Elegir categoría..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Cadena</Label>
            <SearchableSelect 
              options={activeChains.map((c: any) => ({ value: c.id, label: c.name }))}
              value={selectedChainId}
              onSelect={setSelectedChainId}
              placeholder="Buscar cadena..."
              triggerPlaceholder={selectedCategoryId ? "Elegir cadena..." : "Selecciona categoría primero"}
              className={!selectedCategoryId ? "opacity-50 pointer-events-none" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Contenido</Label>
            <div className="relative">
              <MessageSquareQuote className="absolute top-4 left-4 w-5 h-5 text-zinc-700 pointer-events-none" />
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="¿Qué sucedió?..."
                className="bg-zinc-900 border-zinc-800 text-zinc-100 min-h-[120px] rounded-3xl pl-12 pr-6 py-4 placeholder:text-zinc-700 resize-none text-base font-medium leading-relaxed outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Energía</Label>
              <Select value={energyLevel} onValueChange={(val) => setEnergyLevel(val as EnergyLevel)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl px-4">
                  <div className="flex items-center">
                    <Zap className={`w-4 h-4 mr-2 ${energyLevel === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`} />
                    <span className="font-bold">{energyLevelMap[energyLevel]}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value={EnergyLevel.LOW}>{energyLevelMap.LOW}</SelectItem>
                  <SelectItem value={EnergyLevel.MEDIUM}>{energyLevelMap.MEDIUM}</SelectItem>
                  <SelectItem value={EnergyLevel.HIGH}>{energyLevelMap.HIGH}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Motivación</Label>
              <Select value={motivation} onValueChange={(val) => setMotivation(val as any)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl px-4">
                  <div className="flex items-center">
                    {motivation === 'GENUINE_INTEREST' ? <Heart className="w-4 h-4 mr-2 text-purple-400" /> : <Anchor className="w-4 h-4 mr-2 text-zinc-500" />}
                    <span className="font-bold">{motivation === 'NONE' ? 'Ninguna' : motivation === 'GENUINE_INTEREST' ? 'Genuina' : 'Deber'}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value="NONE">Ninguna</SelectItem>
                  <SelectItem value={MotivationType.GENUINE_INTEREST}>{motivationTypeMap.GENUINE_INTEREST}</SelectItem>
                  <SelectItem value={MotivationType.OBLIGATION}>{motivationTypeMap.OBLIGATION}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Tipo de Evento</Label>
            <Select value={type} onValueChange={(val) => setType(val as ChainType)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl px-4">
                <span className="font-bold">{chainTypeMap[type]}</span>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                <SelectItem value={ChainType.SKILL}>{chainTypeMap.SKILL}</SelectItem>
                <SelectItem value={ChainType.ROUTINE}>{chainTypeMap.ROUTINE}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleCreate}
            disabled={isPending}
            className="w-full bg-zinc-50 hover:bg-white text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex justify-center items-center h-14 text-lg uppercase tracking-widest active:scale-[0.98] mt-4"
          >
            {isPending ? "Grabando..." : "Sellar Memoria"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
