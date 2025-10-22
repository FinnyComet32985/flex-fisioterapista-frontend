import { useState } from "react";
import { FiUser, FiLock, FiBell, FiEdit2, FiSave } from "react-icons/fi";

type ProfileData = {
  name: string;
  email: string;
  avatar: string;
  bio: string;
};

type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Notifications = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9",
    bio: "Software Developer | Tech Enthusiast",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState<Notifications>({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    securityAlerts: true,
  });

  const tabLabels: Record<"profile" | "security" | "notifications", string> = {
    profile: "Profilo",
    security: "Sicurezza",
    notifications: "Notifiche",
  };

  const notificationLabels: Record<keyof Notifications, string> = {
    emailNotifications: "Notifiche email",
    pushNotifications: "Notifiche push",
    marketingEmails: "Email commerciali",
    securityAlerts: "Avvisi di sicurezza",
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profilo aggiornato", profileData);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password aggiornata", passwordData);
  };

  const handleNotificationChange = (setting: keyof Notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const TabContent: React.FC = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profileData.avatar}
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
              <div className="flex-1">
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] focus:border-transparent bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full mt-4 px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] focus:border-transparent bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
                />
              </div>
            </div>
            <textarea
              value={profileData.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] focus:border-transparent bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
              rows={4}
            />
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
                className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] focus:border-transparent bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
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
                className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] focus:border-transparent bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
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
                className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ring)] focus:border-transparent bg-[color:var(--color-input)] text-[color:var(--color-foreground)]"
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

      case "notifications":
        return (
          <div className="space-y-6">
            {(Object.keys(notifications) as (keyof Notifications)[]).map((key) => {
              const value = notifications[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-medium capitalize text-[color:var(--color-foreground)]">{notificationLabels[key]}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationChange(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[color:var(--color-muted)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[color:var(--color-ring)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[color:var(--color-border)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[color:var(--color-card)] after:border-[color:var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[color:var(--color-primary)]"></div>
                  </label>
                </div>
              );
            })}
          </div>
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
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg ${activeTab === "notifications" ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]" : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)]"}`}
              >
                <FiBell size={20} />
                <span>{tabLabels.notifications}</span>
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