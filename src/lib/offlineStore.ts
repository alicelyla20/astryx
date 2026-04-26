import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Local string literal types mirroring Prisma enums
type EnergyLevel = "LOW" | "MEDIUM" | "HIGH";
type TaskType = "ROUTINE" | "TECHNICAL";

export type OfflineTask = {
  title: string;
  type: TaskType;
  energyLevel: EnergyLevel;
  dailyLogId: string;
};

export type OfflineChainEvent = {
  chainId: string;
  content: string;
  link?: string;
};

interface OfflineState {
  pendingTasks: OfflineTask[];
  pendingChainEvents: OfflineChainEvent[];
  hasPendingSync: boolean;
  
  addOfflineTask: (task: OfflineTask) => void;
  addOfflineChainEvent: (ev: OfflineChainEvent) => void;
  clearPending: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      pendingTasks: [],
      pendingChainEvents: [],
      hasPendingSync: false,

      addOfflineTask: (task) => set((state) => ({
        pendingTasks: [...state.pendingTasks, task],
        hasPendingSync: true
      })),

      addOfflineChainEvent: (ev) => set((state) => ({
        pendingChainEvents: [...state.pendingChainEvents, ev],
        hasPendingSync: true
      })),

      clearPending: () => set({
        pendingTasks: [],
        pendingChainEvents: [],
        hasPendingSync: false
      }),
    }),
    {
      name: "astryx-offline-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
