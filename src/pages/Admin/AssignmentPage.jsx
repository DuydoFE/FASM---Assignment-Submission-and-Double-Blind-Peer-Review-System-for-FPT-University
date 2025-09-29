import React, { useState, useEffect } from "react";

const AssignmentPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const demoClasses = [
      {
        id: 1,
        className: "Lớp Demo 101",
        subject: "Toán Cao Cấp",
        teacher: "Giảng viên A",
        semester: "spring2025",
        assignments: [
          {
            id: 1,
            title: "Assignment 1 - Đại số tuyến tính",
            content: "Giải các bài toán tuyến tính từ chương 1 đến chương 3.",
            submissions: [
              { studentName: "Sinh viên 1", submitted: true, score: 9 },
              { studentName: "Sinh viên 2", submitted: false, score: null },
              { studentName: "Sinh viên 3", submitted: true, score: 8 },
            ]
          },
          {
            id: 2,
            title: "Assignment 2 - Giải tích",
            content: "Bài tập về tích phân và đạo hàm.",
            submissions: [
              { studentName: "Sinh viên 1", submitted: true, score: 10 },
              { studentName: "Sinh viên 2", submitted: false, score: null },
              { studentName: "Sinh viên 3", submitted: true, score: 7 },
            ]
          }
        ]
      },
      {
        id: 2,
        className: "Lớp Demo 102",
        subject: "Lập trình C++",
        teacher: "Giảng viên B",
        semester: "summer2025",
        assignments: [
          {
            id: 1,
            title: "Assignment 1 - Cơ bản C++",
            content: "Viết chương trình tính tổng các số nguyên.",
            submissions: [
              { studentName: "Sinh viên A", submitted: true, score: 8 },
              { studentName: "Sinh viên B", submitted: false, score: null }
            ]
          }
        ]
      }
    ];
    setClasses(demoClasses);
  }, []);

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
        <h2>📑 View Assignments</h2>
        <div>AdminUser ▼</div>
      </div>

      {/* Danh sách lớp */}
      {!selectedClass && (
        <>
          <h3>Danh sách lớp</h3>
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
              {classes.map(cls => (
                <tr key={cls.id} style={{ cursor: "pointer" }} onClick={() => setSelectedClass(cls)}>
                  <td style={tdStyle}>{cls.className}</td>
                  <td style={tdStyle}>{cls.subject}</td>
                  <td style={tdStyle}>{cls.teacher}</td>
                  <td style={tdStyle}>{cls.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Danh sách assignment */}
      {selectedClass && !selectedAssignment && (
        <>
          <button onClick={() => setSelectedClass(null)} style={{ marginBottom: "10px" }}>⬅ Quay lại danh sách lớp</button>
          <h3>Assignments của lớp: {selectedClass.className}</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Tên Assignment</th>
              </tr>
            </thead>
            <tbody>
              {selectedClass.assignments.map(assign => (
                <tr key={assign.id} style={{ cursor: "pointer" }} onClick={() => setSelectedAssignment(assign)}>
                  <td style={tdStyle}>{assign.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Chi tiết assignment */}
      {selectedAssignment && (
        <>
          <button onClick={() => setSelectedAssignment(null)} style={{ marginBottom: "10px" }}>⬅ Quay lại assignments</button>
          <h3>{selectedAssignment.title}</h3>
          <p><strong>Đề bài:</strong> {selectedAssignment.content}</p>
          <p><strong>Số lượng nộp:</strong> {selectedAssignment.submissions.filter(s => s.submitted).length} / {selectedAssignment.submissions.length}</p>

          <h4>Chi tiết sinh viên</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Đã nộp</th>
                <th style={thStyle}>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {selectedAssignment.submissions.map((sub, index) => (
                <tr key={index} style={index % 2 ? trHover : {}}>
                  <td style={tdStyle}>{sub.studentName}</td>
                  <td style={tdStyle}>{sub.submitted ? "✅" : "❌"}</td>
                  <td style={tdStyle}>{sub.score !== null ? sub.score : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AssignmentPage;
