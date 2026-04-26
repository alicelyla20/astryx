import BottomTabBar from "@/components/BottomTabBar";
import OfflineSync from "@/components/OfflineSync";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OfflineSync />
      
      <div className="pb-24 pt-4 px-4 w-full h-full animate-in fade-in duration-500">
        {children}
      </div>
      
      <BottomTabBar />
    </>
  );
}
