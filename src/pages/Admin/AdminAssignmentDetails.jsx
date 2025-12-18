import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssignmentById,
  getCourseInstanceById,
  getSubmissionsByAssignmentSimple,
} from "../../service/adminService";

export default function AdminAssignmentDetails() {
  const { id, assignmentId } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : "-";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [courseInstanceRes, assignmentRes, submissionsRes] =
          await Promise.all([
            getCourseInstanceById(id),
            getAssignmentById(assignmentId),
            getSubmissionsByAssignmentSimple(assignmentId),
          ]);

        const courseInstance = courseInstanceRes?.data;
        const assignmentData = assignmentRes?.data;
        const submissionsData = submissionsRes?.data?.submissions || [];

        if (!courseInstance || !assignmentData) {
          throw new Error("Invalid data from API");
        }

        setClassInfo({
          className: courseInstance?.sectionCode || "-",
          semester: courseInstance?.semesterName || "-",
          major: courseInstance?.campusName || "-",
          course: courseInstance?.courseName || "-",
        });

        setAssignment({
          title: assignmentData?.title || "-",
          description: assignmentData?.description || "-",
          guidelines: assignmentData?.guidelines || "-",
          criteria: assignmentData?.rubric?.criteria || [],
          startDate: assignmentData?.startDate,
          deadline: assignmentData?.deadline,
          reviewDeadline: assignmentData?.reviewDeadline,
          finalDeadline: assignmentData?.finalDeadline,
          status: assignmentData?.status || "-",
          submissions: assignmentData?.submissionCount || 0,
        });

        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load assignment data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, assignmentId]);

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-10">⏳ Loading...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">❌ {error}</div>
    );

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-orange-500">
        📑 Assignment Details
      </h2>

      {/* Class Info */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🧾 Class Overview
        </h3>
        {classInfo && (
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
          </div>
        )}
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📘 Assignment Details
        </h3>

        {assignment && (
          <>
            <p>
              <span className="font-semibold">Title:</span> {assignment.title}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {assignment.description}
            </p>
            <p>
              <span className="font-semibold">Guidelines:</span>{" "}
              {assignment.guidelines}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {assignment.status}
            </p>
            <p>
              <span className="font-semibold">Start:</span>{" "}
              {formatDate(assignment.startDate)}
            </p>
            <p>
              <span className="font-semibold">Deadline:</span>{" "}
              {formatDate(assignment.deadline)}
            </p>
            <p>
              <span className="font-semibold">Review Deadline:</span>{" "}
              {formatDate(assignment.reviewDeadline)}
            </p>
            <p>
              <span className="font-semibold">Final Deadline:</span>{" "}
              {formatDate(assignment.finalDeadline)}
            </p>
            <p>
              <span className="font-semibold">Submissions:</span>{" "}
              {assignment.submissions}
            </p>

            {/* Criteria Table */}
            <table className="w-full text-sm border rounded-lg overflow-hidden mt-4">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="p-2 text-left">Criteria</th>
                  <th className="p-2 text-left">Max Score</th>
                </tr>
              </thead>
              <tbody>
                {assignment.criteria.length > 0 ? (
                  assignment.criteria.map((c, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">{c.title || "-"}</td>
                      <td className="p-2">{c.max || c.maxScore || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="text-center p-3 text-gray-500"
                    >
                      No criteria found in rubric.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">📝 Submissions</h3>

        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="p-2 text-left">Student Email</th>
                  <th className="p-2 text-left">File</th>
                  <th className="p-2 text-left">Submitted At</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Instructor Score</th>
                  <th className="p-2 text-left">Peer Average</th>
                  <th className="p-2 text-left">Final Score</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.submissionId} className="border-b hover:bg-gray-50">
                    <td className="p-2">{s.user?.email || "-"}</td>
                    <td className="p-2">
                      {s.fileUrl ? (
                        <a
                          href={s.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:underline"
                        >
                          {s.originalFileName || s.fileName}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">{formatDate(s.submittedAt)}</td>
                    <td className="p-2">{s.status || "-"}</td>
                    <td className="p-2">{s.instructorScore ?? "-"}</td>
                    <td className="p-2">{s.peerAverageScore ?? "-"}</td>
                    <td className="p-2">{s.finalScore ?? "-"}</td>
                    <td className="p-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/classes/${id}/assignments/${assignmentId}/submissions/${s.submissionId}`
                          )
                        }
                        className="px-2 py-1 text-white bg-orange-500 rounded hover:bg-orange-600"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No submissions found.</p>
        )}
      </div>
    </div>
  );
}
