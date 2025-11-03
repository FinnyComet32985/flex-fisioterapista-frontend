import { useEffect, useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { it } from "date-fns/locale";

interface EsercizioSvolto {
    esercizio_id: number;
    nome_esercizio: string;
    serie_effettive: number;
    ripetizioni_effettive: number;
    note: string | null;
    ripetizioni_assegnate: number;
    serie_assegnate: number;
}

interface Sessione {
    id: number;
    data_sessione: string;
}

interface Sondaggio {
    forza: string;
    dolore: string;
    feedback: string;
    mobilita: string;
}

interface SessioneSelezionata {
    data_sessione: Date;
    sondaggio: Sondaggio;
    esercizi: EsercizioSvolto[];
}

export function CalendarioSessioni({
    scheda_id,
}: {
    scheda_id: number | undefined;
}) {
    const [dataSelezionata, setDataSelezionata] = useState<Date | undefined>(
        new Date()
    );
    const [sessioni, setSessioni] = useState<Sessione[]>([]);

    const [sessioneDelGiorno, setSessioneDelGiorno] = useState<
        SessioneSelezionata | undefined
    >();
    const [error, setError] = useState<string | null>(null);

    const fetchSessioni = async () => {
        if (!scheda_id) return;
        try {
            const response = await apiGet(`/trainingSessions/${scheda_id}`);
            if (!response.ok)
                throw new Error("Impossibile caricare le sessioni svolte");
            const data: Sessione[] = await response.json();
            setSessioni(data);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Errore nel caricamento delle sessioni."
            );
        }
    };

    useEffect(() => {
        fetchSessioni();
    }, []);

    const giorniConSessione = sessioni.map((s) => new Date(s.data_sessione));

    const fetchSessioneSelezionata = useCallback(
        async (nuovaData: Date | undefined) => {
            if (!nuovaData || sessioni.length === 0) {
                setSessioneDelGiorno(undefined);
                return;
            }

            const ids = sessioni.filter((s) => {
                return (
                    nuovaData?.toLocaleDateString("it-IT") ===
                    new Date(s.data_sessione).toLocaleDateString("it-IT")
                );
            });

            if (ids.length > 0) {
                const response = await apiGet(`/trainingSession/${ids[0].id}`);
                const data: SessioneSelezionata = await response.json();
                console.log(data);
                setSessioneDelGiorno(data);
            } else {
                setSessioneDelGiorno(undefined); // Nessuna sessione per la data selezionata
            }
        },
        [sessioni]
    ); // La funzione dipende da `sessioni`

    // Esegue il fetch per la data di oggi quando le sessioni sono state caricate
    useEffect(() => {
        if (sessioni.length > 0) {
            fetchSessioneSelezionata(dataSelezionata);
        }
    }, [sessioni, dataSelezionata, fetchSessioneSelezionata]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 flex justify-center">
                <Calendar
                    mode="single"
                    locale={it}
                    selected={dataSelezionata}
                    onSelect={(nuovaData) => {
                        setDataSelezionata(nuovaData);
                        fetchSessioneSelezionata(nuovaData);
                    }}
                    className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                    modifiers={{ booked: giorniConSessione }}
                    modifiersClassNames={{
                        booked: "bg-primary text-primary-foreground rounded-full",
                    }}
                />
            </div>
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Dettagli Sessione del{" "}
                            {dataSelezionata?.toLocaleDateString("it-IT") || ""}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[55vh]">
                            {error && (
                                <p className="text-destructive">{error}</p>
                            )}
                            {sessioneDelGiorno ? (
                                <div className="space-y-4 pr-4">
                                    {sessioneDelGiorno.esercizi.length === 0 ? (
                                        <p className="text-muted-foreground">
                                            Nessun esercizio registrato per
                                            questa sessione.
                                        </p>
                                    ) : (
                                        sessioneDelGiorno.esercizi.map((e) => (
                                            <div key={e.esercizio_id}>
                                                <h1>{e.nome_esercizio}</h1>
                                            </div>
                                        ))
                                    )}
                                    {sessioneDelGiorno.esercizi.length > 0 &&
                                        sessioneDelGiorno.esercizi.map((e) => (
                                            <div
                                                key={e.esercizio_id}
                                                className="border p-4 rounded-lg"
                                            >
                                                <h4 className="font-semibold text-lg mb-2">
                                                    {e.nome_esercizio}
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground">
                                                            Serie assegnate
                                                        </p>
                                                        <p className="font-medium">
                                                            {e.serie_assegnate}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">
                                                            Serie effettive
                                                        </p>
                                                        <p className="font-medium">
                                                            {e.serie_effettive}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">
                                                            Ripetizioni
                                                            assegnate
                                                        </p>
                                                        <p className="font-medium">
                                                            {
                                                                e.ripetizioni_assegnate
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">
                                                            Ripetizioni
                                                            effettive
                                                        </p>
                                                        <p className="font-medium">
                                                            {
                                                                e.ripetizioni_effettive
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    {sessioneDelGiorno.esercizi.length > 0 &&
                                        sessioneDelGiorno.esercizi.some(
                                            (e) => e.note
                                        ) && (
                                            <div className="mt-6">
                                                <Separator />
                                                <div className="mt-4">
                                                    <h4 className="font-semibold text-lg mb-2">
                                                        Note del Paziente
                                                    </h4>
                                                    {sessioneDelGiorno.esercizi
                                                        .filter((e) => e.note)
                                                        .map((e) => (
                                                            <div
                                                                key={
                                                                    e.esercizio_id
                                                                }
                                                                className="mb-2"
                                                            >
                                                                <p className="font-medium text-sm">
                                                                    {
                                                                        e.nome_esercizio
                                                                    }
                                                                    :
                                                                </p>
                                                                <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                                                                    {e.note}
                                                                </p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                    <div className="mb-2">
                                        <p className="font-medium text-sm">
                                            Feedback scheda :
                                        </p>
                                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                                            {
                                                sessioneDelGiorno.sondaggio
                                                    .feedback
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">
                                    Nessuna sessione trovata per questo giorno.
                                </p>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
