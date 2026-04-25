"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { User, Archive, History, Settings, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function TopRightMenu() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-10 h-10 bg-zinc-900/80 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors backdrop-blur-md shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
          aria-label="Menú del sistema"
        >
          <Settings className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-zinc-800 shadow-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-zinc-400 font-normal">Sistema</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem 
              className="text-zinc-100 focus:bg-zinc-800 focus:text-white cursor-pointer py-2.5"
              onClick={() => router.push("/historial")}
            >
              <History className="mr-2 h-4 w-4" />
              <span>Historial</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-zinc-100 focus:bg-zinc-800 focus:text-white cursor-pointer py-2.5"
              onClick={() => router.push("/archivo")}
            >
              <Archive className="mr-2 h-4 w-4" />
              <span>Archivo</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem 
              className="text-zinc-100 focus:bg-zinc-800 focus:text-white cursor-pointer py-2.5"
              onClick={() => router.push("/perfil")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem 
              className="text-red-400 focus:bg-zinc-800 focus:text-red-300 cursor-pointer py-2.5"
              onClick={() => startTransition(() => { logoutAction() })}
              disabled={isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
