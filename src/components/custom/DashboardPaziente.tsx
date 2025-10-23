import React, { useState, type ReactNode } from "react";
import { FiEdit2, FiLogOut, FiUser } from "react-icons/fi";


interface Interaction {
  id: number;
  action: string;
  item: string;
  date: string;
}

interface Equipment {
  id: number;
  name: string;
  status: string;
}

interface PazienteData {
  nomeCompleto: string;
  email: string;
  telefono: string;
  codiceFiscale: string; // o altro identificativo
  ruolo: string;
  dataInizioTrattamento: string;
  lastLogin: string;
  totalItems: number;
  recentInteractions: Interaction[];
  assignedEquipment: Equipment[];
}

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}

const DashboardPaziente: React.FC = () => {

  const mockPazienteData: PazienteData = {
    nomeCompleto: "Mario Rossi",
    email: "mario.rossi@example.com",
    telefono: "+39 333 1234567",
    codiceFiscale: "RSSMRA80A01H501U",
    ruolo: "Paziente",
    dataInizioTrattamento: "15-01-2023",
    lastLogin: "2024-01-20",
    totalItems: 15, // Numero di sedute
    recentInteractions: [
      { id: 1, action: "Ultima visita", item: "Controllo posturale", date: "19-01-2024" },
      { id: 2, action: "Nuovo esercizio assegnato", item: "Stretching schiena", date: "18-01-2024" },
    ],
  };

  const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
      {children}
    </div>
  );

  return (
    <div  className={`min-h-screen`}>
      <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">Profilo Paziente</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileSection title="Informazioni Personali">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                      <button
                        className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                        aria-label="Modifica foto profilo"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                      {mockPazienteData.nomeCompleto}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{mockPazienteData.ruolo}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                      <p className="text-gray-800 dark:text-white">{mockPazienteData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Telefono</label>
                      <p className="text-gray-800 dark:text-white">{mockPazienteData.telefono}</p>
                    </div>
                  </div>
                </ProfileSection>

                <div className="space-y-4">
                  <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <FiEdit2 /> Modifica Profilo
                  </button>
                  <button className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <ProfileSection title="Dettagli Account">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Codice Fiscale</label>
                      <p className="text-gray-800 dark:text-white">{mockPazienteData.codiceFiscale}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Inizio Trattamento</label>
                      <p className="text-gray-800 dark:text-white">{mockPazienteData.dataInizioTrattamento}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Ultimo Accesso</label>
                      <p className="text-gray-800 dark:text-white">{mockPazienteData.lastLogin}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Sedute Effettuate</label>
                      <p className="text-gray-800 dark:text-white">{mockPazienteData.totalItems}</p>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Attività Recenti">
                  <div className="space-y-4">
                    {mockPazienteData.recentInteractions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{interaction.action}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{interaction.item}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{interaction.date}</span>
                      </div>
                    ))}
                  </div>
                </ProfileSection>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPaziente;
