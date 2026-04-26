"use server";

import { prisma } from "./prisma";
import { EnergyLevel } from "@prisma/client";

export type DriftSuggestion = {
  id: string;
  title: string;
  type: "TASK" | "CHAIN";
  energyLevel: EnergyLevel;
  categoryId?: string;
};

/**
 * Randomly selects a single suggestion based on the provided energy level.
 * Considers PENDING tasks and active Chains.
 */
export async function getDriftSuggestionAction(energyLevel: EnergyLevel): Promise<DriftSuggestion | null> {
  // Query pending tasks with this energy level
  const pendingTasks = await (prisma as any).task.findMany({
    where: {
      status: "PENDING",
      energyLevel,
    },
    select: {
      id: true,
      title: true,
      chainId: true,
    },
  });

  // Query unarchived chains with this energy level directly
  const activeChains = await (prisma as any).chain.findMany({
    where: {
      energyLevel,
      category: {
        isArchived: false
      }
    },
    select: {
      id: true,
      name: true,
      categoryId: true
    }
  });

  // Combine into a generic list
  const suggestions: DriftSuggestion[] = [
    ...pendingTasks.map((t: any) => ({ 
      id: t.id, 
      title: t.title, 
      type: "TASK" as const, 
      energyLevel 
    })),
    ...activeChains.map((c: any) => ({ 
      id: c.id, 
      title: c.name, 
      type: "CHAIN" as const, 
      energyLevel,
      categoryId: c.categoryId 
    })),
  ];

  if (suggestions.length === 0) return null;

  // Pick one randomly
  const randomIndex = Math.floor(Math.random() * suggestions.length);
  return suggestions[randomIndex];
}
