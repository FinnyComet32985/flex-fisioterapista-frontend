import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import { useState, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";

// Definizione del tipo per i dati del form di un nuovo esercizio
interface FormData {
  nome: string;
  descrizione: string;
  descrizione_svolgimento: string;
  consigli_svolgimento: string;
  immagine?: string; // Campo opzionale per l'URL dell'immagine
  video?: string; // Campo opzionale per l'URL del video
}

// Tipo per la gestione degli errori di validazione, mappando i campi del form a messaggi di errore
type Errors = Partial<Record<keyof FormData, string>>;

// Stato iniziale e vuoto per il form, usato per l'inizializzazione e il reset
const inizialeFormData: FormData = {
  nome: "",
  descrizione: "",
  descrizione_svolgimento: "",
  consigli_svolgimento: "",
  immagine: "",
  video: "",
};

/* Componente che renderizza un form per la creazione di un nuovo esercizio.*/
function NuovoEsercizio() {
  // Stato per i dati correnti del form
  const [formData, setFormData] = useState<FormData>(inizialeFormData);
  // Stato per memorizzare e visualizzare gli errori di validazione
  const [errors, setErrors] = useState<Errors>({});
  // Stato per gestire la visualizzazione del caricamento durante l'invio
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Stato per mostrare messaggi di successo o errore all'utente
  const [status, setStatus] = useState<string>("");

  const navigate = useNavigate();

  const validateField = useCallback(
    (
    name: keyof FormData,
    value: string | undefined
  ): string | undefined => {
      switch (name) {
        case "nome":
          if (typeof value !== "string" || !value.trim())
            return "Il nome è obbligatorio";
          if (value.length > 50)
            return "Il nome non può superare i 50 caratteri.";
          return undefined;
        case "descrizione":
          if (typeof value !== "string" || !value.trim())
            return "Questo campo è obbligatorio";
          return undefined;
  
        case "descrizione_svolgimento":
          if (typeof value !== "string" || !value.trim())
            return "Inserisci una descrizione valida";
          return undefined;
  
        case "consigli_svolgimento":
          if (typeof value !== "string" || !value.trim())
            return "Inserisci dei consigli validi";
          return undefined;
  
        case "immagine":
          // optional: se vuoto va bene, altrimenti verifica minimale che sia un URL
          if (!value || !value.trim()) return undefined;
          if (!/^https?:\/\//i.test(value.trim()))
            return "Inserisci un URL dell'immagine valido (http/https)";
          return undefined;
  
        case "video":
          // optional: se vuoto va bene, altrimenti verifica minimale che sia un URL
          if (!value || !value.trim()) return undefined;
          if (!/^https?:\/\//i.test(value.trim()))
            return "Inserisci un URL del video valido (http/https)";
          return undefined;
  
        default:
          return undefined;
      }
    },
    []
  );

  /* Gestisce le modifiche ai campi di input del form.*/
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      const err = validateField(name as keyof FormData, value);
      if (err) next[name as keyof FormData] = err;
      else delete next[name as keyof FormData];
      return next;
    });
  }, [validateField]);

  /*Resetta completamente lo stato del form ai valori iniziali.*/
  const handleCancel = useCallback(() => {
    setFormData(inizialeFormData);
    setErrors({});
    setIsLoading(false);
    setStatus("");
  }, []);

  /* Esegue la validazione su tutti i campi del form. */
  const validateAll = useCallback((data: FormData): Errors => {
    const newErrors: Errors = {};
    (Object.keys(data) as (keyof FormData)[]).forEach((key) => {
      const val = data[key];
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  }, [validateField]);

  /* Gestisce l'invio del form. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Esegue la validazione completa prima dell'invio
    const newErrors = validateAll(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Invia i dati del form al server
      try {
        const result = await apiPost("/exercise", formData);
        if (!result.ok) {
          setStatus("error");
          setIsLoading(false);
          setTimeout(() => {
            setFormData(inizialeFormData);
            setErrors({});
            setStatus("");
          }, 2000);
          throw new Error("Errore durante l'invio dei dati");
        }
        // In caso di successo (status 201 Created)
        if (result.status === 201) {
          setStatus("success");
          setIsLoading(false);
          setTimeout(() => {
            setFormData(inizialeFormData);
            setErrors({});
            setStatus("");
            navigate("/catalogo-esercizi");
          }, 3000);
        }
      } catch (error) {
        // Gestisce errori di rete o altri fallimenti della richiesta
        console.error("Errore durante l'invio dei dati:", error);
        setStatus("error");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Nuovo esercizio</FieldLegend>
            {/* Messaggi di stato per feedback all'utente */}
            <FieldDescription>
              Aggiungi un nuovo esercizio al catalogo
            </FieldDescription>
            {status === "success" && (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                <span>Esercizio aggiunto con successo!</span>
              </div>
            )}
            {status === "error" && (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>Errore durante l'aggiunta dell'esercizio.</span>
              </div>
            )}
            {/* Gruppo di campi del form */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nome">Nome esercizio</FieldLabel>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  required
                  className={`${
                    errors.nome
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  }`}
                  onChange={handleChange}
                />
                {errors.nome && (
                  <p className="mt-1 text-sm text-(--color-destructive)">
                    {errors.nome}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="descrizione">
                  Descrizione dell'esercizio
                </FieldLabel>
                <Textarea
                  id="descrizione"
                  name="descrizione"
                  value={formData.descrizione}
                  required
                  className={`${
                    errors.descrizione
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  }`}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="descrizione_svolgimento">
                  Descrizione dello svolgimento
                </FieldLabel>
                <Textarea
                  id="descrizione_svolgimento"
                  name="descrizione_svolgimento"
                  value={formData.descrizione_svolgimento}
                  required
                  className={`${
                    errors.descrizione_svolgimento
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  }`}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="consigli_svolgimento">
                  Consigli per lo svolgimento
                </FieldLabel>
                <Textarea
                  id="consigli_svolgimento"
                  name="consigli_svolgimento"
                  value={formData.consigli_svolgimento}
                  required
                  className={`${
                    errors.consigli_svolgimento
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  }`}
                  onChange={handleChange}
                />
              </Field>
              <FieldSeparator />
              <Field>
                <FieldLabel htmlFor="video">
                  Link al video (opzionale)
                </FieldLabel>
                <Input
                  id="video"
                  name="video"
                  value={formData.video}
                  className={`${
                    errors.video
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  }`}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="immagine">
                  Link all'immagine (opzionale)
                </FieldLabel>
                <Input
                  id="immagine"
                  name="immagine"
                  value={formData.immagine}
                  className={`${
                    errors.immagine
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  }`}
                  onChange={handleChange}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          {/* Pulsanti di azione per inviare o annullare */}
          <Field orientation="horizontal">
            <Button
              type="submit"
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-(--color-primary-foreground)" />
                  Elaborazione...
                </>
              ) : (
                "Aggiungi Esercizio"
              )}
            </Button>
            <Button variant="outline" type="button" onClick={handleCancel} className="cursor-pointer">
              Annulla
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default NuovoEsercizio;
