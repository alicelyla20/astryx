import { getArchivedCategoriesAction, toggleArchiveCategoryAction } from "@/lib/mapaActions";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { deleteCategoryAction } from "@/lib/mapaActions";

export default async function ArchivoPage() {
  const archivedCategories = await getArchivedCategoriesAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <header className="mb-6 pl-4 border-l-4 border-purple-600">
        <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Archivo</h1>
        <p className="text-lg text-zinc-400 font-medium tracking-wide">Habilidades en Reposo</p>
      </header>

      <div className="grid gap-4 mt-8">
        {archivedCategories.length > 0 ? (
          archivedCategories.map((category) => (
            <div 
              key={category.id} 
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-4 h-12 rounded-full hidden md:block" 
                  style={{ backgroundColor: category.colorHex }} 
                />
                <div>
                  <h3 className="text-xl font-bold text-zinc-300 line-through decoration-zinc-700 decoration-2">{category.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    Archivada el {category.createdAt.toLocaleDateString("es-AR")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <form action={async () => {
                  "use server";
                  await deleteCategoryAction(category.id);
                }} className="w-full md:w-auto">
                  <button className="w-full bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-zinc-800 font-medium py-3 px-4 rounded-xl flex justify-center items-center transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>

                <form action={async () => {
                  "use server";
                  await toggleArchiveCategoryAction(category.id, false);
                }} className="flex-1 md:flex-none">
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl flex justify-center items-center transition-colors">
                    <ArchiveRestore className="w-5 h-5 mr-2" />
                    Reactivar
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl border-dashed animate-in fade-in zoom-in-95 duration-700">
            <p className="text-zinc-400 font-bold text-2xl text-center max-w-sm leading-tight">
              No hay habilidades en reposo.
            </p>
            <p className="text-zinc-600 text-lg mt-3 text-center max-w-xs">
              Los datos nunca se borran, se almacenan aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
