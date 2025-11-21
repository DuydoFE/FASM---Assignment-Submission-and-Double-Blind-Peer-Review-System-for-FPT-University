import React, { useState, useEffect } from "react";

export default function AdminSemesterManagement() {
  const [semesters, setSemesters] = useState([]);
  const [newSemester, setNewSemester] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setSemesters([
      { id: 1, name: "Semester 1" },
      { id: 2, name: "Semester 2" },
    ]);
  }, []);

  const handleAdd = () => {
    if (!newSemester.trim()) return;
    const newItem = { id: Date.now(), name: newSemester };
    setSemesters([...semesters, newItem]);
    setNewSemester("");
  };

  const handleDelete = (id) => {
    setSemesters(semesters.filter((s) => s.id !== id));
  };

  const handleEdit = (semester) => {
    setEditingId(semester.id);
    setEditingValue(semester.name);
  };

  const handleSaveEdit = () => {
    setSemesters(
      semesters.map((s) =>
        s.id === editingId ? { ...s, name: editingValue } : s
      )
    );
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Semester Management
      </h2>

      {/* Add New Semester */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Enter semester name (e.g., Semester 3)"
          value={newSemester}
          onChange={(e) => setNewSemester(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-sm"
        >
          Add
        </button>
      </div>

      {/* List Semesters */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50 text-left">
              <th className="p-3 border-b font-semibold text-gray-700">ID</th>
              <th className="p-3 border-b font-semibold text-gray-700">
                Semester
              </th>
              <th className="p-3 border-b font-semibold w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {semesters.map((sem) => (
              <tr
                key={sem.id}
                className="border-b hover:bg-orange-50 transition"
              >
                <td className="p-3">{sem.id}</td>

                <td className="p-3">
                  {editingId === sem.id ? (
                    <input
                      type="text"
                      className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                    />
                  ) : (
                    sem.name
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  {editingId === sem.id ? (
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(sem)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(sem.id)}
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
