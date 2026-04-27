"use client";

import { parseTextWithLinks } from "@/lib/textUtils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Archive, Zap, Heart, ExternalLink } from "lucide-react";
import { archiveChainEventAction } from "@/lib/mapaActions";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { EditEventDialog } from "./edit-event-dialog";
import { energyLevelMap, motivationTypeMap } from "@/lib/translations";

interface EventCardProps {
  event: {
    id: string;
    content: string;
    link?: string | null;
    energyLevel: "LOW" | "MEDIUM" | "HIGH";
    motivation?: "GENUINE_INTEREST" | "OBLIGATION";
    dissociationLevel?: number | null;
    tranquilityLevel?: number | null;
    voidLevel?: number | null;
    socialBattery?: number | null;
    type?: string | null;
    createdAt: Date;
  };
  color: string;
  chainType?: string;
}

export function EventCard({ event, color, chainType }: EventCardProps) {
  const formattedDate = format(new Date(event.createdAt), "d 'de' MMM, HH:mm", { locale: es });
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
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

  const actualType = event.type || chainType;

  return (
    <div className="relative w-full flex flex-col items-center group/card animate-in fade-in zoom-in-95 duration-300">
      <div 
        className="bg-zinc-900/80 border p-5 rounded-2xl shadow-xl transition-all duration-300 w-full max-w-[90%] backdrop-blur-sm relative"
        style={{
          borderColor: actualType === "SKILL" ? color : "#27272a99" // zinc-800/60 fallback
        }}
      >
        
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-3">
              <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest" title="Energía">
                <Zap className={`w-3 h-3 mr-1 ${getEnergyColor(event.energyLevel)}`} />
                {energyLevelMap[event.energyLevel]}
              </div>
              {event.motivation && (
                <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest" title="Motivación">
                  <Heart className={`w-3 h-3 mr-1 ${event.motivation === 'GENUINE_INTEREST' ? 'text-pink-400' : 'text-zinc-500'}`} />
                  {motivationTypeMap[event.motivation as keyof typeof motivationTypeMap]}
                </div>
              )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-zinc-600 active:text-purple-500 p-1.5 rounded-lg bg-zinc-950/20 shadow-inner border border-zinc-800/50 transition-all text-[10px] font-bold uppercase"
              title="Editar"
            >
              Editar
            </button>
            <button 
              onClick={handleArchive}
              disabled={isPending}
              className="text-zinc-600 active:text-yellow-500 p-1.5 rounded-lg bg-zinc-950/20 shadow-inner border border-zinc-800/50 transition-all disabled:opacity-30"
              title="Archivar"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-zinc-300 text-base md:text-lg leading-relaxed break-words whitespace-pre-wrap text-center mb-4">
          {parseTextWithLinks(event.content)}
        </div>

        {/* Link */}
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-purple-600/40 hover:bg-purple-600/5 transition-all group/link text-xs font-bold text-zinc-500 hover:text-purple-400 truncate"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 group-hover/link:text-purple-400 transition-colors" />
            <span className="truncate">{event.link.replace(/^https?:\/\//, '')}</span>
          </a>
        )}
        
        {/* Metrics Row */}
        {(event.socialBattery != null || event.dissociationLevel != null || event.tranquilityLevel != null || event.voidLevel != null) && (
          <div className="flex items-center justify-center space-x-4 mb-4 mt-2">
            {event.socialBattery != null && (
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-purple-400/80 uppercase">Social</span>
                <span className="text-xs font-black text-purple-300">{event.socialBattery}/10</span>
              </div>
            )}
            {event.dissociationLevel != null && (
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-emerald-400/80 uppercase">Disoc.</span>
                <span className="text-xs font-black text-emerald-300">{event.dissociationLevel}/10</span>
              </div>
            )}
            {event.tranquilityLevel != null && (
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-blue-400/80 uppercase">Tranq.</span>
                <span className="text-xs font-black text-blue-300">{event.tranquilityLevel}/10</span>
              </div>
            )}
            {event.voidLevel != null && (
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-zinc-400/80 uppercase">Vacío</span>
                <span className="text-xs font-black text-zinc-300">{event.voidLevel}/10</span>
              </div>
            )}
          </div>
        )}

        <p 
          className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center"
          style={{ color: color }}
        >
          {formattedDate}
        </p>
      </div>
      {isEditing && (
        <EditEventDialog event={event} categoryId={categoryId} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}
