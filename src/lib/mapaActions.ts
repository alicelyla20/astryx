"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

interface CategoryWithCount {
  id: string;
  name: string;
  colorHex: string;
  _count: {
    chains: number;
  };
}

export async function getCategoriesAction(): Promise<any[]> {
  return await prisma.category.findMany({
    where: { isArchived: false },
    include: {
      _count: {
        select: { chains: true }
      }
    },
    orderBy: { createdAt: "desc" },
  }) as any[];
}

export async function getLatestEventsPerChainAction(): Promise<any[]> {
  const chains = await (prisma as any).chain.findMany({
    where: {
      category: { isArchived: false }
    },
    include: {
      category: true,
      events: {
        where: { isArchived: false },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  return (chains as any[])
    .filter((c: any) => c.events && c.events.length > 0)
    .map((c: any) => ({
      ...c.events[0],
      chain: {
        id: c.id,
        name: c.name,
        category: c.category
      }
    }))
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateCategoryColorAction(categoryId: string, colorHex: string): Promise<void> {
  await prisma.category.update({
    where: { id: categoryId },
    data: { colorHex }
  });
  revalidatePath("/mapa");
  revalidatePath("/archivo");
}

export async function getCategoryWithChainsAction(categoryId: string): Promise<any> {
  return await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      chains: {
        include: {
          events: {
            where: { isArchived: false },
            orderBy: { createdAt: "desc" },
            take: 30  // Limit to avoid loading all events at once
          },
          tasks: {
            where: { status: { not: "COMPLETED" } },
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    } as any
  });
}

export async function getAllCategoriesWithChainsAction(): Promise<any[]> {
  return await prisma.category.findMany({
    where: { isArchived: false },
    include: {
      chains: {
        select: {
          id: true,
          name: true,
        }
      }
    } as any,
    orderBy: { name: "asc" }
  }) as any[];
}

export async function createCategoryAction(prevState: any, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const name = formData.get("name") as string;
  const colorHex = formData.get("colorHex") as string;

  if (!name || name.trim() === "") {
    return { error: "El nombre es requerido." };
  }
  if (!colorHex) {
    return { error: "El color es requerido." };
  }

  try {
    await prisma.category.create({
      data: {
        name: name.trim(),
        colorHex,
      },
    });
    revalidatePath("/mapa");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Ya existe una categoría con este nombre." };
    }
    return { error: "Ocurrió un error al crear la categoría." };
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<void> {
  await prisma.category.delete({
    where: { id: categoryId },
  });
  revalidatePath("/mapa");
  revalidatePath("/archivo");
}

export async function toggleArchiveCategoryAction(categoryId: string, isArchived: boolean): Promise<void> {
  await prisma.category.update({
    where: { id: categoryId },
    data: { isArchived },
  });
  revalidatePath("/");
  revalidatePath("/mapa");
  revalidatePath("/archivo");
}

export async function getArchivedCategoriesAction(): Promise<any[]> {
  return await prisma.category.findMany({
    where: { isArchived: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createChainAction(categoryId: string, name: string, energyLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM", type: "SKILL" | "ROUTINE" = "ROUTINE"): Promise<void> {
  await (prisma as any).chain.create({
    data: {
      categoryId,
      name: name.trim(),
      energyLevel,
      type
    }
  });
}

export async function createChainEventAction(
  chainId: string, 
  content: string, 
  energyLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM",
  motivation?: "GENUINE_INTEREST" | "OBLIGATION",
  socialBattery?: number,
  dissociationLevel?: number,
  tranquilityLevel?: number,
  voidLevel?: number,
  type?: "SKILL" | "ROUTINE",
  link?: string
): Promise<{ success: boolean; categoryId: string }> {
  const chain = await (prisma as any).chain.findUnique({
    where: { id: chainId },
    select: { categoryId: true, type: true }
  });
  
  if (!chain) throw new Error("Chain not found");

  await (prisma as any).chainEvent.create({
    data: {
      chainId,
      content,
      energyLevel,
      motivation,
      socialBattery,
      dissociationLevel,
      tranquilityLevel,
      voidLevel,
      type: type || chain.type,
      link
    }
  });
  
  revalidatePath(`/mapa/${chain.categoryId}`);
  revalidatePath("/"); // Dashboard ecos
  return { success: true, categoryId: chain.categoryId };
}

export async function archiveChainEventAction(eventId: string, categoryId: string): Promise<void> {
  await (prisma as any).chainEvent.update({
    where: { id: eventId },
    data: { isArchived: true }
  });
  revalidatePath(`/mapa/${categoryId}`);
  revalidatePath("/");
}

export async function deleteChainEventAction(eventId: string, categoryId: string): Promise<void> {
  await (prisma as any).chainEvent.delete({
    where: { id: eventId }
  });
  revalidatePath(`/mapa/${categoryId}`);
}

export async function updateChainEventAction(
  eventId: string,
  categoryId: string,
  data: {
    content: string;
    socialBattery?: number | null;
    dissociationLevel?: number | null;
    tranquilityLevel?: number | null;
    voidLevel?: number | null;
    energyLevel?: "LOW" | "MEDIUM" | "HIGH";
    motivation?: "GENUINE_INTEREST" | "OBLIGATION";
    type?: "SKILL" | "ROUTINE";
    link?: string | null;
  }
): Promise<void> {
  await (prisma as any).chainEvent.update({
    where: { id: eventId },
    data: {
      content: data.content,
      socialBattery: data.socialBattery,
      dissociationLevel: data.dissociationLevel,
      tranquilityLevel: data.tranquilityLevel,
      voidLevel: data.voidLevel,
      energyLevel: data.energyLevel,
      motivation: data.motivation,
      type: data.type,
      link: data.link
    }
  });
  revalidatePath(`/mapa/${categoryId}`);
  revalidatePath("/");
}

export async function updateCategoryAction(categoryId: string, name: string): Promise<{ success?: boolean; error?: string }> {
  if (!name || name.trim() === "") {
    return { error: "El nombre es requerido." };
  }
  
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { name: name.trim() }
    });
    revalidatePath("/mapa");
    revalidatePath("/archivo");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Ya existe una categoría con ese nombre." };
    }
    return { error: "Error al actualizar la categoría." };
  }
}

export async function updateChainAction(
  chainId: string,
  categoryId: string,
  name: string,
  type: "SKILL" | "ROUTINE",
  energyLevel: "LOW" | "MEDIUM" | "HIGH"
): Promise<{ success?: boolean; error?: string }> {
  if (!name || name.trim() === "") {
    return { error: "El nombre es requerido." };
  }

  try {
    await (prisma as any).chain.update({
      where: { id: chainId },
      data: {
        name: name.trim(),
        type,
        energyLevel
      }
    });
    revalidatePath(`/mapa/${categoryId}`);
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Ya existe una cadena con ese nombre en esta categoría." };
    }
    return { error: "Error al actualizar la cadena." };
  }
}

export async function getRandomChainByEnergyAction(energyLevel: "LOW" | "MEDIUM" | "HIGH"): Promise<any | null> {
  const chains = await (prisma as any).chain.findMany({
    where: {
      energyLevel,
      category: { isArchived: false }
    },
    include: {
      category: true
    }
  });

  if (chains.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * chains.length);
  return chains[randomIndex];
}
