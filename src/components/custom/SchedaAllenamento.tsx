import React, { useState, useEffect } from "react";
import { FiTrash2, FiSearch, FiCalendar, FiClock } from "react-icons/fi";
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
  keywords: string[];
  kcalPerMin: number;
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
}

const SchedaAllenamento: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      name: "High-Intensity Interval Training",
      description: "Alternating periods of intense exercise with low-intensity recovery periods",
      keywords: ["HIIT", "Cardio", "Fat-burning"],
      kcalPerMin: 15,
      createdAt: "2024-01-15T10:30:00",
      updatedAt: "2024-01-15T14:45:00",
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
      keywords: ["Flexibility", "Balance", "Mindfulness"],
      kcalPerMin: 7,
      createdAt: "2024-01-14T09:15:00",
      updatedAt: "2024-01-15T11:20:00",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const itemsPerPage = 5;

  const handleDelete = (id: number) => {
    setExercises((prevExercises) => prevExercises.filter((exercise) => exercise.id !== id));
    toast.success("Exercise deleted successfully!");
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredExercises.length / itemsPerPage);
  const currentExercises = filteredExercises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        {/* Table Section */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Exercise List</h2>
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keywords
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kcal/min
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {currentExercises.map((exercise) => (
                  <tr key={exercise.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{exercise.name}</td>
                    <td className="px-6 py-4">{exercise.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {exercise.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">{exercise.kcalPerMin}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedExercise(exercise);
                            setShowHistoryModal(true);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <FiClock className="w-5 h-5" />
                        </button>
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredExercises.length)} of{" "}
              {filteredExercises.length} results
            </div>
            <div className="flex space-x-2">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Modal */}
        {showHistoryModal && selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg max-w-2xl w-full p-6 border border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Change History</h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                {selectedExercise.history.map((change, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(change.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">{change.user}</span>
                      <p className="text-muted-foreground">{change.changes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedaAllenamento;