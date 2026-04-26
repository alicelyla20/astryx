"use client";

import { useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateDailyLogAction, UpdateDailyLogPayload } from "@/lib/dailyLogActions";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, BarChart3, Binary } from "lucide-react";

interface DailyLogClientProps {
  initialLog: {
    socialBattery: number | null;
    dissociationLevel: number | null;
    tranquilityLevel: number | null;
    triggersContent: string | null;
  };
  dateStr?: string;
}

export function DailyLogClient({ initialLog, dateStr }: DailyLogClientProps) {
  const [socialBattery, setSocialBattery] = useState(initialLog.socialBattery || 3);
  const [dissociationLevel, setDissociationLevel] = useState(initialLog.dissociationLevel || 1);
  const [tranquilityLevel, setTranquilityLevel] = useState(initialLog.tranquilityLevel || 3);
  const [triggersContent, setTriggersContent] = useState(initialLog.triggersContent || "");
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedUpdate = (payload: UpdateDailyLogPayload) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      updateDailyLogAction({ ...payload, dateStr }).catch(() => {
        toast.error("Error al sincronizar. Inténtalo de nuevo.");
      });
    }, 500); 
  };

  const handleSocialChange = (val: number | readonly number[]) => {
    const newValue = Array.isArray(val) ? val[0] : val;
    setSocialBattery(newValue);
    debouncedUpdate({ socialBattery: newValue });
  };

  const handleDissociationChange = (val: number | readonly number[]) => {
    const newValue = Array.isArray(val) ? val[0] : val;
    setDissociationLevel(newValue);
    debouncedUpdate({ dissociationLevel: newValue });
  };

  const handleTranquilityChange = (val: number | readonly number[]) => {
    const newValue = Array.isArray(val) ? val[0] : val;
    setTranquilityLevel(newValue);
    debouncedUpdate({ tranquilityLevel: newValue });
  };

  const handleTriggersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTriggersContent(e.target.value);
    debouncedUpdate({ triggersContent: e.target.value });
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Metrics Section (Collapsible) */}
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] shadow-xl overflow-hidden transition-all duration-500">
        <button 
          onClick={() => setIsMetricsOpen(!isMetricsOpen)}
          className="w-full px-6 py-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-left">
              <h2 className="text-lg md:text-2xl font-black text-zinc-50 tracking-tight leading-none">Métricas del Día</h2>
              <p className="text-xs md:text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Estado de Consciencia</p>
            </div>
          </div>
          {isMetricsOpen ? <ChevronUp className="text-zinc-500" /> : <ChevronDown className="text-zinc-500" />}
        </button>

        <div className={`px-6 pb-8 space-y-8 transition-all duration-500 ${isMetricsOpen ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"}`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Batería Social</Label>
              <span className="text-purple-400 font-black text-xl">{socialBattery}</span>
            </div>
            <Slider 
              min={1} max={5} step={1} 
              value={[socialBattery]} 
              onValueChange={handleSocialChange}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Nivel de Disociación</Label>
              <span className="text-pink-400 font-black text-xl">{dissociationLevel}</span>
            </div>
            <Slider 
              min={1} max={5} step={1} 
              value={[dissociationLevel]} 
              onValueChange={handleDissociationChange}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Tranquilidad</Label>
              <span className="text-blue-400 font-black text-xl">{tranquilityLevel}</span>
            </div>
            <Slider 
              min={1} max={5} step={1} 
              value={[tranquilityLevel]} 
              onValueChange={handleTranquilityChange}
            />
          </div>
        </div>
      </div>

      {/* Triggers Section (Stay Always Visible or slightly refined) */}
      <div className="space-y-4 bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800">
              <Binary className="w-5 h-5 text-zinc-500" />
            </div>
            <h2 className="text-lg md:text-2xl font-black text-zinc-50 tracking-tight">Anclaje de Realidad</h2>
        </div>
        <Textarea 
          placeholder="Anota si la realidad se alteró o hubo cambios..."
          className="min-h-[140px] md:min-h-[200px] bg-zinc-950/50 border-zinc-800 text-zinc-100 text-base md:text-lg resize-none focus-visible:ring-purple-600 rounded-2xl leading-relaxed placeholder:text-zinc-700 p-4 md:p-6"
          value={triggersContent}
          onChange={handleTriggersChange}
        />
      </div>
    </div>
  );
}
