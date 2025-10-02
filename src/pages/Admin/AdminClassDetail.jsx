import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fake data for demo (sau này thay bằng fetch API)
  const fakeClasses = [
    {
      id: 1,
      name: "SE101 - Group A",
      semester: "Spring 2025",
      major: "Software Engineering",
      course: "SE101",
      campus: "Hanoi",
    },
    {
      id: 2,
      name: "AI202 - Group B",
      semester: "Fall 2025",
      major: "Artificial Intelligence",
      course: "AI202",
      campus: "HCM",
    },
  ];

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyen Van A", studentId: "SE12345", email: "a@student.fpt.edu.vn" },
    { id: 2, name: "Le Van B", studentId: "SE12346", email: "b@student.fpt.edu.vn" },
  ]);
  const [instructors, setInstructors] = useState([
    { id: 1, name: "Tran Thi C", email: "c@fpt.edu.vn" },
  ]);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", studentId: "", email: "" });

  // Load class info when id changes
  useEffect(() => {
    const found = fakeClasses.find((c) => c.id.toString() === id);
    if (found) {
      setClassInfo(found);
    }
  }, [id]);

  if (!classInfo) {
    return <p className="p-6 text-gray-500">Class not found</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">📘 Class Detail</h2>

      {/* Class Info */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
        <p><span className="font-semibold">Class Name:</span> {classInfo.name}</p>
        <p><span className="font-semibold">Semester:</span> {classInfo.semester}</p>
        <p><span className="font-semibold">Major:</span> {classInfo.major}</p>
        <p><span className="font-semibold">Course:</span> {classInfo.course}</p>
        <p><span className="font-semibold">Campus:</span> {classInfo.campus}</p>
      </div>

      {/* Students Section */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">👩‍🎓 Students</h3>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Import from File
            </button>
            <button
              onClick={() => setShowAddStudent(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              + Add Student
            </button>
          </div>
        </div>

        <table className="w-full text-sm border">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Student ID</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No students in this class
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.studentId}</td>
                  <td className="p-2">{s.email}</td>
                  <td className="p-2 space-x-2">
                    <button className="text-orange-500 hover:underline">Edit</button>
                    <button
                      onClick={() => setStudents(students.filter((st) => st.id !== s.id))}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Instructors Section */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">👨‍🏫 Instructors</h3>
          <button
            onClick={() =>
              setInstructors([
                ...instructors,
                { id: Date.now(), name: "New Instructor", email: "new@fpt.edu.vn" },
              ])
            }
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            + Add Instructor
          </button>
        </div>

        <table className="w-full text-sm border">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {instructors.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No instructors in this class
                </td>
              </tr>
            ) : (
              instructors.map((i) => (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{i.name}</td>
                  <td className="p-2">{i.email}</td>
                  <td className="p-2 space-x-2">
                    <button className="text-orange-500 hover:underline">Edit</button>
                    <button
                      onClick={() => setInstructors(instructors.filter((inst) => inst.id !== i.id))}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Assignments */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/admin/classes/${id}/assignments`)}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          📄 View Assignments
        </button>
      </div>

      {/* Modal Add Student */}
      {showAddStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">Add Student</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded w-full p-2"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Student ID"
              className="border rounded w-full p-2"
              value={newStudent.studentId}
              onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded w-full p-2"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddStudent(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setStudents([...students, { id: Date.now(), ...newStudent }]);
                  setNewStudent({ name: "", studentId: "", email: "" });
                  setShowAddStudent(false);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
