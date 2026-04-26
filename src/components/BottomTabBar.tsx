"use client";

import { Calendar, Map, Compass, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomTabBar() {
  const pathname = usePathname();

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
      </div>
    </nav>
  );
}
