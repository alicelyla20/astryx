"use client";

import { useState, useTransition } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { globalSearchAction } from "@/lib/searchActions";
import Link from "next/link";
import { parseTextWithLinks } from "@/lib/textUtils";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<{
    tasks: any[];
    chainEvents: any[];
    categories: any[];
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(async () => {
      const resp = await globalSearchAction(query);
      setResults(resp);
    });
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto px-4 md:px-0">
      <form onSubmit={handleSearch} className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="w-8 h-8 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
        </div>
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca ideas, tareas, memorias..."
          className="w-full bg-zinc-900/50 border-2 border-zinc-800 focus:border-purple-600 text-zinc-50 rounded-full h-20 md:h-28 pl-20 md:pl-24 pr-8 text-2xl md:text-4xl placeholder:text-zinc-600 outline-none transition-all shadow-xl"
          autoFocus
          autoComplete="off"
        />
        <button 
          type="submit" 
          disabled={isPending || !query.trim()}
          className="absolute right-3 top-3 bottom-3 bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-50 text-white px-6 rounded-full font-bold transition-all flex items-center shadow-[0_0_15px_rgba(147,51,234,0.3)]"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
        </button>
      </form>

      {results && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Categorías Encontradas */}
          {results.categories.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-400 tracking-tight flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                Categorías Encontradas
                <span className="ml-3 bg-zinc-800 text-xs px-2 py-0.5 rounded-full text-zinc-300">
                  {results.categories.length}
                </span>
              </h2>
              <div className="grid gap-3">
                {results.categories.map(cat => (
                  <Link href="/mapa" key={cat.id} className="block group">
                    <div className="bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/60 hover:border-zinc-700 p-5 rounded-2xl transition-all shadow-sm">
                      <div className="flex items-center space-x-3 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.colorHex }} />
                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">
                          {cat.name}
                        </h3>
                      </div>
                      <p className="text-zinc-500 text-sm ml-6">Clic para ir al Mapa</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tareas Encontradas */}
          {results.tasks.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-400 tracking-tight flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                Tareas Encontradas
                <span className="ml-3 bg-zinc-800 text-xs px-2 py-0.5 rounded-full text-zinc-300">
                  {results.tasks.length}
                </span>
              </h2>
              <div className="grid gap-3">
                {results.tasks.map(task => {
                  const dateIso = task.dailyLog?.date ? new Date(task.dailyLog.date).toISOString().split('T')[0] : "";
                  return (
                    <div key={task.id} className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-zinc-100 mb-1">{task.title}</h3>
                        <div className="flex items-center space-x-2 text-xs md:text-sm font-mono text-zinc-500">
                          <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                            {task.type}
                          </span>
                          <span>•</span>
                          <span>{dateIso}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Eventos de Cadena Encontrados */}
          {results.chainEvents.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-400 tracking-tight flex items-center">
                <div className="w-2 h-2 rounded-full bg-pink-500 mr-2" />
                Eventos Encontrados
                <span className="ml-3 bg-zinc-800 text-xs px-2 py-0.5 rounded-full text-zinc-300">
                  {results.chainEvents.length}
                </span>
              </h2>
              <div className="grid gap-3">
                {results.chainEvents.map(ev => {
                  const categoryId = ev.chain?.category?.id;
                  return (
                    <Link href={categoryId ? `/mapa/${categoryId}` : "/mapa"} key={ev.id} className="block group">
                      <div className="bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/60 hover:border-zinc-700 p-5 rounded-2xl transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                             <span className="text-xs text-purple-400 font-mono tracking-wide">
                              {new Date(ev.createdAt).toLocaleString('es-AR')}
                            </span>
                            <span className="text-zinc-600 text-[10px] uppercase font-black">
                              en {ev.chain?.name || "Cadena"}
                            </span>
                          </div>
                          {ev.chain?.category && (
                             <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ev.chain.category.colorHex}20`, color: ev.chain.category.colorHex }}>
                               {ev.chain.category.name}
                             </span>
                          )}
                        </div>
                        <div className="text-zinc-300 text-base md:text-xl leading-relaxed break-words whitespace-pre-wrap group-hover:text-white transition-colors">
                          {parseTextWithLinks(ev.content)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Empty State when no results in any category */}
          {results.tasks.length === 0 && results.chainEvents.length === 0 && results.categories.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-6 border border-zinc-800/30 rounded-3xl bg-zinc-900/20 border-dashed">
              <p className="text-zinc-500 font-medium text-lg">No se encontraron resultados.</p>
              <p className="text-zinc-600 text-sm mt-1">Intenta con otros términos de búsqueda.</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
