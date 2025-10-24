import React, { useState, useEffect } from "react";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface HistoryEntry {
  timestamp: string;
  user: string;
  changes: string;
}

interface Exercise {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
  serie: number;
  ripetizioni: number;
}

const SchedaAllenamento: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      name: "High-Intensity Interval Training",
      description: "Alternating periods of intense exercise with low-intensity recovery periods",
      createdAt: "2024-01-15T10:30:00",
      updatedAt: "2024-01-15T14:45:00",
      serie: 3,
      ripetizioni: 12,
      history: [
        {
          timestamp: "2024-01-15T14:45:00",
          user: "John Doe",
          changes: "Updated kcal/min value"
        }
      ]
    },
    {
      id: 2,
      name: "Yoga Flow",
      description: "Dynamic sequence of poses focusing on breath and movement",
      createdAt: "2024-01-14T09:15:00",
      updatedAt: "2024-01-15T11:20:00",
      serie: 1,
      ripetizioni: 15,
      history: [
        {
          timestamp: "2024-01-15T11:20:00",
          user: "Jane Smith",
          changes: "Added new keywords"
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id: number) => {
    setExercises((prevExercises) => prevExercises.filter((exercise) => exercise.id !== id));
    toast.success("Exercise deleted successfully!");
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-foreground">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        {/* Table Section */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Scheda allenamento</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrizione
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ripetizioni
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredExercises.map((exercise) => (
                  <tr key={exercise.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{exercise.name}</td>
                    <td className="px-6 py-4">{exercise.description}</td>
                    <td className="px-6 py-4">{exercise.serie}</td>
                    <td className="px-6 py-4">{exercise.ripetizioni}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(exercise.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedaAllenamento;