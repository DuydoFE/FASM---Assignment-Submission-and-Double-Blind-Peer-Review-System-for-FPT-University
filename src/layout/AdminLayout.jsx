import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import React from "react";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            User Management
          </NavLink>
          <NavLink
            to="/admin/classes"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Class Management
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Account Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 hover:text-orange-600">
              <User size={18} />
              <span>Admin Name</span>
            </button>
            <button
              onClick={() => navigate("/admin/settings")}
              className="hover:text-orange-600"
            >
              <Settings size={20} />
            </button>
            <button className="hover:text-red-600">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
