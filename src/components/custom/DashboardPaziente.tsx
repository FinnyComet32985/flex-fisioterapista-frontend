import { TrashIcon, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiDelete, apiGet } from "@/lib/api";
import { GraficoPazienti } from "@/components/custom/GraficoPazienti";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ListaSchede from "@/components/custom/ListaSchede";
import { ModificaInformazioniPaziente } from "@/components/custom/ModificaInformazioniPaziente";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";


interface Paziente {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    data_inizio: string;
    sedute_effettuate: number;
    genere: string;
    peso: number;
    altezza: number;
    data_nascita: string;
    diagnosi: string;
    data_fine?: string | null;
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
    const { id } = useParams<{ id: string }>(); // prendi l'ID del paziente dall'URL
    const [paziente, setPaziente] = useState<Paziente | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchPaziente = React.useCallback(async () => {
        if (!id) return;
        try {
            const response = await apiGet(`/patient/${id}`);

            if (!response.ok) {
                const data = await response.json();
                console.log(data.message);
                throw new Error(data.message);
            }

            const data: Paziente = await response.json();
            console.log("Dati paziente:", data);
            setPaziente(data);
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Si è verificato un errore sconosciuto"
            );
            console.error(
                "Errore nel caricamento del profilo del paziente:",
                err
            );
        }
    }, [id]);

    useEffect(() => {
        fetchPaziente();
    }, [fetchPaziente]);

    const handleDeletePaziente = async (id: number) => {
        const prev = paziente;

        try {
            const response = await apiDelete(`/patient/${id}`);
            console.log("Response delete paziente:", response);
            console.log("id:", id);
            if (!response.ok) {
                setPaziente(prev);
                throw new Error("Impossibile eliminare il paziente");
            }

            // Eliminazione riuscita
            setPaziente(null);
            navigate("/pazienti");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Si è verificato un errore sconosciuto"
            );
            console.error("Errore nella cancellazione del paziente:", err);
        }
    };

    const handleInfoUpdate = () => {
        fetchPaziente();
    };

    return (
        <div className="min-h-screen">
            <div className="bg-background p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                        Profilo Paziente
                    </h1>

                    {error && (
                        <div className="text-red-500">Errore: {error}</div>
                    )}
                    {!paziente && !error && (
                        <div>Caricamento del profilo...</div>
                    )}

                    {paziente && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <ProfileSection title="Informazioni Personali">
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <Avatar className="w-32 h-32 border-4 border-card shadow-lg text-4xl">
                                                <AvatarFallback>
                                                    {paziente.nome.charAt(0)}
                                                    {paziente.cognome.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <h3 className="mt-4 text-xl font-semibold text-foreground">
                                            {paziente.nome} {paziente.cognome}
                                        </h3>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground">
                                                Email:
                                            </label>
                                            <p className="text-foreground">
                                                {paziente.email}
                                            </p>
                                        </div>
                                    </div>
                                </ProfileSection>
                            </div>

                            <div className="lg:col-span-2">
                                <ProfileSection title="Dettagli Account">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                                        <div>
                                            <label className="text-sm text-muted-foreground">
                                                Inizio Trattamento:
                                            </label>
                                            <p className="text-foreground">
                                                {new Date(
                                                    paziente.data_inizio
                                                ).toLocaleDateString("it-IT")}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">
                                                Sedute Effettuate:
                                            </label>
                                            <p className="text-foreground">
                                                {paziente.sedute_effettuate}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">
                                                Genere
                                            </label>
                                            <p className="text-foreground">
                                                {paziente.genere}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">
                                                Data di Nascita
                                            </label>
                                            <p className="text-foreground">
                                                {new Date(
                                                    paziente.data_nascita
                                                ).toLocaleDateString("it-IT")}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">
                                                Altezza (cm)
                                            </label>
                                            <p className="text-foreground">
                                                {paziente.altezza} cm
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">
                                                Peso (kg)
                                            </label>
                                            <p className="text-foreground">
                                                {paziente.peso} kg
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm text-muted-foreground">
                                                Diagnosi
                                            </label>
                                            <p className="text-foreground">
                                                {paziente.diagnosi}
                                            </p>
                                        </div>
                                    </div>
                                    {paziente.data_fine && (
                                            <div className="mt-6 text-red-500 flex flex-row items-center justify-center gap-2">
                                              <TriangleAlert />
                                                <p>
                                                    Trattamento terminato il:{" "}
                                                    {new Date(
                                                        paziente.data_fine
                                                    ).toLocaleDateString(
                                                        "it-IT"
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                </ProfileSection>
                            </div>
                        </div>
                    )}
                </div>

                {paziente && (
                    <div className="max-w-7xl mx-auto mt-8 space-y-8">
                        <GraficoPazienti pazienteId={id} />
                        <ListaSchede trattamento_terminato={!!paziente.data_fine} />
                    </div>
                )}
            </div>

            {/* Bottoni fluttuanti di modifica e eliminazione */}
            {paziente && !paziente.data_fine && (
                <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
                    <ModificaInformazioniPaziente
                        id_paziente={paziente.id}
                        peso={paziente.peso}
                        altezza={paziente.altezza}
                        diagnosi={paziente.diagnosi}
                        onInfoUpdate={handleInfoUpdate}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="w-14 h-14 p-4 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors flex items-center justify-center shadow-lg">
                                <TrashIcon className="w-6 h-6" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Ne sei assolutamente sicuro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Questa azione non può essere annullata.
                                    <br />
                                    L'esercizio verrà eliminato definitivamente.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annulla</AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    onClick={() =>
                                        handleDeletePaziente(paziente.id)
                                    }
                                >
                                    Conferma
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
    );
}
