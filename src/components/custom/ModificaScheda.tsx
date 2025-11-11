import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search, XCircle } from "lucide-react";
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
  esercizio_id: number;
  nome: string; 
  serie: number;
  ripetizioni: number;
}

const inizialeFormData: FormData = {
  nome: "",
  tipo: "",
  note: "",
  esercizi: [],
};

const ModificaScheda: React.FC = () => {
  const { schedaId } = useParams<{ schedaId: string }>();
  const [formData, setFormData] = useState<FormData>(inizialeFormData);
  const [formDataIniziale, setFormDataIniziale] = useState<FormData>(inizialeFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  const { pazienteId } = useParams<{ pazienteId: string }>();

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

  const fetchScheda = async () => {
    try {
      const response = await apiGet(`/trainingCard/full/${schedaId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          nome: data.nome,
          tipo: data.tipo_scheda,
          note: data.note,
          esercizi: data.esercizi.map((e: any) => ({
            esercizio_id: e.id,
            nome: e.nome,
            serie: e.serie,
            ripetizioni: e.ripetizioni
          }))
        });
        setFormDataIniziale({ // Salva una copia iniziale per il confronto con le modifiche
          nome: data.nome,
          tipo: data.tipo_scheda,
          note: data.note,
          esercizi: data.esercizi.map((e: any) => ({
            esercizio_id: e.id,
            nome: e.nome,
            serie: e.serie,
            ripetizioni: e.ripetizioni
          }))
        });

      } else {
        console.error("Impossibile caricare la scheda.");
      }
    } catch (error) {
      console.error("Errore API nel caricamento scheda:", error);
    }
  };

  useEffect(() => {
    fetchScheda();
  }, []);

  const handleAddEsercizio = (esercizio: EsercizioCatalogo) => {
    if (!formData.esercizi.some(e => e.esercizio_id === esercizio.id)) {
      const nuovoEsercizio: EsercizioSelezionato = {
        esercizio_id: esercizio.id,
        nome: esercizio.nome,
        serie: 3,
        ripetizioni: 10,
      };
      setFormData(prev => ({ ...prev, esercizi: [...prev.esercizi, nuovoEsercizio] }));
    }
  };

  const handleRemoveEsercizio = (id: number) => {
    setFormData(prev => ({ ...prev, esercizi: prev.esercizi.filter(e => e.esercizio_id !== id) }));
  };

  const handleEsercizioChange = (id: number, field: 'serie' | 'ripetizioni', value: number) => {
    // Se il valore non è un numero, o < di 1, lo imposta a 0.
    const numericValue = !isNaN(value) && value >= 1 ? value : 0;
    setFormData(prev => ({ //passa attraverso tutti gli esercizi e aggiorna quello con l'id corrispondente
      ...prev, // mantiene gli altri campi invariati
      esercizi: prev.esercizi.map(e => (e.esercizio_id === id ? { ...e, [field]: numericValue } : e)) //aggiorna solo il campo specificato
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
    if (!formData.nome.trim()) newErrors.nome = "Il nome è obbligatorio.";
    if (formData.nome.trim().length > 50) newErrors.nome = "Il nome non può superare i 50 caratteri.";
    if (!formData.tipo) newErrors.tipo = "Il tipo è obbligatorio.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0 || formData.esercizi.length === 0) {
      setStatus("error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        nome: formData.nome,
        tipo_scheda: formData.tipo,
        note: formData.note,
        
      };
      const result = await apiPatch(`/trainingCard/${schedaId}`, payload);
      if (result.ok) {
        for (const { esercizio_id, serie, ripetizioni } of formData.esercizi) {
            if (!formDataIniziale.esercizi.some(e => e.esercizio_id === esercizio_id)) {
                // Aggiungi nuovo esercizio
                await apiPost(`/trainingCard/${schedaId}/exercise`, {
                    esercizio_id,
                    serie,
                    ripetizioni
                });
            } else if (formDataIniziale.esercizi.some(e => e.esercizio_id === esercizio_id && (e.serie !== serie || e.ripetizioni !== ripetizioni))) {
                // Aggiorna esercizio esistente
                await apiPatch(`/trainingCard/${schedaId}/exercise`, {
                    esercizio_id,
                    serie,
                    ripetizioni
                });
            }
          
        }

        for (const { esercizio_id } of formDataIniziale.esercizi) {
            if (!formData.esercizi.some(e => e.esercizio_id === esercizio_id)) {
                // Rimuovi esercizio non più presente
                await apiDelete(`/trainingCard/${schedaId}/exercise/${esercizio_id}`);
            }
        }
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Modifica Scheda di Allenamento</h1>
        {status === "success" && (
          <div className="mb-4 p-3 text-sm text-green-800 bg-green-100 rounded">Scheda modificata con successo!</div>
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
                      <div key={ex.esercizio_id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <p className="flex-1 font-medium">{ex.nome}</p>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`serie-${ex.esercizio_id}`} className="text-sm">Serie</Label>
                          <Input type="number" id={`serie-${ex.esercizio_id}`} value={ex.serie} onChange={e => handleEsercizioChange(ex.esercizio_id, 'serie', parseInt(e.target.value, 10))} className="w-16" min="1" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`rip-${ex.esercizio_id}`} className="text-sm">Rip.</Label>
                          <Input type="number" id={`rip-${ex.esercizio_id}`} value={ex.ripetizioni} onChange={e => handleEsercizioChange(ex.esercizio_id, 'ripetizioni', parseInt(e.target.value, 10))} className="w-16" min="1" />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveEsercizio(ex.esercizio_id)}><XCircle className="w-5 h-5 text-destructive" /></Button>
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
                      <Button size="sm" variant="outline" onClick={() => handleAddEsercizio(ex)} disabled={formData.esercizi.some(e => e.esercizio_id === ex.id)}>
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
              {isLoading ? <><FaSpinner className="animate-spin mr-2" /> Salvataggio...</> : "Salva modifiche"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModificaScheda;
