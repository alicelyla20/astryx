import { SearchClient } from "./search-client";

export default function SearchPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <header className="mb-8 pl-4 border-l-4 border-purple-600">
        <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Buscador</h1>
        <p className="text-lg text-zinc-400 font-medium tracking-wide">Tu Segundo Cerebro</p>
      </header>

      <SearchClient />
    </div>
  );
}
