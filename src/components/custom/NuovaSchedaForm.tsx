import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { apiGet, apiPost } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, PlusCircle, Search, XCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { ComboboxTipoScheda } from "./ComboboxTipoScheda";

interface FormData {
  nome: string;
  tipo: string;
  note: string;
  esercizi: EsercizioSelezionato[];
}

type Errors = Partial<Record<keyof Omit<FormData, 'esercizi'>, string>>;

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
  const { pazienteId } = useParams<{ pazienteId: string }>();
  const [formData, setFormData] = useState<FormData>(inizialeFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
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
    // Se il valore non è un numero (es. campo vuoto), o è minore di 1, lo imposta a 1.
    const numericValue = !isNaN(value) && value >= 1 ? value : 0;
    setFormData(prev => ({
      ...prev,
      esercizi: prev.esercizi.map(e => (e.exercise_id === id ? { ...e, [field]: numericValue } : e))
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};
    /* Validazione dei campi */
    if (!formData.nome.trim()) newErrors.nome = "Il nome è obbligatorio.";
    if (formData.nome.trim().length > 50) newErrors.nome = "Il nome non può superare i 50 caratteri.";
    if (!formData.tipo) newErrors.tipo = "Il tipo è obbligatorio.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0 || formData.esercizi.length === 0) {
      setStatus("error");
      return;
    }

    /* Invia i dati al server */
    setIsLoading(true);
    try {
      const payload = {
        nome: formData.nome,
        tipo_scheda: formData.tipo,
        note: formData.note,
        
      };
      const result = await apiPost(`/trainingCard/${pazienteId}`, payload);
      const { scheda_id } = await result.json();
      if (result.ok) {
        for (const { exercise_id, serie, ripetizioni } of formData.esercizi) {
          const result = await apiPost(`/trainingCard/${scheda_id}/exercise`, 
      {
            esercizio_id: exercise_id,
            serie: serie,
            ripetizioni: ripetizioni
          });
          if (!result.ok) {
            throw new Error("Errore durante la creazione degli esercizi");
          }
          
        }
        setStatus("success");
        setTimeout(() => navigate(`/profilo-paziente/${pazienteId}`), 2000);
      } 
      
      else {
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
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5" />
            <span>Scheda creata con successo!</span>
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Errore. Compila tutti i campi e aggiungi almeno un esercizio.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonna sinistra: Dati scheda e esercizi selezionati */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Dettagli Scheda</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Scheda</Label>
                  <Input id="nome" name="nome" value={formData.nome} onChange={handleFormChange} placeholder="Es. Rinforzo schiena" required />
                  {errors.nome && <p className="mt-1 text-sm text-destructive">{errors.nome}</p>}
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo Scheda</Label>
                  <ComboboxTipoScheda value={formData.tipo} onChange={value => setFormData(prev => ({ ...prev, tipo: value }))} />
                  {errors.tipo && <p className="mt-1 text-sm text-destructive">{errors.tipo}</p>}
                </div>
                <div>
                  <Label htmlFor="note">Note Aggiuntive</Label>
                  <Textarea id="note" name="note" value={formData.note} onChange={handleFormChange} placeholder="Consigli per il paziente, frequenza, ecc." />
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
