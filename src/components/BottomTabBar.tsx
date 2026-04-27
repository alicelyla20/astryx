"use client";

import { Calendar, Map, Compass, BookOpen, Settings, Search, History, Archive, LogOut, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/actions";
import { useTransition } from "react";

export default function BottomTabBar() {
  const pathname = usePathname();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { href: "/", label: "Hoy", icon: Calendar },
    { href: "/mapa", label: "Mapa", icon: Map },
    { href: "/journal", label: "Diario", icon: BookOpen },
    { href: "/deriva", label: "Deriva", icon: Compass },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-zinc-950/90 border-t border-zinc-900 backdrop-blur-lg pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                isActive ? "text-purple-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_8px_rgba(147,51,234,0.4)]" : ""}`} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </Link>
          );
        })}

        {/* Dynamic Settings Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-zinc-500 hover:text-zinc-300 transition-colors duration-200 outline-none"
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-wide">Más</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" className="w-48 bg-zinc-950 border-zinc-900 mb-2 shadow-2xl p-2 rounded-2xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-zinc-500 text-[9px] uppercase font-black tracking-widest pl-2 mb-1">Caja de Herramientas</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-900 mb-1" />
              <DropdownMenuItem 
                className="text-zinc-100 focus:bg-zinc-900 focus:text-white cursor-pointer py-3 rounded-xl"
                onClick={() => router.push("/search")}
              >
                <Search className="mr-3 h-4 w-4 text-zinc-500" />
                <span className="font-bold text-sm">Buscar</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-zinc-100 focus:bg-zinc-900 focus:text-white cursor-pointer py-3 rounded-xl"
                onClick={() => router.push("/templates")}
              >
                <ClipboardList className="mr-3 h-4 w-4 text-zinc-500" />
                <span className="font-bold text-sm">Plantillas</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-zinc-100 focus:bg-zinc-900 focus:text-white cursor-pointer py-3 rounded-xl"
                onClick={() => router.push("/archivo")}
              >
                <Archive className="mr-3 h-4 w-4 text-zinc-500" />
                <span className="font-bold text-sm">Archivo</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                className="text-zinc-100 focus:bg-zinc-900 focus:text-white cursor-pointer py-3 rounded-xl"
                onClick={() => router.push("/perfil")}
              >
                <Settings className="mr-3 h-4 w-4 text-zinc-500" />
                <span className="font-bold text-sm">Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-900 my-1" />
              <DropdownMenuItem 
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer py-3 rounded-xl"
                onClick={() => startTransition(() => { logoutAction() })}
                disabled={isPending}
              >
                <LogOut className="mr-3 h-4 w-4 opacity-70" />
                <span className="font-bold text-sm">Salir</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
