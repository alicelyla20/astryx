"use client";

import { useState } from "react";
import { EnergyLevel } from "@prisma/client";
import { getDriftSuggestionAction, DriftSuggestion } from "@/lib/driftActions";
import { Compass, RefreshCcw, CheckCircle2, Zap, Orbit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-16 md:space-y-24 animate-in fade-in duration-500">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 md:w-40 md:h-40 bg-purple-600/10 rounded-[2.5rem] md:rounded-[4rem] flex items-center justify-center mb-8 border border-purple-500/20 shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50" />
            <Image src="/rabbit.png" alt="Astryx Logo" width={48} height={48} className="object-contain mix-blend-screen md:w-24 md:h-24 drop-shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-transform duration-700 group-hover:scale-110" />
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-zinc-50 tracking-tighter">¿Cómo está tu energía?</h1>
          <p className="text-zinc-400 md:text-2xl font-medium">Selecciona para recibir una deriva.</p>
        </div>

        <div className="grid w-full gap-6 md:gap-8 max-w-sm md:max-w-2xl md:grid-cols-3">
          <button
            onClick={() => fetchSuggestion(EnergyLevel.LOW)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 py-8 md:py-12 rounded-[2rem] md:rounded-[3rem] text-2xl md:text-4xl font-black text-zinc-300 transition-all active:scale-[0.98] outline-none shadow-xl hover:border-purple-600/30"
          >
            Baja
          </button>
          <button
            onClick={() => fetchSuggestion(EnergyLevel.MEDIUM)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 py-8 md:py-12 rounded-[2rem] md:rounded-[3rem] text-2xl md:text-4xl font-black text-zinc-100 transition-all active:scale-[0.98] outline-none shadow-xl hover:border-purple-600/30"
          >
            Media
          </button>
          <button
            onClick={() => fetchSuggestion(EnergyLevel.HIGH)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 py-8 md:py-12 rounded-[2rem] md:rounded-[3rem] text-2xl md:text-4xl font-black text-white transition-all active:scale-[0.98] outline-none shadow-xl hover:border-purple-600/30"
          >
            Alta
          </button>
        </div>
      </div>
    );
  }

  if (state === "EMPTY") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-12 animate-in fade-in duration-500">
        <h2 className="text-4xl md:text-6xl font-black text-zinc-50 tracking-tighter">Nada coincide con esta energía</h2>
        <p className="text-zinc-400 md:text-2xl max-w-2xl mx-auto leading-relaxed">Intenta con otro nivel o crea nuevas actividades en el Mapa para nutrir la deriva.</p>
        <button
          onClick={reset}
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-black py-5 px-12 md:py-8 md:px-16 rounded-[2rem] transition-all hover:bg-zinc-800 text-xl md:text-3xl shadow-2xl"
        >
          Volver a Intentar
        </button>
      </div>
    );
  }

  const targetHref = suggestion?.type === "TASK" 
    ? "/" 
    : `/mapa/${suggestion?.categoryId}?chainId=${suggestion?.id}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 space-y-16 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
      <div className={`text-center space-y-8 transition-opacity duration-300 ${isLoading ? "opacity-30 blur-sm" : "opacity-100"}`}>
        <span className="text-xs md:text-lg font-black uppercase tracking-[0.4em] text-purple-500 bg-purple-500/10 px-6 py-2.5 rounded-full border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          {suggestion?.type === "TASK" ? "Misión Pendiente" : "Explorar Cadena"}
        </span>
        
        <h2 className="text-5xl md:text-8xl font-black text-zinc-50 tracking-tighter leading-[1] md:leading-[0.9] break-words">
          {suggestion?.title}
        </h2>
      </div>

      <div className="grid w-full gap-6 max-w-sm md:max-w-2xl">
        <Link
          href={targetHref}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-6 md:py-10 rounded-[2.5rem] md:rounded-[4rem] text-2xl md:text-4xl flex items-center justify-center shadow-[0_20px_50px_rgba(147,51,234,0.4)] transition-all active:scale-[0.95] outline-none group"
        >
          <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 mr-4 group-hover:scale-110 transition-transform" />
          Aceptar
        </Link>
        
        <button
          onClick={handleReroll}
          disabled={isLoading}
          className="w-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 font-black py-6 md:py-10 rounded-[2.5rem] md:rounded-[4rem] text-2xl md:text-3xl flex items-center justify-center border border-zinc-800 transition-all active:scale-[0.95] disabled:opacity-50 outline-none shadow-xl"
        >
          <RefreshCcw className={`w-7 h-7 md:w-10 md:h-10 mr-4 ${isLoading ? "animate-spin" : ""}`} />
          Tirar de nuevo
        </button>

        <button
          onClick={reset}
          className="text-zinc-600 hover:text-zinc-400 font-bold py-4 text-sm md:text-xl uppercase tracking-[0.3em] transition-colors mt-4"
        >
          Cambiar Nivel de Energía
        </button>
      </div>
    </div>
  );
}
