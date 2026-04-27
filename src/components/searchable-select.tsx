"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchableSelectProps {
  options: { value: string; label: string; subLabel?: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
  triggerPlaceholder?: string;
  value?: string;
  className?: string;
  name?: string;
}

export function SearchableSelect({
  options,
  onSelect,
  placeholder = "Buscar cadena...",
  triggerPlaceholder = "Seleccionar cadena...",
  value,
  className,
  name
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger nativeButton={false} render={
        <div
          role="combobox"
          tabIndex={0}
          aria-expanded={open}
          className={cn(
            "flex items-center justify-between w-full bg-zinc-900 border border-zinc-800 text-zinc-100 h-14 rounded-2xl px-5 cursor-pointer outline-none focus:border-purple-500 transition-colors shadow-sm font-bold",
            !value && "text-zinc-500 font-normal",
            className
          )}
        >
          {name && <input type="hidden" name={name} value={value || ""} />}
          <span className="truncate">
            {value
              ? options.find((opt) => opt.value === value)?.label || triggerPlaceholder
              : triggerPlaceholder}
          </span>
          <ChevronsUpDown className="ml-3 h-5 w-5 shrink-0 opacity-50 text-zinc-400" />
        </div>
      } />
      <PopoverContent className="w-full min-w-[300px] p-0 bg-zinc-950 border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden" align="start">
        <Command className="bg-zinc-950 text-zinc-50 rounded-2xl">
          <CommandInput 
            placeholder={placeholder} 
            className="h-12 border-none bg-transparent text-white placeholder:text-zinc-600 px-3" 
          />
          <CommandList className="max-h-[300px] overflow-y-auto no-scrollbar py-2">
            <CommandEmpty className="py-6 text-center text-sm text-zinc-500 font-medium">
              No se encontraron resultados.
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={(currentValue) => {
                    onSelect(opt.value);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between rounded-xl mx-2 my-1 px-4 py-3 text-sm cursor-pointer border border-transparent hover:border-purple-600/30 hover:bg-purple-600/10 text-zinc-300 hover:text-purple-300 transition-all data-[selected=true]:bg-purple-600/20 data-[selected=true]:text-purple-400 data-[selected=true]:border-purple-600/50 group"
                >
                  <div className="flex flex-col items-start truncate pr-4">
                    <span className="font-bold tracking-tight text-base">{opt.label}</span>
                    {opt.subLabel && <span className="text-[10px] text-zinc-500 group-hover:text-purple-400/70 uppercase tracking-[0.2em] mt-0.5">{opt.subLabel}</span>}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-5 w-5 group-hover:opacity-100 transition-all text-purple-400",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
