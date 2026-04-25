import { getCategoriesAction } from "@/lib/mapaActions";
import { CategoryCard } from "./category-card";
import { CreateCategoryDialog } from "./create-category-dialog";

export default async function MapaPage() {
  const categories = await getCategoriesAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="mb-6 flex justify-between items-center pl-4 border-l-4 border-purple-600">
        <div>
          <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Mapa</h1>
          <p className="text-lg text-zinc-400 font-medium tracking-wide">Estructura Activa</p>
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
          <div className="col-span-full flex flex-col justify-center items-center h-40 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl border-dashed">
            <p className="text-zinc-500 font-medium text-lg">El mapa está vacío.</p>
            <p className="text-zinc-600 text-sm mt-1">Crea una categoría para empezar a guardar puntos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
