import * as React from "react";
import { it } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CalendarAppointment from "./custom/calendar-appointment";
import { apiGet } from "@/lib/api";
import { set } from "date-fns";

export default function Calendar20() {
    const [data, setData] = React.useState<Date | undefined>(new Date());
    const [mese, setMese] = React.useState<Date>(data || new Date());
    const [orarioSelezionato, setOrarioSelezionato] = useState(0);

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

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await apiGet("/appointment");

                if (!response.ok) {
                    throw new Error("Impossibile caricare gli appuntamenti");
                }

                setDati(await response.json());
            } catch (error) {
                console.error(
                    "Errore nel caricamento degli appuntamenti:",
                    error
                );
            }
        };

        fetchAppointments();
    }, []);

    /* 
    {
		"id": 1,
		"data_appuntamento": "2025-02-25T23:00:00.000Z",
		"ora_appuntamento": "15:00:00",
		"stato_conferma": "Confermato",
		"paziente_id": 4,
		"nome": "Carlo",
		"cognome": "Bianchi"
	},
    */

    const [orariAttuali, setOrariAttuali] = useState<
        Array<AppointmentCalendar>
    >([]);

    useEffect(() => {
        if (!data || !dati) return;

        // 1️⃣ Filtra appuntamenti del giorno selezionato
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

        console.log("Orari attuali:", mergedOrari);
    }, [data, dati]);

    const giorniDisabilitati = [{ before: new Date() }];

    return (
        <Card className="gap-0 p-0">
            <CardContent className="relative p-0 md:pr-48">
                <div className="p-6">
                    <Calendar
                        locale={it}
                        mode="single"
                        selected={data}
                        onSelect={(nuovaData) => {
                            setData(nuovaData);
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
                                    id={orario.id}
                                    img={orario.paziente_id ? "https://images.unsplash.com/photo-1731531992660-d63e738c0b05?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687": undefined}
                                    paziente={orario.paziente_id? orario.nome + " " + orario.cognome: undefined}
                                    orario={orario.data_appuntamento.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                                    selected={orarioSelezionato === index}
                                    setSelected={setOrarioSelezionato}
                                ></CalendarAppointment>
                            ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
                {/* <div className="text-sm">
                    {oraGiaPrenotata ? (
                        <span className="text-destructive">
                            Questa data e ora non è disponibile.
                        </span>
                    ) : data && orarioSelezionato ? (
                        <span>
                            Il tuo appuntamento è per il{" "}
                            <span className="font-medium">
                                {data.toLocaleDateString("it-IT", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                })}
                            </span>{" "}
                            alle{" "}
                            <span className="font-medium">
                                {orarioSelezionato}
                            </span>
                            .
                        </span>
                    ) : (
                        <>
                            Seleziona una data e un orario per il tuo
                            appuntamento.
                        </>
                    )}
                </div>
                <Button
                    disabled={!data || !orarioSelezionato || oraGiaPrenotata}
                    className="w-full md:ml-auto md:w-auto"
                >
                    Continua
                </Button> */}
            </CardFooter>
        </Card>
    );
}
