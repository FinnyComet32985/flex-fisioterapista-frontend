import { TrashIcon} from "lucide-react";
import React, { useState, type ReactNode } from "react";
import { FiEdit2 } from "react-icons/fi";
import { GraficoPazienti } from "./GraficoPazienti";
import SchedaAllenamento from "./SchedaAllenamento";

interface PazienteData {
  nomeCompleto: string;
  email: string;
  dataInizioTrattamento: string;
  totalItems: number;
  genere: string;
  peso: number;
  altezza: number;
  dataNascita: string;
  diagnosi: string;
}

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}

const DashboardPaziente: React.FC = () => {

  const mockPazienteData: PazienteData = {
    
    nomeCompleto: "Mario Rossi",
    email: "mario.rossi@example.com",
    dataInizioTrattamento: "15-01-2023",
    totalItems: 15, // Numero di sedute
    genere: "Maschile",
    peso: 75, // kg
    altezza: 175, // cm
    dataNascita: "1990-05-20",
    diagnosi: "Lombalgia cronica",
  };

  const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg mb-6 border border-border">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );

  return (
    <div  className={`min-h-screen`}>
      <div className="bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Profilo Paziente</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileSection title="Informazioni Personali">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-card shadow-lg"
                      />
                      
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">
                      {mockPazienteData.nomeCompleto}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="text-foreground">{mockPazienteData.email}</p>
                    </div>
                  </div>
                </ProfileSection>

            
              </div>

              <div className="lg:col-span-2">
                <ProfileSection title="Dettagli Account">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                    <div>
                      <label className="text-sm text-muted-foreground">Inizio Trattamento</label>
                      <p className="text-foreground">{mockPazienteData.dataInizioTrattamento}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Sedute Effettuate</label>
                      <p className="text-foreground">{mockPazienteData.totalItems}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Genere</label>
                      <p className="text-foreground">{mockPazienteData.genere}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Data di Nascita</label>
                      <p className="text-foreground">{mockPazienteData.dataNascita}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Altezza (cm)</label>
                      <p className="text-foreground">{mockPazienteData.altezza} cm</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Peso (kg)</label>
                      <p className="text-foreground">{mockPazienteData.peso} kg</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground">Diagnosi</label>
                      <p className="text-foreground">{mockPazienteData.diagnosi}</p>
                      
                    </div>
                    
                  </div>
                </ProfileSection>
                 
              </div>
              
               
            </div>
        </div>
          <GraficoPazienti />
          <SchedaAllenamento />
      </div>
      
      
      {/* Bottoni Flottanti */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <button className="w-14 h-14 p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center shadow-lg">
            <FiEdit2 className="w-6 h-6" /> 
        </button>
        <button className="w-14 h-14 p-4 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors flex items-center justify-center shadow-lg">
            <TrashIcon className="w-6 h-6" /> 
        </button>
      </div>
      
    </div>
  );
};

export default DashboardPaziente;
