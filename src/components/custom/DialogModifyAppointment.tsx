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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "./data-picker";
import { PencilLine } from "lucide-react";
import { FieldSeparator } from "../ui/field";
import * as React from "react";
import { apiPatch } from "@/lib/api";

export function DialogModifyAppointment({id_appuntamento, paziente, data, ora, onAppointmentUpdate}: {id_appuntamento: number | undefined, paziente: string, data: string, ora: string, onAppointmentUpdate: () => void}) {
    const [nuovaData, setNuovaData] = React.useState<Date | undefined>();
    const [nuovoOrario, setNuovoOrario] = React.useState<string | undefined>();
    const [open, setOpen] = React.useState(false);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("eseguito")
        if (!id_appuntamento || (!nuovaData && !nuovoOrario)) {
            console.log("Nessuna modifica da salvare.");
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
                console.log("Appuntamento modificato con successo!");
                onAppointmentUpdate(); // Esegue la funzione di callback per aggiornare la lista
                setOpen(false); // Chiude il dialog
            } else {
                console.error("Errore durante la modifica dell'appuntamento");
            }
        } catch (error) {
            console.error("Errore API:", error);
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