"use client";

import { useActionState, useState, useEffect } from "react";
import { Plus, ListTodo, Activity, RefreshCcw, Binary } from "lucide-react";
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
import { getAllCategoriesWithChainsAction } from "@/lib/mapaActions";
import { createTaskAction } from "@/lib/dailyLogActions";
import { toast } from "sonner";
import { TaskType, EnergyLevel } from "@prisma/client";

export function CreateTaskDialog({ preselectedCategoryId, trigger }: { preselectedCategoryId?: string, trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [taskType, setTaskType] = useState<string>(TaskType.TECHNICAL);
  const [energyLevel, setEnergyLevel] = useState<string>(EnergyLevel.MEDIUM);
  const [selectedChainId, setSelectedChainId] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setTaskType(TaskType.TECHNICAL);
      setEnergyLevel(EnergyLevel.MEDIUM);
      setSelectedChainId("");
    }
  }, [open]);

  useEffect(() => {
    if (open && !categoriesLoaded) {
      getAllCategoriesWithChainsAction().then(data => {
        setCategories(data);
        setCategoriesLoaded(true);
      });
    }
  }, [open, categoriesLoaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createTaskAction({}, formData);
      if (result.success) {
        toast.success("Misión añadida al mapa de hoy.");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Error al crear la tarea.");
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

  const displayChains = preselectedCategoryId 
    ? allChains.filter(c => c.categoryId === preselectedCategoryId)
    : allChains;

  const typeMap: Record<string, string> = {
    [TaskType.TECHNICAL]: "Técnica",
    [TaskType.ROUTINE]: "Rutina"
  };

  const energyMap: Record<string, string> = {
    [EnergyLevel.LOW]: "Baja",
    [EnergyLevel.MEDIUM]: "Media",
    [EnergyLevel.HIGH]: "Alta"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger nativeButton={false} render={trigger as React.ReactElement} />
      ) : (
        <DialogTrigger render={
          <button className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] font-bold shadow-sm">
            <Plus className="w-4 h-4 text-purple-500" />
            <span>Planificar Nueva Misión</span>
          </button>
        } />
      )}
      
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[calc(100%-2rem)] md:max-w-[450px] w-full rounded-[2rem] p-8 shadow-2xl overflow-y-auto max-h-[90dvh]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center">
            <ListTodo className="mr-3 text-purple-500" />
            Nueva Misión
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Toda tarea de hoy debe ser un eslabón de una cadena existente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Título de la Misión</Label>
            <Input
              name="title"
              placeholder="Ej: Acomodar la habitación, 30 min de estiramiento..."
              required
              className="bg-zinc-900 border-zinc-800 text-zinc-100 h-14 rounded-2xl px-5 text-lg placeholder:text-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Tipo</Label>
              <Select name="type" value={taskType} onValueChange={(val) => setTaskType(val || TaskType.TECHNICAL)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl">
                  <span className="font-bold">{typeMap[taskType]}</span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value={TaskType.TECHNICAL}>Técnica</SelectItem>
                  <SelectItem value={TaskType.ROUTINE}>Rutina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Energía</Label>
              <Select name="energyLevel" value={energyLevel} onValueChange={(val) => setEnergyLevel(val || EnergyLevel.MEDIUM)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl">
                  <span className="font-bold">{energyMap[energyLevel]}</span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value={EnergyLevel.LOW}>Baja</SelectItem>
                  <SelectItem value={EnergyLevel.MEDIUM}>Media</SelectItem>
                  <SelectItem value={EnergyLevel.HIGH}>Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Cadena Origen</Label>
            <Select name="chainId" value={selectedChainId} onValueChange={(val) => setSelectedChainId(val || "")} required>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-14 rounded-2xl px-5">
                <span className={!selectedChainId ? "text-zinc-400" : "font-bold"}>
                  {selectedChainId 
                    ? displayChains.find(c => c.id === selectedChainId)?.name || "Seleccionar..." 
                    : "Selecciona una cadena..."}
                </span>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-h-[300px]">
                {displayChains.map((chain: any) => (
                  <SelectItem key={chain.id} value={chain.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{chain.name}</span>
                      {!preselectedCategoryId && (
                        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{chain.categoryName}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-50 hover:bg-white text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex justify-center items-center h-14 text-lg uppercase tracking-widest active:scale-[0.98]"
          >
            {isPending ? "Agregando..." : "Planificar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
