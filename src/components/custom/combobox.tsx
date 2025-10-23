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

type Pazienti = {
    id: number;
    nome: string;
    cognome: string;
};

export function PazientiCombobox({
    setPaziente,
}: {
    setPaziente: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [pazienti, setPazienti] = React.useState<Array<Pazienti> | undefined>(
        undefined
    );

    useEffect(() => {
        const fetchPazienti = async () => {
            try {
                const response = await apiGet("/patient");

                if (!response.ok) {
                    throw new Error("Impossibile caricare gli appuntamenti");
                }

                setPazienti(await response.json());
            } catch (error) {
                console.error(
                    "Errore nel caricamento degli appuntamenti:",
                    error
                );
            }
        };

        fetchPazienti();
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? (() => {
                              const paziente = pazienti?.find(
                                  (p) => p.nome + " " + p.cognome === value
                              );
                              return paziente
                                  ? `${paziente.nome} ${paziente.cognome}`
                                  : "Seleziona paziente...";
                          })()
                        : "Seleziona paziente..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>Nessun paziente trovato.</CommandEmpty>
                        <CommandGroup>
                            {pazienti &&
                                pazienti.map((paziente) => (
                                    <CommandItem
                                        key={paziente.id}
                                        value={
                                            paziente.nome +
                                            " " +
                                            paziente.cognome
                                        }
                                        onSelect={(currentValue) => {
                                            setValue(
                                                currentValue === value
                                                    ? ""
                                                    : currentValue
                                            );
                                            setPaziente(paziente.id);
                                            setOpen(false);
                                        }}
                                    >
                                        {paziente.nome + " " + paziente.cognome}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value ===
                                                    paziente.nome +
                                                        " " +
                                                        paziente.cognome
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
