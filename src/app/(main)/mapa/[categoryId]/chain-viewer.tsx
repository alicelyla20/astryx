"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChainColumn } from "./chain-column";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ChainViewerProps {
  category: {
    id: string;
    name: string;
    colorHex: string;
    chains: any[];
  }
}

export function ChainViewer({ category }: ChainViewerProps) {
  const searchParams = useSearchParams();

  const targetChainId = searchParams.get("chainId");
  const targetEventId = searchParams.get("eventId");

  const targetIndex = targetChainId
    ? category.chains.findIndex(c => c.id === targetChainId)
    : -1;

  const initialIndex = targetIndex !== -1
    ? targetIndex
    : parseInt(searchParams.get("chainIndex") || "0");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false, // snap tightly
    slidesToScroll: "auto", // Automatically page by available slots
    startIndex: Math.min(initialIndex, Math.max(0, category.chains.length - 1)),
  });

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  // Use a ref to avoid stale closures in onSelect without adding selectedIndex as a dependency
  const selectedIndexRef = useRef(selectedIndex);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // onSelect does NOT depend on selectedIndex — uses ref instead to break the loop
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();

    if (selectedIndexRef.current !== index) {
      selectedIndexRef.current = index;
      setSelectedIndex(index);
    }

    const params = new URLSearchParams(window.location.search);
    params.set("chainIndex", index.toString());
    params.delete("chainId");
    params.delete("eventId");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [emblaApi]); // Only depends on emblaApi — no more loop

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && targetIndex !== -1 && targetIndex !== selectedIndexRef.current) {
      emblaApi.scrollTo(targetIndex);
    }
  }, [emblaApi, targetIndex]);

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Dynamic Header & Controls (Visible everywhere) */}
      <div className="flex items-center justify-between px-4 mb-3">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-all font-bold"
          disabled={!emblaApi?.canScrollPrev()}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-1">
            <span className="md:hidden">Cadena Activa</span>
            <span className="hidden md:inline">Cadenas Activas</span>
          </p>
          <h1 className="text-2xl font-black text-white tracking-tighter">
            <span className="md:hidden">{category.chains[selectedIndex]?.name || "Explorar"}</span>
            <span className="hidden md:inline">Vista de Mapa</span>
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

      {/* Main Container: Carousel on all devices */}
      <div
        className="overflow-hidden flex-1 min-h-0 px-4 md:px-8 pb-2"
        ref={emblaRef}
      >
        <div className="flex h-full md:space-x-8">
          {category.chains.map((chain) => (
            <div
              key={chain.id}
              className="flex-[0_0_100%] lg:flex-[0_0_calc(50%-1rem)] xl:flex-[0_0_calc(33.3333%-1.3333rem)] min-h-0 h-full scroll-mt-20"
            >
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
      <div className="flex justify-center space-x-2 mt-2 pb-0">
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
