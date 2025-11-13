import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { Avatar } from "@/components/ui/avatar";
import { Item } from "@/components/ui/item";
import { apiGet } from "@/lib/api";
import { AvatarFallback } from "@radix-ui/react-avatar";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

type Appointment = {
    id: number;
    data_appuntamento: string;
    ora_appuntamento: string;
    stato_conferma: string;
    paziente_id: number;
    nome: string;
    cognome: string;
};

type RecentChat = {
    id: number;
    nome: string;
    cognome: string;
};

type GroupedAppointments = {
    date: string;
    displayDate: string;
    appointments: Appointment[];
};

function HomePage() {
    const [appuntamenti, setAppuntamenti] = React.useState<
        Array<Appointment> | undefined
    >(undefined);
    const [recenti, setRecenti] = React.useState<RecentChat[]>([]);
    const [loadingRecenti, setLoadingRecenti] = React.useState(true);
    const [errorRecenti, setErrorRecenti] = React.useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            const response = await apiGet("/appointment");

            if (response.status === 200) {
                setAppuntamenti(await response.json());
            } else if (response.status === 204) {
                setAppuntamenti([]);
            } else if (!response.ok) {
                throw new Error("Impossibile caricare gli appuntamenti");
            }
        } catch (error) {
            console.error("Errore nel caricamento degli appuntamenti:", error);
        }
    };

    const fetchRecentChats = async () => {
        try {
            setLoadingRecenti(true);
            const response = await apiGet("/chat");
            if (response.status === 200) {
                const data: RecentChat[] = await response.json();
                setRecenti(data);
                setErrorRecenti(null);
            } else if (response.status === 204) {
                setRecenti([]);
                setErrorRecenti(null);
            }
            if (!response.ok) {
                throw new Error("Impossibile caricare le chat recenti");
            }
        } catch (err) {
            setErrorRecenti(
                err instanceof Error ? err.message : "Errore sconosciuto"
            );
        } finally {
            setLoadingRecenti(false);
        }
    };

    useEffect(() => {
        fetchAppointments();

        fetchRecentChats();
    }, []);

    // Funzione per filtrare e raggruppare gli appuntamenti
    const getGroupedUpcomingAppointments = (): GroupedAppointments[] => {
        if (!appuntamenti) return [];

        const now = new Date(); // crea una costante di tipo Date con la data attuale

        // Filtra appuntamenti futuri e ordina per data e ora
        const upcomingAppointments = appuntamenti
            .filter((app) => {
                const appointmentDate = new Date(app.data_appuntamento); // crea una costante con la data dell'appuntamento
                const [hours, minutes] = app.ora_appuntamento.split(":"); // crea un array contenente l'ora e i minuti dell'appuntamento
                appointmentDate.setHours(
                    parseInt(hours), // hours
                    parseInt(minutes), // min
                    0, // sec
                    0 // ms
                ); // aggiunge l'orario alla data dell'appuntamento

                return appointmentDate > now; // aggiunge all'array filtrato l'appuntamento se è successivo alla data attuale
            })
            .sort((a, b) => {
                // crea una costante di tipo Date con i dati di a
                const dateA = new Date(a.data_appuntamento);
                const [hoursA, minutesA] = a.ora_appuntamento.split(":");
                dateA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0);

                // crea una costante di tipo Date con i dati di b
                const dateB = new Date(b.data_appuntamento);
                const [hoursB, minutesB] = b.ora_appuntamento.split(":");
                dateB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0);

                // se iil risultato è positivo la data b sarà dopo a nell'array finale
                return dateA.getTime() - dateB.getTime();
            });

        // Raggruppa per giorno
        const grouped: { [key: string]: GroupedAppointments } = {}; // crea un oggetto grouped di questo tipo: key (di tipo string), value (di tipo GroupedAppointments)

        upcomingAppointments.forEach((app) => {
            const date = new Date(app.data_appuntamento);
            const dateKey = date.toISOString().split("T")[0]; // crea quella che sarà la chiave da inserire nell'oggetto (lasciando solo la data e rimuovendo l'orario)

            if (!grouped[dateKey]) {
                // se la data non esiste già nell'oggetto allora crea una nuova struttura per quel giorno
                grouped[dateKey] = {
                    date: dateKey,
                    displayDate: date.toLocaleDateString("it-IT", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                    appointments: [],
                };
            }
            // aggiunge all'oggetto il nuovo appuntamento
            grouped[dateKey].appointments.push(app);
        });

        return Object.values(grouped); // resituisce un array dei valori dell'oggetto (rimuovendo così le chiavi)
    };

    const groupedAppointments = getGroupedUpcomingAppointments();

    return (
        <>
            <h1>Benvenuto!</h1>
            <div className="flex flex-row gap-4">
                <Card className="w-2/5">
                    <CardHeader>
                        <CardTitle>Prossimi appuntamenti</CardTitle>
                    </CardHeader>
                    <CardContent className="pr-0">
                        <ScrollArea className="h-96">
                            <div className="flex flex-col gap-4 pr-4">
                                {appuntamenti === undefined && (
                                    <p className="text-muted-foreground text-center py-4">
                                        Caricamento appuntamenti...
                                    </p>
                                )}
                                {appuntamenti && appuntamenti.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">
                                        Nessun appuntamento.
                                    </p>
                                )}
                                {appuntamenti &&
                                    appuntamenti.length > 0 &&
                                    groupedAppointments.length === 0 && (
                                        <p className="text-muted-foreground text-center py-4">
                                            Nessun appuntamento futuro
                                        </p>
                                    )}
                                {groupedAppointments.map((group) => (
                                    <React.Fragment key={group.date}>
                                        <div className="flex items-center gap-4 pt-2">
                                            <Separator className="flex-1" />
                                            <span className="text-xs text-muted-foreground font-medium capitalize">
                                                {group.displayDate}
                                            </span>
                                            <Separator className="flex-1" />
                                        </div>
                                        {group.appointments.map(
                                            (appuntamento) => (
                                                <Item
                                                    key={appuntamento.id}
                                                    className="bg-accent w-full"
                                                >
                                                    <ItemMedia variant="image">
                                                        <Avatar className="  border-card shadow-lg text-lg">
                                                            <AvatarFallback>
                                                                {appuntamento.nome.charAt(
                                                                    0
                                                                )}
                                                                {appuntamento.cognome.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </ItemMedia>
                                                    <ItemContent>
                                                        <ItemTitle className="line-clamp-1">
                                                            <Link
                                                                to={`/profilo-paziente/${appuntamento.paziente_id}`}
                                                            >
                                                                {appuntamento.nome +
                                                                    " " +
                                                                    appuntamento.cognome}
                                                            </Link>
                                                        </ItemTitle>
                                                    </ItemContent>
                                                    <ItemContent className="flex-none text-center">
                                                        <ItemDescription className="text-accent-foreground">
                                                            {appuntamento.ora_appuntamento.slice(
                                                                0,
                                                                5
                                                            )}
                                                        </ItemDescription>
                                                    </ItemContent>
                                                </Item>
                                            )
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card className="w-2/5">
                    <CardHeader>
                        <CardTitle>Utenti recenti</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <div className="flex flex-col gap-4 pr-4">
                                {loadingRecenti && <p>Caricamento...</p>}
                                {errorRecenti && (
                                    <p className="text-destructive">
                                        {errorRecenti}
                                    </p>
                                )}
                                {!loadingRecenti && recenti.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">
                                        Nessuna chat recente.
                                    </p>
                                )}
                                {recenti.map((chat) => (
                                    <Link
                                        key={chat.id}
                                        to={`/profilo-paziente/${chat.id}`}
                                        className="block"
                                    >
                                        <Item className="w-full hover:bg-accent transition-colors">
                                            <ItemMedia>
                                                <Avatar className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-muted-foreground/20">
                                                    <AvatarFallback className="text-muted-foreground font-semibold">
                                                        {chat.nome.charAt(0)}
                                                        {chat.cognome.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </ItemMedia>

                                            <ItemContent className="gap-1">
                                                <ItemTitle>
                                                    {chat.nome} {chat.cognome}
                                                </ItemTitle>
                                            </ItemContent>
                                        </Item>
                                    </Link>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default HomePage;
