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
      chainId: true, // Needed for navigation if needed
    },
  });

  // Query unarchived chains (via category) with this energy level
  // Note: Since energyLevel is on Category in schema, we look for categories with that level
  const activeCategoriesWithChains = await (prisma as any).category.findMany({
    where: {
      isArchived: false,
      energyLevel,
    },
    include: {
      chains: true
    }
  });

  const activeChains = activeCategoriesWithChains.flatMap((cat: any) => 
    cat.chains.map((chain: any) => ({
      id: chain.id,
      name: chain.name,
      categoryId: cat.id
    }))
  );

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
