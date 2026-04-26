import { getCategoriesAction } from "@/lib/mapaActions";
import { CategoryCard } from "./category-card";
import { CreateCategoryDialog } from "./create-category-dialog";
import Image from "next/image";

export default async function MapaPage() {
  const categories = await getCategoriesAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex justify-between items-start pl-4 border-l-4 border-purple-600 ml-3 pr-2 mb-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Mapa</h1>
          <p className="text-lg text-zinc-400 font-medium tracking-wide">Estructura Activa</p>
        </div>
        <div className="flex flex-col items-center justify-center opacity-80 pt-1">
          <Image src="/rabbit.png" alt="Astryx Logo" width={36} height={36} className="object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">Astryx</span>
        </div>
      </header>

      <div className="mb-8">
        <CreateCategoryDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryCard key={category.id} category={category as any} />
          ))
        ) : (
          <div className="col-span-full flex flex-col justify-center items-center py-20 px-6 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl border-dashed animate-in fade-in zoom-in-95 duration-700">
            <p className="text-zinc-400 font-bold text-2xl text-center max-w-sm leading-tight">
              Aún no tienes categorías.
            </p>
            <p className="text-zinc-600 text-lg mt-3 text-center max-w-xs">
              ¡Crea una para empezar a organizar tu mapa!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
