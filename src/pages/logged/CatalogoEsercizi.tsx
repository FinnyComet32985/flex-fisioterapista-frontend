import React, { useState } from "react";
import { FiSearch, FiTarget } from "react-icons/fi";

import { Link } from "react-router";
import { Button } from "@/components/ui/button";
/* import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"; */

interface Exercise {
  id: number;
  name: string;
  category: string;
  image: string;
  muscleGroups: string[];
  difficulty: string;
  duration: string;
  sets: number;
  reps: number;
}



const CatalogoEsercizi: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const exercises: Exercise[] = [
    {
      id: 1,
      name: "Push-ups",
      category: "strength",
      image: "images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
      muscleGroups: ["chest", "shoulders", "triceps"],
      difficulty: "intermediate",
      duration: "10 mins",
      sets: 3,
      reps: 12,
    },
    {
      id: 2,
      name: "Running",
      category: "cardio",
      image: "images.unsplash.com/photo-1571008887538-b36bb32f4571",
      muscleGroups: ["legs", "cardiovascular"],
      difficulty: "beginner",
      duration: "30 mins",
      sets: 1,
      reps: 1,
    },
    {
      id: 3,
      name: "Yoga",
      category: "flexibility",
      image: "images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      muscleGroups: ["full body", "core"],
      difficulty: "beginner",
      duration: "20 mins",
      sets: 1,
      reps: 1,
    },
  ];


  const WorkoutDisplay: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="bg-card rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={`https://${exercise.image}`}
          alt={exercise.name}
          className="w-24 h-24 object-cover rounded-lg"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
            (e.currentTarget.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b")
          }
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-card-foreground">{exercise.name}</h3>
          <p className="text-card-foreground">Duration: {exercise.duration}</p>
          <p className="text-card-foreground">
            Sets: {exercise.sets} × Reps: {exercise.reps}
          </p>
          <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );

    const filteredExercises = exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca esercizio..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button><Link to="/nuovo-esercizio">Aggiungi Esercizio</Link></Button>
        </div>
        {filteredExercises.map((exercise) => (
          <WorkoutDisplay key={exercise.id} exercise={exercise} />
        ))}
      </div>
    );
  };


export default CatalogoEsercizi;