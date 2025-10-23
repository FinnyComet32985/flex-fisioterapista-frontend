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
import { useEffect } from "react";
import { apiGet } from "@/lib/api";

type Appointment = {
    id: number;
    data_appuntamento: string;
    ora_appuntamento: string;
};

export function OrariCombobox({
    setOrario,
    data,
}: {
    setOrario: React.Dispatch<React.SetStateAction<string | undefined>>;
    data: Date | undefined;
}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [orariDisponibili, setOrariDisponibili] = React.useState<string[]>([]);
    const [tuttiAppuntamenti, setTuttiAppuntamenti] = React.useState<
        Appointment[]
    >([]);

    // 1. Fetch di tutti gli appuntamenti una sola volta al mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await apiGet("/appointment");
                if (response.ok) {
                    setTuttiAppuntamenti(await response.json());
                } else {
                    console.error("Impossibile caricare gli appuntamenti");
                }
            } catch (error) {
                console.error("Errore nel fetch degli appuntamenti:", error);
            }
        };
        fetchAppointments();
    }, []);

    // 2. Filtra gli orari disponibili quando la data o gli appuntamenti cambiano
    useEffect(() => {
        if (!data) {
            setOrariDisponibili([]);
            return;
        }

        const orariBase = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

        const appuntamentiDelGiorno = tuttiAppuntamenti.filter(app => {
            const dataApp = new Date(app.data_appuntamento);
            return dataApp.toDateString() === data.toDateString();
        });

        const orariOccupati = appuntamentiDelGiorno.map(app => app.ora_appuntamento.substring(0, 5));

        const disponibili = orariBase.filter(orario => !orariOccupati.includes(orario));
        setOrariDisponibili(disponibili);
        setValue(""); // Resetta la selezione quando la data cambia
    }, [data, tuttiAppuntamenti]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    disabled={!data || orariDisponibili.length === 0}
                >
                    {value ? value : "Seleziona orario..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search framework..."
                    />
                    <CommandList>
                        <CommandEmpty>Nessun orario disponibile.</CommandEmpty>
                        <CommandGroup>
                            {orariDisponibili.map((orario) => (
                                    <CommandItem
                                        key={orario}
                                        value={
                                            orario
                                        }
                                        onSelect={(currentValue) => {
                                            setValue(
                                                currentValue === value
                                                    ? ""
                                                    : currentValue
                                            );
                                            setOrario(currentValue === value ? undefined : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {orario}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === orario
                                                    ? "opacity-100"
                                                    : "opacity-0"
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
