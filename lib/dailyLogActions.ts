"use server";

import { prisma } from "./prisma";
import { getStartOfDayArg } from "./dateUtils";

export interface UpdateDailyLogPayload {
  socialBattery?: number;
  dissociationLevel?: number;
  tranquilityLevel?: number;
  triggersContent?: string;
}

/**
 * Retrieves the daily log for today based on Argentina Time.
 * Ensures that if it doesn't exist, an empty template is upserted.
 * Also performs an internal rollover evaluation to move passed PLANNED tasks to PENDING.
 */
export async function getTodayLogAction() {
  const startOfDay = getStartOfDayArg();

  // Lazy evaluation: Rollover stale tasks to PENDING
  await prisma.task.updateMany({
    where: {
      status: "PLANNED",
      dailyLog: {
        date: {
          lt: startOfDay
        }
      }
    },
    data: {
      status: "PENDING"
    }
  });

  return await prisma.dailyLog.upsert({
    where: { date: startOfDay },
    update: {}, // Do nothing if it exists
    create: {
      date: startOfDay,
    },
    include: {
      tasks: true, // Fetch tasks bound to today
    }
  });
}

/**
 * Persists partial updates directly to today's log securely.
 */
export async function updateDailyLogAction(payload: UpdateDailyLogPayload) {
  const startOfDay = getStartOfDayArg();

  return await prisma.dailyLog.upsert({
    where: { date: startOfDay },
    update: { ...payload },
    create: {
      date: startOfDay,
      ...payload,
    },
  });
}

import { revalidatePath } from "next/cache";

export async function createTaskAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as any;
  const energyLevel = formData.get("energyLevel") as any;

  if (!title || !type || !energyLevel) {
    return { error: "Todos los campos son requeridos." };
  }

  // Ensure daily log exists
  const dailyLog = await getTodayLogAction();

  await prisma.task.create({
    data: {
      title,
      type,
      energyLevel,
      dailyLogId: dailyLog.id,
    }
  });

  revalidatePath("/");
  return { success: true };
}
