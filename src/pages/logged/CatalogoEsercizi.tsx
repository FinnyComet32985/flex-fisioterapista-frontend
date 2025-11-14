import React, { useState, useCallback, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiDelete, apiGet } from "@/lib/api";
import { TrashIcon } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ModificaEsercizio } from "@/components/custom/ModificaEsercizio";

interface Exercise {
    id: number;
    nome: string;
    descrizione: string;
    descrizione_svolgimento: string;
    consigli_svolgimento: string;
    video?: string; // url a video o youtube
    immagine?: string; // url immagine
}

const CatalogoEsercizi: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [videoSelezionato, setVideoSelezionato] = useState<string | null>(
        null
    );
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    /* funzione per ottenere l'URL completo dell'immagine */
    const getImageSrc = (path?: string) => {
        const fallback =
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b";
        if (!path) return fallback;
        const trimmed = path.trim();
        if (!trimmed) return fallback;
        // se è già un URL assoluto
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        // altrimenti prefissa la base API (impostala in .env come VITE_API_URL)
        const base = (import.meta.env.VITE_API_URL as string) || "";
        if (base)
            return `${base.replace(/\/$/, "")}/${trimmed.replace(/^\/+/, "")}`;
        // fallback se non hai base
        return fallback;
    };

    /* funzione per ottenere la lista degli esercizi dal server */
    const fetchEsercizi = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiGet("/exercise");

            if (response.ok) {
                const data: Exercise[] = await response.json();
                setExercises(data || []); // Gestisce anche il caso 204 No Content
            } else if (!response.ok) {
                throw new Error("Impossibile caricare la lista degli esercizi");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Si è verificato un errore sconosciuto"
            );
            console.error("Errore nel caricamento degli esercizi:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEsercizi();
    }, [fetchEsercizi]);

    // handler per cancellare esercizio (con conferma) — optimistic update + rollback
    const handleDeleteExercise = useCallback(async (id: number) => {
        // Salvataggio dello stato originale per il rollback
        const originalExercises = [...exercises];

        // Aggiornamento ottimistico dell'interfaccia
        setExercises((currentExercises) => currentExercises.filter((e) => e.id !== id));

        try {
            // Chiamata al server
            const response = await apiDelete(`/exercise/${id}`);

            // Se la chiamata fallisce, esegui il rollback
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Impossibile eliminare l'esercizio");
            }
        } catch (err) {
            // Rollback in caso di errore e notifica all'utente
            setExercises(originalExercises);
            setError(
                err instanceof Error
                    ? err.message
                    : "Si è verificato un errore sconosciuto"
            );
            console.error(err);

            setTimeout(() => setError(null), 5000);
        }
    }, [exercises]);

    const WorkoutDisplay: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
        <div className="relative bg-[color:var(--color-card)] rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow border border-[color:var(--color-border)]">
            {/* pulsante cancella e modifica in alto a destra */}
            {/* pulsanti azione: edit sopra delete */}
            <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                <ModificaEsercizio
                    exercise={exercise}
                    onUpdated={fetchEsercizi}
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className="cursor-pointer w-12 h-12 p-3 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors flex items-center justify-center shadow-lg"
                            aria-label="Elimina esercizio"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Ne sei assolutamente sicuro?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Questa azione non può essere annullata.
                                <br />
                                L'esercizio verrà eliminato definitivamente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction
                                variant="destructive"
                                onClick={() =>
                                    handleDeleteExercise(exercise.id)
                                }
                            >
                                Conferma
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex items-start space-x-4">
                <div className="flex flex-col items-start gap-3">
                    <img
                        src={getImageSrc(exercise.immagine)}
                        alt={exercise.nome}
                        className="w-36 h-36 object-cover rounded-lg flex-shrink-0"
                        onError={(
                            e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) =>
                            (e.currentTarget.src =
                                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b")
                        }
                    />
                    {exercise.video && (
                        <Button
                            onClick={() => setVideoSelezionato(exercise.video!)}
                            className="cursor-pointer self-start"
                        >
                            🎥 Guarda video
                        </Button>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[color:var(--color-card-foreground)] mb-2">
                        {exercise.nome}
                    </h3>
                    <p className="text-[color:var(--color-card-foreground)] mb-3">
                        {exercise.descrizione}
                    </p>

                    <div className="mb-3">
                        <h4 className="font-semibold text-[color:var(--color-muted-foreground)]">
                            Esecuzione
                        </h4>
                        <p className="text-[color:var(--color-card-foreground)]">
                            {exercise.descrizione_svolgimento}
                        </p>
                    </div>

                    <div className="mb-3">
                        <h4 className="font-semibold text-[color:var(--color-muted-foreground)]">
                            Consigli
                        </h4>
                        <p className="text-[color:var(--color-card-foreground)]">
                            {exercise.consigli_svolgimento}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const filteredExercises = exercises.filter((exercise) =>
        exercise.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-3 text-[color:var(--color-muted-foreground)]" />
                        <input
                            type="text"
                            placeholder="Cerca esercizio..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)] border-[color:var(--color-border)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Link
                            to="/nuovo-esercizio"
                            className="text-[color:var(--color-primary-foreground)]"
                        >
                            Aggiungi Esercizio
                        </Link>
                    </Button>
                </div>
                {loading && (
                    <p className="text-muted-foreground text-center py-4">
                        Caricamento esercizi...
                    </p>
                )}
                {!loading && exercises && exercises.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                        Nessun esercizio trovato.
                    </p>
                )}
                {error && (
                    <div className="mb-4 p-4 text-red-800 bg-red-200 rounded mt-6">
                        {error}
                    </div>
                )}
                {filteredExercises.map((exercise) => (
                    <WorkoutDisplay key={exercise.id} exercise={exercise} />
                ))}
            </div>

            {/* Modale Video con componente Dialog */}
            <Dialog
                open={!!videoSelezionato}
                onOpenChange={(isOpen) => !isOpen && setVideoSelezionato(null)}
            >
                <DialogContent className="w-[90vw] sm:max-w-[1200px]">
                    <DialogHeader>
                        <DialogTitle>Video Esercizio</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video">
                        {videoSelezionato &&
                        (videoSelezionato.includes("youtube.com") ||
                            videoSelezionato.includes("youtu.be")) ? (
                            <iframe
                                className="w-full h-full rounded-lg"
                                src={
                                    videoSelezionato.includes("watch?v=")
                                        ? videoSelezionato.replace(
                                              "watch?v=",
                                              "embed/"
                                          )
                                        : videoSelezionato.includes("youtu.be")
                                        ? videoSelezionato.replace(
                                              "https://youtu.be/",
                                              "https://www.youtube.com/embed/"
                                          )
                                        : videoSelezionato
                                }
                                title="Video esercizio"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={getImageSrc(videoSelezionato!)}
                                controls
                                className="w-full h-full rounded-lg"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CatalogoEsercizi;
