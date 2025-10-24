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
import { apiPost } from "@/lib/api";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface FormData {
  nome: string;
  descrizione: string;
  descrizione_svolgimento: string;
  consigli_svolgimento: string;
  immagine: string;
  video: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

const inizialeFormData: FormData = {
  nome: "",
  descrizione: "",
  descrizione_svolgimento: "",
  consigli_svolgimento: "",
  immagine: "",
  video: "",
};

function NuovoEsercizio() {
  const [formData, setFormData] = useState<FormData>(inizialeFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // usa name, non id
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      const err = validateField(name as keyof FormData, value);
      if (err) next[name as keyof FormData] = err;
      else delete next[name as keyof FormData];
      return next;
    });
  };

  const validateField = (
    name: keyof FormData,
    value: string | undefined
  ): string | undefined => {
    switch (name) {
      case "nome":
        if (typeof value !== "string" || !value.trim())
          return "Il nome è obbligatorio";
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
        if (typeof value !== "string" || !value.trim())
          return "Seleziona un'immagine valida";
        return undefined;

      case "video":
        if (typeof value !== "string" || !value.trim())
          return "Seleziona un video valido";
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (data: FormData): Errors => {
    const newErrors: Errors = {};
    (Object.keys(data) as (keyof FormData)[]).forEach((key) => {
      const val = data[key];
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validateAll(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await apiPost("/exercise", formData);
        if (!result.ok) {
          setStatus("error");
          setTimeout(() => {
            setIsLoading(false);
            setFormData(inizialeFormData);
            setErrors({});
            setStatus("");
          }, 2000);
          throw new Error("Errore durante l'invio dei dati");
        }
        if (result.status === 200) {
          setStatus("success");
          setTimeout(() => {
            setIsLoading(false);
            setFormData(inizialeFormData);
            setErrors({});
            setStatus("");
            navigate("/catalogo-esercizi");
          }, 3000);
        }
      } catch (error) {
        console.error("Errore durante l'invio dei dati:", error);
      }
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Nuovo esercizio</FieldLegend>
            <FieldDescription>
              Aggiungi un nuovo esercizio al catalogo
            </FieldDescription>
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
                      ? "border-[color:var(--color-destructive)]"
                      : "border-[color:var(--color-border)]"
                  }`}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="descrizione">
                  Descrizione dell'esercizio
                </FieldLabel>
                <Input
                  id="descrizione"
                  name="descrizione"
                  value={formData.descrizione}
                  required
                  className={`${
                    errors.descrizione
                      ? "border-[color:var(--color-destructive)]"
                      : "border-[color:var(--color-border)]"
                  }`}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="descrizione_svolgimento">
                  Descrizione dello svolgimento
                </FieldLabel>
                <Input
                  id="descrizione_svolgimento"
                  name="descrizione_svolgimento"
                  value={formData.descrizione_svolgimento}
                  required
                  className={`${
                    errors.descrizione_svolgimento
                      ? "border-[color:var(--color-destructive)]"
                      : "border-[color:var(--color-border)]"
                  }`}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="consigli_svolgimento">
                  Consigli per lo svolgimento
                </FieldLabel>
                <Input
                  id="consigli_svolgimento"
                  name="consigli_svolgimento"
                  value={formData.consigli_svolgimento}
                  required
                  className={`${
                    errors.consigli_svolgimento
                      ? "border-[color:var(--color-destructive)]"
                      : "border-[color:var(--color-border)]"
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
                      ? "border-[color:var(--color-destructive)]"
                      : "border-[color:var(--color-border)]"
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
                      ? "border-[color:var(--color-destructive)]"
                      : "border-[color:var(--color-border)]"
                  }`}
                  onChange={handleChange}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Button
              type="submit"
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-[color:var(--color-primary-foreground)]" />
                  Elaborazione...
                </>
              ) : (
                "Aggiungi Esercizio"
              )}
            </Button>
            <Button variant="outline" type="button" className="cursor-pointer">
              Annulla
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default NuovoEsercizio;
