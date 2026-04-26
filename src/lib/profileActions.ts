"use server";

import { prisma } from "./prisma";
import { verifySession } from "./auth";
import bcrypt from "bcryptjs";

export async function getUserProfileAction() {
  const session = await verifySession();
  if (!session) throw new Error("No hay sesión activa.");

  const user = await (prisma as any).user.findUnique({
    where: { id: session.userId as string },
    select: { username: true }
  });

  return user;
}

export async function changePasswordAction(prevState: any, formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "Ambas contraseñas son requeridas." };
  }

  const session = await verifySession();
  if (!session) return { error: "No hay sesión activa." };

  const user = await (prisma as any).user.findUnique({
    where: { id: session.userId as string }
  });

  if (!user) return { error: "Usuario no encontrado." };

  const isCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isCorrect) return { error: "La contraseña actual es incorrecta." };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await (prisma as any).user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  return { success: "Contraseña actualizada correctamente." };
}

export async function exportUserDataAction() {
  const session = await verifySession();
  if (!session) throw new Error("No hay sesión activa.");

  const userId = session.userId as string;

  const categories = await (prisma as any).category.findMany({
    include: {
      chains: {
        include: {
          events: true,
          tasks: true,
        }
      },
    }
  });

  const dailyLogs = await (prisma as any).dailyLog.findMany({
    include: {
      tasks: true,
    }
  });

  return {
    exportDate: new Date().toISOString(),
    categories,
    dailyLogs
  };
}
