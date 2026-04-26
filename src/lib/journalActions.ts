"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getJournalsAction(page = 1, limit = 20) {
  return await prisma.journalEntry.findMany({
    orderBy: { date: "desc" },
    skip: (page - 1) * limit,
    take: limit
  });
}

export async function getJournalsCountAction() {
  return await prisma.journalEntry.count();
}

export async function getTodayJournalAction() {
  const dateStr = new Date().toLocaleString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).slice(0, 10);
  const date = new Date(dateStr + "T00:00:00.000Z");
  
  let entry = await prisma.journalEntry.findUnique({
    where: { date }
  });

  if (!entry) {
    entry = await prisma.journalEntry.create({
      data: { date, content: "" }
    });
  }
  return entry;
}

export async function upsertJournalEntryAction(content: string, customDateStr?: string) {
  const dateStr = customDateStr || new Date().toLocaleString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).slice(0, 10);
  const date = new Date(dateStr + "T00:00:00.000Z");

  const entry = await prisma.journalEntry.upsert({
    where: { date },
    update: { content },
    create: { date, content }
  });

  revalidatePath("/");
  revalidatePath("/journal");
  return entry;
}
