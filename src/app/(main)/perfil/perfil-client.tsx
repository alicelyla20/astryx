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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* User Info Section */}
      <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-3xl flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/20">
          <UserIcon className="w-10 h-10 text-purple-500" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">{username}</h2>
        <p className="text-zinc-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Cerebro Activo</p>
      </section>

      {/* Password Change Section */}
      <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <Lock className="w-5 h-5 text-zinc-400" />
          <h3 className="text-xl font-bold text-zinc-100">Seguridad</h3>
        </div>

        <form action={pwAction} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-400 text-sm">Contraseña Actual</Label>
            <Input 
              type="password" 
              name="currentPassword" 
              required 
              className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus-visible:ring-purple-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-sm">Nueva Contraseña</Label>
            <Input 
              type="password" 
              name="newPassword" 
              required 
              className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus-visible:ring-purple-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPwPending}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {isPwPending ? "Actualizando..." : "Cambiar Contraseña"}
          </button>
        </form>
      </section>

      {/* Data Export Section */}
      <section className="bg-purple-600/5 border border-purple-500/10 p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <Download className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-zinc-100 font-bold">Privacidad y Prohibición</h3>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed">
          Eres el único dueño de tu información. Puedes exportar una copia completa de tus registros, 
          tareas y categorías en formato JSON para tu propio respaldo o uso externo.
        </p>

        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] active:scale-[0.95] flex items-center justify-center disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Download className="w-6 h-6 mr-3" />
              Exportar mis Datos
            </>
          )}
        </button>
      </section>

    </div>
  );
}
