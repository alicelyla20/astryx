"use client";

import { useState, useTransition } from "react";
import { updateChainEventAction } from "@/lib/mapaActions";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function EditEventDialog({ event, categoryId, onClose }: any) {
  const [content, setContent] = useState(event.content || "");
  const [social, setSocial] = useState(event.socialBattery || 3);
  const [dissoc, setDissoc] = useState(event.dissociationLevel || 3);
  const [tranq, setTranq] = useState(event.tranquilityLevel || 3);
  const [energyLevel, setEnergyLevel] = useState(event.energyLevel || "MEDIUM");
  const [motivation, setMotivation] = useState(event.motivation || "GENUINE_INTEREST");
  const [link, setLink] = useState(event.link || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateChainEventAction(event.id, categoryId, {
          content,
          socialBattery: social,
          dissociationLevel: dissoc,
          tranquilityLevel: tranq,
          energyLevel,
          motivation,
          link: link.trim() === "" ? null : link
        });
        toast.success("Eslabón actualizado");
        onClose();
      } catch (e) {
        toast.error("Error al actualizar");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 w-full max-w-md shadow-2xl relative">
        <h2 className="text-xl font-bold text-white mb-4">Editar Eslabón</h2>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-zinc-900 border-zinc-800 min-h-[100px] text-zinc-100"
            placeholder="Descripción del eslabón..."
          />
          
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
               <label className="text-[10px] uppercase text-zinc-500 font-bold block">Energía</label>
               <select value={energyLevel} onChange={e => setEnergyLevel(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl h-10 px-2 text-sm text-zinc-100">
                 <option value="LOW">Baja</option>
                 <option value="MEDIUM">Media</option>
                 <option value="HIGH">Alta</option>
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-[10px] uppercase text-zinc-500 font-bold block">Interés</label>
               <select value={motivation} onChange={e => setMotivation(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl h-10 px-2 text-sm text-zinc-100">
                 <option value="GENUINE_INTEREST">Genuino</option>
                 <option value="OBLIGATION">Obligación</option>
               </select>
             </div>
          </div>

          <div className="space-y-5 border-y border-zinc-800/50 py-4">
             <div className="space-y-2">
               <label className="text-xs uppercase text-zinc-400 font-black block text-center">Batería Social: {social}</label>
               <input type="range" min="1" max="5" value={social} onChange={e => setSocial(+e.target.value)} className="w-full accent-purple-500 h-2" />
             </div>
             <div className="space-y-2">
               <label className="text-xs uppercase text-zinc-400 font-black block text-center">Nivel de Disociación: {dissoc}</label>
               <input type="range" min="1" max="5" value={dissoc} onChange={e => setDissoc(+e.target.value)} className="w-full accent-emerald-500 h-2" />
             </div>
             <div className="space-y-2">
               <label className="text-xs uppercase text-zinc-400 font-black block text-center">Tranquilidad: {tranq}</label>
               <input type="range" min="1" max="5" value={tranq} onChange={e => setTranq(+e.target.value)} className="w-full accent-blue-500 h-2" />
             </div>
          </div>
          
          <div className="space-y-1">
             <label className="text-[10px] uppercase text-zinc-500 font-bold block">Enlace (Opcional)</label>
             <input type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl h-10 px-3 text-sm text-zinc-100 placeholder:text-zinc-700" placeholder="https://..." />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm bg-zinc-900 text-zinc-300">Cerrar</button>
          <button onClick={handleSave} disabled={isPending} className="px-4 py-2 rounded-xl text-sm bg-purple-600 hover:bg-purple-500 transition-colors text-white font-bold disabled:opacity-50">Guardar</button>
        </div>
      </div>
    </div>
  );
}
