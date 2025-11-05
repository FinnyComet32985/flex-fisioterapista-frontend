import * as React from "react";
import { it } from "date-fns/locale";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CalendarAppointment from "@/components/custom/calendar-appointment";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { PazientiCombobox } from "@/components/custom/comboboxPazienti";
import { Button } from "@/components/ui/button";
import DialogModifyAppointment from "@/components/custom/DialogModifyAppointment";
import { Trash2 } from "lucide-react";

export default function Calendar20() {
    const [data, setData] = React.useState<Date | undefined>(new Date());
    const [mese, setMese] = React.useState<Date>(data || new Date());
    const [orarioSelezionato, setOrarioSelezionato] = React.useState<
        number | undefined
    >(undefined);

    const [status, setStatus] = React.useState<[string, string]>(["", ""]);

    type Appointment = {
        id: number;
        data_appuntamento: string;
        ora_appuntamento: string;
        stato_conferma: string;
        paziente_id: number;
        nome: string;
        cognome: string;
    };
    type AppointmentCalendar = {
        id?: number;
        data_appuntamento: Date;
        stato_conferma?: string;
        paziente_id?: number;
        nome?: string;
        cognome?: string;
    };

    const [dati, setDati] = React.useState<Array<Appointment> | undefined>(
        undefined
    );

    const fetchAppointments = async () => {
        try {
            const response = await apiGet("/appointment");

            if (!response.ok) {
                throw new Error("Impossibile caricare gli appuntamenti");
            }
            
            setDati(await response.json());
        } catch (error) {
            console.error("Errore nel caricamento degli appuntamenti:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const [orariAttuali, setOrariAttuali] = useState<
        Array<AppointmentCalendar>
    >([]);

    useEffect(() => {
        if (!data || !dati) {
            if (data) {
                const baseOrari = [9, 10, 11, 12, 15, 16, 17, 18, 19].map(
                    (ora) => ({
                        data_appuntamento: new Date(
                            data.getFullYear(),
                            data.getMonth(),
                            data.getDate(),
                            ora,
                            0,
                            0
                        ),
                    })
                );
                setOrariAttuali(baseOrari);
            }
            return;
        }
        const appuntamentiGiornalieri = dati.filter((appuntamento) => {
            const dataApp = new Date(appuntamento.data_appuntamento);
            return (
                dataApp.getDate() === data.getDate() &&
                dataApp.getMonth() === data.getMonth() &&
                dataApp.getFullYear() === data.getFullYear()
            );
        });

        const baseOrari = [9, 10, 11, 12, 15, 16, 17, 18, 19].map((ora) => ({
            data_appuntamento: new Date(
                data.getFullYear(),
                data.getMonth(),
                data.getDate(),
                ora,
                0,
                0
            ),
        }));

        const mergedOrari = baseOrari.map((slot) => {
            const trovato = appuntamentiGiornalieri.find((app) => {
                const [ore, minuti, secondi] = app.ora_appuntamento
                    .split(":")
                    .map(Number);
                const appDate = new Date(app.data_appuntamento);
                appDate.setHours(ore, minuti, secondi);
                return appDate.getHours() === slot.data_appuntamento.getHours();
            });

            if (trovato) {
                return {
                    ...slot,
                    id: trovato.id,
                    stato_conferma: trovato.stato_conferma,
                    paziente_id: trovato.paziente_id,
                    nome: trovato.nome,
                    cognome: trovato.cognome,
                };
            }
            return slot;
        });
        setOrariAttuali(mergedOrari);
    }, [data, dati]);

    const giorniDisabilitati = [{ before: new Date() }];

    const [pazienteSelezionato, setPazienteSelezionato] = React.useState<
        number | undefined
    >(undefined);

    const handleClickPrenota = async () => {
        if (!pazienteSelezionato) {
            setStatus(["error", "Seleziona un paziente"]);
            setTimeout(() => {
                setStatus(["", ""]);
            }, 5000);
            return;
        }
        if (orarioSelezionato === undefined || !data) {
            return;
        }

        try {
            const slotSelezionato = orariAttuali[orarioSelezionato];

            const anno = data.getFullYear();

            const meseFormattato = (data.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const giornoFormattato = data.getDate().toString().padStart(2, "0");
            const dataFormattata = `${anno}-${meseFormattato}-${giornoFormattato}`;

            const oraFormattata =
                slotSelezionato.data_appuntamento.toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                });

            const response = await apiPost(
                `/appointment/${pazienteSelezionato}`,
                {
                    data_appuntamento: dataFormattata,
                    ora_appuntamento: oraFormattata,
                }
            );

            if (!response.ok) {
                const result = await response.json();
                setStatus(["error", result.message]);
                setTimeout(() => {
                    setStatus(["", ""]);
                }, 5000);
                throw new Error("Impossibile prenotare l'appuntamento");
            }

            setStatus(["success", ""]);
            setTimeout(() => {
                setStatus(["", ""]);
            }, 3000);

            fetchAppointments();

            // 3. Resetta la selezione per pulire l'interfaccia
            setOrarioSelezionato(undefined);
            setPazienteSelezionato(undefined);
        } catch (error) {
            console.error("Errore nel prenotare l'appuntamento:", error);
        }
    };

    const handleClickElimina = async () => {
        if (orarioSelezionato === undefined || !data) {
            return;
        }
        const response = await apiDelete(
            `/appointment/${orariAttuali[orarioSelezionato].id}`
        );

        if (!response.ok) {
            const result = await response.json();
            setStatus(["error", result.message]);
            setTimeout(() => {
                setStatus(["", ""]);
            }, 5000);
            throw new Error("Impossibile eliminare l'appuntamento");
        }

        setStatus(["success", ""]);
        setTimeout(() => {
            setStatus(["", ""]);
        }, 3000);

        fetchAppointments();

        setOrarioSelezionato(undefined);
        setPazienteSelezionato(undefined);
    };

    const handleAppointmentUpdate = () => {
        fetchAppointments();
        setOrarioSelezionato(undefined);
    };

    const handleClickConfermaAppuntamento = async () => {
        if (orarioSelezionato === undefined || !data) {
            return;
        }
        const response = await apiPost(
            `/appointment/${orariAttuali[orarioSelezionato].id}/confirm`, {}
        );
        if (!response.ok) {
            const result = await response.json();
            setStatus(["error", result.message]);
            setTimeout(() => {
                setStatus(["", ""]);
            }, 5000);
            throw new Error("Impossibile confermare l'appuntamento");
        } 
        setStatus(["success", ""]);
        setTimeout(() => {
            setStatus(["", ""]);
        }, 3000);

        fetchAppointments();

        setOrarioSelezionato(undefined);
        setPazienteSelezionato(undefined);
    }

    return (
        <div>
            {status[0] === "success" && (
                <div className="mb-4 p-4 text-green-800 bg-green-200 rounded mt-6">
                    Paziente aggiunto con successo!
                </div>
            )}
            {status[0] === "error" && (
                <div className="mb-4 p-4 text-red-800 bg-red-200 rounded mt-6">
                    {status[1]}
                </div>
            )}
            <Card className="gap-0 p-0">
                <CardContent className="relative p-0 md:pr-48">
                    <div className="p-6">
                        <Calendar
                            locale={it}
                            mode="single"
                            selected={data}
                            onSelect={(nuovaData) => {
                                setData(nuovaData);
                                setOrarioSelezionato(undefined);
                                if (nuovaData) {
                                    setMese(nuovaData); // calendario al mese della nuova data
                                }
                            }}
                            month={mese}
                            onMonthChange={setMese} // navigazione tra i mesi
                            disabled={giorniDisabilitati}
                            showOutsideDays={false}
                            modifiers={{
                                booked: giorniDisabilitati,
                            }}
                            modifiersClassNames={{
                                booked: "[&>button]:line-through opacity-100",
                            }}
                            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                            formatters={{
                                formatWeekdayName: (date) =>
                                    date
                                        .toLocaleString("it-IT", {
                                            weekday: "short",
                                        })
                                        .charAt(0)
                                        .toUpperCase() +
                                    date
                                        .toLocaleString("it-IT", {
                                            weekday: "short",
                                        })
                                        .slice(1),
                            }}
                        />
                    </div>
                    <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-110 md:border-t-0 md:border-l">
                        <div className="grid gap-2">
                            {orariAttuali &&
                                orariAttuali.map((orario, index) => (
                                    <CalendarAppointment
                                        key={index}
                                        key_id={index}
                                        id_appuntamento={orario.id}
                                        id_paziente={orario.paziente_id}
                                        nome={orario.nome}
                                        cognome={orario.cognome}
                                        paziente={
                                            orario.paziente_id
                                                ? orario.nome +
                                                  " " +
                                                  orario.cognome
                                                : undefined
                                        }
                                        orario={orario.data_appuntamento.toLocaleTimeString(
                                            "it-IT",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                        confermato={orario.stato_conferma}
                                        selected={orarioSelezionato === index}
                                        setSelected={setOrarioSelezionato}
                                    ></CalendarAppointment>
                                ))}
                        </div>
                    </div>
                </CardContent>

                {orarioSelezionato !== undefined && (
                    <CardFooter className="flex flex-col gap-4 border-t px-6 py-5! md:flex-row">
                        <div className="text-sm w-full">
                            {orariAttuali[orarioSelezionato].paziente_id ? (
                                <>
                                    <div className="flex items-center justify-between w-full">
                                        <span className="whitespace-nowrap">
                                            Modifica o elimina l'appuntamento
                                        </span>
                                        <div className="flex items-center gap-4">
                                            {/* CONFERMA APPUNTAMENTO */}
                                            {orariAttuali[orarioSelezionato].stato_conferma === "Non Confermato" &&
                                                <Button onClick={() => handleClickConfermaAppuntamento()}>
                                                Conferma
                                            </Button>}
                                            {/* MODIFICA APPUNTAMENTO */}
                                            <DialogModifyAppointment id_appuntamento={orariAttuali[orarioSelezionato].id} paziente={orariAttuali[orarioSelezionato].nome + " " + orariAttuali[orarioSelezionato].cognome} data={orariAttuali[orarioSelezionato].data_appuntamento.toLocaleDateString("it-IT")} ora={orariAttuali[orarioSelezionato].data_appuntamento.toLocaleTimeString("it-IT")} onAppointmentUpdate={handleAppointmentUpdate}></DialogModifyAppointment>

                                            {/* ELIMINA APPUNTAMENTO */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive">
                                                        <Trash2 />
                                                        Elimina
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Ne sei assolutamente
                                                            sicuro?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Questa azione non
                                                            può essere
                                                            annullata.
                                                            <br></br>
                                                            L'appuntamento verrà
                                                            eliminato
                                                            definitivamente.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Annulla
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleClickElimina()
                                                            }
                                                        >
                                                            Conferma
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <span className="whitespace-nowrap">
                                            Seleziona il paziente che vuoi
                                            prenotare:{" "}
                                        </span>
                                        <PazientiCombobox
                                            setPaziente={setPazienteSelezionato}
                                        ></PazientiCombobox>
                                    </div>
                                    <Button
                                        onClick={() => handleClickPrenota()}
                                    >
                                        Prenota
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
