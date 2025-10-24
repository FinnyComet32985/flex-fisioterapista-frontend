import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import DatePicker from "./data-picker";
import { PencilLine } from "lucide-react";
import { FieldSeparator } from "../ui/field";
import * as React from "react";
import { apiPatch } from "@/lib/api";

export function DialogModifyAppointment({id_appuntamento, paziente, data, ora, onAppointmentUpdate}: {id_appuntamento: number | undefined, paziente: string, data: string, ora: string, onAppointmentUpdate: () => void}) {
    const [nuovaData, setNuovaData] = React.useState<Date | undefined>();
    const [nuovoOrario, setNuovoOrario] = React.useState<string | undefined>();
    const [status, setStatus] = React.useState<[string, string]>(["", ""]);
    const [open, setOpen] = React.useState(false);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id_appuntamento || (!nuovaData && !nuovoOrario)) {
            setStatus(["error", "Nessuna modifica da salvare."]);
            setTimeout(() => setStatus(["", ""]), 3000);
            return;
        }

        const body: { data_appuntamento?: string; ora_appuntamento?: string } = {};

        if (nuovaData) {
            const anno = nuovaData.getFullYear();
            const mese = (nuovaData.getMonth() + 1).toString().padStart(2, "0");
            const giorno = nuovaData.getDate().toString().padStart(2, "0");
            body.data_appuntamento = `${anno}-${mese}-${giorno}`;
        }

        if (nuovoOrario) {
            body.ora_appuntamento = nuovoOrario;
        }

        try {
            const response = await apiPatch(`/appointment/${id_appuntamento}`, body);
            if (response.ok) {
                setStatus(["success", "Appuntamento modificato con successo!"]);
                setTimeout(() => {
                    onAppointmentUpdate(); // Esegue la callback per aggiornare la lista e deselezionare
                    setOpen(false);      // Chiude il dialog
                    setStatus(["", ""]);  // Resetta lo stato per la prossima apertura
                }, 2000);
            } else {
                const errorData = await response.json();
                setStatus(["error", errorData.message || "Errore durante la modifica."]);
                setTimeout(() => setStatus(["", ""]), 5000);
            }
        } catch (error) {
            console.error("Errore API:", error);
            setStatus(["error", "Errore di connessione."]);
            setTimeout(() => setStatus(["", ""]), 5000);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline"><PencilLine />Modifica</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Modifica appuntamento</DialogTitle>
                        <DialogDescription>
                            Decidi il giorno e l'orario a cui vuoi spostare l'appuntamento.
                        </DialogDescription>
                        {status[0] === "success" && (
                            <div className="mt-4 p-3 text-sm text-green-800 bg-green-100 rounded dark:bg-green-900 dark:text-green-200">
                                {status[1]}
                            </div>
                        )}
                        {status[0] === "error" && (
                            <div className="mt-4 p-3 text-sm text-red-800 bg-red-100 rounded dark:bg-red-900 dark:text-red-200">
                                {status[1]}
                            </div>
                        )}
                    </DialogHeader>
                    <div className="grid gap-4">
                        <h5>Paziente dell'appuntamento:</h5>
                        <span>{paziente}</span>
                        <h5>Data dell'appuntamento:</h5>
                        <span>{data}</span>
                        <h5>Ora dell'appuntamento:</h5>
                        <span>{ora}</span>
                    </div>
                    <FieldSeparator/>
                    <div>
                    <DatePicker setData={setNuovaData} setOrario={setNuovoOrario} />
                    
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Annulla</Button>
                        </DialogClose>
                        <Button onClick={handleSaveChanges} type="submit">Salva modifiche</Button>
                    </DialogFooter>
                </DialogContent>
        </Dialog>
    );
}

export default DialogModifyAppointment;