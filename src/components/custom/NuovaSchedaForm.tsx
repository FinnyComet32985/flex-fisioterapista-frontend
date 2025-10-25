import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { apiGet, apiPost } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search, Trash2, XCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface FormData {
  nome: string;
  tipo: string;
  note: string;
  esercizi: EsercizioSelezionato[];
}

interface EsercizioCatalogo {
  id: number;
  nome: string;
  descrizione: string;
}

interface EsercizioSelezionato {
  exercise_id: number;
  nome: string; // Lo teniamo per comodità di visualizzazione
  serie: number;
  ripetizioni: number;
}

const inizialeFormData: FormData = {
  nome: "",
  tipo: "",
  note: "",
  esercizi: [],
};

const NuovaSchedaForm: React.FC = () => {
  const { id: pazienteId } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>(inizialeFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();

  const [eserciziCatalogo, setEserciziCatalogo] = useState<EsercizioCatalogo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEsercizi = async () => {
      try {
        const response = await apiGet("/exercise");
        if (response.ok) {
          const data: EsercizioCatalogo[] = await response.json();
          setEserciziCatalogo(data);
        } else {
          console.error("Impossibile caricare il catalogo esercizi.");
        }
      } catch (error) {
        console.error("Errore API nel caricamento esercizi:", error);
      }
    };
    fetchEsercizi();
  }, []);

  const tipiScheda = [
    "Rinforzo Muscolare",
    "Miglioramento Mobilità",
    "Correzione Posturale",
    "Riabilitazione Funzionale",
    "Propriocezione ed Equilibrio",
  ];

  const handleAddEsercizio = (esercizio: EsercizioCatalogo) => {
    if (!formData.esercizi.some(e => e.exercise_id === esercizio.id)) {
      const nuovoEsercizio: EsercizioSelezionato = {
        exercise_id: esercizio.id,
        nome: esercizio.nome,
        serie: 3,
        ripetizioni: 10,
      };
      setFormData(prev => ({ ...prev, esercizi: [...prev.esercizi, nuovoEsercizio] }));
    }
  };

  const handleRemoveEsercizio = (id: number) => {
    setFormData(prev => ({ ...prev, esercizi: prev.esercizi.filter(e => e.exercise_id !== id) }));
  };

  const handleEsercizioChange = (id: number, field: 'serie' | 'ripetizioni', value: number) => {
    setFormData(prev => ({
      ...prev,
      esercizi: prev.esercizi.map(e => e.exercise_id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.tipo || formData.esercizi.length === 0) {
      setStatus("error");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        nome: formData.nome,
        tipo: formData.tipo,
        note: formData.note,
        exercises: formData.esercizi.map(({ exercise_id, serie, ripetizioni }) => ({
          exercise_id,
          serie,
          ripetizioni,
        })),
      };
      const result = await apiPost(`/trainingCard/${pazienteId}`, payload);
      if (result.ok) {
        setStatus("success");
        setTimeout(() => navigate(`/profilo-paziente/${pazienteId}`), 2000);
      } else {
        setStatus("error");
        throw new Error("Errore durante la creazione della scheda");
      }
    } catch (error) {
      console.error("Errore invio dati:", error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEsercizi = eserciziCatalogo.filter(e =>
    e.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Crea Nuova Scheda di Allenamento</h1>
        {status === "success" && (
          <div className="mb-4 p-3 text-sm text-green-800 bg-green-100 rounded">Scheda creata con successo!</div>
        )}
        {status === "error" && (
          <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded">Errore. Compila tutti i campi e aggiungi almeno un esercizio.</div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonna sinistra: Dati scheda e esercizi selezionati */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Dettagli Scheda</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Scheda</Label>
                  <Input id="nome" value={formData.nome} onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))} placeholder="Es. Rinforzo schiena" required />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo Scheda</Label>
                  <Input id="tipo" list="tipiScheda" value={formData.tipo} onChange={e => setFormData(prev => ({ ...prev, tipo: e.target.value }))} placeholder="Seleziona o scrivi un tipo" required />
                  <datalist id="tipiScheda">
                    {tipiScheda.map((t, i) => <option key={i} value={t} />)}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="note">Note Aggiuntive</Label>
                  <Textarea id="note" value={formData.note} onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))} placeholder="Consigli per il paziente, frequenza, ecc." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Esercizi Selezionati</CardTitle></CardHeader>
              <CardContent>
                {formData.esercizi.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nessun esercizio aggiunto. Selezionali dal catalogo a destra.</p>
                ) : (
                  <div className="space-y-4">
                    {formData.esercizi.map(ex => (
                      <div key={ex.exercise_id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <p className="flex-1 font-medium">{ex.nome}</p>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`serie-${ex.exercise_id}`} className="text-sm">Serie</Label>
                          <Input type="number" id={`serie-${ex.exercise_id}`} value={ex.serie} onChange={e => handleEsercizioChange(ex.exercise_id, 'serie', parseInt(e.target.value, 10))} className="w-16" min="1" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`rip-${ex.exercise_id}`} className="text-sm">Rip.</Label>
                          <Input type="number" id={`rip-${ex.exercise_id}`} value={ex.ripetizioni} onChange={e => handleEsercizioChange(ex.exercise_id, 'ripetizioni', parseInt(e.target.value, 10))} className="w-16" min="1" />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveEsercizio(ex.exercise_id)}><XCircle className="w-5 h-5 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonna destra: Catalogo esercizi */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Catalogo Esercizi</CardTitle></CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cerca esercizio..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <ScrollArea className="h-[400px] border rounded-md p-2">
                  {filteredEsercizi.map(ex => (
                    <div key={ex.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                      <div>
                        <p className="font-semibold">{ex.nome}</p>
                        <p className="text-xs text-muted-foreground">{ex.descrizione}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleAddEsercizio(ex)} disabled={formData.esercizi.some(e => e.exercise_id === ex.id)}>
                        <PlusCircle className="w-4 h-4 mr-2" /> Aggiungi
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Pulsante di salvataggio */}
          <div className="lg:col-span-2 flex justify-center mt-8">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? <><FaSpinner className="animate-spin mr-2" /> Salvataggio...</> : "Crea Scheda"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuovaSchedaForm;
