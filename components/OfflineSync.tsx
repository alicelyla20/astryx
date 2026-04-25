"use client";

import { useEffect, useState } from "react";
import { useOfflineStore } from "@/lib/offlineStore";
import { Wifi, WifiOff, CloudSync } from "lucide-react";
import { toast } from "sonner";

export default function OfflineSync() {
  const { hasPendingSync, pendingTasks, pendingChainEvents, clearPending } = useOfflineStore();
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      syncData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pendingTasks, pendingChainEvents]);

  const syncData = async () => {
    if (pendingTasks.length === 0 && pendingChainEvents.length === 0) return;
    
    setIsSyncing(true);
    toast.info("Sincronizando datos...");
    try {
      // Simulate network delay for sync
      console.log("Syncing offline data...", { pendingTasks, pendingChainEvents });
      
      setTimeout(() => {
        clearPending();
        setIsSyncing(false);
        toast.success("¡Datos sincronizados!");
      }, 2000);
    } catch (error) {
      console.error("Sync failed:", error);
      setIsSyncing(false);
      toast.error("Error al sincronizar datos offline.");
    }
  };

  if (isOnline && !hasPendingSync) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-10 duration-500">
      <div className={`flex items-center space-x-3 px-6 py-3 rounded-full shadow-2xl border backdrop-blur-xl ${
        !isOnline ? "bg-red-500/10 border-red-500/20 text-red-400" : 
        isSyncing ? "bg-purple-600/10 border-purple-500/20 text-purple-400" :
        "bg-amber-500/10 border-amber-500/20 text-amber-400"
      }`}>
        {isSyncing ? (
          <CloudSync className="w-5 h-5 animate-spin" />
        ) : !isOnline ? (
          <WifiOff className="w-5 h-5" />
        ) : (
          <Wifi className="w-5 h-5" />
        )}
        
        <span className="text-sm font-bold tracking-tight">
          {isSyncing ? "Sincronizando memorias..." : 
           !isOnline ? "Modo Offline - Guardado Local" : 
           "Pendiente de Sincronización"}
        </span>
      </div>
    </div>
  );
}
