import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../service/adminService";
import { FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses();
      if (response?.data) {
        setCourses(response.data);
        setFilteredCourses(response.data);
      } else {
        toast.error("Failed to load courses");
      }
    } catch (err) {
      toast.error("Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((c) =>
      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleCreateCourse = async () => {
    if (!newCourse.courseCode || !newCourse.courseName) {
      toast.error("Please fill all fields");
      return;
    }

    const toastId = toast.loading("Creating course...");

    try {
      await createCourse(newCourse);
      toast.success("Course created successfully!", { id: toastId });
      setShowAddForm(false);
      setNewCourse({ courseCode: "", courseName: "", isActive: true });
      loadCourses();
    } catch (err) {
      toast.error("Failed to create course", { id: toastId });
    }
  };

  const openEditForm = (course) => {
    setEditCourse({ ...course });
    setShowEditForm(true);
  };

  const handleUpdateCourse = async () => {
    toast(
      (t) => (
        <div>
          <p className="font-semibold">Are you sure you want to make this change?</p>
          <div className="flex gap-3 mt-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Updating course...");

                try {
                  await updateCourse(editCourse);
                  toast.success("Updated successfully!", { id: toastId });
                  setShowEditForm(false);
                  loadCourses();
                } catch (err) {
                  toast.error("Failed to update", { id: toastId });
                }
              }}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };
  const handleDelete = async (courseId) => {
    toast(
      (t) => (
        <div>
          <p className="font-semibold">Are you sure you want to delete?</p>
          <div className="flex gap-3 mt-3">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Deleting course...");

                try {
                  await deleteCourse(courseId);
                  toast.success("Deleted successfully!", { id: toastId });
                  loadCourses();
                } catch (error) {
                  toast.error("Failed to delete", { id: toastId });
                }
              }}
            >
              Yes
            </button>

            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Course Management
      </h2>

      {/* ------- Search + Create ------- */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search by course code..."
            className="border border-gray-300 p-3 w-full rounded-xl pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute top-4 left-3 text-gray-500" />
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-sm"
        >
          Create Course
        </button>
      </div>

      {/* ------- Create Form ------- */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded-xl bg-orange-50">
          <h3 className="text-xl font-semibold mb-3 text-orange-700">
            Create New Course
          </h3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Course Code"
              className="border p-3 rounded-lg"
              value={newCourse.courseCode}
              onChange={(e) =>
                setNewCourse({ ...newCourse, courseCode: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Course Name"
              className="border p-3 rounded-lg"
              value={newCourse.courseName}
              onChange={(e) =>
                setNewCourse({ ...newCourse, courseName: e.target.value })
              }
            />

            <select
              className="border p-3 rounded-lg"
              value={newCourse.isActive}
              onChange={(e) =>
                setNewCourse({ ...newCourse, isActive: e.target.value === "true" })
              }
            >
              <option value="true">Active</option>
              <option value="false">Deactive</option>
            </select>

            <div className="flex gap-3 mt-2">
              <button
                className="px-5 py-2 bg-green-600 text-white rounded-lg"
                onClick={handleCreateCourse}
              >
                Save
              </button>

              <button
                className="px-5 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------- Edit Form ------- */}
      {showEditForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded-xl bg-blue-50">
          <h3 className="text-xl font-semibold mb-3 text-blue-700">
            Update Course
          </h3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              className="border p-3 rounded-lg"
              value={editCourse.courseCode}
              onChange={(e) =>
                setEditCourse({ ...editCourse, courseCode: e.target.value })
              }
            />

            <input
              type="text"
              className="border p-3 rounded-lg"
              value={editCourse.courseName}
              onChange={(e) =>
                setEditCourse({ ...editCourse, courseName: e.target.value })
              }
            />

            <select
              className="border p-3 rounded-lg"
              value={editCourse.isActive}
              onChange={(e) =>
                setEditCourse({ ...editCourse, isActive: e.target.value === "true" })
              }
            >
              <option value="true">Active</option>
              <option value="false">Deactive</option>
            </select>

            <div className="flex gap-3 mt-2">
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleUpdateCourse}
              >
                Save
              </button>

              <button
                className="px-5 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------- Table ------- */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50 text-left">
              <th className="p-3 border-b font-semibold text-gray-700 w-40">Course Code</th>
              <th className="p-3 border-b font-semibold text-gray-700">Course Name</th>
              <th className="p-3 border-b font-semibold text-gray-700 w-20">Status</th>
              <th className="p-3 border-b font-semibold text-gray-700 w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No courses found
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.courseId} className="border-b hover:bg-orange-50 transition">
                  <td className="p-3">{course.courseCode}</td>
                  <td className="p-3">{course.courseName}</td>
                  <td className="p-3">
                    {course.isActive ? (
                      <FaCheckCircle className="text-green-600 text-xl" />
                    ) : (
                      <FaTimesCircle className="text-red-600 text-xl" />
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditForm(course)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(course.courseId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
    </div>
  );
}
