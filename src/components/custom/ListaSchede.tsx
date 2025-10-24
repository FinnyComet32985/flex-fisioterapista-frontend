import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

// ✅ Tipi per i dati
interface Exercise {
  name: string;
  serie: number;
  ripetizioni: number;
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
        { name: "Push-ups", serie: 3, ripetizioni: 12 },
        { name: "Squats", serie: 3, ripetizioni: 15 },
        { name: "Planks", serie: 3, ripetizioni: 60 }, // 60 secondi
      ],
    },
    {
      id: 2,
      name: "Cardio Session",
      tipo: "Cardiovascolare",
      note: "Mantenere un ritmo costante durante la corsa.",
      exercises: [
        { name: "Running", serie: 1, ripetizioni: 20 }, // 20 minuti
        { name: "Jump Rope", serie: 5, ripetizioni: 1 }, // 5 serie da 1 minuto
      ],
    },
    {
      id: 3,
      name: "Strength Training",
      tipo: "Forza Specifica",
      note: "Focus sulla tecnica per gli stacchi, non caricare troppo peso all'inizio.",
      exercises: [
        { name: "Deadlifts", serie: 4, ripetizioni: 8 },
        { name: "Bench Press", serie: 4, ripetizioni: 10 },
        { name: "Pull-ups", serie: 3, ripetizioni: 8 },
      ],
    },
  ];

  // ✅ Stati tipizzati
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);

  const handleWorkoutClick = (workout: Workout) => {
    // Qui potrai inserire la nuova logica
    console.log("Visualizza scheda:", workout.name);
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
    </div>
  );
};

export default ListaSchede;
