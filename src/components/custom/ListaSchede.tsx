import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {EyeIcon} from "lucide-react";
import { apiGet } from "@/lib/api";
import { Link, useParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";


interface Scheda {
  id: number;
  nome: string;
  tipo: string;
  note: string;
  exercises: Exercise[]; 
}

interface Exercise {
  nome: string;
  descrizione: string | null;
  serie: number;
  ripetizioni: number;
  video: string; // URL del video
}

export default  function ListaSchede() {
  const [schede, setSchede] = useState<Scheda[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedaSelezionata, setSchedaSelezionata] = useState<Scheda | null>(null);
  const [mostraDettagli, setMostraDettagli] = useState<boolean>(false);

  const params = useParams();
  const pazienteId = params.id;

  useEffect(() => {
    const fetchSchede = async () => {
      if (!pazienteId) return; // Non fare nulla se non c'è un ID paziente
      try {
        setIsLoading(true);
        const response = await apiGet("/trainingCard/"+pazienteId);
        if (!response.ok) {
          throw new Error("Impossibile caricare le schede di allenamento");
        }
        const data = await response.json();
        // Assicurati che data sia un array prima di impostarlo
        setSchede(Array.isArray(data) ? data : []);
      } catch (err) { 
        setError(err instanceof Error ? err.message : "Si è verificato un errore sconosciuto");
        console.error("Errore nel caricamento delle schede:", err);
        setSchede([]); // In caso di errore, imposta un array vuoto
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchede();
  }, [pazienteId]); // Esegui l'effetto ogni volta che pazienteId cambia

  const handleVisualizzaClick = async (scheda: Scheda) => {
    // Se gli esercizi non sono già stati caricati, li carichiamo ora
    if (!scheda.exercises) {
      try {
        const response = await apiGet("/trainingCard/" + scheda.id + "/exercise");
        if (!response.ok) {
          throw new Error("Impossibile caricare gli esercizi della scheda");
        }
        const esercizi: Exercise[] = await response.json();
        console.log("Esercizi caricati:", esercizi);
        // Aggiorniamo la scheda specifica nello stato con i nuovi esercizi
        const schedaAggiornata = { ...scheda, exercises: esercizi };
        setSchede(prevSchede => prevSchede.map(s => s.id === scheda.id ? schedaAggiornata : s));
        setSchedaSelezionata(schedaAggiornata);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore caricamento esercizi");
        console.error("Errore nel caricamento degli esercizi:", err);
        // Mostra comunque i dettagli con le info base anche se gli esercizi falliscono
        setSchedaSelezionata(scheda);
      }
    } else {
      // Se gli esercizi sono già presenti, apriamo subito il modale
      setSchedaSelezionata(scheda);
    }
    setMostraDettagli(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="flex items-center justify-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Schede di Allenamento</h1>
            <Button asChild>
                <Link to={`/nuova-scheda/${pazienteId}`}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Scheda
                </Link>
            </Button>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md border border-border">

          {isLoading && <div>Caricamento schede...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {/* Lista delle schede */}
          <div className="space-y-4">
            {schede.map((scheda) => (
              <div
                key={scheda.id}
                className="bg-card border border-border rounded-lg p-4 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">{scheda.nome}</h3>
                    <div className="flex items-center gap-x-4 text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Tipo: <span className="font-normal">{scheda.tipo}</span></span>
                      <p className="truncate"><span className="font-medium">Note:</span> {scheda.note}</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" onClick={() => handleVisualizzaClick(scheda)}> <EyeIcon /> Visualizza</Button>

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
                        Esegui gli esercizi seguendo le indicazioni.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                    <div className="space-y-6 pr-6">
                            {schedaSelezionata.exercises?.map((exercise, index) => (
                                <div key={index} className="rounded-lg border p-4">
                                    <h4 className="font-semibold text-lg text-foreground">{exercise.nome}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{exercise.descrizione}</p>
                                    <div className="flex items-center gap-6 mt-3 text-sm">
                                        <span className="font-medium">Serie: <span className="font-normal">{exercise.serie}</span></span>
                                        <span className="font-medium">Ripetizioni: <span className="font-normal">{exercise.ripetizioni}</span></span>
                                    </div>
                                    {exercise.video && (
                                    <div className="mt-4">
                                        <div className="aspect-video rounded-md overflow-hidden">
                                        <iframe className="w-full h-full" src={exercise.video} title={exercise.nome} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setMostraDettagli(false)}>Chiudi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
