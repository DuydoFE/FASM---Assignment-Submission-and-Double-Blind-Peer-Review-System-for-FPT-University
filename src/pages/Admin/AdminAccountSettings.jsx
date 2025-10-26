import React, { useState } from "react";

const tabs = [
  "Personal Info",
  "Avatar",
  "Contact",
  "Password",
  "Security",
  "Preferences",
];

export default function AdminAccountSettings() {
  const [activeTab, setActiveTab] = useState("Personal Info");

  return (
    <div className="flex space-x-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white rounded-xl shadow-md p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded 
              ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6">
        {/* Personal Info */}
        {activeTab === "Personal Info" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">👤 Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded w-full p-2"
              />
              <input
                type="text"
                placeholder="Username"
                className="border rounded w-full p-2"
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded w-full p-2"
              />
              <input
                type="text"
                placeholder="Role (e.g. System Admin)"
                className="border rounded w-full p-2"
              />
            </div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Save Changes
            </button>
          </div>
        )}

        {/* Avatar */}
        {activeTab === "Avatar" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🖼️ Profile Picture</h2>
            <div className="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/100"
                alt="avatar"
                className="w-24 h-24 rounded-full border"
              />
              <div className="space-y-2">
                <input type="file" className="block" />
                <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                  Upload New Avatar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        {activeTab === "Contact" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">📞 Contact Information</h2>
            <input
              type="text"
              placeholder="Phone Number"
              className="border rounded w-full p-2"
            />
            <input
              type="text"
              placeholder="Address"
              className="border rounded w-full p-2"
            />
            <input
              type="text"
              placeholder="Website or LinkedIn (optional)"
              className="border rounded w-full p-2"
            />
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Save Contact Info
            </button>
          </div>
        )}

        {/* Password */}
        {activeTab === "Password" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🔑 Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              className="border rounded w-full p-2"
            />
            <input
              type="password"
              placeholder="New Password"
              className="border rounded w-full p-2"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="border rounded w-full p-2"
            />
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Update Password
            </button>
          </div>
        )}

        {/* Security */}
        {activeTab === "Security" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🛡️ Security Settings</h2>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>Enable Two-Factor Authentication</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>Login Alerts via Email</span>
            </label>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Logout from all devices
            </button>
          </div>
        )}

        {/* Preferences */}
        {activeTab === "Preferences" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">⚙️ Preferences</h2>
            <select className="border rounded p-2 w-full">
              <option>Light Mode</option>
              <option>Dark Mode</option>
              <option>System Default</option>
            </select>
            <select className="border rounded p-2 w-full">
              <option>English</option>
              <option>Tiếng Việt</option>
            </select>
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
