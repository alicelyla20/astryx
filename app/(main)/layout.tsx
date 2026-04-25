import BottomTabBar from "@/components/BottomTabBar";
import FloatingActionButton from "@/components/FloatingActionButton";
import TopRightMenu from "@/components/TopRightMenu";
import OfflineSync from "@/components/OfflineSync";
import { Suspense } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopRightMenu />
      <OfflineSync />
      
      <div className="pb-24 pt-4 px-4 w-full h-full animate-in fade-in duration-500">
        {children}
      </div>
      
      <Suspense fallback={null}>
        <FloatingActionButton />
      </Suspense>
      <BottomTabBar />
    </>
  );
}
