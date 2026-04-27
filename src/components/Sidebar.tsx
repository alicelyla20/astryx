"use client";

import { 
  Calendar, 
  Map, 
  Compass, 
  BookOpen, 
  Settings, 
  Search, 
  History, 
  Archive, 
  LogOut,
  User,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import { useTransition } from "react";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const mainLinks = [
    { href: "/", label: "Hoy", icon: Calendar },
    { href: "/mapa", label: "Mapa", icon: Map },
    { href: "/deriva", label: "Deriva", icon: Compass },
    { href: "/search", label: "Buscador", icon: Search },
  ];

  const secondaryLinks = [
    { href: "/journal", label: "Diario de Abordo", icon: BookOpen },
    { href: "/templates", label: "Plantillas", icon: ClipboardList },
    { href: "/archivo", label: "Archivo", icon: Archive },
  ];

  const footerLinks = [
    { href: "/perfil", label: "Perfil", icon: User },
  ];

  const NavLink = ({ href, label, icon: Icon, isSecondary = false }: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
          isActive 
            ? "bg-purple-600/10 text-white border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.1)]" 
            : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
        }`}
      >
        <div className={`p-2 rounded-xl transition-colors ${
          isActive ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]" : "bg-zinc-900 group-hover:bg-zinc-800"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-bold tracking-tight ${isSecondary ? "text-sm" : "text-base"}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen bg-zinc-950 border-r border-zinc-900 sticky top-0 left-0 p-6 z-50">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3 px-2 mb-10">
        <div className="relative w-10 h-10">
          <Image 
            src="/rabbit.png" 
            alt="Astryx Logo" 
            fill 
            sizes="40px"
            className="object-contain mix-blend-screen drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]" 
          />        </div>
        <div>
          <h1 className="text-xl font-black text-zinc-50 tracking-tighter leading-none">Astryx</h1>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Sistema PWA</span>
        </div>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 no-scrollbar">
        {/* Main Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-2 block">
            Principal
          </label>
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        </div>

        {/* Secondary Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-2 block">
            Bitácora & Registros
          </label>
          <div className="space-y-1">
            {secondaryLinks.map((link) => (
              <NavLink key={link.href} {...link} isSecondary />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer / Account */}
      <div className="mt-auto pt-6 border-t border-zinc-900 space-y-1">
        {footerLinks.map((link) => (
          <NavLink key={link.href} {...link} isSecondary />
        ))}
        <button
          onClick={() => startTransition(() => logoutAction())}
          disabled={isPending}
          className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 group"
        >
          <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-sm">
            {isPending ? "Saliendo..." : "Cerrar Sesión"}
          </span>
        </button>
      </div>
    </aside>
  );
}
