"use server";

import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "./auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Todos los campos son obligatorios." };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: "Credenciales inválidas." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Credenciales inválidas." };
  }

  // Create session
  await createSession(user.id);
  
  // Navigate home
  redirect("/");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
