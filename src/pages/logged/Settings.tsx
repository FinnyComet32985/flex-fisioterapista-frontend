import { useState } from "react";
import { FiUser, FiLock, FiEdit2, FiSave } from "react-icons/fi";
import { useLocation } from "react-router-dom";

type ProfileData = {
  nome: string;
  cognome: string;
  email: string;
};

type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const routeUser = (location.state as { name?: string; email?: string } | null) ?? null;

  // split nome completo in nome + cognome (se disponibile)
  const [nomeInit, cognomeInit] = routeUser?.name ? routeUser.name.split(" ", 2) : ["John", "Doe"];

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

  const tabLabels: Record<"profile" | "security", string> = {
    profile: "Profilo",
    security: "Sicurezza",
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profilo aggiornato", profileData);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password aggiornata", passwordData);
  };

  const TabContent: React.FC = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={"https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-[color:var(--color-primary)] rounded-full text-[color:var(--color-primary-foreground)] hover:brightness-110"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={profileData.nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProfileData({ ...profileData, nome: e.target.value })
                  }
                  placeholder="Nome"
                  className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
                <input
                  type="text"
                  value={profileData.cognome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProfileData({ ...profileData, cognome: e.target.value })
                  }
                  placeholder="Cognome"
                  className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full md:col-span-2 px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] py-2 px-4 rounded-lg hover:brightness-110 flex items-center justify-center space-x-2"
            >
              <FiSave size={18} />
              <span>Salva modifiche</span>
            </button>
          </form>
        );

      case "security":
        return (
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
            <button
              type="submit"
              className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] py-2 px-4 rounded-lg hover:brightness-110 flex items-center justify-center space-x-2"
            >
              <FiLock size={18} />
              <span>Aggiorna password</span>
            </button>
          </form>
        );

      default:
        return null;
    }
  };

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
            <h2 className="text-2xl font-bold mb-6 capitalize text-[color:var(--color-foreground)]">{tabLabels[activeTab]} impostazioni</h2>
            <TabContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;