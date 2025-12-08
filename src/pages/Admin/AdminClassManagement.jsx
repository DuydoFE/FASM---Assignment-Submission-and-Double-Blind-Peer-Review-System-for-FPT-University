import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
  getCourseInstancesByCampusId,
  getAllCampuses,
  getAllCourses,
  getAllSemesters,
  createCourseInstance,
  toggleCourseStatus,
  updateCourseInstance,
} from "../../service/adminService";

export default function AdminClassManagement() {
  const navigate = useNavigate();
const startDate = new Date(selectedDate).toISOString();

  const [classes, setClasses] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [filters, setFilters] = useState({
    campus: "",
    semester: "",
    course: "",
    search: "",
    status: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newClass, setNewClass] = useState({
    campusId: "",
    semesterId: "",
    courseId: "",
    sectionCode: "",
    startDate: "",
    endDate: "",
    enrollmentPassword: "",
    requiresApproval: true,
  });

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateClass, setUpdateClass] = useState({
    courseInstanceId: 0,
    courseId: "",
    semesterId: "",
    campusId: "",
    sectionCode: "",
    enrollmentPassword: "",
    requiresApproval: true,
    startDate: "",
    endDate: ""
  });

  const contextClass = {
    success: "bg-green-50 text-green-600 border border-green-200",
    error: "bg-red-50 text-red-600 border border-red-200",
    info: "bg-blue-50 text-blue-600 border border-blue-200",
    warning: "bg-orange-50 text-orange-600 border border-orange-200",
    default: "bg-white text-gray-600 border border-gray-200",
  };

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
        console.error(err);
        toast.error("Lỗi tải dữ liệu hệ thống!");
      }
    };
    fetchFiltersData();
  }, []);

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
        console.error(err);
        toast.error("Không thể tải danh sách lớp!");
      }
    };
    fetchData();
  }, [filters.campus]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleNewClassChange = (e) => {
    const { name, value } = e.target;

    setNewClass({
      ...newClass,
      [name]:
        ["courseId", "campusId", "semesterId"].includes(name)
          ? Number(value)
          : name === "requiresApproval"
            ? value === "true"
            : value,
    });
  };

  const formatToISO = (input) => {
  if (!input) return null;
  const d = new Date(input);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}T${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};



  const handleAddClass = async () => {
    const { campusId, semesterId, courseId, sectionCode, startDate, endDate } = newClass;

    if (!campusId || !semesterId || !courseId || !sectionCode.trim())
      return toast.warn("⚠ Vui lòng nhập đầy đủ thông tin!");
    if (new Date(startDate) < new Date())
      return toast.error("⛔ Start date cannot be earlier than the current time!");
    const selectedSemester = semesters.find(s => s.semesterId === Number(semesterId));
    if (selectedSemester && new Date(endDate) > new Date(selectedSemester.endDate))
      return toast.error("⛔ End date cannot be later than the semester's end date!");
    if (classes.some(c => c.sectionCode.toLowerCase() === sectionCode.toLowerCase()))
      return toast.error("⛔ Class name already exists!");
    const payload = {
  courseId: Number(newClass.courseId),
  campusId: Number(newClass.campusId),
  semesterId: newClass.semesterId, // MUST be DB ID
  sectionCode: newClass.sectionCode,
  requiresApproval: true,
  startDate: new Date(newClass.startDate).toISOString(),
  endDate: new Date(newClass.endDate).toISOString()
}

    try {
      await createCourseInstance(payload);
      toast.success("🎉 Class created successfully!");
      setShowAddForm(false);
      setNewClass({
        campusId: "",
        semesterId: "",
        courseId: "",
        sectionCode: "",
        enrollmentPassword: "",
        requiresApproval: true,
        startDate: "",
        endDate: "",
      });

      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(res.data || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Fail to create!");
    }
  };

  const handleViewDetail = (id) => navigate(`/admin/classes/${id}`);

  const displayedClasses = classes.filter((c) => {
    const matchSearch =
      c.courseName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.sectionCode?.toLowerCase().includes(filters.search.toLowerCase());

    const matchCourse = filters.course ? c.courseId === Number(filters.course) : true;
    const matchSemester = filters.semester ? c.semesterId === Number(filters.semester) : true;

    const matchStatus =
      filters.status === "active"
        ? c.isActive === true
        : filters.status === "deactive"
          ? c.isActive === false
          : true;

    return matchSearch && matchCourse && matchSemester && matchStatus;
  });

  const handleToggleStatus = async (courseInstanceId, isActive) => {
    if (!window.confirm(`Are you sure you want to set class to ${isActive ? "Deactive" : "Active"}?`)) {
      return;
    }

    try {
      await toggleCourseStatus(courseInstanceId);
      toast.success("Status updated successfully!");

      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Update status failed!";
      toast.error(msg);
    }
  };

  const handleOpenUpdateForm = (c) => {
    setUpdateClass({
      courseInstanceId: c.courseInstanceId,
      courseId: c.courseId,
      semesterId: c.semesterId,
      campusId: c.campusId,
      sectionCode: c.sectionCode || "",
      enrollmentPassword: c.enrollmentPassword || "",
      requiresApproval: true,
      startDate: toDatetimeLocal(c.startDate),
      endDate: toDatetimeLocal(c.endDate)
    });
    setShowUpdateForm(true);
  };

  const toDatetimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleUpdateClassChange = (e) => {
    setUpdateClass({ ...updateClass, [e.target.name]: e.target.value });
  };

  const handleUpdateClass = async () => {
    if (!updateClass.sectionCode.trim()) {
      toast.warn("Please enter the class name.");
      return;
    }

    try {
      const requestPayload = {
  ...updateClass,
  courseInstanceId: Number(updateClass.courseInstanceId),
  courseId: Number(updateClass.courseId),
  campusId: Number(updateClass.campusId),
  semesterId: Number(updateClass.semesterId),
  startDate: formatToISO(updateClass.startDate),
  endDate: formatToISO(updateClass.endDate),
};

      await updateCourseInstance(requestPayload);
      toast.success("Class updated successfully!");
      setShowUpdateForm(false);

      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Class update failed!";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 p-6 relative">

      <ToastContainer
        toastClassName={({ type }) =>
          `${contextClass[type || "default"]
          } relative flex p-3 min-h-[50px] rounded-lg justify-between overflow-hidden cursor-pointer shadow-lg mb-4 transform transition-all hover:scale-105 font-medium`
        }
        bodyClassName={() => "flex items-center text-sm px-2"}
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        closeButton={false}
      />

      <h2 className="text-3xl font-bold text-orange-500 mb-4">🏫 Class Management</h2>

      <div className="bg-white p-5 rounded-2xl shadow-md flex flex-wrap gap-4 items-center">
        <select
          name="campus"
          value={filters.campus}
          onChange={handleFilterChange}
          className="border rounded-lg p-3 text-gray-700 hover:border-orange-400 transition flex-1 min-w-[150px]"
        >
          <option value="">Select Campus</option>
          {campuses.map((c) => (
            <option key={c.campusId} value={c.campusId}>{c.name || c.campusName}</option>
          ))}
        </select>

        <select name="semester" value={filters.semester} onChange={handleFilterChange} className="border rounded-lg p-3 text-gray-700 hover:border-orange-400 transition flex-1 min-w-[150px]">
          <option value="">All Semesters</option>
          {semesters.map((s) => (<option key={s.semesterId} value={s.semesterId}>{s.name || s.semesterName}</option>))}
        </select>
        <select name="course" value={filters.course} onChange={handleFilterChange} className="border rounded-lg p-3 text-gray-700 hover:border-orange-400 transition flex-1 min-w-[150px]">
          <option value="">All Courses</option>
          {courses.map((course) => (<option key={course.courseId} value={course.courseId}>{course.name || course.courseName}</option>))}
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded-lg p-3 text-gray-700 hover:border-orange-400 transition flex-1 min-w-[150px]"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
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

      {showAddForm && (
        <div className="bg-white p-5 rounded-2xl shadow-md mt-4 space-y-4 animate-fade-in-down">
          <h3 className="text-xl font-semibold text-gray-700">Create New Class</h3>
          <div className="flex flex-wrap gap-4">
            <select name="campusId" value={newClass.campusId} onChange={handleNewClassChange} className="border rounded-lg p-3 flex-1 min-w-[150px]">
              <option value="">Select Campus</option>
              {campuses.map((c) => (<option key={c.campusId} value={c.campusId}>{c.name || c.campusName}</option>))}
            </select>
            <select onChange={(e) => setNewClass({...newClass, semesterId: e.target.value})}>
  {semesters.map(s => (
    <option key={s.id} value={s.id}>{s.name}</option>
  ))}
</select>

            <select name="courseId" value={newClass.courseId || ""} onChange={handleNewClassChange} className="border rounded-lg p-3 flex-1 min-w-[150px]">
              <option value="">Select Course</option>
              {courses.map((course) => (<option key={course.courseId} value={course.courseId}>{course.name || course.courseName}</option>))}
            </select>
            <input type="text" name="sectionCode" value={newClass.sectionCode} onChange={handleNewClassChange} placeholder="ClassName" className="border rounded-lg p-3 flex-1 min-w-[150px]" />
            <input
              type="datetime-local"
              name="startDate"
              value={newClass.startDate}
              min={(() => {
                const now = new Date().toISOString().slice(0, 16);
                const selectedSemester = semesters.find(s => s.semesterId === Number(newClass.semesterId));
                const semesterStart = selectedSemester ? new Date(selectedSemester.startDate).toISOString().slice(0, 16) : now;

                return semesterStart > now ? semesterStart : now;
              })()}
              max={(() => {
                const selectedSemester = semesters.find(s => s.semesterId === Number(newClass.semesterId));
                return selectedSemester ? new Date(selectedSemester.endDate).toISOString().slice(0, 16) : "";
              })()}
              onChange={handleNewClassChange}
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
            />
            <input
              type="datetime-local"
              name="endDate"
              value={newClass.endDate}
              min={newClass.startDate ? newClass.startDate : (() => {
                const selectedSemester = semesters.find(s => s.semesterId === Number(newClass.semesterId));
                return selectedSemester ? new Date(selectedSemester.startDate).toISOString().slice(0, 16) : "";
              })()}
              max={(() => {
                const selectedSemester = semesters.find(s => s.semesterId === Number(newClass.semesterId));
                return selectedSemester ? new Date(selectedSemester.endDate).toISOString().slice(0, 16) : "";
              })()}
              onChange={handleNewClassChange}
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
            />
          </div>

          <div className="flex gap-4">
            <button onClick={handleAddClass} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow-sm">
              Create
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-semibold">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showUpdateForm && (
        <div className="bg-white p-5 rounded-2xl shadow-md mt-4 space-y-4 animate-fade-in-down">
          <h3 className="text-xl font-semibold text-gray-700">Update Class</h3>
          <div className="flex flex-wrap gap-4">
            <select name="campusId" value={updateClass.campusId} onChange={handleUpdateClassChange} className="border rounded-lg p-3 flex-1 min-w-[150px]">
              <option value="">Select Campus</option>
              {campuses.map(c => <option key={c.campusId} value={c.campusId}>{c.name || c.campusName}</option>)}
            </select>

            <select name="semesterId" value={updateClass.semesterId} onChange={handleUpdateClassChange} className="border rounded-lg p-3 flex-1 min-w-[150px]">
              <option value="">Select Semester</option>
              {semesters.map(s => <option key={s.semesterId} value={s.semesterId}>{s.name || s.semesterName}</option>)}
            </select>

            <select name="courseId" value={updateClass.courseId} onChange={handleUpdateClassChange} className="border rounded-lg p-3 flex-1 min-w-[150px]">
              <option value="">Select Course</option>
              {courses.map(course => <option key={course.courseId} value={course.courseId}>{course.name || course.courseName}</option>)}
            </select>

            <input type="text" name="sectionCode" value={updateClass.sectionCode} onChange={handleUpdateClassChange} placeholder="Class Name" className="border rounded-lg p-3 flex-1 min-w-[150px]" />
            <input
              type="datetime-local"
              name="startDate"
              value={updateClass.startDate}
              onChange={handleUpdateClassChange}
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
              placeholder="Start Date"
            />
            <input
              type="datetime-local"
              name="endDate"
              value={updateClass.endDate}
              onChange={handleUpdateClassChange}
              className="border rounded-lg p-3 flex-1 min-w-[150px]"
              placeholder="End Date"
            />
          </div>

          <div className="flex gap-4">
            <button onClick={handleUpdateClass} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow-sm">
              Update
            </button>
            <button onClick={() => setShowUpdateForm(false)} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-semibold">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- TABLE --- */}
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
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedClasses.map((c) => {
                  const formatDate = (dateStr) => {
                    if (!dateStr || dateStr.startsWith("0001")) return "-";
                    return new Date(dateStr).toLocaleDateString("en-GB");
                  };

                  return (
                    <tr key={c.courseInstanceId} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-medium text-gray-800">{c.sectionCode || c.courseName}</td>
                      <td className="p-3">{c.courseName}</td>
                      <td className="p-3">{c.semesterName}</td>
                      <td className="p-3">{c.campusName}</td>
                      <td className="p-3">{c.studentCount}</td>
                      <td className="p-3">{c.assignmentCount}</td>
                      <td className="p-3">{formatDate(c.startDate)}</td>
                      <td className="p-3">{formatDate(c.endDate)}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${c.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {c.isActive ? "Active" : "Deactive"}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          disabled={c.isActive}
                          className={`font-semibold mr-2 ${c.isActive
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-green-500 hover:text-green-700"
                            }`}
                          onClick={() => !c.isActive && handleOpenUpdateForm(c)}
                        >
                          Update
                        </button>
                        <button
                          className="text-orange-500 hover:text-orange-700 font-semibold"
                          onClick={() => handleViewDetail(c.courseInstanceId)}
                        >
                          View Detail
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                          onClick={() => handleToggleStatus(c.courseInstanceId, c.isActive)}
                        >
                          {c.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (<p className="p-6 text-center text-gray-500 font-medium">No classes found</p>)
        ) : (<p className="p-6 text-center text-gray-500 font-medium">Please select a campus first</p>)}
      </div>
    </div>
  );
}
