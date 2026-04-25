"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import { Plus, Loader2, Zap, Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAllCategoriesWithChainsAction, createChainEventAction } from "@/lib/mapaActions";

interface CategoryWithChains {
  id: string;
  name: string;
  chains: { id: string; name: string }[];
}

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChains[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedChainId, setSelectedChainId] = useState<string>("");
  const [content, setContent] = useState("");
  const [energyLevel, setEnergyLevel] = useState<string>("MEDIUM");
  const [motivation, setMotivation] = useState<string>("GENUINE_INTEREST");
  const [isPending, startTransition] = useTransition();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const data = await getAllCategoriesWithChainsAction() as any[];
          setCategories(data);

          if (pathname.includes("/mapa/")) {
            const parts = pathname.split("/");
            const catId = parts[parts.length - 1];
            setSelectedCategoryId(catId);

            const chainIndex = parseInt(searchParams.get("chainIndex") || "-1");
            const category = data.find((c: any) => c.id === catId);
            if (category && chainIndex >= 0 && category.chains && category.chains[chainIndex]) {
              setSelectedChainId(category.chains[chainIndex].id);
            }
          }
        } catch (err) {
          toast.error("Error al cargar categorías.");
        }
      };
      fetchData();
    } else {
      setSelectedCategoryId("");
      setSelectedChainId("");
      setContent("");
      setEnergyLevel("MEDIUM");
      setMotivation("GENUINE_INTEREST");
    }
  }, [open, pathname, searchParams]);

  const activeChains = categories.find(c => c.id === selectedCategoryId)?.chains || [];

  const categoryLabel = categories.find(c => c.id === selectedCategoryId)?.name || "Elegir categoría...";
  const chainLabel = activeChains.find((c: any) => c.id === selectedChainId)?.name || (selectedCategoryId ? "Elegir cadena..." : "Selecciona categoría primero");
  
  const energyMap: Record<string, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta"
  };
  const motivationMap: Record<string, string> = {
    GENUINE_INTEREST: "Genuino",
    OBLIGATION: "Obligación"
  };

  const handleCreate = () => {
    if (!selectedChainId || !content.trim()) {
      toast.error("Selecciona una cadena y escribe contenido.");
      return;
    }

    startTransition(async () => {
      setOpen(false);
      try {
        const result = await createChainEventAction(
          selectedChainId, 
          content,
          energyLevel as any,
          motivation as any
        );
        if (result.success) {
          toast.success("¡Evento guardado!");
          router.push(`/mapa/${result.categoryId}`);
        }
      } catch (err) {
        toast.error("Error al guardar el evento.");
        setOpen(true);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <button className="fixed bottom-24 right-5 z-40 group outline-none">
            <div className="relative">
              {/* Animated Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-40 group-active:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative w-14 h-14 bg-zinc-950 border border-zinc-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-active:scale-90 group-active:bg-purple-600">
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-950 animate-ping opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
          </button>
        }
      />

      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[calc(100%-2rem)] md:max-w-[450px] w-full rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90dvh] flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader className="mb-6 shrink-0">
          <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center">
            <span className="w-2 h-8 bg-purple-600 rounded-full mr-3" />
            Nueva Memoria
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Captura un nuevo eslabón en tu historia técnica.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.15em] ml-1">Categoría</Label>
            <Select value={selectedCategoryId} onValueChange={(val) => {
              setSelectedCategoryId(val || "");
              setSelectedChainId("");
            }}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-14 rounded-2xl w-full flex items-center px-4 justify-between group hover:border-zinc-700 transition-colors">
                <span className={!selectedCategoryId ? "text-zinc-600" : "text-zinc-100 font-bold"}>
                  {categoryLabel}
                </span>
              </SelectTrigger>
              <SelectContent 
                className="bg-zinc-950 border-zinc-800 text-zinc-50"
                side="bottom"
                align="center"
                alignItemWithTrigger={false}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.15em] ml-1">Cadena</Label>
            <Select 
              value={selectedChainId} 
              onValueChange={(val) => setSelectedChainId(val || "")}
              disabled={!selectedCategoryId}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-14 rounded-2xl w-full flex items-center px-4 justify-between disabled:opacity-30 hover:border-zinc-700 transition-colors">
                <span className={!selectedChainId ? "text-zinc-600" : "text-zinc-100 font-bold"}>
                  {chainLabel}
                </span>
              </SelectTrigger>
              <SelectContent 
                className="bg-zinc-950 border-zinc-800 text-zinc-50"
                side="bottom"
                align="center"
                alignItemWithTrigger={false}
              >
                {activeChains.map((chain: any) => (
                  <SelectItem key={chain.id} value={chain.id}>{chain.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.15em] ml-1 flex items-center">
                <Zap className="w-3 h-3 mr-1 text-amber-500" /> Energía
              </Label>
              <Select value={energyLevel} onValueChange={(val) => setEnergyLevel(val || "MEDIUM")}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl w-full flex items-center px-4 justify-between">
                  <span className="font-bold">{energyMap[energyLevel]}</span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.15em] ml-1 flex items-center">
                <Heart className="w-3 h-3 mr-1 text-pink-500" /> Interés
              </Label>
              <Select value={motivation} onValueChange={(val) => setMotivation(val || "GENUINE_INTEREST")}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl w-full flex items-center px-4 justify-between">
                  <span className="font-bold">{motivationMap[motivation]}</span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value="GENUINE_INTEREST">Genuino</SelectItem>
                  <SelectItem value="OBLIGATION">Obligación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.15em] ml-1">Descripción</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="¿Qué has hecho hoy?"
              className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-purple-600 rounded-2xl min-h-[120px] text-base p-4 placeholder:text-zinc-700 shadow-inner"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={isPending || !selectedChainId || !content.trim()}
            className="w-full bg-zinc-50 hover:bg-white text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-[0_10px_20px_rgba(0,0,0,0.4)] disabled:opacity-50 flex justify-center items-center active:scale-[0.98] mt-4 h-14 text-lg uppercase tracking-widest"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Memoria"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
