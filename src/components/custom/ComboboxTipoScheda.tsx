import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

const tipiScheda = [
    { value: "Casa", label: "Casa" },
    { value: "Clinica", label: "Clinica" },
];

export function ComboboxTipoScheda({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {value ? tipiScheda.find((tipo) => tipo.value === value)?.label : "Seleziona un tipo..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Cerca tipo..." />
                    <CommandList>
                        <CommandEmpty>Nessun tipo trovato.</CommandEmpty>
                        <CommandGroup>
                            {tipiScheda.map((tipo) => (
                                <CommandItem key={tipo.value} value={tipo.value} onSelect={(currentValue) => { onChange(currentValue === value ? "" : currentValue); setOpen(false); }}>
                                    <Check className={cn("mr-2 h-4 w-4", value === tipo.value ? "opacity-100" : "opacity-0")} />
                                    {tipo.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}