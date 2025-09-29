import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/manage-class">Manage Classes</a>
          <a href="/admin/assignments">Assignments</a>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
