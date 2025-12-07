import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../service/adminService";
import toast, { Toaster } from "react-hot-toast";

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
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    semesterId: null,
    callback: null,
  });

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

  const semesterOptions = (academicYearName) => [
    `Spring ${academicYearName}`,
    `Summer ${academicYearName}`,
    `Fall ${academicYearName}`,
  ];

  const getPresetDates = (name, academicYearObj) => {
    if (!academicYearObj || !academicYearObj.name) return { startDate: "", endDate: "" };

    const parsedYear = academicYearObj.name.match(/^(\d{4})/)?.[1];
    if (!parsedYear) return { startDate: "", endDate: "" };

    const y = Number(parsedYear);

    const format = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;

    let start, end;

    switch (name) {
      case "Spring":
        start = new Date(y, 0, 1, 0, 0, 0, 0);
        end = new Date(y, 3, 30, 23, 59, 59, 999);
        break;

      case "Summer":
        start = new Date(y, 4, 1, 0, 0, 0, 0);
        end = new Date(y, 7, 31, 23, 59, 59, 999);
        break;

      case "Fall":
        start = new Date(y, 8, 1, 0, 0, 0, 0);
        end = new Date(y, 11, 31, 23, 59, 59, 999);
        break;

      default:
        start = new Date(y, 0, 1, 0, 0, 0, 0);
        end = new Date(y, 11, 31, 23, 59, 59, 999);
    }

    return {
      startDate: format(start),
      endDate: format(end),
    };
  };

  <select
    className="border p-3 rounded-xl"
    value={newSemester.name}
    onChange={(e) => {
      const updatedName = e.target.value;
      const selectedYearObj = academicYears.find(
        (y) => y.academicYearId === Number(newSemester.academicYearId)
      );

      const shortName = updatedName.split(" ")[0];

      const dates = getPresetDates(shortName, selectedYearObj);

      setNewSemester({
        ...newSemester,
        name: updatedName,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
    }}
  >
    <option value="">Select Semester Name</option>
    {newSemester.academicYearId &&
      semesterOptions(
        academicYears.find((y) => y.academicYearId === newSemester.academicYearId)?.name
      ).map((option) => (
        <option
          key={option}
          value={option}
          disabled={semesters.some(
            (s) => s.name === option && s.academicYearId === newSemester.academicYearId
          )}
        >
          {option}
        </option>
      ))}
  </select>

  const handleSubmit = async () => {
    if (!newSemester.name || !newSemester.startDate || !newSemester.endDate)
      return toast.error("Please fill all fields");

    const formatForAPI = (value) => {
      if (!value) return null;
      return value.length === 16 ? value + ":00" : value;
    };

    const payload = {
      academicYearId: Number(newSemester.academicYearId),
      name: newSemester.name,
      startDate: formatForAPI(newSemester.startDate),
      endDate: formatForAPI(newSemester.endDate),
    };

    try {
      await createSemester(payload);
      toast.success("Semester created!");
      loadSemesters();
      setShowAddForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating semester");
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

  const normalizeDate = (value) => {
    if (!value) return null;
    return value.length === 16 ? value + ":00" : value;
  };

  const handleSaveEdit = async () => {
    if (!editing.academicYearId) return toast.error("Please select an academic year");
    if (!editing.name.trim()) return toast.error("Please enter semester name");
    if (!editing.startDate || !editing.endDate) return toast.error("Please select start and end date");

    try {
      const payload = {
        ...editing,
        startDate: normalizeDate(editing.startDate),
        endDate: normalizeDate(editing.endDate),
      };
      const res = await updateSemester(payload);
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

  const displayedSemesters = filterYearId
    ? semesters.filter((s) => s.academicYearId === Number(filterYearId))
    : [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
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

          <select
            className="border p-3 rounded-xl"
            value={newSemester.name}
            onChange={(e) => {
              const updatedName = e.target.value;

              const selectedYear = academicYears.find(
                (y) => y.academicYearId === Number(newSemester.academicYearId)
              );

              const dates = getPresetDates(updatedName.split(" ")[0], selectedYear);

              setNewSemester({
                ...newSemester,
                name: updatedName,
                startDate: dates.startDate,
                endDate: dates.endDate,
              });
            }}
          >
            <option value="">Select Semester Name</option>
            {newSemester.academicYearId &&
              semesterOptions(
                academicYears.find(
                  (y) => y.academicYearId === newSemester.academicYearId
                )?.name
              ).map((option) => (
                <option
                  key={option}
                  value={option}
                  disabled={semesters.some(
                    (s) =>
                      s.name === option &&
                      s.academicYearId === newSemester.academicYearId
                  )}
                >
                  {option}
                </option>
              ))}
          </select>

          <input
            type="datetime-local"
            value={newSemester.startDate}
            onChange={(e) =>
              setNewSemester({ ...newSemester, startDate: e.target.value })
            }
          />

          <input
            type="datetime-local"
            value={newSemester.endDate}
            onChange={(e) =>
              setNewSemester({ ...newSemester, endDate: e.target.value })
            }
          />


          <button
            onClick={handleSubmit}
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
                      type="datetime-local"
                      className="border p-2 rounded-lg"
                      value={editing.startDate || ""}
                      onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                    />
                  ) : (
                    sem.startDate?.split("T")[0]
                  )}
                </td>
                <td className="p-3">
                  {editing?.semesterId === sem.semesterId ? (
                    <input
                      type="datetime-local"
                      className="border p-2 rounded-lg"
                      value={editing.endDate || ""}
                      onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                    />
                  ) : (
                    sem.endDate?.split("T")[0]
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  {editing?.semesterId === sem.semesterId ? (
                    <>
                      {/* Save */}
                      <button
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            type: "edit",
                            semesterId: editing.semesterId,
                            callback: () => handleSaveEdit(),
                          })
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Save
                      </button>

                      {/* Cancel */}
                      <button
                        onClick={() => setEditing(null)}
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Edit */}
                      <button
                        onClick={() =>
                          setEditing({
                            ...sem,
                            startDate: sem.startDate ? sem.startDate.slice(0, 16) : "",
                            endDate: sem.endDate ? sem.endDate.slice(0, 16) : "",
                          })
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            type: "delete",
                            semesterId: sem.semesterId,
                            callback: () => handleDelete(sem.semesterId),
                          })
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {confirmModal.type === "delete"
                ? "Are you sure you want to delete this semester?"
                : "Are you sure you want to save changes?"}
            </h3>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => {
                  setConfirmModal({ ...confirmModal, isOpen: false });
                  if (confirmModal.type === "edit") setEditing(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  if (confirmModal.callback) confirmModal.callback();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
