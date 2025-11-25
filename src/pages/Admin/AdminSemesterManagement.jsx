import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../service/adminService";
import toast, { Toaster } from "react-hot-toast"; // ✅ import Toaster

export default function AdminSemesterManagement() {
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [newSemester, setNewSemester] = useState({
    academicYearId: "",
    name: "",
    startDate: "",
    endDate: "",
  });
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterYearId, setFilterYearId] = useState("");

  useEffect(() => {
    loadAcademicYears();
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    try {
      const res = await getAllSemesters();
      if (res?.data) setSemesters(res.data);
    } catch {
      toast.error("Failed to load semesters");
    }
  };

  const loadAcademicYears = async () => {
    try {
      const res = await getAllAcademicYears();
      if (res?.data) setAcademicYears(res.data);
    } catch {
      toast.error("Failed to load academic years");
    }
  };

  const handleAdd = async () => {
    if (!newSemester.academicYearId) return toast.error("Please select an academic year");
    if (!newSemester.name.trim()) return toast.error("Please enter semester name");
    if (!newSemester.startDate || !newSemester.endDate) return toast.error("Please select start and end date");

    try {
      const res = await createSemester(newSemester);
      if (res?.data) {
        const academicYear = academicYears.find(
          (y) => y.academicYearId === res.data.academicYearId
        );

        setSemesters([
          ...semesters,
          { ...res.data, academicYearName: academicYear?.name || "" },
        ]);
        setNewSemester({ academicYearId: "", name: "", startDate: "", endDate: "" });
        setShowAddForm(false);
        toast.success("Semester created successfully");
      }
    } catch {
      toast.error("Failed to create semester");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSemester(id);
      setSemesters(semesters.filter((s) => s.semesterId !== id));
      toast.success("Semester deleted successfully");
    } catch {
      toast.error("Failed to delete semester");
    }
  };

  const handleSaveEdit = async () => {
    if (!editing.academicYearId) return toast.error("Please select an academic year");
    if (!editing.name.trim()) return toast.error("Please enter semester name");
    if (!editing.startDate || !editing.endDate) return toast.error("Please select start and end date");

    try {
      const res = await updateSemester(editing);
      if (res?.data) {
        const academicYear = academicYears.find(
          (y) => y.academicYearId === res.data.academicYearId
        );

        setSemesters(
          semesters.map((s) =>
            s.semesterId === editing.semesterId
              ? { ...res.data, academicYearName: academicYear?.name || "" }
              : s
          )
        );
        setEditing(null);
        toast.success("Semester updated successfully");
      }
    } catch {
      toast.error("Failed to update semester");
    }
  };

  // Filtered semesters by academic year
  const displayedSemesters = filterYearId
    ? semesters.filter((s) => s.academicYearId === Number(filterYearId))
    : [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      {/* ✅ Thêm Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-3xl font-bold mb-6 text-orange-600">Semester Management</h2>

      {/* Filter by Academic Year */}
      <div className="flex items-center gap-3 mb-6">
        <select
          className="border p-3 rounded-xl"
          value={filterYearId}
          onChange={(e) => setFilterYearId(e.target.value)}
        >
          <option value="">Select Academic Year to filter</option>
          {academicYears.map((year) => (
            <option key={year.academicYearId} value={year.academicYearId}>
              {year.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
        >
          {showAddForm ? "Cancel" : "Add Semester"}
        </button>
      </div>

      {/* Add New Semester Form */}
      {showAddForm && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <select
            className="border p-3 rounded-xl"
            value={newSemester.academicYearId}
            onChange={(e) =>
              setNewSemester({ ...newSemester, academicYearId: Number(e.target.value) })
            }
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((year) => (
              <option key={year.academicYearId} value={year.academicYearId}>
                {year.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Semester name"
            className="border p-3 rounded-xl"
            value={newSemester.name}
            onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
          />

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={newSemester.startDate}
            onChange={(e) => setNewSemester({ ...newSemester, startDate: e.target.value })}
          />

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={newSemester.endDate}
            onChange={(e) => setNewSemester({ ...newSemester, endDate: e.target.value })}
          />

          <button
            onClick={handleAdd}
            className="col-span-4 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600"
          >
            Save
          </button>
        </div>
      )}

      {/* List Semesters */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50 text-left">
              <th className="p-3 border-b">Academic Year</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Start</th>
              <th className="p-3 border-b">End</th>
              <th className="p-3 border-b w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSemesters.map((sem) => (
              <tr key={sem.semesterId} className="border-b hover:bg-orange-50">
                <td className="p-3">
                  {editing?.semesterId === sem.semesterId ? (
                    <select
                      className="border p-2 rounded-lg"
                      value={editing.academicYearId}
                      onChange={(e) =>
                        setEditing({ ...editing, academicYearId: Number(e.target.value) })
                      }
                    >
                      {academicYears.map((year) => (
                        <option key={year.academicYearId} value={year.academicYearId}>
                          {year.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    sem.academicYearName
                  )}
                </td>
                <td className="p-3">
                  {editing?.semesterId === sem.semesterId ? (
                    <input
                      type="text"
                      className="border p-2 rounded-lg"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                  ) : (
                    sem.name
                  )}
                </td>
                <td className="p-3">
                  {editing?.semesterId === sem.semesterId ? (
                    <input
                      type="date"
                      className="border p-2 rounded-lg"
                      value={editing.startDate}
                      onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                    />
                  ) : (
                    sem.startDate?.split("T")[0]
                  )}
                </td>
                <td className="p-3">
                  {editing?.semesterId === sem.semesterId ? (
                    <input
                      type="date"
                      className="border p-2 rounded-lg"
                      value={editing.endDate}
                      onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                    />
                  ) : (
                    sem.endDate?.split("T")[0]
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  {editing?.semesterId === sem.semesterId ? (
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditing({ ...sem })}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(sem.semesterId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!filterYearId && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  Select an academic year to see semesters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
