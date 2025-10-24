import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { Item } from "@/components/ui/item";
import { apiGet } from "@/lib/api";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Appointment = {
    id: number;
    data_appuntamento: string;
    ora_appuntamento: string;
    stato_conferma: string;
    paziente_id: number;
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

    const fetchAppointments = async () => {
        try {
            const response = await apiGet("/appointment");

            if (!response.ok) {
                throw new Error("Impossibile caricare gli appuntamenti");
            }

            setAppuntamenti(await response.json());
        } catch (error) {
            console.error("Errore nel caricamento degli appuntamenti:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Funzione per filtrare e raggruppare gli appuntamenti
    const getGroupedUpcomingAppointments = (): GroupedAppointments[] => {
        if (!appuntamenti) return [];

        const now = new Date();

        // Filtra appuntamenti futuri e ordina per data e ora
        const upcomingAppointments = appuntamenti
            .filter((app) => {
                const appointmentDate = new Date(app.data_appuntamento);
                const [hours, minutes] = app.ora_appuntamento.split(':');
                appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                
                return appointmentDate > now;
            })
            .sort((a, b) => {
                const dateA = new Date(a.data_appuntamento);
                const [hoursA, minutesA] = a.ora_appuntamento.split(':');
                dateA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0);

                const dateB = new Date(b.data_appuntamento);
                const [hoursB, minutesB] = b.ora_appuntamento.split(':');
                dateB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0);

                return dateA.getTime() - dateB.getTime();
            });

        // Raggruppa per giorno
        const grouped: { [key: string]: GroupedAppointments } = {};

        upcomingAppointments.forEach((app) => {
            const date = new Date(app.data_appuntamento);
            const dateKey = date.toISOString().split('T')[0];
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: dateKey,
                    displayDate: date.toLocaleDateString("it-IT", {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }),
                    appointments: []
                };
            }

            grouped[dateKey].appointments.push(app);
        });

        return Object.values(grouped);
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
                    <CardContent>
                        <ScrollArea className="h-96">
                            <div className="flex flex-col gap-4 pr-4">
                                {groupedAppointments.length === 0 && appuntamenti && (
                                    <p className="text-muted-foreground text-center py-4">
                                        Nessun appuntamento futuro
                                    </p>
                                )}
                                {groupedAppointments.map((group, groupIndex) => (
                                    <React.Fragment key={group.date}>
                                        <div className="flex items-center gap-4 pt-2">
                                            <Separator className="flex-1" />
                                            <span className="text-xs text-muted-foreground font-medium capitalize">
                                                {group.displayDate}
                                            </span>
                                            <Separator className="flex-1" />
                                        </div>
                                        {group.appointments.map((appuntamento) => (
                                            <Item key={appuntamento.id} className="bg-accent w-full">
                                                <ItemMedia variant="image">
                                                    <img
                                                        src="https://images.unsplash.com/photo-1731531992660-d63e738c0b05?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                                                        alt={
                                                            appuntamento.nome +
                                                            " " +
                                                            appuntamento.cognome
                                                        }
                                                        width={32}
                                                        height={32}
                                                        className="object-cover"
                                                    />
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle className="line-clamp-1">
                                                        {appuntamento.nome +
                                                            " " +
                                                            appuntamento.cognome}
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
                                        ))}
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
                        {/* Qui potrai inserire la lista degli utenti recenti */}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default HomePage;