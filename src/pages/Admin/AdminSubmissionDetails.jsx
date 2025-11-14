import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissionDetails } from "../../service/adminService";

export default function AdminSubmissionDetails() {
  const { assignmentId, submissionId, id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getSubmissionDetails(submissionId);
        const data = res?.data;
        if (!data) throw new Error("No submission data found");
        setSubmission(data);
      } catch (err) {
        console.error("Error loading submission:", err);
        setError("Failed to load submission data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [submissionId]);

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "-");

  if (loading) return <div className="text-center text-gray-500 mt-10">⏳ Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">❌ {error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">📄 Submission Details</h2>

      {/* Submission Info */}
      <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">🧾 Submission Overview</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <p><span className="font-medium">Student Email:</span> {submission.user?.email || "-"}</p>
          <p><span className="font-medium">File Name:</span> {submission.originalFileName || "-"}</p>
          <p><span className="font-medium">Keywords:</span> {submission.keywords || "-"}</p>
          <p><span className="font-medium">Submitted At:</span> {formatDate(submission.submittedAt)}</p>
          <p><span className="font-medium">Status:</span> {submission.status || "-"}</p>
          <p><span className="font-medium">Public:</span> {submission.isPublic ? "Yes" : "No"}</p>
          <p><span className="font-medium">Instructor Score:</span> {submission.instructorScore ?? "-"}</p>
          <p><span className="font-medium">Peer Average Score:</span> {submission.peerAverageScore ?? "-"}</p>
          <p><span className="font-medium">Final Score:</span> {submission.finalScore ?? "-"}</p>
          <p><span className="font-medium">Graded At:</span> {formatDate(submission.gradedAt)}</p>
          <p><span className="font-medium">Feedback:</span> {submission.feedback || "-"}</p>
        </div>

        {/* File download button */}
        {submission.fileUrl && (
          <div className="mt-4">
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-orange-600"
            >
              Download Submission
            </a>
          </div>
        )}
      </div>

      {/* Assignment Info */}
      {submission.assignment && (
        <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📘 Assignment Info</h3>
          <p><span className="font-medium">Title:</span> {submission.assignment.title}</p>
          <p><span className="font-medium">Description:</span> {submission.assignment.description}</p>
          <p><span className="font-medium">Deadline:</span> {formatDate(submission.assignment.deadline)}</p>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-orange-600"
      >
        Back
      </button>
    </div>
  );
}
