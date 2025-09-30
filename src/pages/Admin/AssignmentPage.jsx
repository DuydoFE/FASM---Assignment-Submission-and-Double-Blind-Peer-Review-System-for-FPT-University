import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AssignmentPage = () => {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fake data: Assignments cho từng lớp
    const demoAssignments = {
      1: [
        {
          id: 101,
          title: "Software Engineering Project",
          description: "Build a small software project with ReactJS.",
          deadline: "2025-11-01",
          submissions: [
            {
              studentId: "IT001",
              name: "IT Student 1",
              email: "itstudent1@university.edu",
              score: 85,
            },
            {
              studentId: "IT002",
              name: "IT Student 2",
              email: "itstudent2@university.edu",
              score: 90,
            },
          ],
          notSubmitted: [
            { studentId: "IT003", name: "IT Student 3", email: "itstudent3@university.edu" },
            { studentId: "IT004", name: "IT Student 4", email: "itstudent4@university.edu" },
          ],
        },
      ],
      2: [
        {
          id: 201,
          title: "Microeconomics Essay",
          description: "Write a 2000-word essay about demand and supply.",
          deadline: "2025-10-20",
          submissions: [
            {
              studentId: "ECO001",
              name: "Eco Student 1",
              email: "ecostudent1@university.edu",
              score: 88,
            },
          ],
          notSubmitted: [
            { studentId: "ECO002", name: "Eco Student 2", email: "ecostudent2@university.edu" },
          ],
        },
      ],
    };

    setAssignments(demoAssignments[classId] || []);
  }, [classId]);

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
        <h2>📚 Assignments</h2>
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

      {/* Assignment list */}
      {!selectedAssignment ? (
        <div>
          <h3>Assignments for Class {classId}</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Deadline</th>
                <th style={thStyle}>Submissions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr
                  key={a.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedAssignment(a)}
                >
                  <td style={tdStyle}>{a.title}</td>
                  <td style={tdStyle}>{a.deadline}</td>
                  <td style={tdStyle}>
                    {a.submissions.length} /{" "}
                    {a.submissions.length + a.notSubmitted.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedAssignment(null)}
            style={{
              marginBottom: "15px",
              padding: "8px 15px",
              border: "none",
              borderRadius: "6px",
              background: "#2196F3",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>

          <h3 style={{ color: "#FF9800" }}>{selectedAssignment.title}</h3>
          <p>
            <strong>Description:</strong> {selectedAssignment.description}
          </p>
          <p>
            <strong>Deadline:</strong> {selectedAssignment.deadline}
          </p>

          <h4>Submitted Students</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Student ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Score</th>
              </tr>
            </thead>
            <tbody>
              {selectedAssignment.submissions.map((s) => (
                <tr key={s.studentId}>
                  <td style={tdStyle}>{s.studentId}</td>
                  <td style={tdStyle}>{s.name}</td>
                  <td style={tdStyle}>{s.email}</td>
                  <td style={tdStyle}>{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Not Submitted</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Student ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
              </tr>
            </thead>
            <tbody>
              {selectedAssignment.notSubmitted.map((s) => (
                <tr key={s.studentId}>
                  <td style={tdStyle}>{s.studentId}</td>
                  <td style={tdStyle}>{s.name}</td>
                  <td style={tdStyle}>{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
