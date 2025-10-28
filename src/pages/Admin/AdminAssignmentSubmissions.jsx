import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";

export default function AdminAssignmentSubmissions() {
  const { id, assignmentId } = useParams();

  // Thông tin chung (tạm thời hardcode, sau này sẽ fetch từ API)
  const classInfo = {
    className: "SE101 - Group A",
    semester: "Spring 2025",
    major: "Software Engineering",
    course: "Introduction to Programming",
    assignmentTitle: "Assignment 1: Build a Simple Webpage",
    studentName: "Nguyen Van A",
    studentId: "SE12345",
  };

  // Điểm và đánh giá chi tiết (demo data)
  const evaluation = {
    totalScore: 85,
    criteria: [
      { name: "Code Quality", score: 30, max: 40 },
      { name: "Functionality", score: 35, max: 40 },
      { name: "Documentation", score: 20, max: 20 },
    ],
    lecturerFeedback:
      "Good structure and clear documentation. Some functions could be optimized further.",
    peerFeedback:
      "The webpage looks nice and responsive. Maybe improve naming conventions.",
    aiSummary:
      "The submission demonstrates solid programming fundamentals, clear structure, and meets all core requirements of the assignment.",
  };

  const handleDownload = () => {
    // Sau này sẽ thay bằng logic download thực tế (fetch file)
    alert("Downloading student's submission...");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">
        📑 Assignment Submission Details
      </h2>

      {/* Thông tin tổng quan */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🧾 Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Class:</span> {classInfo.className}
          </p>
          <p>
            <span className="font-medium">Semester:</span> {classInfo.semester}
          </p>
          <p>
            <span className="font-medium">Major:</span> {classInfo.major}
          </p>
          <p>
            <span className="font-medium">Course:</span> {classInfo.course}
          </p>
          <p>
            <span className="font-medium">Assignment:</span>{" "}
            {classInfo.assignmentTitle}
          </p>
          <p>
            <span className="font-medium">Student:</span>{" "}
            {classInfo.studentName} ({classInfo.studentId})
          </p>
        </div>
      </div>

      {/* Điểm và đánh giá */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            🧮 Evaluation & Feedback
          </h3>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Download size={16} />
            Download Submission
          </button>
        </div>

        {/* Điểm chi tiết */}
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-2 text-left">Criteria</th>
              <th className="p-2 text-left">Score</th>
              <th className="p-2 text-left">Max</th>
            </tr>
          </thead>
          <tbody>
            {evaluation.criteria.map((c, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.score}</td>
                <td className="p-2">{c.max}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="p-2">Total</td>
              <td className="p-2">{evaluation.totalScore}</td>
              <td className="p-2">100</td>
            </tr>
          </tbody>
        </table>

        {/* Phản hồi */}
        <div className="space-y-3 mt-4">
          <div>
            <p className="font-semibold text-gray-800">👨‍🏫 Lecturer Feedback:</p>
            <p className="text-gray-700">{evaluation.lecturerFeedback}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">🤝 Peer Review:</p>
            <p className="text-gray-700">{evaluation.peerFeedback}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">🤖 AI Summary:</p>
            <p className="text-gray-700 italic">{evaluation.aiSummary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
