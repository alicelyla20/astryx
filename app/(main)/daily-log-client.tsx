"use client";

import { useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateDailyLogAction, UpdateDailyLogPayload } from "@/lib/dailyLogActions";

interface DailyLogClientProps {
  initialLog: {
    socialBattery: number | null;
    dissociationLevel: number | null;
    tranquilityLevel: number | null;
    triggersContent: string | null;
  };
}

export function DailyLogClient({ initialLog }: DailyLogClientProps) {
  const [socialBattery, setSocialBattery] = useState(initialLog.socialBattery || 3);
  const [dissociationLevel, setDissociationLevel] = useState(initialLog.dissociationLevel || 1);
  const [tranquilityLevel, setTranquilityLevel] = useState(initialLog.tranquilityLevel || 3);
  const [triggersContent, setTriggersContent] = useState(initialLog.triggersContent || "");

  // Use refs to keep track of debounce timeouts
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // General debounced update function
  const debouncedUpdate = (payload: UpdateDailyLogPayload) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      // Background save. Since it's optimistic, we don't await blocking UI.
      updateDailyLogAction(payload).catch(console.error);
    }, 500); 
  };

  // Handlers
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
    <div className="space-y-8 mt-6">
      {/* Metrics Section */}
      <div className="space-y-6 bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl shadow-lg">
        <h2 className="text-xl font-bold text-zinc-50 tracking-tight">Métricas del Día</h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-300 font-medium text-base">Batería Social</Label>
              <span className="text-purple-400 font-bold text-lg w-6 text-right">{socialBattery}</span>
            </div>
            <Slider 
              min={1} max={5} step={1} 
              value={[socialBattery]} 
              onValueChange={handleSocialChange}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-300 font-medium text-base">Nivel de Disociación</Label>
              <span className="text-purple-400 font-bold text-lg w-6 text-right">{dissociationLevel}</span>
            </div>
            <Slider 
              min={1} max={5} step={1} 
              value={[dissociationLevel]} 
              onValueChange={handleDissociationChange}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-300 font-medium text-base">Nivel de Tranquilidad</Label>
              <span className="text-purple-400 font-bold text-lg w-6 text-right">{tranquilityLevel}</span>
            </div>
            <Slider 
              min={1} max={5} step={1} 
              value={[tranquilityLevel]} 
              onValueChange={handleTranquilityChange}
            />
          </div>
        </div>
      </div>

      {/* Triggers Section */}
      <div className="space-y-4 bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl shadow-lg mb-8">
        <h2 className="text-xl font-bold text-zinc-50 tracking-tight">Triggers / Anclaje de Realidad</h2>
        <Textarea 
          placeholder="Anota si algo cambió o si la realidad se alteró..."
          className="min-h-[160px] bg-zinc-950 border-zinc-800 text-zinc-100 text-base resize-none focus-visible:ring-purple-600 rounded-xl leading-relaxed"
          value={triggersContent}
          onChange={handleTriggersChange}
        />
      </div>
    </div>
  );
}
