"use client";

import { useEffect, useRef } from "react";
import { EventCard } from "./event-card";

interface ChainColumnProps {
  chain: {
    id: string;
    name: string;
    events: any[];
  };
  color: string;
  targetEventId?: string | null;
}

export function ChainColumn({ chain, color, targetEventId }: ChainColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Improved seamless chain pattern SVG
  const chainSvg = `data:image/svg+xml,%3Csvg width='12' height='20' viewBox='0 0 12 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' y='0' width='4' height='20' rx='2' stroke='${encodeURIComponent(color)}' stroke-width='1.5' opacity='0.3'/%3E%3Cpath d='M6 2C4.34315 2 3 3.34315 3 5V15C3 16.6569 4.34315 18 6 18C7.65685 18 9 16.6569 9 15V5C9 3.34315 7.65685 2 6 2Z' stroke='${encodeURIComponent(color)}' stroke-width='2'/%3E%3C/svg%3E`;

  // Auto-scroll to target event if present
  useEffect(() => {
    if (targetEventId && eventRefs.current[targetEventId]) {
      eventRefs.current[targetEventId]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [targetEventId]);

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative px-2">
      
      <header className="mb-8 pl-3">
        <h2 
          className="text-lg font-black text-zinc-100 tracking-[0.1em] uppercase border-b-2 pb-2 inline-block shadow-sm"
          style={{ borderColor: color }}
        >
          {chain.name}
        </h2>
      </header>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-12 pb-40 scrollbar-hide relative flex flex-col items-center pt-8"
      >
        
        {/* The Centered Chain Line (Seamless Eslabones) */}
        {chain.events.length > 0 && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 top-4 bottom-0 w-3 -z-0 opacity-40 pointer-events-none"
            style={{ 
              backgroundImage: `url("${chainSvg}")`,
              backgroundRepeat: "repeat-y",
              backgroundSize: "12px 20px"
            }}
          />
        )}

        {chain.events.length > 0 ? (
          chain.events.map((event) => (
            <div 
              key={event.id} 
              className="w-full flex justify-center"
              ref={el => { eventRefs.current[event.id] = el; }}
            >
              <EventCard event={event} color={color} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-zinc-900/10 border border-zinc-800/30 rounded-3xl border-dashed">
            <p className="text-zinc-600 text-sm italic">Sin eventos en esta cadena.</p>
          </div>
        )}
      </div>
    </div>
  );
}
