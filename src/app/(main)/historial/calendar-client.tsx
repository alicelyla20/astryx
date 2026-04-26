"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";

export function CalendarClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  
  const [date, setDate] = useState<Date | undefined>(
    dateParam ? new Date(dateParam + "T00:00:00") : new Date()
  );

  useEffect(() => {
    if (dateParam) {
      setDate(new Date(dateParam + "T00:00:00"));
    }
  }, [dateParam]);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      // YYYY-MM-DD
      const isoString = newDate.toISOString().split("T")[0];
      router.push(`/historial?date=${isoString}`);
    } else {
      router.push("/historial");
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 shadow-lg mb-8 flex justify-center w-full">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        className="w-full h-full flex flex-col pointer-events-auto"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
          month: "space-y-4 w-full",
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full justify-between",
          head_cell: "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem] text-center",
          row: "flex w-full mt-2 justify-between",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-zinc-800/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-9 h-9 flex items-center justify-center",
          day: "h-9 w-9 p-0 font-normal hover:bg-zinc-800 hover:text-zinc-50 rounded-full flex items-center justify-center aria-selected:opacity-100 transition-colors",
          day_selected: "bg-purple-600 text-white hover:bg-purple-500 hover:text-white rounded-full font-bold shadow-[0_0_15px_rgba(147,51,234,0.5)]",
          day_today: "bg-zinc-800/50 text-zinc-50 rounded-full",
          day_outside: "text-zinc-600 opacity-50",
          day_disabled: "text-zinc-600 opacity-50",
          day_hidden: "invisible",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 hover:opacity-100 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors",
          caption: "flex justify-between items-center relative pt-1 pb-4",
          caption_label: "text-base font-bold text-zinc-100",
        }}
      />
    </div>
  );
}
