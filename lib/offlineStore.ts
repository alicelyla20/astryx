import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Local string literal types mirroring Prisma enums (avoiding import issues with Prisma v7)
type EnergyLevel = "LOW" | "MEDIUM" | "HIGH";
type TaskType = "ROUTINE" | "TECHNICAL";

export type OfflineTask = {
  title: string;
  type: TaskType;
  energyLevel: EnergyLevel;
  dailyLogId: string;
};

export type OfflineSavePoint = {
  categoryId: string;
  content: string;
};

interface OfflineState {
  pendingTasks: OfflineTask[];
  pendingSavePoints: OfflineSavePoint[];
  hasPendingSync: boolean;
  
  addOfflineTask: (task: OfflineTask) => void;
  addOfflineSavePoint: (sp: OfflineSavePoint) => void;
  clearPending: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      pendingTasks: [],
      pendingSavePoints: [],
      hasPendingSync: false,

      addOfflineTask: (task) => set((state) => ({
        pendingTasks: [...state.pendingTasks, task],
        hasPendingSync: true
      })),

      addOfflineSavePoint: (sp) => set((state) => ({
        pendingSavePoints: [...state.pendingSavePoints, sp],
        hasPendingSync: true
      })),

      clearPending: () => set({
        pendingTasks: [],
        pendingSavePoints: [],
        hasPendingSync: false
      }),
    }),
    {
      name: "astryx-offline-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
