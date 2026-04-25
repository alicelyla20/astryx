"use server";

import { prisma } from "./prisma";
import { getStartOfDayArg } from "./dateUtils";
import { revalidatePath } from "next/cache";

export interface UpdateDailyLogPayload {
  socialBattery?: number;
  dissociationLevel?: number;
  tranquilityLevel?: number;
  triggersContent?: string;
  dateStr?: string;
}

export async function getTodayLogAction(dateStr?: string) {
  const targetDate = dateStr ? new Date(dateStr) : getStartOfDayArg();

  if (!dateStr) {
    await (prisma as any).task.updateMany({
      where: {
        status: "PLANNED",
        dailyLog: {
          date: {
            lt: targetDate
          }
        }
      },
      data: {
        status: "PENDING"
      }
    });
  }

  return await (prisma as any).dailyLog.upsert({
    where: { date: targetDate },
    update: {}, 
    create: {
      date: targetDate,
    },
    include: {
      tasks: {
        include: {
          chain: {
            include: {
              category: true
            }
          }
        }
      },
    }
  });
}

export async function updateDailyLogAction(payload: UpdateDailyLogPayload) {
  const targetDate = payload.dateStr ? new Date(payload.dateStr) : getStartOfDayArg();
  const { dateStr, ...updateData } = payload;

  return await (prisma as any).dailyLog.upsert({
    where: { date: targetDate },
    update: { ...updateData },
    create: {
      date: targetDate,
      ...updateData,
    },
  });
}

export async function createTaskAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as any;
  const energyLevel = formData.get("energyLevel") as any;
  const chainId = formData.get("chainId") as string;
  const dateStr = formData.get("dateStr") as string | null;

  if (!title || !type || !energyLevel || !chainId) {
    return { error: "Todos los campos son requeridos, incluyendo la cadena origen." };
  }

  const dailyLog = await getTodayLogAction(dateStr || undefined);

  await (prisma as any).task.create({
    data: {
      title,
      type,
      energyLevel,
      chainId,
      dailyLogId: dailyLog.id,
    }
  });

  revalidatePath("/");
  revalidatePath("/historial");
  return { success: true };
}
