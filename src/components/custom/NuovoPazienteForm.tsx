import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { apiPost } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import {
  Calendar1,
  Mail,
  Ruler,
  User,
  VenusAndMars,
  Weight,
} from "lucide-react";

interface FormData {
  nome: string;
  cognome: string;
  email: string;
  data_nascita: Date | string;
  diagnosi: string;
  genere: string;
  altezza: number;
  peso: number;
}

type Errors = Partial<Record<keyof FormData, string>>;

const inizialeFormData: FormData = {
  nome: "",
  cognome: "",
  email: "",
  data_nascita: "",
  diagnosi: "",
  genere: "",
  altezza: 0,
  peso: 0,
};

const NuovoPazienteForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(inizialeFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const navigate = useNavigate();

  const diagnoses = [
    "Ipotrofia",
    "Ipertonia",
    "Ipomobilità",
    "Instabilità",
    "Limitazione articolare",
    "Rigidità",
    "Alterazione del passo",
    "Dolore lombare",
    "Squilibrio posturale",
    "Retrazione muscolare",
    "Ipotonia",
    "Rallentamento motorio",
  ];

  const validateField = (
    name: keyof FormData,
    value: string | number | Date | undefined
  ): string | undefined => {
    switch (name) {
      case "nome":
      case "cognome":
        if (typeof value !== "string" || !value.trim())
          return "Questo campo è obbligatorio";
        return undefined;

      case "email":
        if (typeof value !== "string" || !value.trim())
          return "Inserisci un'email";
        // semplice regex per email
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Inserisci un'email valida";
        return undefined;

      case "data_nascita":
        if (!value) return "Inserisci una data di nascita valida";
        // accetta stringa ISO 'YYYY-MM-DD' o Date
        if (typeof value === "string") {
          const d = new Date(value);
          if (isNaN(d.getTime())) return "Data non valida";
        }
        return undefined;

      case "genere":
        if (typeof value !== "string" || !value.trim())
          return "Seleziona un genere";
        return undefined;

      case "altezza":
        if (typeof value !== "number" || value <= 0)
          return "Inserisci un'altezza valida (> 0)";
        return undefined;

      case "peso":
        if (typeof value !== "number" || value <= 0)
          return "Inserisci un peso valido (> 0)";
        return undefined;

      case "diagnosi":
        // opzionale: se vuoi renderla obbligatoria togli il commento sotto
        // if (typeof value !== "string" || !value.trim()) return "Seleziona una diagnosi";
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const key = name as keyof FormData;
    let parsedValue: string | number = value;

    if (key === "altezza" || key === "peso") {
      parsedValue = value === "" ? 0 : Number(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    } else if (key === "data_nascita") {
      // keep date as string from input[type=date]
      parsedValue = value;
    }

    setFormData((prev) => ({ ...prev, [key]: parsedValue as any }));

    // validazione inline
    setErrors((prev) => {
      const next = { ...prev };
      const err = validateField(key, parsedValue as any);
      if (err) next[key] = err;
      else delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateAll(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await apiPost("/patient", formData);
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
            navigate("/pazienti");
          }, 3000);
        }
      } catch (error) {
        console.error("Errore durante l'invio dei dati:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-(--color-background) flex items-center justify-center p-4">
      <div className="bg-(--color-card) rounded-lg shadow-xl p-8 w-full max-w-4xl border border-(--color-border)">
        <h1 className="text-2xl font-bold text-center mb-6 text-(--color-foreground)">
          Aggiungi Paziente
        </h1>
        {status === "success" && (
          <div className="mb-4 p-4 text-green-800 bg-green-200 rounded">
            Paziente aggiunto con successo!
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 p-4 text-red-800 bg-red-200 rounded">
            Errore durante l'aggiunta del paziente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Nome
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-(--color-muted-foreground)" />
                </div>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) placeholder-(--color-muted-foreground) border ${
                    errors.nome
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                  placeholder="Mario"
                  aria-label="Nome"
                />
              </div>
              {errors.nome && (
                <p className="mt-2 text-sm text-(--color-destructive)">
                  {errors.nome}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cognome"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Cognome
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-(--color-muted-foreground)" />
                </div>
                <input
                  type="text"
                  name="cognome"
                  id="cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) placeholder-(--color-muted-foreground) border ${
                    errors.cognome
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                  placeholder="Rossi"
                  aria-label="Cognome"
                />
              </div>
              {errors.cognome && (
                <p className="mt-2 text-sm text-(--color-destructive)">
                  {errors.cognome}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-(--color-muted-foreground)" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 px-4 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) placeholder-(--color-muted-foreground) border ${
                    errors.email
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                  placeholder="mario@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-(--color-destructive)">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="data_nascita"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Data di nascita
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar1 className="h-5 w-5 text-(--color-muted-foreground)" />
                </div>
                <input
                  type="date"
                  name="data_nascita"
                  id="data_nascita"
                  value={
                    typeof formData.data_nascita === "string"
                      ? formData.data_nascita
                      : formData.data_nascita
                      ? new Date(formData.data_nascita)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                  className={`block w-full pl-10 px-4 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) border ${
                    errors.data_nascita
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                />
              </div>
              {errors.data_nascita && (
                <p className="mt-2 text-sm text-(--color-destructive)">
                  {errors.data_nascita}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="genere"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Genere
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <VenusAndMars className="h-5 w-5 text-(--color-muted-foreground)" />
                </div>
                <select
                  name="genere"
                  id="genere"
                  value={formData.genere}
                  onChange={handleChange}
                  className={`block w-full pl-10 px-4 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) border ${
                    errors.genere
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                >
                  <option
                    className="bg-secondary text-(--color-muted-foreground)"
                    value=""
                  >
                    Seleziona
                  </option>
                  <option
                    className="bg-secondary text-(--color-foreground)"
                    value="M"
                  >
                    Maschile
                  </option>
                  <option
                    className="bg-secondary text-(--color-foreground)"
                    value="F"
                  >
                    Femminile
                  </option>
                  <option
                    className="bg-secondary text-(--color-foreground)"
                    value="O"
                  >
                    Altro
                  </option>
                </select>
              </div>
              {errors.genere && (
                <p className="mt-2 text-sm text-(--color-destructive)">
                  {errors.genere}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="altezza"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Altezza (cm)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-5 w-5 text-(--color-muted-foreground)" />
                </div>
                <input
                  type="number"
                  name="altezza"
                  id="altezza"
                  value={formData.altezza || ""}
                  onChange={handleChange}
                  min={0}
                  step="0.1"
                  className={`block w-full pl-10 px-4 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) border ${
                    errors.altezza
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                  placeholder="170"
                />
              </div>
              {errors.altezza && (
                <p className="mt-2 text-sm text-(--color-destructive)">
                  {errors.altezza}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="peso"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Peso (kg)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Weight className="h-5 w-5 text-(--color-muted-foreground)" />
                </div>
                <input
                  type="number"
                  name="peso"
                  id="peso"
                  value={formData.peso || ""}
                  onChange={handleChange}
                  min={0}
                  step="0.1"
                  className={`block w-full pl-10 px-4 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) border ${
                    errors.peso
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                  placeholder="70"
                />
              </div>
              {errors.peso && (
                <p className="mt-2 text-sm text-(--color-destructive)">
                  {errors.peso}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="diagnosi"
                className="block text-sm font-medium text-(--color-muted-foreground)"
              >
                Diagnosi (opzionale)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="diagnosi"
                  id="diagnosi"
                  value={formData.diagnosi}
                  onChange={handleChange}
                  list="diagnosesList"
                  className={`block w-full px-4 py-2 rounded-md sm:text-sm bg-(--color-input) text-(--color-foreground) placeholder-(--color-muted-foreground) border ${
                    errors.diagnosi
                      ? "border-(--color-destructive)"
                      : "border-(--color-border)"
                  } focus:outline-none focus:ring-2 focus:ring-(--color-ring)`}
                  placeholder="Seleziona o scrivi una diagnosi"
                />
                <datalist id="diagnosesList">
                  {diagnoses.map((d, i) => (
                    <option key={i} value={d} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center px-6 py-3 rounded-md text-base font-medium text-(--color-primary-foreground) bg-(--color-primary) hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-(--color-ring) ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-(--color-primary-foreground)" />
                  Elaborazione...
                </>
              ) : (
                "Invia dati paziente"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuovoPazienteForm;
