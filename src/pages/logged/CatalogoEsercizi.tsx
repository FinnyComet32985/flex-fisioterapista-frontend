import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { apiDelete, apiGet } from "@/lib/api";
import { TrashIcon} from "lucide-react";

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
  const [videoSelezionato, setVideoSelezionato] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getImageSrc = (path?: string) => {
    const fallback = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b";
    if (!path) return fallback;
    const trimmed = path.trim();
    if (!trimmed) return fallback;
    // se è già un URL assoluto
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // altrimenti prefissa la base API (impostala in .env come VITE_API_URL)
    const base = (import.meta.env.VITE_API_URL as string) || "";
    if (base) return `${base.replace(/\/$/, "")}/${trimmed.replace(/^\/+/, "")}`;
    // fallback se non hai base
    return fallback;
  };


   const fetchEsercizi = async () => {
        try {
          const response = await apiGet("/exercise"); // Assumendo che l'endpoint sia /exercises

          if (!response.ok) {
            throw new Error("Impossibile caricare la lista dei pazienti");
          }

          const data: Exercise[] = await response.json();
          console.log("Esercizi caricati:", data);
          setExercises(data);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Si è verificato un errore sconosciuto");
          console.error("Errore nel caricamento dei pazienti:", err);
        } finally {
        }
      };

  useEffect(() => {
      fetchEsercizi();
    }, []);

  // ora gli esercizi sono nello state così possiamo rimuoverli

  // handler per cancellare esercizio (con conferma) — optimistic update + rollback
  const handleDeleteExercise = async (id: number) => {
    if (!window.confirm("Confermi la cancellazione dell'esercizio?")) return;

    // salvo snapshot per eventuale rollback
    const prev = exercises;
    // rimuovo subito dall'interfaccia (optimistic update)
    setExercises((s) => s.filter((e) => e.id !== id));

    try {
      const response = await apiDelete(`/exercise/${id}`);
      if (!response.ok) {
        // rollback: ripristina la lista dal server (o dallo snapshot)
        setExercises(prev);
        throw new Error("Impossibile eliminare l'esercizio");
      }
      // opzionale: forzare un refetch per essere sicuri di avere dati aggiornati
      // await fetchEsercizi();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore sconosciuto");
      console.error(err);
    }
  };

  const WorkoutDisplay: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="relative bg-[color:var(--color-card)] rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow border border-[color:var(--color-border)]">
      {/* pulsante cancella in alto a destra */}
      <button onClick={() => handleDeleteExercise(exercise.id)} className="cursor-pointer w-14 h-14 p-4 absolute top-3 right-3 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors flex items-center justify-center shadow-lg">
            <TrashIcon className="w-6 h-6" /> 
        </button>

      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-start gap-3">
          <img
            src={getImageSrc(exercise.immagine)}
            alt={exercise.nome}
            className="w-36 h-36 object-cover rounded-lg flex-shrink-0"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b")
            }
          />
          {exercise.video && (
            <Button onClick={() => setVideoSelezionato(exercise.video!)} className="cursor-pointer self-start">
              🎥 Guarda video
            </Button>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[color:var(--color-card-foreground)] mb-2">{exercise.nome}</h3>
          <p className="text-[color:var(--color-card-foreground)] mb-3">{exercise.descrizione}</p>

          <div className="mb-3">
            <h4 className="font-semibold text-[color:var(--color-muted-foreground)]">Esecuzione</h4>
            <p className="text-[color:var(--color-card-foreground)]">{exercise.descrizione_svolgimento}</p>
          </div>

          <div className="mb-3">
            <h4 className="font-semibold text-[color:var(--color-muted-foreground)]">Consigli</h4>
            <p className="text-[color:var(--color-card-foreground)]">{exercise.consigli_svolgimento}</p>
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
            <Link to="/nuovo-esercizio" className="text-[color:var(--color-primary-foreground)]">
              Aggiungi Esercizio
            </Link>
          </Button>
        </div>

        {filteredExercises.map((exercise) => (
          <WorkoutDisplay key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {/* MODALE VIDEO */}
      {videoSelezionato && (
        <div
          onClick={() => setVideoSelezionato(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "800px",
              width: "90%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setVideoSelezionato(null)}
              aria-label="Chiudi"
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            {/* Se il video è di YouTube */}
            {videoSelezionato.includes("youtube.com") || videoSelezionato.includes("youtu.be") ? (
              <iframe
                width="100%"
                height="450"
                src={
                  videoSelezionato.includes("watch?v=")
                    ? videoSelezionato.replace("watch?v=", "embed/")
                    : // convert shortened youtu.be into embed
                      videoSelezionato.includes("youtu.be")
                    ? videoSelezionato.replace("https://youtu.be/", "https://www.youtube.com/embed/")
                    : videoSelezionato
                }
                title="Video esercizio"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 8 }}
              />
            ) : (
              <video src={videoSelezionato} controls style={{ width: "100%", borderRadius: 8 }} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogoEsercizi;