import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  Users,
  ClipboardList,
  BarChart3,
  FileText,
  CalendarRange,
  CalendarDays,
  LogOut   // import icon logout
} from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/userSlice";

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // điều hướng về trang login
  };

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

          {/* Rubric Management */}
          <NavLink
            to="/admin/rubrics"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <FileText size={18} />
            Rubric Management
          </NavLink>

          {/* Academic Year Management */}
          <NavLink
            to="/admin/academicYears"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <CalendarRange size={18} />
            Academic Year Management
          </NavLink>

          {/* Semester Management */}
          <NavLink
            to="/admin/semesters"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <CalendarDays size={18} />
            Semester Management
          </NavLink>

          {/* System Setting */}
          <NavLink
            to="/admin/systemSetting"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <Settings size={18} />
            System Setting
          </NavLink>
        </nav>

        {/* Logout button ở cuối sidebar */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-gray-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Administrator Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/settings")}
              className="flex items-center space-x-2 hover:text-orange-600"
            >
              <User size={18} />
              <span>Admin Name</span>
            </button>

            <button
              onClick={() => navigate("/admin/systemSetting")}
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
