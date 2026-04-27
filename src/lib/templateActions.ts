"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { TaskType, EnergyLevel } from "@prisma/client";
import { getTodayLogAction } from "./dailyLogActions";

export async function getTemplatesAction() {
  return await (prisma as any).missionTemplate.findMany({
    include: {
      _count: { select: { items: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getTemplateByIdAction(id: string) {
  return await (prisma as any).missionTemplate.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          chain: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
}

export async function createTemplateAction(name: string, description?: string) {
  const tpl = await (prisma as any).missionTemplate.create({
    data: { name, description }
  });
  revalidatePath("/templates");
  return tpl;
}

export async function updateTemplateAction(id: string, name: string, description?: string) {
  await (prisma as any).missionTemplate.update({
    where: { id },
    data: { name, description }
  });
  revalidatePath("/templates");
}

export async function deleteTemplateAction(id: string) {
  await (prisma as any).missionTemplate.delete({
    where: { id }
  });
  revalidatePath("/templates");
}

export async function createTemplateItemAction(
  templateId: string, 
  title: string, 
  type: TaskType, 
  energyLevel: EnergyLevel, 
  chainId: string
) {
  await (prisma as any).templateItem.create({
    data: {
      title,
      type,
      energyLevel,
      templateId,
      chainId
    }
  });
  revalidatePath(`/templates/${templateId}`);
}

export async function deleteTemplateItemAction(itemId: string, templateId: string) {
  await (prisma as any).templateItem.delete({
    where: { id: itemId }
  });
  revalidatePath(`/templates/${templateId}`);
}

export async function updateTemplateItemAction(
  itemId: string,
  templateId: string,
  data: { title: string; type: TaskType; energyLevel: EnergyLevel; chainId: string }
) {
  await (prisma as any).templateItem.update({
    where: { id: itemId },
    data
  });
  revalidatePath(`/templates/${templateId}`);
}

export async function importTemplateAction(templateId: string, dateStr?: string) {
  const dailyLog = await getTodayLogAction(dateStr);
  
  const template = await (prisma as any).missionTemplate.findUnique({
    where: { id: templateId },
    include: { items: true }
  });

  if (!template || template.items.length === 0) {
    return 0; // Return zero count correctly instead of throwing
  }

  const tasksData = template.items.map((item: any) => ({
    title: item.title,
    type: item.type,
    energyLevel: item.energyLevel,
    chainId: item.chainId,
    dailyLogId: dailyLog.id,
  }));

  await (prisma as any).task.createMany({
    data: tasksData
  });

  revalidatePath("/");
  revalidatePath("/historial");
  return tasksData.length;
}
