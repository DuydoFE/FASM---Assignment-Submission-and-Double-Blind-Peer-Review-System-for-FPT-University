import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../service/adminService";
import { FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";

/* ================= MODAL WRAPPER ================= */
const ModalWrapper = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      {children}
    </div>
  </div>
);

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState(null);
  // { message: string, onConfirm: async function }

  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseName: "",
    isActive: true,
  });

  const [editCourse, setEditCourse] = useState({
    courseId: 0,
    courseCode: "",
    courseName: "",
    isActive: true,
  });

  /* ================= LOAD ================= */
  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await getAllCourses();
      setCourses(res?.data || []);
      setFilteredCourses(res?.data || []);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((c) =>
        c.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, courses]);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!newCourse.courseCode || !newCourse.courseName) {
      toast.error("Please fill all fields");
      return;
    }

    const id = toast.loading("Creating course...");
    try {
      await createCourse(newCourse);
      toast.success("Created successfully!", { id });
      setShowAddModal(false);
      setNewCourse({ courseCode: "", courseName: "", isActive: true });
      loadCourses();
    } catch {
      toast.error("Create failed", { id });
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = () => {
    setConfirmConfig({
      message: "Are you sure you want to update this course?",
      onConfirm: async () => {
        const id = toast.loading("Updating...");
        try {
          await updateCourse(editCourse);
          toast.success("Updated successfully!", { id });
          setShowEditModal(false);
          loadCourses();
        } catch {
          toast.error("Update failed", { id });
        }
      },
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = (courseId) => {
    setConfirmConfig({
      message: "Are you sure you want to delete this course?",
      onConfirm: async () => {
        const id = toast.loading("Deleting...");
        try {
          await deleteCourse(courseId);
          toast.success("Deleted successfully!", { id });
          loadCourses();
        } catch {
          toast.error("Delete failed", { id });
        }
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Course Management
      </h2>

      {/* ===== Search + Create ===== */}
      <div className="flex justify-between mb-4">
        <div className="relative w-80">
          <input
            className="border p-3 w-full rounded-xl pl-10"
            placeholder="Search by course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute top-4 left-3 text-gray-500" />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl"
        >
          Create Course
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-50">
            <tr>
              <th className="p-3 text-left">Course Code</th>
              <th className="p-3 text-left">Course Name</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">Loading...</td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">No data</td>
              </tr>
            ) : (
              filteredCourses.map((c) => (
                <tr key={c.courseId} className="border-b hover:bg-orange-50">
                  <td className="p-3">{c.courseCode}</td>
                  <td className="p-3">{c.courseName}</td>
                  <td className="p-3 text-center">
                    {c.isActive ? (
                      <FaCheckCircle className="text-green-600 inline" />
                    ) : (
                      <FaTimesCircle className="text-red-600 inline" />
                    )}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => {
                        setEditCourse(c);
                        setShowEditModal(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => handleDelete(c.courseId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <ModalWrapper>
          <h3 className="text-xl font-semibold mb-4">Create Course</h3>

          <input
            className="border p-3 rounded-lg w-full mb-3"
            placeholder="Course Code"
            value={newCourse.courseCode}
            onChange={(e) =>
              setNewCourse({ ...newCourse, courseCode: e.target.value })
            }
          />

          <input
            className="border p-3 rounded-lg w-full mb-3"
            placeholder="Course Name"
            value={newCourse.courseName}
            onChange={(e) =>
              setNewCourse({ ...newCourse, courseName: e.target.value })
            }
          />

          <select
            className="border p-3 rounded-lg w-full mb-4"
            value={newCourse.isActive}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                isActive: e.target.value === "true",
              })
            }
          >
            <option value="true">Active</option>
            <option value="false">Deactive</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleCreate}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <ModalWrapper>
          <h3 className="text-xl font-semibold mb-4">Update Course</h3>

          <input
            className="border p-3 rounded-lg w-full mb-3"
            value={editCourse.courseCode}
            onChange={(e) =>
              setEditCourse({ ...editCourse, courseCode: e.target.value })
            }
          />

          <input
            className="border p-3 rounded-lg w-full mb-3"
            value={editCourse.courseName}
            onChange={(e) =>
              setEditCourse({ ...editCourse, courseName: e.target.value })
            }
          />

          <select
            className="border p-3 rounded-lg w-full mb-4"
            value={editCourse.isActive}
            onChange={(e) =>
              setEditCourse({
                ...editCourse,
                isActive: e.target.value === "true",
              })
            }
          >
            <option value="true">Active</option>
            <option value="false">Deactive</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* ===== CONFIRM MODAL ===== */}
      {confirmConfig && (
        <ModalWrapper>
          <h3 className="text-xl font-semibold mb-4 text-red-600">
            Confirm Action
          </h3>

          <p className="mb-6">{confirmConfig.message}</p>

          <div className="flex justify-end gap-3">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={async () => {
                await confirmConfig.onConfirm();
                setConfirmConfig(null);
              }}
            >
              Yes
            </button>

            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              onClick={() => setConfirmConfig(null)}
            >
              Cancel
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
