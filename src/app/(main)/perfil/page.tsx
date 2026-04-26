import { getUserProfileAction } from "@/lib/profileActions";
import { PerfilClient } from "./perfil-client";
import Image from "next/image";

export default async function PerfilPage() {
  const user = await getUserProfileAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex justify-between items-start pl-4 border-l-4 border-purple-600 ml-3 pr-2 mb-10">
        <div>
          <h1 className="text-4xl font-black text-zinc-50 tracking-tighter uppercase">Perfil</h1>
          <p className="text-lg text-zinc-400 font-medium tracking-wide">Configuración y Soberanía de Datos</p>
        </div>
        <div className="flex flex-col items-center justify-center opacity-80 pt-1">
          <Image src="/rabbit.png" alt="Astryx Logo" width={36} height={36} className="object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">Astryx</span>
        </div>
      </header>

      <PerfilClient username={user?.username || "Usuario"} />
    </div>
  );
}
