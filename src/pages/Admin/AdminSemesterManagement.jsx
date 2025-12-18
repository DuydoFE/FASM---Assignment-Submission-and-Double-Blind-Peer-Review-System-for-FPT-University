import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../service/adminService";
import toast, { Toaster } from "react-hot-toast";

const getApiMessage = (errorOrResponse) => {
  if (!errorOrResponse) return "Unknown error";
  if (errorOrResponse.response?.data?.message) return errorOrResponse.response.data.message;
  if (errorOrResponse?.data?.message) return errorOrResponse.data.message;
  if (errorOrResponse.message) return errorOrResponse.message;
  return "Unknown error";
};

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
    } catch (err) {
      toast.error(getApiMessage(err));
    }
  };

  const loadAcademicYears = async () => {
    try {
      const res = await getAllAcademicYears();
      if (res?.data) setAcademicYears(res.data);
    } catch (err) {
      toast.error(getApiMessage(err));
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
      const res = await createSemester(payload);
      toast.success(getApiMessage(res));
      loadSemesters();
      setShowAddForm(false);
    } catch (err) {
      toast.error(getApiMessage(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteSemester(id);
      toast.success(getApiMessage(res));
      loadSemesters();
    } catch (err) {
      toast.error(getApiMessage(err));
    }
  };

  const normalizeDate = (value) => {
    if (!value) return null;
    return value.length === 16 ? value + ":00" : value;
  };

  const hasChanged = (currentEdit) => {
    const original = semesters.find(s => s.semesterId === currentEdit.semesterId);
    if (!original) return false;

    return (
      original.academicYearId !== currentEdit.academicYearId ||
      original.name !== currentEdit.name ||
      (original.startDate?.slice(0, 16) || "") !== (currentEdit.startDate || "") ||
      (original.endDate?.slice(0, 16) || "") !== (currentEdit.endDate || "")
    );
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
        toast.success(getApiMessage(res));
      }
    } catch {
      toast.error(getApiMessage(err));
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
          className="bg-[#F36F21] text-white px-6 py-3 rounded-xl hover:bg-orange-600 hover:opacity-90 transition-all duration-200 hover:-translate-y-[1px]"
        >
          {showAddForm ? "Cancel" : "+ Create Semester"}
        </button>
      </div>

      {/* Add New Semester Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Add New Semester</h3>

            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddForm(false)}
            >
              ✕
            </button>

            <div className="grid grid-cols-1 gap-4">
              {/* Academic Year */}
              <label className="font-medium">Academic Year</label>
              <select
                className="border p-3 rounded-xl w-full"
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

              {/* Semester Name */}
              <label className="font-medium">Semester Name</label>
              <select
                className="border p-3 rounded-xl w-full"
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

              {/* Start Date */}
              <label className="font-medium">Start Date</label>
              <input
                type="datetime-local"
                className="border p-3 rounded-xl w-full bg-gray-100 cursor-not-allowed"
                value={newSemester.startDate}
                readOnly
              />

              {/* End Date */}
              <label className="font-medium">End Date</label>
              <input
                type="datetime-local"
                className="border p-3 rounded-xl w-full bg-gray-100 cursor-not-allowed"
                value={newSemester.endDate}
                readOnly
              />

              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl w-full hover:bg-blue-600 hover:opacity-90 transition-all duration-200 hover:-translate-y-[1px]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Semester Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Edit Semester</h3>

            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setEditing(null)}
            >
              ✕
            </button>

            <div className="grid grid-cols-1 gap-4">
              {/* Academic Year */}
              <label className="font-medium">Academic Year</label>
              <select
                className="border p-3 rounded-xl w-full"
                value={editing.academicYearId}
                onChange={(e) => {
                  const yearId = Number(e.target.value);
                  const selectedYear = academicYears.find(y => y.academicYearId === yearId);
                  const semesterShortName = editing.name.split(" ")[0] || "";
                  const dates = getPresetDates(semesterShortName, selectedYear);

                  setEditing({
                    ...editing,
                    academicYearId: yearId,
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                  });
                }}
              >
                <option value="">Select Academic Year</option>
                {academicYears.map(year => (
                  <option key={year.academicYearId} value={year.academicYearId}>
                    {year.name}
                  </option>
                ))}
              </select>

              {/* Semester Name */}
              <label className="font-medium">Semester Name</label>
              <select
                className="border p-3 rounded-xl w-full"
                value={editing.name}
                onChange={(e) => {
                  const updatedName = e.target.value;
                  const selectedYear = academicYears.find(
                    y => y.academicYearId === editing.academicYearId
                  );
                  const shortName = updatedName.split(" ")[0];
                  const dates = getPresetDates(shortName, selectedYear);

                  setEditing({
                    ...editing,
                    name: updatedName,
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                  });
                }}
              >
                <option value="">Select Semester Name</option>
                {editing.academicYearId &&
                  semesterOptions(
                    academicYears.find(
                      y => y.academicYearId === editing.academicYearId
                    )?.name
                  ).map(option => (
                    <option
                      key={option}
                      value={option}
                      disabled={semesters.some(
                        s =>
                          s.name === option &&
                          s.academicYearId === editing.academicYearId &&
                          s.semesterId !== editing.semesterId
                      )}
                    >
                      {option}
                    </option>
                  ))}
              </select>

              {/* Start Date */}
              <label className="font-medium">Start Date</label>
              <input
                type="datetime-local"
                className="border p-3 rounded-xl w-full bg-gray-100 cursor-not-allowed"
                value={editing.startDate || ""}
                readOnly
              />

              {/* End Date */}
              <label className="font-medium">End Date</label>
              <input
                type="datetime-local"
                className="border p-3 rounded-xl w-full bg-gray-100 cursor-not-allowed"
                value={editing.endDate || ""}
                readOnly
              />

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      type: "edit",
                      semesterId: editing.semesterId,
                      callback: handleSaveEdit,
                    })
                  }
                  className={`bg-blue-500 text-white px-6 py-3 rounded-xl flex-1 transition-all duration-200 ${hasChanged(editing)
                    ? "hover:bg-blue-600 hover:opacity-90 hover:-translate-y-[1px]"
                    : "opacity-50 cursor-not-allowed"}
`}
                  disabled={!hasChanged(editing)}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-300 text-black px-6 py-3 rounded-xl hover:bg-gray-400 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List Semesters */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FFF3EB] text-[#F36F21] text-left">
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
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:opacity-90 transition-all duration-200 hover:-translate-y-[1px]"
                      >
                        Update
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
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:opacity-90 transition-all duration-200 hover:-translate-y-[1px]"
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
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2
    ${confirmModal.type === "delete"
                  ? "text-red-600"
                  : "text-[#F36F21]"}
  `}
            >
              {confirmModal.type === "delete" ? "⚠️" : "ℹ️"}
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
