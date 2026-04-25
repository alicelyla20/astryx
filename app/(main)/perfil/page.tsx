import { getUserProfileAction } from "@/lib/profileActions";
import { PerfilClient } from "./perfil-client";

export default async function PerfilPage() {
  const user = await getUserProfileAction();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="mb-10 pl-4 border-l-4 border-purple-600">
        <h1 className="text-4xl font-black text-zinc-50 tracking-tighter uppercase">Perfil</h1>
        <p className="text-lg text-zinc-400 font-medium tracking-wide">Configuración y Soberanía de Datos</p>
      </header>

      <PerfilClient username={user?.username || "Usuario"} />
    </div>
  );
}
