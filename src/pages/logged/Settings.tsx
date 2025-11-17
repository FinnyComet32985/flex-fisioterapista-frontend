import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiPatch, apiPost } from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { FiUser, FiLock, FiSave } from "react-icons/fi"; // Icone
import { useLocation, useNavigate } from "react-router-dom"; // Hook per la navigazione e gestione della rotta

// tipo dati del profilo utente
type ProfileData = {
  nome: string;
  cognome: string;
  email: string;
};

// tipo dati del form di cambio password
type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const SettingsPage: React.FC = () => {
  // per passare dati tra rotte
  const location = useLocation();
  const navigate = useNavigate();
  // Estrae i dati utente (name, email) passati tramite lo state della rotta, con un fallback a null
  const routeUser = (location.state as { name?: string; email?: string } | null) ?? null;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    // Validazione semplice lato client prima dell'invio
    if (!profileData.nome.trim() || !profileData.cognome.trim()) {
      setSubmitError("Nome e cognome sono obbligatori");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(profileData.email)) {
      setSubmitError("Email non valida");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiPatch("/profile", profileData);

      // Controlla se la chiamata API ha avuto successo (status 2xx)
      if (!result.ok) {
        // Se la chiamata fallisce, prova a leggere il corpo della risposta per un messaggio d'errore
        const body = await result.json().catch(() => null);
        const msg = body?.message ?? body?.error ?? "Aggiornamento profilo fallito";
        setSubmitError(msg);
      } else {
        setSubmitSuccess("Profilo aggiornato con successo");
        // Dopo il successo, reindirizza l'utente alla home e ricarica la pagina per aggiornare i dati
        setTimeout(() => {
          setSubmitSuccess(null);
          navigate("/");
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Errore di rete");
      console.error("handleSubmit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Divide il nome completo
  const [nomeInit, cognomeInit] = routeUser?.name ? routeUser.name.split(" ", 2) : ["John", "Doe"];

  // Stato per tenere traccia della scheda attiva ("profilo" o "sicurezza")
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profileData, setProfileData] = useState<ProfileData>({
    nome: nomeInit ?? "John",
    cognome: cognomeInit ?? "Doe",
    email: routeUser?.email ?? "john.doe@example.com",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
 
  const [pwLoading, setPwLoading] = useState<boolean>(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // Oggetto per mappare gli ID delle schede ai loro nomi visualizzati
  const tabLabels: Record<"profile" | "security", string> = {
    profile: "Profilo",
    security: "Sicurezza",
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    // Validazione dei campi password
    if (!passwordData.currentPassword) {
      setPwError("Inserisci la password attuale");
      return;
    }
   
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwError("La conferma non corrisponde alla nuova password");
      return;
    }

    setPwLoading(true);
    try {
      const result = await apiPost("/changePassword", {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (!result.ok) {
        const body = await result.json().catch(() => null);
        setPwError(body?.message ?? body?.error ?? `Errore (${result.status})`);
        return;
      }

      setPwSuccess("Password aggiornata con successo");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Errore di rete");
    } finally {
      setPwLoading(false);
      if (pwSuccess) setTimeout(() => setPwSuccess(null), 2500);
    }
  };

  // useMemo per ottimizzare il rendering del contenuto della scheda attiva.
  // Il contenuto viene ricalcolato solo se una delle sue dipendenze cambia.
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {/* Avatar dell'utente con le iniziali di nome e cognome */}
                <Avatar className="w-32 h-32 border-4 border-card shadow-lg text-4xl">
                        <AvatarFallback>
                          {profileData.nome.charAt(0)}
                          {profileData.cognome.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
              </div>
              {/* Campi di input per nome, cognome ed email */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nome"
                  value={profileData.nome}
                  onChange={handleChange}
                  placeholder="Nome"
                  className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
                <input
                  type="text"
                  name="cognome"
                  value={profileData.cognome}
                  onChange={handleChange}
                  placeholder="Cognome"
                  className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full md:col-span-2 px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
              </div>
            </div>
            {/* Visualizzazione dei messaggi di errore o successo */}
            {submitError && <p className="text-sm text-[color:var(--color-destructive)]">{submitError}</p>}
            {submitSuccess && <p className="text-sm text-[color:var(--color-success)]">{submitSuccess}</p>}
            {/* Pulsante di salvataggio con stato di caricamento */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] py-2 px-4 rounded-lg hover:brightness-110 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <FiSave size={18} />
              <span>{isSubmitting ? "Salvataggio..." : "Salva modifiche"}</span>
            </button>
          </form>
        );

      case "security":
        return (
          // Form per l'aggiornamento della password
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-[color:var(--color-muted-foreground)]">Password attuale</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[color:var(--color-muted-foreground)]">Nuova password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[color:var(--color-muted-foreground)]">Conferma nuova password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
              />
            </div>
            {/* Visualizzazione dei messaggi di errore o successo per il cambio password */}
            {pwError && <p className="text-sm text-[color:var(--color-destructive)]">{pwError}</p>}
            {pwSuccess && <p className="text-sm text-[color:var(--color-success)]">{pwSuccess}</p>}
            {/* Pulsante di aggiornamento password con stato di caricamento */}
            <button
              type="submit"
              disabled={pwLoading}
              className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] py-2 px-4 rounded-lg hover:brightness-110 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <FiLock size={18} />
              <span>{pwLoading ? "Aggiornamento..." : "Aggiorna password"}</span>
            </button>
          </form>
        );

      default:
        return null;
    }
    // Array di dipendenze per useMemo: il contenuto si aggiorna solo se uno di questi valori cambia
  }, [activeTab, profileData, passwordData, handleChange, handleSubmit, handlePasswordUpdate, isSubmitting, submitError, submitSuccess, pwLoading, pwError, pwSuccess]);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-foreground)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[color:var(--color-card)] rounded-xl shadow-md overflow-hidden border border-[color:var(--color-border)]">
        <div className="flex">
          <div className="w-64 bg-[color:var(--color-sidebar)] p-8 border-r border-[color:var(--color-sidebar-border)]">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg ${activeTab === "profile" ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]" : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)]"}`}
              >
                <FiUser size={20} />
                <span>{tabLabels.profile}</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg ${activeTab === "security" ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]" : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)]"}`}
              >
                <FiLock size={20} />
                <span>{tabLabels.security}</span>
              </button>
            </nav>
          </div>
          <div className="flex-1 p-8">
            {/* Titolo dinamico basato sulla scheda attiva */}
            <h2 className="text-2xl font-bold mb-6 capitalize text-[color:var(--color-foreground)]">{tabLabels[activeTab]} impostazioni</h2>
            {/* Renderizza il contenuto della scheda attiva (memoizzato) */}
            {tabContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;