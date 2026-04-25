export default function ArchivoPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="mb-6 pl-4 border-l-4 border-purple-600">
        <h1 className="text-4xl font-black text-zinc-50 tracking-tighter">Archivo</h1>
        <p className="text-lg text-zinc-400 font-medium tracking-wide">Categorías y datos inactivos</p>
      </header>

      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 border border-zinc-800/30 rounded-3xl bg-zinc-900/20 border-dashed">
        <p className="text-zinc-400 font-medium text-lg">En construcción</p>
        <p className="text-zinc-600 text-sm mt-2">Aquí se guardarán las categorías y tareas archivadas de tu mapa.</p>
      </div>
    </div>
  );
}
