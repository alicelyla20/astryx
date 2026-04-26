"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex items-center justify-center min-h-[100dvh] p-4 text-zinc-50 relative z-10 w-full overflow-hidden">
      <Card className="w-full max-w-sm bg-zinc-950 border-zinc-900 shadow-[0_0_20px_rgba(147,51,234,0.15)] relative z-20">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-black tracking-tighter text-zinc-50">Astryx</CardTitle>
          <CardDescription className="text-zinc-400 font-medium tracking-wide">
            Identidad Requerida
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="username" className="text-zinc-300 font-medium">Usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="bg-zinc-900/50 border-zinc-800 text-zinc-50 focus-visible:ring-purple-600 focus-visible:border-purple-600 rounded-xl h-12 px-4 shadow-inner"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-zinc-300 font-medium">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-zinc-900/50 border-zinc-800 text-zinc-50 focus-visible:ring-purple-600 focus-visible:border-purple-600 rounded-xl h-12 px-4 shadow-inner"
              />
            </div>

            {state?.error && (
              <p className="text-sm font-semibold text-red-500 text-center animate-in fade-in slide-in-from-top-1">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4 flex justify-center items-center text-lg"
            >
              {isPending ? "Procesando..." : "Entrar"}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Decorative gradient background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
    </div>
  );
}
