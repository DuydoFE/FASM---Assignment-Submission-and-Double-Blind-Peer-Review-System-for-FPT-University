import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageClass = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // Filters
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const [years, setYears] = useState(["2025"]); // mặc định 1 năm
  const [semesters, setSemesters] = useState(["Spring2025", "Fall2025"]); // demo
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fake data: 2 lớp
    const demoClasses = [
      {
        id: 1,
        className: "IT Class 101",
        subject: "Software Engineering",
        teacher: "Dr. Alice",
        year: "2025",
        semester: "Spring2025",
        major: "IT",
        students: Array.from({ length: 5 }, (_, i) => ({
          name: `IT Student ${i + 1}`,
          avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
          studentId: `IT00${i + 1}`,
          gender: i % 2 === 0 ? "Male" : "Female",
          major: "IT",
          email: `itstudent${i + 1}@university.edu`,
          role: "Student",
        })),
        teachers: [
          { name: "Dr. Alice", email: "alice@university.edu", role: "Teacher" },
        ],
      },
      {
        id: 2,
        className: "Economics Class 201",
        subject: "Microeconomics",
        teacher: "Prof. Bob",
        year: "2025",
        semester: "Fall2025",
        major: "Economics",
        students: Array.from({ length: 5 }, (_, i) => ({
          name: `Eco Student ${i + 1}`,
          avatar: `https://i.pravatar.cc/40?img=${i + 20}`,
          studentId: `ECO00${i + 1}`,
          gender: i % 2 === 0 ? "Male" : "Female",
          major: "Economics",
          email: `ecostudent${i + 1}@university.edu`,
          role: "Student",
        })),
        teachers: [
          { name: "Prof. Bob", email: "bob@university.edu", role: "Teacher" },
        ],
      },
    ];
    setClasses(demoClasses);
  }, []);

  const handleViewClass = (cls) => {
    setSelectedClass(cls);
  };

  const handleDeleteStudent = (studentId) => {
    setSelectedClass((prev) => ({
      ...prev,
      students: prev.students.filter((stu) => stu.studentId !== studentId),
    }));
  };

  const handleEditStudent = (studentId) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    setSelectedClass((prev) => ({
      ...prev,
      students: prev.students.map((stu) =>
        stu.studentId === studentId ? { ...stu, name: newName } : stu
      ),
    }));
  };

  // Create semester
  const handleCreateSemester = () => {
    const year = prompt("Enter year (e.g. 2025):");
    if (!year) return;
    const season = prompt("Enter season (Spring/Summer/Fall):");
    if (!season) return;

    const semesterName = `${season}${year}`;
    if (!semesters.includes(semesterName)) {
      setSemesters([...semesters, semesterName]);
    }
    if (!years.includes(year)) {
      setYears([...years, year]);
    }
  };

  // Create class
  const handleCreateClass = () => {
    let major = majorFilter;
    let subject = subjectFilter;

    if (!major) {
      major = prompt("Enter Major (e.g. IT, Economics):");
      if (!major) return;
      setMajorFilter(major);
    }
    if (!subject) {
      subject = prompt("Enter Subject name:");
      if (!subject) return;
      setSubjectFilter(subject);
    }

    const className = prompt("Enter new class name:");
    if (!className) return;

    const newClass = {
      id: classes.length + 1,
      className,
      subject,
      teacher: "",
      year: yearFilter,
      semester: semesterFilter,
      major,
      students: [],
      teachers: [],
    };
    setClasses([...classes, newClass]);
  };

  // Import students (demo)
  const handleImportStudents = () => {
    alert("Import student file feature coming soon! (demo only)");
  };

  // Add student manually
  const handleAddStudent = () => {
    const name = prompt("Enter student name:");
    if (!name) return;
    const studentId = `STU${Math.floor(Math.random() * 1000)}`;
    const newStudent = {
      name,
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
      studentId,
      gender: "Male",
      major: selectedClass.major,
      email: `${name.toLowerCase().replace(" ", ".")}@university.edu`,
      role: "Student",
    };
    setSelectedClass((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const thStyle = {
    padding: "10px",
    background: "#FF9800",
    color: "#fff",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
  };

  // Filter flow
  const filteredClasses = classes.filter((cls) => {
    return (
      (yearFilter ? cls.year === yearFilter : true) &&
      (semesterFilter ? cls.semester === semesterFilter : true) &&
      (majorFilter ? cls.major === majorFilter : true) &&
      (subjectFilter ? cls.subject === subjectFilter : true)
    );
  });

  const availableSubjects = [
    ...new Set(
      classes
        .filter(
          (c) =>
            (!yearFilter || c.year === yearFilter) &&
            (!semesterFilter || c.semester === semesterFilter) &&
            (!majorFilter || c.major === majorFilter)
        )
        .map((c) => c.subject)
    ),
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#FF9800",
          color: "#fff",
          padding: "15px 30px",
          borderRadius: "8px",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <h2>📋 Manage Classes</h2>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            AdminUser ▼
          </button>
          {showMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                background: "#fff",
                color: "#333",
                borderRadius: "6px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                padding: "10px",
                minWidth: "150px",
                zIndex: 2000,
              }}
            >
              <div style={{ padding: "8px", cursor: "pointer" }}>Settings</div>
              <div style={{ padding: "8px", cursor: "pointer", color: "red" }}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setSemesterFilter("");
            setMajorFilter("");
            setSubjectFilter("");
            setSelectedClass(null);
          }}
          style={{ padding: "10px", borderRadius: "6px" }}
        >
          <option value="">Filter by Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {yearFilter && (
          <select
            value={semesterFilter}
            onChange={(e) => {
              setSemesterFilter(e.target.value);
              setMajorFilter("");
              setSubjectFilter("");
              setSelectedClass(null);
            }}
            style={{ padding: "10px", borderRadius: "6px" }}
          >
            <option value="">Filter by Semester</option>
            {semesters
              .filter((s) => s.includes(yearFilter))
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        )}

        {semesterFilter && (
          <select
            value={majorFilter}
            onChange={(e) => {
              setMajorFilter(e.target.value);
              setSubjectFilter("");
              setSelectedClass(null);
            }}
            style={{ padding: "10px", borderRadius: "6px" }}
          >
            <option value="">Filter by Major</option>
            <option value="IT">IT</option>
            <option value="Economics">Economics</option>
          </select>
        )}

        {majorFilter && (
          <select
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setSelectedClass(null);
            }}
            style={{ padding: "10px", borderRadius: "6px" }}
          >
            <option value="">Filter by Subject</option>
            {availableSubjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleCreateSemester}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Create Semester
        </button>

        {(semesterFilter && filteredClasses.length === 0 && !subjectFilter) ||
          (subjectFilter && (
            <button
              onClick={handleCreateClass}
              style={{
                padding: "10px 20px",
                background: "#2196F3",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Create Class
            </button>
          ))}
      </div>

      {/* Table lớp */}
      {yearFilter && semesterFilter && majorFilter && subjectFilter && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Class Name</th>
              <th style={thStyle}>Subject</th>
              <th style={thStyle}>Teacher</th>
              <th style={thStyle}>Semester</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((cls) => (
              <tr
                key={cls.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleViewClass(cls)}
              >
                <td style={tdStyle}>{cls.className}</td>
                <td style={tdStyle}>{cls.subject}</td>
                <td style={tdStyle}>{cls.teacher}</td>
                <td style={tdStyle}>{cls.semester}</td>
                <td style={tdStyle}>
                  <button
                    style={{
                      padding: "5px 10px",
                      background: "#2196F3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/view-assignment/${cls.id}`);
                    }}
                  >
                    View Assignments
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Class details */}
      {selectedClass && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#FF9800" }}>
            Class Details: {selectedClass.className}
          </h3>

          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={handleImportStudents}
              style={{
                padding: "8px 15px",
                marginRight: "10px",
                background: "#673AB7",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Import Students
            </button>
            <button
              onClick={handleAddStudent}
              style={{
                padding: "8px 15px",
                background: "#009688",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Add Student
            </button>
          </div>

          {/* Students */}
          <h4>Students</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Avatar</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Student ID</th>
                <th style={thStyle}>Gender</th>
                <th style={thStyle}>Major</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedClass.students.map((stu) => (
                <tr key={stu.studentId}>
                  <td style={tdStyle}>
                    <img
                      src={stu.avatar}
                      alt={stu.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td style={tdStyle}>{stu.name}</td>
                  <td style={tdStyle}>{stu.studentId}</td>
                  <td style={tdStyle}>{stu.gender}</td>
                  <td style={tdStyle}>{stu.major}</td>
                  <td style={tdStyle}>{stu.email}</td>
                  <td style={tdStyle}>{stu.role}</td>
                  <td style={tdStyle}>
                    <button
                      style={{
                        padding: "5px 10px",
                        marginRight: "5px",
                        background: "#FFC107",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEditStudent(stu.studentId)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: "5px 10px",
                        background: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteStudent(stu.studentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Teachers */}
          <h4>Teachers</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
              </tr>
            </thead>
            <tbody>
              {selectedClass.teachers.map((t, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{t.name}</td>
                  <td style={tdStyle}>{t.email}</td>
                  <td style={tdStyle}>{t.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageClass;
