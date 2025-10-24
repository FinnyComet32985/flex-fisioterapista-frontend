import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// ✅ Tipi per i dati
interface Exercise {
  name: string;
  descrizione: string;
  serie: number;
  ripetizioni: number;
  video: string; // URL del video
}

interface Workout {
  id: number;
  name: string;
  tipo: string;
  note: string;
  exercises: Exercise[];
}

const ListaSchede: React.FC = () => {
  const initialWorkouts: Workout[] = [
    {
      id: 1,
      name: "Full Body Workout",
      tipo: "Forza Generale",
      note: "Mantenere una buona forma durante gli squat, schiena dritta.",
      exercises: [
        { name: "Push-ups", descrizione: "Esercizio a corpo libero per pettorali, spalle e tricipiti.", serie: 3, ripetizioni: 12, video: "https://www.youtube.com/embed/IODxDxX7oi4" },
        { name: "Squats", descrizione: "Esercizio fondamentale per gambe e glutei.", serie: 3, ripetizioni: 15, video: "https://www.youtube.com/embed/xqvCmoLULNY" },
        { name: "Plank", descrizione: "Esercizio isometrico per il core.", serie: 3, ripetizioni: 60, video: "https://www.youtube.com/embed/ASdvN_XEl_c" }, // 60 secondi
      ],
    },
    {
      id: 2,
      name: "Cardio Session",
      tipo: "Cardiovascolare",
      note: "Mantenere un ritmo costante durante la corsa.",
      exercises: [
        { name: "Corsa sul posto", descrizione: "Corsa a ginocchia alte per aumentare la frequenza cardiaca.", serie: 1, ripetizioni: 20, video: "https://www.youtube.com/embed/8lvXMLP0d6Q" }, // 20 minuti
        { name: "Salto con la corda", descrizione: "Esercizio ad alta intensità per tutto il corpo.", serie: 5, ripetizioni: 1, video: "https://www.youtube.com/embed/u3zgHI8QnqE" }, // 5 serie da 1 minuto
      ],
    },
    {
      id: 3,
      name: "Strength Training",
      tipo: "Forza Specifica",
      note: "Focus sulla tecnica per gli stacchi, non caricare troppo peso all'inizio.",
      exercises: [
        { name: "Stacchi da terra", descrizione: "Esercizio multiarticolare per schiena, gambe e glutei.", serie: 4, ripetizioni: 8, video: "https://www.youtube.com/embed/op9kVnSso6Q" },
        { name: "Panca piana", descrizione: "Esercizio fondamentale per lo sviluppo dei pettorali.", serie: 4, ripetizioni: 10, video: "https://www.youtube.com/embed/rT7DgCr-3pg" },
        { name: "Trazioni alla sbarra", descrizione: "Esercizio a corpo libero per la schiena e i bicipiti.", serie: 3, ripetizioni: 8, video: "https://www.youtube.com/embed/eGo4IYlbE5g" },
      ],
    },
  ];

  // ✅ Stati tipizzati
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Schede Allenamento</h1>
        <div className="bg-card p-6 rounded-lg shadow-md border border-border">

          {/* 🔥 LISTA ALLENAMENTI */}
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-card border border-border rounded-lg p-4 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">{workout.name}</h3>
                    <div className="flex items-center gap-x-4 text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Tipo: <span className="font-normal">{workout.tipo}</span></span>
                      <p className="truncate"><span className="font-medium">Note:</span> {workout.note}</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" onClick={() => handleWorkoutClick(workout)}><EyeIcon />Visualizza</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 💪 MODALE DETTAGLIO - Integrato direttamente */}
      {selectedWorkout && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{selectedWorkout.name}</DialogTitle>
                    <DialogDescription>
                        Esegui gli esercizi seguendo le indicazioni.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {selectedWorkout.exercises.map((exercise, index) => (
                            <div key={index} className="rounded-lg border p-4">
                                <h4 className="font-semibold text-lg text-foreground">{exercise.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{exercise.descrizione}</p>
                                <div className="flex items-center gap-6 mt-3 text-sm">
                                    <span className="font-medium">Serie: <span className="font-normal">{exercise.serie}</span></span>
                                    <span className="font-medium">Ripetizioni: <span className="font-normal">{exercise.ripetizioni}</span></span>
                                </div>
                                {exercise.video && (
                                <div className="mt-4">
                                    <div className="aspect-video rounded-md overflow-hidden">
                                    <iframe className="w-full h-full" src={exercise.video} title={exercise.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                    </div>
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Chiudi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ListaSchede;
