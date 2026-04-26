"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChainColumn } from "./chain-column";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ChainViewerProps {
  category: {
    id: string;
    name: string;
    colorHex: string;
    chains: any[];
  }
}

export function ChainViewer({ category }: ChainViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Logic to handle direct navigation from dashboard
  const targetChainId = searchParams.get("chainId");
  const targetEventId = searchParams.get("eventId");
  
  // Find index of targeted chain
  const targetIndex = targetChainId 
    ? category.chains.findIndex(c => c.id === targetChainId)
    : -1;

  const initialIndex = targetIndex !== -1 
    ? targetIndex 
    : parseInt(searchParams.get("chainIndex") || "0");

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    startIndex: initialIndex
  });

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    if (selectedIndex !== index) {
      setSelectedIndex(index);
    }
    
    // Prevent infinite loops by checking if we actually need to update URL
    const currentIndex = searchParams.get("chainIndex");
    const hasLegacyParams = searchParams.has("chainId") || searchParams.has("eventId");
    
    if (currentIndex === index.toString() && !hasLegacyParams) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("chainIndex", index.toString());
    params.delete("chainId");
    params.delete("eventId");
    
    // window.history.replaceState avoids Next.js full re-renders for purely visual params
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [emblaApi, searchParams, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Handle live updates if params change
  useEffect(() => {
    if (emblaApi && targetIndex !== -1 && targetIndex !== selectedIndex) {
      emblaApi.scrollTo(targetIndex);
    }
  }, [emblaApi, targetIndex, selectedIndex]);

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-4 mb-8">
        <button 
          onClick={scrollPrev} 
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-all font-bold"
          disabled={!emblaApi?.canScrollPrev()}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-1">Cadena Activa</p>
          <h1 className="text-2xl font-black text-white tracking-tighter">
            {category.chains[selectedIndex]?.name || "Explorar"}
          </h1>
        </div>

        <button 
          onClick={scrollNext} 
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-all font-bold"
          disabled={!emblaApi?.canScrollNext()}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex h-full">
          {category.chains.map((chain) => (
            <div key={chain.id} className="flex-[0_0_100%] min-w-0 h-full">
              <ChainColumn 
                chain={chain} 
                categoryId={category.id}
                color={category.colorHex} 
                targetEventId={chain.id === targetChainId ? targetEventId : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6 pb-2">
        {category.chains.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === selectedIndex ? "w-10 shadow-[0_0_10px_rgba(139,92,246,0.3)]" : "w-1.5 bg-zinc-800"
            }`} 
            style={{ backgroundColor: i === selectedIndex ? category.colorHex : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
