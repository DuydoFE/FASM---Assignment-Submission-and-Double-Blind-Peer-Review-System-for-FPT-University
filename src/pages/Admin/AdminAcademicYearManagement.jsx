import React, { useState, useEffect } from "react";

export default function AdminAcademicYearManagement() {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setYears([
      { id: 1, name: "2022 - 2023" },
      { id: 2, name: "2023 - 2024" },
    ]);
  }, []);

  const handleAdd = () => {
    if (!newYear.trim()) return;
    const newItem = { id: Date.now(), name: newYear };
    setYears([...years, newItem]);
    setNewYear("");
  };

  const handleDelete = (id) => {
    setYears(years.filter((y) => y.id !== id));
  };

  const handleEdit = (year) => {
    setEditingId(year.id);
    setEditingValue(year.name);
  };

  const handleSaveEdit = () => {
    setYears(
      years.map((y) =>
        y.id === editingId ? { ...y, name: editingValue } : y
      )
    );
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Academic Year Management
      </h2>

      {/* Add New Academic Year */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Enter academic year (e.g., 2024 - 2025)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-sm"
        >
          Add
        </button>
      </div>

      {/* List Academic Years */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50 text-left">
              <th className="p-3 border-b font-semibold text-gray-700">ID</th>
              <th className="p-3 border-b font-semibold text-gray-700">Academic Year</th>
              <th className="p-3 border-b font-semibold w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {years.map((year) => (
              <tr
                key={year.id}
                className="border-b hover:bg-orange-50 transition"
              >
                <td className="p-3">{year.id}</td>

                <td className="p-3">
                  {editingId === year.id ? (
                    <input
                      type="text"
                      className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                    />
                  ) : (
                    year.name
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  {editingId === year.id ? (
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(year)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(year.id)}
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
