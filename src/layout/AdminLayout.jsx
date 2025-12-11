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
  GraduationCap,
  ListChecks,
  LogOut
} from "lucide-react";

import React from "react";
import FASMLogo from "../assets/img/FASM.png";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/userSlice";
import axios from "axios";
import { persistStore } from "redux-persist";
import { store } from "../redux/store";

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      dispatch(logout());

      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("access_token");

      if (axios?.defaults?.headers?.common["Authorization"]) {
        delete axios.defaults.headers.common["Authorization"];
      }

      try {
        const persistor = persistStore(store);
        persistor.purge();
      } catch (err) {}

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="h-20 flex items-center justify-center border-b px-4">
          <img src={FASMLogo} alt="FASM Logo" className="h-16 w-full object-contain" />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <BarChart3 size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <Users size={18} />
            User Management
          </NavLink>

          <NavLink
            to="/admin/classes"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <ClipboardList size={18} />
            Class Management
          </NavLink>

          <NavLink
            to="/admin/majors"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <GraduationCap size={18} />
            Major Management
          </NavLink>

          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <FileText size={18} />
            Course Management
          </NavLink>

          <NavLink
            to="/admin/rubrics"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <ListChecks size={18} />
            Rubric Management
          </NavLink>

          <NavLink
            to="/admin/academicYears"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <CalendarRange size={18} />
            Academic Year Management
          </NavLink>

          <NavLink
            to="/admin/semesters"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <CalendarDays size={18} />
            Semester Management
          </NavLink>

          <NavLink
            to="/admin/systemSetting"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            <Settings size={18} />
            System Setting
          </NavLink>
        </nav>

        {/* Logout */}
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

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
