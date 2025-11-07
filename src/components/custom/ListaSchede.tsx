import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { apiGet, apiDelete } from "@/lib/api";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { TrashIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiEdit2 } from "react-icons/fi";
import { CalendarioSessioni } from "./CalendarioSessioni";
import { set } from "date-fns";
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
} from "../ui/alert-dialog";

interface Scheda {
    id: number;
    nome: string;
    tipo_scheda: string;
    note: string;
    exercises: Exercise[];
}

interface Exercise {
    nome: string;
    descrizione: string | null;
    serie: number;
    ripetizioni: number;
    video: string;
}

export default function ListaSchede() {
    const [schede, setSchede] = useState<Scheda[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [schedaSelezionata, setSchedaSelezionata] = useState<Scheda | null>(
        null
    );
    const [mostraDettagli, setMostraDettagli] = useState<boolean>(false);
    const [mostraSessioni, setMostraSessioni] = useState<boolean>(false);

    const params = useParams();
    const pazienteId = params.id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchede = async () => {
            if (!pazienteId) return; // se id paziente non c'è, fai return senza fare alcuna operazione
            try {
                setIsLoading(true);
                const response = await apiGet("/trainingCard/" + pazienteId);

                if (response.status === 200) {
                    const data = await response.json();
                    setSchede(data);
                    setError(null);
                } else if (response.status === 204) {
                    setSchede([]);
                    setError(null);
                } else {
                    throw new Error(
                        "Impossibile caricare le schede di allenamento"
                    );
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Si è verificato un errore sconosciuto"
                );
                console.error("Errore nel caricamento delle schede:", err);
                setSchede([]); // In caso di errore, imposta un array vuoto
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchede();
    }, [pazienteId]); // Esegui l'effetto ogni volta che pazienteId cambia

    // cancella una scheda con conferma e aggiorna lo state
    const handleDeleteScheda = async (id: number) => {
        try {
            const res = await apiDelete(`/trainingCard/${id}`);
            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(
                    body?.message ?? `Eliminazione fallita (${res.status})`
                );
            }
            // rimuovi dalla lista senza ricaricare la pagina
            setSchede((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Errore durante l'eliminazione";
            setError(msg);
            console.error("Errore delete scheda:", err);
        }
    };
    // apri il form in modalità edit passando la scheda nello state della route
    const handleModificaScheda = (scheda: Scheda) => {
        if (!scheda.id) return;
        navigate(`/modifica-scheda/${pazienteId}/${scheda.id}`);
    };

    const handleVisualizzaClick = async (scheda: Scheda) => {
        // Se gli esercizi non sono già stati caricati, li carichiamo ora
        if (!scheda.exercises) {
            try {
                const response = await apiGet(
                    "/trainingCard/" + scheda.id + "/exercise"
                );
                if (!response.ok) {
                    throw new Error(
                        "Impossibile caricare gli esercizi della scheda"
                    );
                }
                const esercizi: Exercise[] = await response.json();
                console.log("Esercizi caricati:", esercizi);
                // Aggiorniamo la scheda specifica nello stato con i nuovi esercizi
                const schedaAggiornata = { ...scheda, exercises: esercizi };
                setSchede((prevSchede) =>
                    prevSchede.map((s) =>
                        s.id === scheda.id ? schedaAggiornata : s
                    )
                );
                setSchedaSelezionata(schedaAggiornata);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Errore caricamento esercizi"
                );
                console.error("Errore nel caricamento degli esercizi:", err);
                // Mostra i dettagli con le info di base anche se gli esercizi falliscono
                setSchedaSelezionata(scheda);
            }
        } else {
            // Se gli esercizi sono già presenti, apriamo subito il modale
            setSchedaSelezionata(scheda);
        }
        setMostraDettagli(true);
    };

    const handleClickMostraSessioni = (scheda: Scheda) => {
        setSchedaSelezionata(scheda);
        setMostraSessioni(true);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
                <div className="flex items-center justify-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        Schede di Allenamento
                    </h1>
                    <Button asChild>
                        <Link to={`/nuova-scheda/${pazienteId}`}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi
                            Scheda
                        </Link>
                    </Button>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                    {isLoading && <div>Caricamento schede...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {!isLoading && schede.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                            Nessuna scheda di allenamento trovata.
                        </p>
                    )}
                    {/* Lista delle schede */}
                    <div className="space-y-4">
                        {schede.map((scheda) => (
                            <div
                                key={scheda.id}
                                className="bg-card border border-border rounded-lg p-4 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-card-foreground">
                                            {scheda.nome}
                                        </h3>
                                        <div className="flex items-center gap-x-4 text-sm text-muted-foreground mt-1">
                                            <span className="font-medium">
                                                Tipo:{" "}
                                                <span className="font-normal">
                                                    {scheda.tipo_scheda}
                                                </span>
                                            </span>
                                            <p className="truncate">
                                                <span className="font-medium">
                                                    Note:
                                                </span>{" "}
                                                {scheda.note}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleClickMostraSessioni(
                                                    scheda
                                                )
                                            }
                                        >
                                            Visualizza Sessioni
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleVisualizzaClick(scheda)
                                            }
                                        >
                                            <EyeIcon /> Visualizza
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleModificaScheda(scheda)
                                            }
                                            aria-label={`Modifica scheda ${scheda.nome}`}
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    aria-label={`Elimina scheda ${scheda.nome}`}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Ne sei assolutamente
                                                        sicuro?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Questa azione non può
                                                        essere annullata.
                                                        <br />
                                                        L'esercizio verrà
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
                                                            handleDeleteScheda(
                                                                scheda.id
                                                            )
                                                        }
                                                    >
                                                        Conferma
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Finestra di dialogo con i dettagli della scheda */}
            {schedaSelezionata && (
                <Dialog open={mostraDettagli} onOpenChange={setMostraDettagli}>
                    <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{schedaSelezionata.nome}</DialogTitle>
                            <DialogDescription>
                                Note del fisioterapista:{" "}
                                {schedaSelezionata.note}
                            </DialogDescription>
                            <DialogDescription>
                                Tipologia della scheda:{" "}
                                {schedaSelezionata.tipo_scheda}
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[70vh]">
                            <div className="space-y-6 pr-6">
                                {schedaSelezionata.exercises?.map(
                                    (exercise, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border p-4"
                                        >
                                            <h4 className="font-semibold text-lg text-foreground">
                                                {exercise.nome}
                                            </h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {exercise.descrizione}
                                            </p>
                                            <div className="flex items-center gap-6 mt-3 text-sm">
                                                <span className="font-medium">
                                                    Serie:{" "}
                                                    <span className="font-normal">
                                                        {exercise.serie}
                                                    </span>
                                                </span>
                                                <span className="font-medium">
                                                    Ripetizioni:{" "}
                                                    <span className="font-normal">
                                                        {exercise.ripetizioni}
                                                    </span>
                                                </span>
                                            </div>
                                            {exercise.video && (
                                                <div className="mt-4">
                                                    <div className="aspect-video rounded-md overflow-hidden">
                                                        <iframe
                                                            className="w-full h-full"
                                                            src={
                                                                exercise.video.includes(
                                                                    "watch?v="
                                                                )
                                                                    ? exercise.video.replace(
                                                                          "watch?v=",
                                                                          "embed/"
                                                                      )
                                                                    : // convert shortened youtu.be into embed
                                                                    exercise.video.includes(
                                                                          "youtu.be"
                                                                      )
                                                                    ? exercise.video.replace(
                                                                          "https://youtu.be/",
                                                                          "https://www.youtube.com/embed/"
                                                                      )
                                                                    : exercise.video
                                                            }
                                                            title={
                                                                exercise.nome
                                                            }
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setMostraDettagli(false)}
                            >
                                Chiudi
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Finestra di dialogo per visualizzare le sessioni */}
            <Dialog open={mostraSessioni} onOpenChange={setMostraSessioni}>
                <DialogContent className="sm:max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>Storico Sessioni del Paziente</DialogTitle>
                    </DialogHeader>

                    <div className="p-4">
                        <CalendarioSessioni scheda_id={schedaSelezionata?.id} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMostraSessioni(false)}
                        >
                            Chiudi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
