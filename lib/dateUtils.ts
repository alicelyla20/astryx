import { toZonedTime, formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import { es } from "date-fns/locale";

const TIMEZONE = "America/Argentina/Buenos_Aires";

/**
 * Retorna la fecha y hora actual ajustada a la zona horaria de Argentina.
 */
export function getNowArg(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Retorna un objeto Date que representa exactamente las 00:00:00 del día
 * actual en la zona horaria de Argentina, convertido a UTC para
 * almacenarlo de manera estandarizada en la base de datos (Prisma).
 */
export function getStartOfDayArg(): Date {
  const currentZonedTime = getNowArg();
  const startZoned = startOfDay(currentZonedTime);
  // Se convierte el tiempo "local" de argentina a UTC para Prisma.
  return fromZonedTime(startZoned, TIMEZONE);
}

/**
 * Helper para formatear una fecha a string asegurando que se visualice
 * en el huso horario de Argentina.
 */
export function formatDateArg(date: Date | string | number, formatStr: string = "yyyy-MM-dd"): string {
  return formatInTimeZone(new Date(date), TIMEZONE, formatStr, { locale: es });
}
