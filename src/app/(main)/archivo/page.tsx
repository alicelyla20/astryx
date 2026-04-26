import { getArchivedCategoriesAction, toggleArchiveCategoryAction } from "@/lib/mapaActions";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { deleteCategoryAction } from "@/lib/mapaActions";
import Image from "next/image";

export default async function ArchivoPage() {
  const archivedCategories = await getArchivedCategoriesAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <header className="flex justify-between items-start pl-4 border-l-4 border-purple-600 ml-3 pr-2 mb-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Archivo</h1>
          <p className="text-lg text-zinc-400 font-medium tracking-wide">Habilidades en Reposo</p>
        </div>
        <div className="flex flex-col items-center justify-center opacity-80 pt-1">
          <Image src="/rabbit.png" alt="Astryx Logo" width={36} height={36} className="object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">Astryx</span>
        </div>
      </header>

      <div className="grid gap-6 mt-12 max-w-5xl mx-auto">
        {archivedCategories.length > 0 ? (
          archivedCategories.map((category) => (
            <div 
              key={category.id} 
              className="bg-zinc-950 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-all hover:border-zinc-700/50"
            >
              <div className="flex items-center gap-6">
                <div 
                  className="w-4 h-16 rounded-full hidden md:block shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  style={{ backgroundColor: category.colorHex }} 
                />
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-zinc-300 line-through decoration-zinc-700 decoration-4 tracking-tighter">{category.name}</h3>
                  <p className="text-sm md:text-lg text-zinc-500 mt-2 font-medium uppercase tracking-widest">
                    Archivada el {category.createdAt.toLocaleDateString("es-AR")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <form action={async () => {
                  "use server";
                  await deleteCategoryAction(category.id);
                }} className="w-full md:w-auto">
                  <button className="w-full md:w-20 bg-zinc-900 border border-zinc-800 text-red-500 hover:bg-red-500/10 hover:border-red-500/30 font-bold py-4 md:py-6 rounded-2xl flex justify-center items-center transition-all active:scale-95 shadow-lg">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </form>

                <form action={async () => {
                  "use server";
                  await toggleArchiveCategoryAction(category.id, false);
                }} className="flex-1 md:flex-none">
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 px-8 md:py-6 md:px-12 rounded-2xl flex justify-center items-center transition-all active:scale-95 shadow-[0_10px_20px_rgba(147,51,234,0.3)] text-lg md:text-2xl uppercase tracking-widest">
                    <ArchiveRestore className="w-6 h-6 md:w-8 md:h-8 mr-3" />
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
