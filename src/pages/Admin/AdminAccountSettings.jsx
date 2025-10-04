import React, { useState } from "react";

const tabs = [
  "Profile",
  "Appearance",
  "Notifications",
  "Language & Region",
  "System",
  "Security",
  "Danger Zone",
];

export default function AdminAccountSettings() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex space-x-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white rounded-xl shadow-md p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded 
              ${activeTab === tab ? "bg-orange-500 text-white" : "hover:bg-gray-100"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6">
        {activeTab === "Profile" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">👤 Profile Settings</h2>
            <input type="text" placeholder="Full Name" className="border rounded w-full p-2" />
            <input type="email" placeholder="Email" className="border rounded w-full p-2" />
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Save Profile
            </button>
          </div>
        )}

        {activeTab === "Appearance" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🎨 Appearance</h2>
            <select className="border rounded p-2">
              <option>Light Mode</option>
              <option>Dark Mode</option>
            </select>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🔔 Notifications</h2>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>Email Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>Push Notifications</span>
            </label>
          </div>
        )}

        {activeTab === "Language & Region" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🌍 Language & Region</h2>
            <select className="border rounded p-2">
              <option>English</option>
              <option>Tiếng Việt</option>
            </select>
            <select className="border rounded p-2">
              <option>GMT+7 (Hanoi)</option>
              <option>GMT+9 (Tokyo)</option>
            </select>
          </div>
        )}

        {activeTab === "System" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🖥️ System Config</h2>
            <input type="number" placeholder="Max upload size (MB)" className="border rounded w-full p-2" />
            <input type="number" placeholder="Max assignments per class" className="border rounded w-full p-2" />
          </div>
        )}

        {activeTab === "Security" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🔒 Security</h2>
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Enable 2FA
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Logout all devices
            </button>
          </div>
        )}

        {activeTab === "Danger Zone" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-500">⚠️ Danger Zone</h2>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Delete Account
            </button>
            <button className="px-4 py-2 bg-red-200 text-red-700 rounded hover:bg-red-300">
              Reset Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
