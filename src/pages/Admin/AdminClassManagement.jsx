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

  const [classes, setClasses] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmState({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmState({
      open: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

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

  const [originalUpdateClass, setOriginalUpdateClass] = useState(null);

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

  useEffect(() => {
    document.body.style.overflow =
      showAddForm || showUpdateForm ? "hidden" : "auto";
  }, [showAddForm, showUpdateForm]);

  useEffect(() => {
    document.body.style.overflow =
      showAddForm || showUpdateForm || confirmState.open
        ? "hidden"
        : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAddForm, showUpdateForm, confirmState.open]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toDatetimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const pad = (n) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const toISOWithLocalTime = (localDatetime) => {
    const date = new Date(localDatetime);
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  };

  const handleNewClassChange = (e) => {
    const { name, value } = e.target;

    // If semester is changed, auto-populate start and end dates from semester
    if (name === "semesterId" && value) {
      const selectedSemester = semesters.find(s => s.semesterId === Number(value));
      if (selectedSemester && selectedSemester.startDate && selectedSemester.endDate) {
        setNewClass({
          ...newClass,
          [name]: value,
          startDate: toDatetimeLocal(selectedSemester.startDate),
          endDate: toDatetimeLocal(selectedSemester.endDate)
        });
        return;
      }
    }

    setNewClass({ ...newClass, [name]: value });
  };

  const handleAddClass = async () => {
    const { campusId, semesterId, courseId, sectionCode, startDate, endDate } = newClass;

    if (!campusId || !semesterId || !courseId || !sectionCode.trim()) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!startDate || !endDate) {
      toast.warn("Vui lòng chọn ngày bắt đầu và kết thúc!");
      return;
    }

    // Validate dates are within semester range
    const selectedSemester = semesters.find(s => s.semesterId === Number(semesterId));
    if (selectedSemester) {
      const semesterStart = new Date(selectedSemester.startDate);
      const semesterEnd = new Date(selectedSemester.endDate);
      const classStart = new Date(startDate);
      const classEnd = new Date(endDate);

      if (classStart < semesterStart) {
        toast.error(`Ngày bắt đầu không thể trước ngày bắt đầu học kỳ (${semesterStart.toLocaleDateString('en-GB')})!`);
        return;
      }
      if (classEnd > semesterEnd) {
        toast.error(`Ngày kết thúc không thể sau ngày kết thúc học kỳ (${semesterEnd.toLocaleDateString('en-GB')})!`);
        return;
      }
    }

    const payload = {
      courseId: Number(courseId),
      campusId: Number(campusId),
      semesterId: Number(semesterId),
      sectionCode: sectionCode.trim(),
      requiresApproval: true,
      startDate: toISOWithLocalTime(startDate),
      endDate: toISOWithLocalTime(endDate),
      enrollmentPassword: ""
    };

    try {
      await createCourseInstance(payload);
      toast.success("Tạo lớp thành công!");
      setShowAddForm(false);
      setNewClass({ campusId: "", semesterId: "", courseId: "", sectionCode: "", startDate: "", endDate: "" });

      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Tạo lớp thất bại!");
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

  const handleToggleStatus = (courseInstanceId, isActive) => {
    openConfirm({
      title: isActive ? "Deactivate Class" : "Activate Class",
      message: `Are you sure you want to ${isActive ? "deactivate" : "activate"} this class?`,
      onConfirm: async () => {
        try {
          await toggleCourseStatus(courseInstanceId);
          toast.success("Status updated successfully!");

          if (filters.campus) {
            const res = await getCourseInstancesByCampusId(Number(filters.campus));
            setClasses(Array.isArray(res?.data) ? res.data : []);
          }
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Update status failed!");
        }
      },
    });
  };

  const handleOpenUpdateForm = (c) => {
    const mappedData = {
      courseInstanceId: c.courseInstanceId,
      courseId: c.courseId,
      semesterId: c.semesterId,
      campusId: c.campusId,
      sectionCode: c.sectionCode || "",
      enrollmentPassword: c.enrollmentPassword || "",
      requiresApproval: true,
      startDate: toDatetimeLocal(c.startDate),
      endDate: toDatetimeLocal(c.endDate)
    };

    setUpdateClass(mappedData);
    setOriginalUpdateClass(mappedData);
    setShowUpdateForm(true);
  };

  const isUpdateChanged = () => {
    if (!originalUpdateClass) return false;

    return (
      originalUpdateClass.courseId !== updateClass.courseId ||
      originalUpdateClass.semesterId !== updateClass.semesterId ||
      originalUpdateClass.campusId !== updateClass.campusId ||
      originalUpdateClass.sectionCode !== updateClass.sectionCode ||
      originalUpdateClass.startDate !== updateClass.startDate ||
      originalUpdateClass.endDate !== updateClass.endDate
    );
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
        startDate: new Date(updateClass.startDate).toISOString(),
        endDate: new Date(updateClass.endDate).toISOString(),
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

  // Get semester date constraints for date inputs
  const getDateConstraints = (semesterId) => {
    const selectedSemester = semesters.find(s => s.semesterId === Number(semesterId));
    if (!selectedSemester) return { min: "", max: "" };
    return {
      min: toDatetimeLocal(selectedSemester.startDate),
      max: toDatetimeLocal(selectedSemester.endDate)
    };
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
          {courses.map((course) => (<option key={course.courseId} value={course.courseId}>{course.courseCode}</option>))}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddForm(false)}
          />

          <div className="relative bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in-down">
            <h3 className="text-xl font-semibold text-gray-700">Create New Class</h3>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Campus
                </label>
                <select
                  name="campusId"
                  value={newClass.campusId}
                  onChange={handleNewClassChange}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="">Select Campus</option>
                  {campuses.map(c => (
                    <option key={c.campusId} value={c.campusId}>
                      {c.name || c.campusName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Semester
                </label>
                <select
                  name="semesterId"
                  value={newClass.semesterId}
                  onChange={handleNewClassChange}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="">Select Semester</option>
                  {semesters.map(s => (
                    <option key={s.semesterId} value={s.semesterId}>
                      {s.name || s.semesterName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Course
                </label>
                <select
                  name="courseId"
                  value={newClass.courseId}
                  onChange={handleNewClassChange}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="">Select Course</option>
                  {courses.filter(c => c.isActive).map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  name="sectionCode"
                  value={newClass.sectionCode}
                  onChange={handleNewClassChange}
                  className="border rounded-lg p-3 w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={newClass.startDate}
                  onChange={handleNewClassChange}
                  min={getDateConstraints(newClass.semesterId).min}
                  max={getDateConstraints(newClass.semesterId).max}
                  disabled={!newClass.semesterId}
                  className="border rounded-lg p-3 w-full"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={newClass.endDate}
                  onChange={handleNewClassChange}
                  min={getDateConstraints(newClass.semesterId).min}
                  max={getDateConstraints(newClass.semesterId).max}
                  disabled={!newClass.semesterId}
                  className="border rounded-lg p-3 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  openConfirm({
                    title: "Create Class",
                    message: "Are you sure you want to create this class?",
                    onConfirm: handleAddClass,
                  })
                }
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold shadow"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowUpdateForm(false)}
          />

          <div className="relative bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in-down">
            <h3 className="text-xl font-semibold text-gray-700">Update Class</h3>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Campus
                </label>
                <select
                  name="campusId"
                  value={updateClass.campusId}
                  onChange={handleUpdateClassChange}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="">Select Campus</option>
                  {campuses.map(c => (
                    <option key={c.campusId} value={c.campusId}>
                      {c.name || c.campusName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Semester
                </label>
                <select
                  name="semesterId"
                  value={updateClass.semesterId}
                  onChange={handleUpdateClassChange}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="">Select Semester</option>
                  {semesters.map(s => (
                    <option key={s.semesterId} value={s.semesterId}>
                      {s.name || s.semesterName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Course
                </label>
                <select
                  name="courseId"
                  value={updateClass.courseId}
                  onChange={handleUpdateClassChange}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="">Select Course</option>
                  {courses.filter(c => c.isActive).map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  name="sectionCode"
                  value={updateClass.sectionCode}
                  onChange={handleUpdateClassChange}
                  className="border rounded-lg p-3 w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={updateClass.startDate}
                  onChange={handleUpdateClassChange}
                  className="border rounded-lg p-3 w-full"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={updateClass.endDate}
                  onChange={handleUpdateClassChange}
                  className="border rounded-lg p-3 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={() => setShowUpdateForm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={!isUpdateChanged()}
                onClick={() =>
                  openConfirm({
                    title: "Update Class",
                    message: "Are you sure you want to update this class?",
                    onConfirm: handleUpdateClass,
                  })
                }
                className={`px-6 py-2 rounded-lg font-semibold shadow transition
    ${!isUpdateChanged()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                  }`}
              >
                Update
              </button>
            </div>
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
                      <td className="p-3">{c.courseCode}</td>
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
                        <div className="flex flex-wrap gap-2">
                          <button
                            disabled={c.isActive}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${c.isActive
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                              }`}
                            onClick={() => !c.isActive && handleOpenUpdateForm(c)}
                          >
                            ✏️ Update
                          </button>
                          <button
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 transition-all"
                            onClick={() => handleViewDetail(c.courseInstanceId)}
                          >
                            👁️ View
                          </button>
                          <button
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${c.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                              }`}
                            onClick={() => handleToggleStatus(c.courseInstanceId, c.isActive)}
                          >
                            {c.isActive ? "🔒 Deactivate" : "🔓 Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (<p className="p-6 text-center text-gray-500 font-medium">No classes found</p>)
        ) : (<p className="p-6 text-center text-gray-500 font-medium">Please select a campus first</p>)}
      </div>
      {confirmState.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeConfirm}
          />

          {/* Modal */}
          <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in-down">
            <h3 className="text-lg font-semibold text-gray-800">
              {confirmState.title || "Confirm"}
            </h3>

            <p className="text-gray-600">
              {confirmState.message}
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmState.onConfirm?.();
                  closeConfirm();
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold shadow"
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