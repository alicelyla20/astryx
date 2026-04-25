"use client";

import { useState } from "react";
import { EnergyLevel } from "@prisma/client";
import { getDriftSuggestionAction, DriftSuggestion } from "@/lib/driftActions";
import { Compass, RefreshCcw, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

type DriftState = "SELECT_ENERGY" | "SUGGESTION" | "EMPTY";

export default function DerivaPage() {
  const [state, setState] = useState<DriftState>("SELECT_ENERGY");
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);
  const [suggestion, setSuggestion] = useState<DriftSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestion = async (energy: EnergyLevel) => {
    setIsLoading(true);
    setSelectedEnergy(energy);
    try {
      const result = await getDriftSuggestionAction(energy);
      if (result) {
        setSuggestion(result);
        setState("SUGGESTION");
      } else {
        setState("EMPTY");
      }
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReroll = () => {
    if (selectedEnergy) {
      fetchSuggestion(selectedEnergy);
    }
  };

  const reset = () => {
    setState("SELECT_ENERGY");
    setSelectedEnergy(null);
    setSuggestion(null);
  };

  if (state === "SELECT_ENERGY") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-purple-600/10 rounded-full flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">¿Cómo está tu energía?</h1>
          <p className="text-zinc-400 font-medium">Selecciona para recibir una deriva.</p>
        </div>

        <div className="grid w-full gap-4">
          <button
            onClick={() => fetchSuggestion(EnergyLevel.LOW)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 py-6 rounded-3xl text-2xl font-black text-zinc-300 transition-all active:scale-[0.98] outline-none"
          >
            Baja
          </button>
          <button
            onClick={() => fetchSuggestion(EnergyLevel.MEDIUM)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 py-6 rounded-3xl text-2xl font-black text-zinc-100 transition-all active:scale-[0.98] outline-none"
          >
            Media
          </button>
          <button
            onClick={() => fetchSuggestion(EnergyLevel.HIGH)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 py-6 rounded-3xl text-2xl font-black text-white transition-all active:scale-[0.98] outline-none"
          >
            Alta
          </button>
        </div>
      </div>
    );
  }

  if (state === "EMPTY") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-8 animate-in fade-in duration-500">
        <h2 className="text-3xl font-black text-zinc-50 tracking-tighter">Nada coincide con esta energía</h2>
        <p className="text-zinc-400">Intenta con otro nivel o crea nuevas actividades en el Mapa.</p>
        <button
          onClick={reset}
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold py-4 px-8 rounded-2xl transition-all"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 space-y-12 animate-in fade-in zoom-in-95 duration-500">
      <div className={`text-center space-y-6 max-w-sm transition-opacity duration-300 ${isLoading ? "opacity-30 blur-sm" : "opacity-100"}`}>
        <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-500 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
          {suggestion?.type === "TASK" ? "Misión Pendiente" : "Explorar Categoría"}
        </span>
        
        <h2 className="text-5xl md:text-6xl font-black text-zinc-50 tracking-tighter leading-[1.1] break-words">
          {suggestion?.title}
        </h2>
      </div>

      <div className="grid w-full gap-4 max-w-sm">
        <Link
          href={suggestion?.type === "TASK" ? "/" : "/mapa"}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-3xl text-xl flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all active:scale-[0.95] outline-none"
        >
          <CheckCircle2 className="w-6 h-6 mr-3" />
          Aceptar
        </Link>
        
        <button
          onClick={handleReroll}
          disabled={isLoading}
          className="w-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 font-bold py-5 rounded-3xl text-xl flex items-center justify-center border border-zinc-800 transition-all active:scale-[0.95] disabled:opacity-50 outline-none"
        >
          <RefreshCcw className={`w-5 h-5 mr-3 ${isLoading ? "animate-spin" : ""}`} />
          Tirar de nuevo
        </button>

        <button
          onClick={reset}
          className="text-zinc-600 hover:text-zinc-400 font-bold py-4 text-sm uppercase tracking-widest transition-colors"
        >
          Cambiar Energía
        </button>
      </div>
    </div>
  );
}
