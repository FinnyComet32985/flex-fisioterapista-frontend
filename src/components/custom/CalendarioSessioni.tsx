
    import React, { useEffect, useState } from "react";
    import { useParams } from "react-router-dom";
    import { Calendar } from "@/components/ui/calendar";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { apiGet } from "@/lib/api";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Separator } from "@/components/ui/separator";
    import { it } from "date-fns/locale";

    interface EsercizioSvolto {
    id: number;
    nome_esercizio: string;
    serie_effettive: number;
    ripetizioni_effettive: number;
    note: string | null;
    ripetizioni_assegnate: number;
    serie_assegnate: number;
    }

    interface SessioneSvolta {
    id: number;
    data_sessione: string;
    esercizi: EsercizioSvolto[];
    }

    export function CalendarioSessioni() {
    const { id: pazienteId } = useParams<{ id: string }>();
    const [dataSelezionata, setDataSelezionata] = useState<Date | undefined>(
        new Date()
    );
    const [sessioniSvolte, setSessioniSvolte] = useState<SessioneSvolta[]>([]);
    const [sessioneDelGiorno, setSessioneDelGiorno] = useState<
        SessioneSvolta | undefined
    >(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Carica tutte le sessioni per il paziente per popolare il calendario
    useEffect(() => {
        const fetchSessioniSvolte = async () => {
        if (!pazienteId) return;
        setIsLoading(true);
        try {
            const response = await apiGet(`/session/patient/${pazienteId}`);
            if (!response.ok) {
            throw new Error("Impossibile caricare le sessioni svolte");
            }
            const data: SessioneSvolta[] = await response.json();
            setSessioniSvolte(data);
        } catch (err) {
            setError(
            err instanceof Error
                ? err.message
                : "Errore nel caricamento delle sessioni."
            );
        }
        finally {
            setIsLoading(false);
        }
        };

        fetchSessioniSvolte();
    }, [pazienteId]);

    // 2. Trova la sessione corrispondente quando viene selezionata una data
    useEffect(() => {
        if (dataSelezionata) {
        const dataISO = dataSelezionata.toISOString().split("T")[0];
        const sessione = sessioniSvolte.find(
            (s) => s.data_sessione.split("T")[0] === dataISO
        );
        setSessioneDelGiorno(sessione);
        }
    }, [dataSelezionata, sessioniSvolte]);

    const giorniConSessione = sessioniSvolte.map((s) => new Date(s.data_sessione));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex justify-center">
            <Calendar
            mode="single"
            locale={it}
            selected={dataSelezionata}
            onSelect={setDataSelezionata}
            className="rounded-lg border"
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
                {isLoading && <p>Caricamento...</p>}
                {error && <p className="text-destructive">{error}</p>}
                {sessioneDelGiorno ? (
                    <div className="space-y-4 pr-4">
                    {sessioneDelGiorno.esercizi.map((esercizio) => (
                        <div key={esercizio.id} className="border p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">
                            {esercizio.nome_esercizio}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                            <p className="text-muted-foreground">Serie effettive</p>
                            <p className="font-medium">{esercizio.serie_effettive}</p>
                            </div>
                            <div>
                            <p className="text-muted-foreground">Ripetizioni effettive</p>
                            <p className="font-medium">{esercizio.ripetizioni_effettive}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                    {/* Le note ora sono per esercizio, ma se ci fosse una nota generale della sessione, andrebbe qui.
                        Potresti voler aggregare le note di tutti gli esercizi. */}
                    {sessioneDelGiorno.esercizi.some(e => e.note) && (
                        <div className="mt-6">
                        <Separator />
                        <div className="mt-4">
                            <h4 className="font-semibold text-lg mb-2">
                            Note del Paziente
                            </h4>
                            {sessioneDelGiorno.esercizi.filter(e => e.note).map(e => (
                            <div key={e.id} className="mb-2">
                                <p className="font-medium text-sm">{e.nome_esercizio}:</p>
                                <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">{e.note}</p>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                ) : (
                    !isLoading && <p className="text-muted-foreground">Nessuna sessione trovata per questo giorno.</p>
                )}
                </ScrollArea>
            </CardContent>
            </Card>
        </div>
        </div>
    );
    }
