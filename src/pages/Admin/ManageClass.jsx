import React, { useState, useEffect } from "react";

const ManageClass = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState(null); // "student" hoặc "teacher"
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassData, setNewClassData] = useState({
    className: "",
    subject: "",
    semester: ""
  });

  useEffect(() => {
    const demoClasses = [
      {
        id: 1,
        className: "Lớp Demo 101",
        subject: "Toán Cao Cấp",
        teacher: "Giảng viên A",
        semester: "spring2025",
        students: Array.from({ length: 10 }, (_, i) => ({
          name: `Sinh viên ${i + 1}`,
          avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
          studentId: `SV00${i + 1}`,
          gender: i % 2 === 0 ? "Nam" : "Nữ",
          major: i % 2 === 0 ? "CNTT" : "Kinh tế",
          email: `sv${i + 1}@university.edu`,
          role: "Student"
        })),
        teachers: [
          {
            name: "Giảng viên A",
            email: "giaovienA@university.edu",
            role: "Teacher"
          }
        ]
      }
    ];
    setClasses(demoClasses);
  }, []);

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewClass = (cls) => {
    setSelectedClass(cls);
    setEditIndex(null);
  };

  const handleImport = () => {
    alert("Chức năng import file dữ liệu sinh viên (chưa implement)");
  };

  const handleAdd = () => {
    const newStudent = {
      name: "Sinh viên mới",
      avatar: "https://i.pravatar.cc/40",
      studentId: "SVXXXX",
      gender: "Nam",
      major: "Chưa chọn",
      email: "new@student.edu",
      role: "Student"
    };
    setSelectedClass(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));
  };

  const handleEdit = (type, index) => {
    setEditIndex(index);
    setEditType(type);
    const item = type === "student" ? selectedClass.students[index] : selectedClass.teachers[index];
    setEditData({ ...item });
  };

  const handleSave = () => {
    if (editType === "student") {
      const updatedStudents = [...selectedClass.students];
      updatedStudents[editIndex] = editData;
      setSelectedClass(prev => ({ ...prev, students: updatedStudents }));
    } else {
      const updatedTeachers = [...selectedClass.teachers];
      updatedTeachers[editIndex] = editData;
      setSelectedClass(prev => ({ ...prev, teachers: updatedTeachers }));
    }
    setEditIndex(null);
    setEditType(null);
    setEditData({});
  };

  const handleDelete = (type, index) => {
    if (type === "student") {
      const updatedStudents = selectedClass.students.filter((_, i) => i !== index);
      setSelectedClass(prev => ({ ...prev, students: updatedStudents }));
    } else {
      const updatedTeachers = selectedClass.teachers.filter((_, i) => i !== index);
      setSelectedClass(prev => ({ ...prev, teachers: updatedTeachers }));
    }
  };

  const handleCreateClass = () => {
    const newClass = {
      id: classes.length + 1,
      className: newClassData.className,
      subject: newClassData.subject,
      semester: newClassData.semester,
      teacher: "",
      students: [],
      teachers: []
    };
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    setShowCreateForm(false);
    setNewClassData({ className: "", subject: "", semester: "" });
    setSelectedClass(newClass); // Tự động chọn lớp vừa tạo
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden"
  };

  const thStyle = {
    padding: "10px",
    background: "#FF9800",
    color: "#fff",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee"
  };

  const trHover = {
    backgroundColor: "#f9f9f9"
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#FF9800",
        color: "#fff",
        padding: "15px 30px",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h2>📋 Manage Class</h2>
        <div>AdminUser ▼</div>
      </div>

      {/* Search + Create Class */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tìm lớp..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "10px", width: "300px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <div>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: "10px 20px",
              background: "#29B6F6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Tạo lớp mới
          </button>

          {showCreateForm && (
            <div style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
              marginTop: "20px"
            }}>
              <h3 style={{ color: "#FF9800" }}>Tạo lớp mới</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Tên lớp"
                  value={newClassData.className}
                  onChange={(e) => setNewClassData({ ...newClassData, className: e.target.value })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                <input
                  type="text"
                  placeholder="Tên môn học"
                  value={newClassData.subject}
                  onChange={(e) => setNewClassData({ ...newClassData, subject: e.target.value })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                <input
                  type="text"
                  placeholder="Học kỳ (ví dụ: spring2025)"
                  value={newClassData.semester}
                  onChange={(e) => setNewClassData({ ...newClassData, semester: e.target.value })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleCreateClass}
                    style={{ padding: "10px 20px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px" }}
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    style={{ padding: "10px 20px", background: "#f44336", color: "#fff", border: "none", borderRadius: "6px" }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bảng lớp */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Tên lớp</th>
            <th style={thStyle}>Môn học</th>
            <th style={thStyle}>Giảng viên</th>
            <th style={thStyle}>Học kỳ</th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.map(cls => (
            <tr key={cls.id} style={{ cursor: "pointer" }} onClick={() => handleViewClass(cls)}>
              <td style={tdStyle}>{cls.className}</td>
              <td style={tdStyle}>{cls.subject}</td>
              <td style={tdStyle}>{cls.teacher}</td>
              <td style={tdStyle}>{cls.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chi tiết lớp */}
      {selectedClass && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#FF9800" }}>Chi tiết lớp: {selectedClass.className}</h3>

          {/* Nút Import + Add */}
          <div style={{ marginBottom: "20px" }}>
            <button onClick={handleImport} style={{ marginRight: "10px", padding: "8px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px" }}>
              Import
            </button>
            <button onClick={handleAdd} style={{ padding: "8px 15px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "6px" }}>
              Add
            </button>
          </div>

          {/* Sinh viên */}
          <h4>Sinh viên</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Ảnh</th>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Mã số</th>
                <th style={thStyle}>Giới tính</th>
                <th style={thStyle}>Chuyên ngành</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {selectedClass.students.map((student, index) => (
                <tr key={index} style={index % 2 ? trHover : {}}>
                  <td style={tdStyle}><img src={student.avatar} alt="avatar" style={{ borderRadius: "50%" }} /></td>
                  {editIndex === index && editType === "student" ? (
                    <>
                      <td style={tdStyle}><input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></td>
                      <td style={tdStyle}><input value={editData.studentId} onChange={e => setEditData({ ...editData, studentId: e.target.value })} /></td>
                      <td style={tdStyle}><input value={editData.gender} onChange={e => setEditData({ ...editData, gender: e.target.value })} /></td>
                      <td style={tdStyle}><input value={editData.major} onChange={e => setEditData({ ...editData, major: e.target.value })} /></td>
                      <td style={tdStyle}><input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></td>
                      <td style={tdStyle}><input value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} /></td>
                      <td style={tdStyle}>
                        <button onClick={handleSave} style={{ background: "#4CAF50", color: "#fff", marginRight: "5px" }}>Save</button>
                        <button onClick={() => handleDelete("student", index)} style={{ background: "#f44336", color: "#fff" }}>Delete</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.studentId}</td>
                      <td style={tdStyle}>{student.gender}</td>
                      <td style={tdStyle}>{student.major}</td>
                      <td style={tdStyle}>{student.email}</td>
                      <td style={tdStyle}>{student.role}</td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEdit("student", index)} style={{ background: "#FFC107", color: "#fff" }}>Edit</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Giảng viên */}
          <h4>Giảng viên</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {selectedClass.teachers.map((teacher, index) => (
                <tr key={index} style={index % 2 ? trHover : {}}>
                  {editIndex === index && editType === "teacher" ? (
                    <>
                      <td style={tdStyle}><input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></td>
                      <td style={tdStyle}><input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></td>
                      <td style={tdStyle}><input value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} /></td>
                      <td style={tdStyle}>
                        <button onClick={handleSave} style={{ background: "#4CAF50", color: "#fff", marginRight: "5px" }}>Save</button>
                        <button onClick={() => handleDelete("teacher", index)} style={{ background: "#f44336", color: "#fff" }}>Delete</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{teacher.name}</td>
                      <td style={tdStyle}>{teacher.email}</td>
                      <td style={tdStyle}>{teacher.role}</td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEdit("teacher", index)} style={{ background: "#FFC107", color: "#fff" }}>Edit</button>
                      </td>
                    </>
                  )}
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
