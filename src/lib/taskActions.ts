"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { MotivationType, TaskStatus } from "@prisma/client";

/**
 * Marks a task as completed with a specific motivation type.
 */
export async function completeTaskAction(taskId: string, motivation: MotivationType) {
  const task = await (prisma as any).task.findUnique({ where: { id: taskId } });
  if (!task) return;

  await (prisma as any).$transaction([
    (prisma as any).task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.COMPLETED,
        motivation: motivation,
      },
    }),
    (prisma as any).chainEvent.create({
      data: {
        chainId: task.chainId,
        content: `[COMPLETADA] ${task.title}`,
        energyLevel: task.energyLevel,
        motivation: motivation,
      }
    })
  ]);

  revalidatePath("/");
}

/**
 * Reverts task completion.
 */
export async function uncompleteTaskAction(taskId: string) {
  const task = await (prisma as any).task.findUnique({ where: { id: taskId } });
  if (!task) return;

  await (prisma as any).task.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.PENDING,
      motivation: null,
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
