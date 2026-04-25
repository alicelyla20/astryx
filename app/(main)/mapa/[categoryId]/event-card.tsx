"use client";

import { parseTextWithLinks } from "@/lib/textUtils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Archive, Zap, Heart } from "lucide-react";
import { archiveChainEventAction } from "@/lib/mapaActions";
import { toast } from "sonner";
import { useTransition } from "react";
import { useParams } from "next/navigation";

interface EventCardProps {
  event: {
    id: string;
    content: string;
    energyLevel: "LOW" | "MEDIUM" | "HIGH";
    motivation?: "GENUINE_INTEREST" | "OBLIGATION";
    createdAt: Date;
  };
  color: string;
}

export function EventCard({ event, color }: EventCardProps) {
  const formattedDate = format(new Date(event.createdAt), "d 'de' MMM, HH:mm", { locale: es });
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const categoryId = params?.categoryId as string;

  const handleArchive = () => {
    if (!categoryId) return;
    if (confirm("¿Mandar este eslabón a reposo (archivar)?")) {
      startTransition(async () => {
        try {
          await archiveChainEventAction(event.id, categoryId);
          toast.success("Eslabón archivado.");
        } catch (err) {
          toast.error("Error al archivar.");
        }
      });
    }
  };

  const getEnergyColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-emerald-400";
      case "HIGH": return "text-red-400";
      default: return "text-amber-400";
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center group/card animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-zinc-900/80 border border-zinc-800/60 p-5 rounded-2xl shadow-xl hover:border-zinc-700 transition-all duration-300 w-full max-w-[90%] backdrop-blur-sm relative">
        
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-3">
             <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest" title="Energía">
               <Zap className={`w-3 h-3 mr-1 ${getEnergyColor(event.energyLevel)}`} />
               {event.energyLevel === 'LOW' ? 'Baja' : event.energyLevel === 'HIGH' ? 'Alta' : 'Media'}
             </div>
             {event.motivation && (
               <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest" title="Motivación">
                 <Heart className={`w-3 h-3 mr-1 ${event.motivation === 'GENUINE_INTEREST' ? 'text-pink-400' : 'text-zinc-500'}`} />
                 {event.motivation === 'GENUINE_INTEREST' ? 'Genuino' : 'Obligación'}
               </div>
             )}
          </div>
          
          <button 
            onClick={handleArchive}
            disabled={isPending}
            className="text-zinc-600 active:text-yellow-500 p-1.5 rounded-lg bg-zinc-950/20 shadow-inner border border-zinc-800/50 transition-all disabled:opacity-30"
            title="Archivar"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>

        <div className="text-zinc-300 text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap text-center mb-4">
          {parseTextWithLinks(event.content)}
        </div>

        <p 
          className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center"
          style={{ color: color }}
        >
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
