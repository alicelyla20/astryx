"use server";

import { prisma } from "./prisma";

export async function globalSearchAction(query: string) {
  if (!query || query.trim() === "") {
    return {
      tasks: [],
      chainEvents: [],
      categories: [],
    };
  }

  const sanitizedQuery = query.trim();

  // Search Tasks
  const tasks = await (prisma as any).task.findMany({
    where: {
      title: {
        contains: sanitizedQuery,
        mode: "insensitive",
      },
    },
    include: {
      dailyLog: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  // Search ChainEvents
  const chainEvents = await (prisma as any).chainEvent.findMany({
    where: {
      content: {
        contains: sanitizedQuery,
        mode: "insensitive",
      },
      isArchived: false,
    },
    include: {
      chain: {
        include: {
          category: true,
        }
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  // Search Categories
  const categories = await (prisma as any).category.findMany({
    where: {
      name: {
        contains: sanitizedQuery,
        mode: "insensitive",
      },
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return {
    tasks,
    chainEvents,
    categories,
  };
}
