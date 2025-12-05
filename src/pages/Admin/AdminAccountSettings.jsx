import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserById, updateUser } from "../../service/adminService";
import { Pencil, Save } from "lucide-react";
import { toast } from "react-hot-toast";

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
  const userId = useSelector((state) => state.user.userId);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    roles: [],
    avatarUrl: "",
    phone: "",
    address: "",
    website: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await getUserById(userId);
        if (res.statusCode === 200 || res.statusCode === 100) {
          setUser({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            username: res.data.username || "",
            email: res.data.email || "",
            roles: res.data.roles || [],
            avatarUrl: res.data.avatarUrl || "",
            phone: res.data.phone || "",
            address: res.data.address || "",
            website: res.data.website || "",
            campusId: res.data.campusId ?? 1,
            majorId: res.data.majorId ?? 1,
            studentCode: res.data.studentCode ?? null,
            isActive: res.data.isActive ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
        toast.error("Failed to fetch user info");
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      const payload = {
        userId: userId || 1,
        campusId: user.campusId ?? 1,
        majorId: user.majorId ?? 1,

        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",

        studentCode: user.studentCode ?? null,
        avatarUrl: user.avatarUrl || "",

        isActive: user.isActive ?? true
      };

      console.log("Updating with payload:", payload);
      const res = await updateUser(userId, payload);

      toast.success("User information updated successfully!");
      setIsEditing(false);

    } catch (error) {
      console.error("Failed to update user", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="flex space-x-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white rounded-xl shadow-md p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded ${activeTab === tab
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-orange-500">
                👤 Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  <Save size={16} />
                  Save
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  value={user.firstName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                  className={`border rounded w-full p-2 ${isEditing
                    ? "bg-white cursor-text"
                    : "bg-gray-100 cursor-not-allowed"
                    }`}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  value={user.lastName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                  className={`border rounded w-full p-2 ${isEditing
                    ? "bg-white cursor-text"
                    : "bg-gray-100 cursor-not-allowed"
                    }`}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Username</label>
                <input
                  type="text"
                  value={user.username}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  className={`border rounded w-full p-2 ${isEditing
                    ? "bg-white cursor-text"
                    : "bg-gray-100 cursor-not-allowed"
                    }`}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  className={`border rounded w-full p-2 ${isEditing
                    ? "bg-white cursor-text"
                    : "bg-gray-100 cursor-not-allowed"
                    }`}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Role</label>
                <input
                  type="text"
                  value={user.roles.join(", ")}
                  readOnly
                  className="border rounded w-full p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Avatar */}
        {activeTab === "Avatar" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">🖼️ Profile Picture</h2>
            <div className="flex items-center space-x-4">
              <img
                src={user.avatarUrl || "https://via.placeholder.com/100"}
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
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="border rounded w-full p-2"
            />
            <input
              type="text"
              placeholder="Address"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="border rounded w-full p-2"
            />
            <input
              type="text"
              placeholder="Website or LinkedIn (optional)"
              value={user.website}
              onChange={(e) => setUser({ ...user, website: e.target.value })}
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
            <input type="password" placeholder="Current Password" className="border rounded w-full p-2" />
            <input type="password" placeholder="New Password" className="border rounded w-full p-2" />
            <input type="password" placeholder="Confirm New Password" className="border rounded w-full p-2" />
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
