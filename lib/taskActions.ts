"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { MotivationType, TaskStatus } from "@prisma/client";

/**
 * Marks a task as completed with a specific motivation type.
 */
export async function completeTaskAction(taskId: string, motivation: MotivationType) {
  await (prisma as any).task.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.COMPLETED,
      motivation: motivation,
    },
  });
  revalidatePath("/");
}

/**
 * Deletes a task.
 */
export async function deleteTaskAction(taskId: string) {
  await (prisma as any).task.delete({
    where: { id: taskId },
  });
  revalidatePath("/");
}
