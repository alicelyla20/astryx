"use client";

import { useActionState, useTransition } from "react";
import { changePasswordAction, exportUserDataAction } from "@/lib/profileActions";
import { toast } from "sonner";
import { Download, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PerfilClient({ username }: { username: string }) {
  const [isExporting, startExportTransition] = useTransition();

  const handlePasswordChange = async (prevState: any, formData: FormData) => {
    const res = await changePasswordAction(prevState, formData);
    if (res.success) {
      toast.success(res.success);
    } else if (res.error) {
      toast.error(res.error);
    }
    return res;
  };

  const [pwState, pwAction, isPwPending] = useActionState(handlePasswordChange, null);

  const handleExport = () => {
    startExportTransition(async () => {
      try {
        const data = await exportUserDataAction();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `astryx-export-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("¡Datos exportados con éxito!");
      } catch (err) {
        toast.error("Error al exportar los datos.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4 md:px-0 max-w-6xl mx-auto">
      
      {/* Left Column: User Info & Security */}
      <div className="space-y-8 md:space-y-12">
        {/* User Info Section */}
        <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-purple-600/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
            <UserIcon className="w-12 h-12 md:w-16 md:h-16 text-purple-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{username}</h2>
          <p className="text-zinc-500 font-bold mt-2 uppercase tracking-[0.3em] text-xs md:text-sm">Cerebro Activo</p>
        </section>

        {/* Password Change Section */}
        <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-[2.5rem] space-y-8 shadow-xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <Lock className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-100 tracking-tight">Seguridad</h3>
          </div>

          <form action={pwAction} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-zinc-400 text-sm md:text-base font-bold uppercase tracking-wider">Contraseña Actual</Label>
              <Input 
                type="password" 
                name="currentPassword" 
                required 
                className="bg-zinc-950 border-zinc-800 h-14 md:h-16 rounded-2xl focus-visible:ring-purple-600 text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-zinc-400 text-sm md:text-base font-bold uppercase tracking-wider">Nueva Contraseña</Label>
              <Input 
                type="password" 
                name="newPassword" 
                required 
                className="bg-zinc-950 border-zinc-800 h-14 md:h-16 rounded-2xl focus-visible:ring-purple-600 text-lg"
              />
            </div>

            <button 
              type="submit" 
              disabled={isPwPending}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-black py-5 md:py-6 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 mt-4 text-lg uppercase tracking-widest shadow-lg"
            >
              {isPwPending ? "Actualizando..." : "Confirmar Cambio"}
            </button>
          </form>
        </section>
      </div>

      {/* Right Column: Data & Export */}
      <div className="space-y-8 md:space-y-12">
        <section className="bg-purple-600/5 border border-purple-500/10 p-8 md:p-12 rounded-[2.5rem] space-y-8 shadow-2xl h-full flex flex-col justify-center">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-100 tracking-tight">Soberanía de Datos</h3>
          </div>
          
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-medium">
            Eres el único dueño de tu información. Exporta una copia completa de tus registros, 
            tareas y categorías en formato JSON para tu propio respaldo o uso externo.
          </p>

          <div className="pt-4">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-6 md:py-8 rounded-[2rem] transition-all shadow-[0_20px_40px_rgba(147,51,234,0.3)] active:scale-[0.95] flex items-center justify-center disabled:opacity-50 text-xl uppercase tracking-widest"
            >
              {isExporting ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <Download className="w-8 h-8 mr-4" />
                  Exportar Todo
                </>
              )}
            </button>
            <p className="text-zinc-600 text-xs md:text-sm text-center mt-6 font-bold uppercase tracking-widest">Formato: JSON Estándar</p>
          </div>
        </section>
      </div>

    </div>
  );
}
