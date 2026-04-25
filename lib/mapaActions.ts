"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getCategoriesAction() {
  return await prisma.category.findMany({
    where: { isArchived: false },
    include: {
      savePoints: {
        orderBy: { createdAt: "desc" },
        take: 1, // Only fetch the most recent SavePoint
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryHistoryAction(categoryId: string) {
  return await prisma.savePoint.findMany({
    where: { categoryId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCategoryAction(prevState: any, formData: FormData) {
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
    // Unique constraint violation code for Prisma
    if (error.code === "P2002") {
      return { error: "Ya existe una categoría con este nombre." };
    }
    return { error: "Ocurrió un error al crear la categoría." };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  await prisma.category.delete({
    where: { id: categoryId },
  });
  revalidatePath("/mapa");
}

export async function deleteSavePointAction(savePointId: string) {
  await prisma.savePoint.delete({
    where: { id: savePointId },
  });
  revalidatePath("/mapa");
}
