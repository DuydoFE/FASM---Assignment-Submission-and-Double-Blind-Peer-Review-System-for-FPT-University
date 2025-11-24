import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCourseInstancesByCampusId,
  getAllCampuses,
  getAllCourses,
  getAllSemesters,
  createCourseInstance,
} from "../../service/adminService";
import toast from "react-hot-toast";

export default function AdminClassManagement() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [filters, setFilters] = useState({
    campus: "",
    semester: "",
    course: "",
    search: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newClass, setNewClass] = useState({
    campusId: "",
    semesterId: "",
    courseId: "",
    sectionCode: "",
  });

  // Lấy dữ liệu filter: campuses, semesters, courses
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const campusesRes = await getAllCampuses();
        setCampuses(Array.isArray(campusesRes?.data) ? campusesRes.data : []);

        const semestersRes = await getAllSemesters();
        setSemesters(Array.isArray(semestersRes?.data) ? semestersRes.data : []);

        const coursesRes = await getAllCourses();
        setCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      } catch (err) {
        console.error("❌ Fetch filter data error:", err);
        toast.error("Failed to load campuses, semesters, or courses");
      }
    };
    fetchFiltersData();
  }, []);

  // Lấy danh sách lớp theo campus
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!filters.campus) {
          setClasses([]);
          return;
        }
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Fetch classes error:", err);
        toast.error("Failed to load classes");
      }
    };
    fetchData();
  }, [filters.campus]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleNewClassChange = (e) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleAddClass = async () => {
    if (!newClass.campusId || !newClass.semesterId || !newClass.courseId || !newClass.sectionCode.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const requestPayload = {
        courseId: Number(newClass.courseId),
        campusId: Number(newClass.campusId),
        semesterId: Number(newClass.semesterId),
        sectionCode: newClass.sectionCode.trim(),
        enrollmentPassword: "", // gửi chuỗi rỗng nếu không dùng
        requiresApproval: true,
      };

      await createCourseInstance(requestPayload);
      toast.success("Class created successfully");

      setShowAddForm(false);
      setNewClass({ campusId: "", semesterId: "", courseId: "", sectionCode: "" });

      // refresh danh sách lớp
      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      console.error("❌ Create class error details:", err.response?.data || err);
      toast.error("Failed to create class");
    }
  };

  const handleViewDetail = (id) => navigate(`/admin/classes/${id}`);

  const displayedClasses = classes.filter((c) => {
    const matchSearch =
      c.courseName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.sectionCode?.toLowerCase().includes(filters.search.toLowerCase());
    const matchCourse = filters.course ? c.courseId === Number(filters.course) : true;
    const matchSemester = filters.semester ? c.semesterId === Number(filters.semester) : true;
    return matchSearch && matchCourse && matchSemester;
  });

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-orange-500 mb-4">🏫 Class Management</h2>

      {/* Filter & Actions */}
      <div className="bg-white p-5 rounded-2xl shadow-md flex flex-wrap gap-4 items-center">
        <select
          name="campus"
          value={filters.campus}
          onChange={handleFilterChange}
          className="border rounded-lg p-3 text-gray-700 hover:border-orange-400 transition flex-1 min-w-[150px]"
        >
          <option value="">Select Campus</option>
          {campuses.map((c) => (
            <option key={c.campusId} value={c.campusId}>
              {c.name || c.campusName}
            </option>
          ))}
        </select>

        <select
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="border rounded-lg p-3 text-gray-700 hover:border-orange-400 transition flex-1 min-w-[150px]"
        >
          <option value="">All Semesters</option>
          {semesters.map((s) => (
            <option key={s.semesterId} value={s.semesterId}>
              {s.name || s.semesterName}
            </option>
          ))}
        </select>

        <select
          name="course"
          value={filters.course}
          onChange={handleFilterChange}
          className="border rounded-lg p-3 text-gray-700 hover:border-orange-400 transition flex-1 min-w-[150px]"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.name || course.courseName}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search class name..."
          className="border rounded-lg p-3 flex-1 min-w-[200px] focus:outline-orange-400"
        />

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 transition"
        >
          + Add Class
        </button>
      </div>

      {/* Add Class Form */}
      {showAddForm && (
        <div className="bg-white p-5 rounded-2xl shadow-md mt-4 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Create New Class</h3>
          <div className="flex flex-wrap gap-4">
            <select
              name="campusId"
              value={newClass.campusId}
              onChange={handleNewClassChange}
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
            >
              <option value="">Select Campus</option>
              {campuses.map((c) => (
                <option key={c.campusId} value={c.campusId}>
                  {c.name || c.campusName}
                </option>
              ))}
            </select>

            <select
              name="semesterId"
              value={newClass.semesterId}
              onChange={handleNewClassChange}
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s.semesterId} value={s.semesterId}>
                  {s.name || s.semesterName}
                </option>
              ))}
            </select>

            <select
              name="courseId"
              value={newClass.courseId || ""}
              onChange={handleNewClassChange}
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.name || course.courseName}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="sectionCode"
              value={newClass.sectionCode}
              onChange={handleNewClassChange}
              placeholder="Section Code"
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddClass}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Create
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        {filters.campus ? (
          displayedClasses.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-orange-500 text-white text-left">
                <tr>
                  <th className="p-3">Class Name</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Campus</th>
                  <th className="p-3">Students</th>
                  <th className="p-3">Assignments</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedClasses.map((c) => (
                  <tr key={c.courseInstanceId} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-medium">{c.sectionCode || c.courseName}</td>
                    <td className="p-3">{c.courseName}</td>
                    <td className="p-3">{c.semesterName}</td>
                    <td className="p-3">{c.campusName}</td>
                    <td className="p-3">{c.studentCount}</td>
                    <td className="p-3">{c.assignmentCount}</td>
                    <td className="p-3">
                      <button
                        className="text-orange-500 hover:underline font-semibold"
                        onClick={() => handleViewDetail(c.courseInstanceId)}
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-gray-500 font-medium">No classes found</p>
          )
        ) : (
          <p className="p-6 text-center text-gray-500 font-medium">Please select a campus first</p>
        )}
      </div>
    </div>
  );
}
