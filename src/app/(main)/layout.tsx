import BottomTabBar from "@/components/BottomTabBar";
import OfflineSync from "@/components/OfflineSync";
import { Sidebar } from "@/components/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950">
      <OfflineSync />
      
      {/* Permanent Sidebar on Desktop */}
      <Sidebar />
      
      <main className="flex-1 relative pb-24 md:pb-8 pt-4 px-4 w-full h-full animate-in fade-in duration-500 overflow-y-auto max-h-screen">
        {children}
      </main>
      
      {/* Bottom Bar ONLY on Mobile */}
      <div className="md:hidden">
        <BottomTabBar />
      </div>
    </div>
  );
}
