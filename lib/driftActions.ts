"use server";

import { prisma } from "./prisma";
import { EnergyLevel } from "@prisma/client";

export type DriftSuggestion = {
  id: string;
  title: string;
  type: "TASK" | "CATEGORY";
  energyLevel: EnergyLevel;
};

/**
 * Randomly selects a single suggestion based on the provided energy level.
 * Considers PENDING tasks and active Categories.
 */
export async function getDriftSuggestionAction(energyLevel: EnergyLevel): Promise<DriftSuggestion | null> {
  // Query pending tasks with this energy level
  const pendingTasks = await prisma.task.findMany({
    where: {
      status: "PENDING",
      energyLevel,
    },
    select: {
      id: true,
      title: true,
    },
  });

  // Query unarchived categories with this energy level
  const activeCategories = await prisma.category.findMany({
    where: {
      isArchived: false,
      energyLevel,
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Combine into a generic list
  const suggestions: DriftSuggestion[] = [
    ...pendingTasks.map(t => ({ id: t.id, title: t.title, type: "TASK" as const, energyLevel })),
    ...activeCategories.map(c => ({ id: c.id, title: c.name, type: "CATEGORY" as const, energyLevel })),
  ];

  if (suggestions.length === 0) return null;

  // Pick one randomly
  const randomIndex = Math.floor(Math.random() * suggestions.length);
  return suggestions[randomIndex];
}
