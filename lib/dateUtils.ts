import { toZonedTime, formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import { es } from "date-fns/locale";

const TIMEZONE = "America/Argentina/Buenos_Aires";

/**
 * Returns current date and time adjusted to Argentina timezone.
 */
export function getNowArg(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Returns a Date object representing 00:00:00 of the current day 
 * in Argentina timezone, converted to UTC for standardized storage 
 * in the database (Prisma).
 */
export function getStartOfDayArg(): Date {
  const currentZonedTime = getNowArg();
  const startZoned = startOfDay(currentZonedTime);
  // Convert "local" Argentina time back to UTC for Prisma.
  return fromZonedTime(startZoned, TIMEZONE);
}

/**
 * Helper to format a date to string ensuring it's displayed 
 * according to Argentina's timezone.
 */
export function formatDateArg(date: Date | string | number, formatStr: string = "yyyy-MM-dd"): string {
  return formatInTimeZone(new Date(date), TIMEZONE, formatStr, { locale: es });
}
