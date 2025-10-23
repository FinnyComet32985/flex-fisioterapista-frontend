import React, { useState, type ReactNode } from "react";
import { FiEdit2, FiUpload, FiMoon, FiSun, FiLogOut, FiKey, FiBox, FiSettings, FiUser } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";


interface Interaction {
  id: number;
  action: string;
  item: string;
  date: string;
}

interface Equipment {
  id: number;
  name: string;
  status: string;
}

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  totalItems: number;
  recentInteractions: Interaction[];
  assignedEquipment: Equipment[];
}

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}

const UserProfile: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");

  const mockUserData: UserData = {
    fullName: "John Anderson",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    username: "john.inventory",
    role: "Inventory Manager",
    createdAt: "2023-01-15",
    lastLogin: "2024-01-20",
    totalItems: 1234,
    recentInteractions: [
      { id: 1, action: "Updated Stock", item: "Laptop Dell XPS", date: "2024-01-19" },
      { id: 2, action: "Approved Shipment", item: "Office Supplies", date: "2024-01-18" },
    ],
    assignedEquipment: [
      { id: 1, name: "Company Laptop", status: "Active" },
      { id: 2, name: "Access Card", status: "Active" },
    ],
  };

  const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
      {children}
    </div>
  );

  const NavigationTabs: React.FC = () => (
    <div className="flex space-x-2 mb-6 border-b dark:border-gray-700">
      <button
        onClick={() => setActiveTab("profile")}
        className={`px-4 py-2 -mb-px ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 dark:text-gray-400"}`}
      >
        <div className="flex items-center gap-2">
          <FiUser />
          <span>Profile</span>
        </div>
      </button>
      <button
        onClick={() => setActiveTab("settings")}
        className={`px-4 py-2 -mb-px ${activeTab === "settings" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 dark:text-gray-400"}`}
      >
        <div className="flex items-center gap-2">
          <FiSettings />
          <span>Settings</span>
        </div>
      </button>
    </div>
  );

  return (
    <div  className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">User Profile</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <FiSun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <FiMoon className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <div className="relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Notifications"
                >
                  <IoMdNotifications className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
              </div>
            </div>
          </div>

          <NavigationTabs />

          {activeTab === "profile" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileSection title="Personal Information">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                      <button
                        className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                        aria-label="Edit profile picture"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                      {mockUserData.fullName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{mockUserData.role}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                      <p className="text-gray-800 dark:text-white">{mockUserData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Phone</label>
                      <p className="text-gray-800 dark:text-white">{mockUserData.phone}</p>
                    </div>
                  </div>
                </ProfileSection>

                <div className="space-y-4">
                  <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <FiEdit2 /> Edit Profile
                  </button>
                  <button className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <FiKey /> Change Password
                  </button>
                  <button className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <ProfileSection title="Account Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
                      <p className="text-gray-800 dark:text-white">{mockUserData.username}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Account Created</label>
                      <p className="text-gray-800 dark:text-white">{mockUserData.createdAt}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Last Login</label>
                      <p className="text-gray-800 dark:text-white">{mockUserData.lastLogin}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">Total Items Managed</label>
                      <p className="text-gray-800 dark:text-white">{mockUserData.totalItems}</p>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Recent Inventory Interactions">
                  <div className="space-y-4">
                    {mockUserData.recentInteractions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{interaction.action}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{interaction.item}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{interaction.date}</span>
                      </div>
                    ))}
                  </div>
                </ProfileSection>

                <ProfileSection title="Assigned Equipment">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockUserData.assignedEquipment.map((equipment) => (
                      <div
                        key={equipment.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <FiBox className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-800 dark:text-white">{equipment.name}</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {equipment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </ProfileSection>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Account Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your inventory</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
