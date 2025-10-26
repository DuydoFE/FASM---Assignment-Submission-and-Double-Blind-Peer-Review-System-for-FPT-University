import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  Users,
  ClipboardList,
  BarChart3,
  Cpu,
} from "lucide-react";
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

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <BarChart3 size={18} />
            Dashboard
          </NavLink>

          {/* Edit Profile */}
          <NavLink
            to="/admin/account-settings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <User size={18} />
            Profile Management
          </NavLink>

          {/* User Management */}
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <Users size={18} />
            User Management
          </NavLink>

          {/* Class Management */}
          <NavLink
            to="/admin/classes"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <ClipboardList size={18} />
            Class Management
          </NavLink>

          {/* Class Details Management */}
          <NavLink
            to="/admin/class/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <Users size={18} />
            Class Details Management
          </NavLink>

          {/* Class Assignments */}
          <NavLink
            to="/admin/class/assignments"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <ClipboardList size={18} />
            Class Assignments
          </NavLink>

          {/* Assignment Details */}
          <NavLink
            to="/admin/class/assignment-details"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <ClipboardList size={18} />
            Assignment Details
          </NavLink>

          {/* LLM Integration */}
          <NavLink
            to="/admin/llm"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <Cpu size={18} />
            LLM Integration
          </NavLink>

          {/* System Configuration */}
          <NavLink
            to="/admin/system"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <Settings size={18} />
            System Configuration
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Administrator Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/account-settings")}
              className="flex items-center space-x-2 hover:text-orange-600"
            >
              <User size={18} />
              <span>Admin Name</span>
            </button>

            <button
              onClick={() => navigate("/admin/system")}
              className="hover:text-orange-600"
            >
              <Settings size={20} />
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
