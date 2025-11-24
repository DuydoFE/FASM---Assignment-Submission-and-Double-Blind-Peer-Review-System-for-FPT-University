import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../service/adminService";
import toast from "react-hot-toast";

export default function AdminSemesterManagement() {
  const [semesters, setSemesters] = useState([]);
  const [newSemester, setNewSemester] = useState({
    academicYearId: "",
    name: "",
    startDate: "",
    endDate: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    try {
      const res = await getAllSemesters();
      if (res?.data) {
        setSemesters(res.data);
      }
    } catch (err) {
      toast.error("Failed to load semesters");
    }
  };

  const handleAdd = async () => {
    if (!newSemester.name.trim()) return toast.error("Enter semester name");

    try {
      const res = await createSemester(newSemester);
      if (res?.data) {
        toast.success("Semester created");
        setSemesters([...semesters, res.data]);
        setNewSemester({ academicYearId: "", name: "", startDate: "", endDate: "" });
      }
    } catch (error) {
      toast.error("Failed to create semester");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSemester(id);
      setSemesters(semesters.filter((s) => s.semesterId !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete semester");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await updateSemester(editing);
      if (res?.data) {
        setSemesters(
          semesters.map((s) => (s.semesterId === editing.semesterId ? res.data : s))
        );
        toast.success("Updated successfully");
        setEditing(null);
      }
    } catch (e) {
      toast.error("Failed to update semester");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">Semester Management</h2>

      {/* Add New Semester */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <input
          type="number"
          placeholder="Academic Year ID"
          className="border p-3 rounded-xl"
          value={newSemester.academicYearId}
          onChange={(e) => setNewSemester({ ...newSemester, academicYearId: Number(e.target.value) })}
        />
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
      </div>
      <button onClick={handleAdd} className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 mb-6">
        Add Semester
      </button>

      {/* List Semesters */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50 text-left">
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Academic Year</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Start</th>
              <th className="p-3 border-b">End</th>
              <th className="p-3 border-b w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {semesters.map((sem) => (
              <tr key={sem.semesterId} className="border-b hover:bg-orange-50">
                <td className="p-3">{sem.semesterId}</td>
                <td className="p-3">{sem.academicYearName}</td>
                <td className="p-3">
                  {editing?.semesterId === sem.semesterId ? (
                    <input
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="border p-2 rounded-lg"
                    />
                  ) : (
                    sem.name
                  )}
                </td>
                <td className="p-3">{sem.startDate?.split("T")[0]}</td>
                <td className="p-3">{sem.endDate?.split("T")[0]}</td>
                <td className="p-3 flex gap-2">
                  {editing?.semesterId === sem.semesterId ? (
                    <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
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
          </tbody>
        </table>
      </div>
    </div>
  );
}