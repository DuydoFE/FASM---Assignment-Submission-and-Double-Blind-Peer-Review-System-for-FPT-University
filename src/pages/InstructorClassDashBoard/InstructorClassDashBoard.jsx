import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getAssignmentsOverview,
  getSubmissionStatistics,
  getAssignmentsDistribution,
} from "../../service/instructorStatistic";
import { getCurrentAccount } from "../../utils/accountUtils";
import { getCourseInstanceById } from "../../service/courseInstanceService";
import AssignmentStatusChart from "../../component/InstructorDashboard/AssignmentStatusChart";
import SubmissionStatusChart from "../../component/InstructorDashboard/SubmissionStatusChart";
import ScoreDistributionChart from "../../component/InstructorDashboard/ScoreDistributionChart";

const InstructorClassDashboard = () => {
  const { courseInstanceId } = useParams();
  const currentUser = getCurrentAccount();
  const [courseInstanceData, setCourseInstanceData] = useState(null);
  const [assignmentStatusData, setAssignmentStatusData] = useState([
    { value: 0, name: "Draft" },
    { value: 0, name: "Upcoming" },
    { value: 0, name: "Active" },
    { value: 0, name: "In Review" },
    { value: 0, name: "Closed" },
    { value: 0, name: "Grades Published" },
    { value: 0, name: "Cancelled" },
  ]);
  const [submissionData, setSubmissionData] = useState([
    { value: 0, name: "Not Submitted" },
    { value: 0, name: "Submitted" },
    { value: 0, name: "Graded" },
  ]);
  const [distributionBins, setDistributionBins] = useState([
    "0-1",
    "1-2",
    "2-3",
    "3-4",
    "4-5",
    "5-6",
    "6-7",
    "7-8",
    "8-9",
    "9-10",
  ]);
  const [distributionCounts, setDistributionCounts] = useState(
    new Array(10).fill(0)
  );

  const fetchCourseInstanceData = async (courseInstanceId) => {
    try {
      const response = await getCourseInstanceById(courseInstanceId);
      console.log("Course Instance API Response:", response);
      // API might return { data: {...} } or directly the data
      const data = response.data || response;
      console.log("Course Instance Data:", data);
      setCourseInstanceData(data);
    } catch (error) {
      console.error("Failed to fetch course instance data:", error);
    }
  };

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        if (!currentUser?.id || !courseInstanceId) {
          console.warn(
            "Skipping assignments overview fetch: missing userId or courseInstanceId"
          );
          return;
        }

        // Fetch course instance data
        await fetchCourseInstanceData(courseInstanceId);

        const res = await getAssignmentsOverview(
          currentUser.id,
          courseInstanceId
        );
        const item =
          res && res.data && res.data.length > 0 ? res.data[0] : null;
        if (item) {
          const mapped = [
            { value: item.draftCount, name: "Draft" },
            { value: item.upcomingCount, name: "Upcoming" },
            { value: item.activeCount, name: "Active" },
            { value: item.inReviewCount, name: "In Review" },
            { value: item.closedCount, name: "Closed" },
            { value: item.gradesPublishedCount, name: "Grades Published" },
            { value: item.cancelledCount, name: "Cancelled" },
          ];
          setAssignmentStatusData(mapped);
        }

        try {
          const resSub = await getSubmissionStatistics(
            currentUser.id,
            courseInstanceId
          );
          const subItem =
            resSub && resSub.data && resSub.data.length > 0
              ? resSub.data[0]
              : null;
          if (subItem) {
            const mappedSub = [
              {
                value: subItem.totalNotSubmittedCount ?? 0,
                name: "Not Submitted",
              },
              { value: subItem.totalSubmittedCount ?? 0, name: "Submitted" },
              { value: subItem.totalGradedCount ?? 0, name: "Graded" },
            ];
            setSubmissionData(mappedSub);
          }
        } catch (err) {
          console.error("Failed to load submission statistics:", err);
        }

        try {
          const resDist = await getAssignmentsDistribution(
            currentUser.id,
            courseInstanceId
          );
          const distItem =
            resDist && resDist.data && resDist.data.length > 0
              ? resDist.data[0]
              : null;
          if (distItem && Array.isArray(distItem.distribution)) {
            const bins = [];
            const counts = [];
            distItem.distribution.forEach((d) => {
              bins.push(
                typeof d.range === "string" ? d.range.trim() : String(d.range)
              );
              counts.push(Number(d.count) || 0);
            });
            if (bins.length > 0) setDistributionBins(bins);
            if (counts.length > 0) setDistributionCounts(counts);
          }
        } catch (err) {
          console.error("Failed to load assignments distribution:", err);
        }
      } catch (error) {
        console.error("Failed to load assignments overview:", error);
      }
    };

    fetchOverview();
  }, [currentUser, courseInstanceId]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header with Course Info */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Class Statistics</h1>
        <div className="flex items-center space-x-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Course: {courseInstanceData?.courseCode || "N/A"}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Class: {courseInstanceData?.sectionCode || "N/A"}
          </span>
        </div>
      </motion.div>

      {/* Hàng đầu tiên */}
      <motion.div
        className="grid grid-cols-12 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="col-span-9">
          <AssignmentStatusChart data={assignmentStatusData} />
        </div>
        <div className="col-span-3">
          <SubmissionStatusChart data={submissionData} />
        </div>
      </motion.div>

      {/* Hàng thứ hai */}
      <motion.div
        className="grid grid-cols-12 gap-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="col-span-12">
          <ScoreDistributionChart
            bins={distributionBins}
            counts={distributionCounts}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default InstructorClassDashboard;