import { TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

import { apiGet } from "@/lib/api";

import { GraficoPazienti } from "@/components/custom/GraficoPazienti";
import {Avatar,AvatarFallback} from "@/components/ui/avatar"
import ListaSchede from "@/components/custom/ListaSchede";

interface Paziente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  dataInizioTrattamento: string;
  numero_sedute_effettuate: number;
  genere: string;
  peso: number;
  altezza: number;
  data_nascita: string;
  diagnosi: string;
}

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg mb-6 border border-border">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default function DashboardPaziente() {
  const { id } = useParams<{ id: string }>(); // Estrae l'ID del paziente dall'URL
  const [paziente, setPaziente] = useState<Paziente | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaziente = async () => {
      if (!id) return;
      try {
        const response = await apiGet(`/patient/${id}`); // Carica il singolo paziente

        if (!response.ok) {
          throw new Error("Impossibile caricare il profilo del paziente");
        }
        const data: Paziente[] = await response.json();
        setPaziente(data[0]); // ✅ prende il primo elemento dell’array

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Si è verificato un errore sconosciuto");
        console.error("Errore nel caricamento del profilo del paziente:", err);
      }
    };

    fetchPaziente();
  }, [id]);

  return (
    <div  className={`min-h-screen`}>
      <div className="bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Profilo Paziente</h1>

          {error && <div className="text-red-500">Errore: {error}</div>}
          {!paziente && !error && <div>Caricamento del profilo...</div>}

          {paziente && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileSection title="Informazioni Personali">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-card shadow-lg text-4xl">
                      <AvatarFallback>{paziente.nome.charAt(0)}{paziente.cognome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">
                      {paziente.nome} {paziente.cognome}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Email:INSERIRE</label>
                      <p className="text-foreground">{paziente.email}</p>
                    </div>
                  </div>
                </ProfileSection>

            
              </div>

              <div className="lg:col-span-2">
                <ProfileSection title="Dettagli Account">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                    <div>
                      <label className="text-sm text-muted-foreground">Inizio Trattamento:INSERIRE</label>
                      <p className="text-foreground">{new Date(paziente.dataInizioTrattamento).toLocaleDateString("it-IT")}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Sedute Effettuate:INSERIRE</label>
                      <p className="text-foreground">{paziente.numero_sedute_effettuate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Genere</label>
                      <p className="text-foreground">{paziente.genere}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Data di Nascita</label>
                      <p className="text-foreground">{new Date(paziente.data_nascita).toLocaleDateString("it-IT")}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Altezza (cm)</label>
                      <p className="text-foreground">{paziente.altezza} cm</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Peso (kg)</label>
                      <p className="text-foreground">{paziente.peso} kg</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground">Diagnosi</label>
                      <p className="text-foreground">{paziente.diagnosi}</p>
                      
                    </div>
                    
                  </div>
                </ProfileSection>
                 
              </div>
            </div>
          )}
        </div>
        <div className="max-w-7xl mx-auto mt-8 space-y-8">
            <GraficoPazienti />
            <ListaSchede />
        </div>
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
}
