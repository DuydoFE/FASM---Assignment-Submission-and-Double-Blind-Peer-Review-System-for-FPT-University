import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  getAssignmentsOverview,
  getSubmissionStatistics,
  getAssignmentsDistribution,
} from "../../service/instructorStatistic";
import { getCurrentAccount } from "../../utils/accountUtils";

const InstructorClassDashboard = () => {
  const currentUser = getCurrentAccount();
  const [assignmentStatusData, setAssignmentStatusData] = useState([
    { value: 0, name: "Draft" },
    { value: 0, name: "Upcoming" },
    { value: 0, name: "Active" },
    { value: 0, name: "In Review" },
    { value: 0, name: "Closed" },
    { value: 0, name: "Grades Published" },
  ]);
  const [submissionData, setSubmissionData] = useState([
    { value: 0, name: "Not Submitted" },
    { value: 0, name: "Submitted" },
    { value: 0, name: "Graded" },
  ]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const courseInstanceId = sessionStorage.getItem(
          "currentCourseInstanceId"
        );
        if (!currentUser?.id || !courseInstanceId) {
          console.warn(
            "Skipping assignments overview fetch: missing userId or courseInstanceId"
          );
          return;
        }

        const res = await getAssignmentsOverview(currentUser.id, courseInstanceId);
        const item = res && res.data && res.data.length > 0 ? res.data[0] : null;
        if (item) {
          const mapped = [
            { value: item.draftCount, name: "Draft" },
            { value: item.upcomingCount, name: "Upcoming" },
            { value: item.activeCount, name: "Active" },
            { value: item.inReviewCount, name: "In Review" },
            { value: item.closedCount, name: "Closed" },
            { value: item.gradesPublishedCount, name: "Grades Published" },
          ];
          setAssignmentStatusData(mapped);
        }

        try {
          const resSub = await getSubmissionStatistics(currentUser.id, courseInstanceId);
          const subItem = resSub && resSub.data && resSub.data.length > 0 ? resSub.data[0] : null;
          if (subItem) {
            const mappedSub = [
              { value: subItem.totalNotSubmittedCount ?? 0, name: "Not Submitted" },
              { value: subItem.totalSubmittedCount ?? 0, name: "Submitted" },
              { value: subItem.totalGradedCount ?? 0, name: "Graded" },
            ];
            setSubmissionData(mappedSub);
          }
        } catch (err) {
          console.error("Failed to load submission statistics:", err);
        }
      } catch (error) {
        console.error("Failed to load assignments overview:", error);
      }
    };

    fetchOverview();
  }, [currentUser]);

  const assignmentStatusOption = {
    tooltip: { trigger: "item" },
    legend: { top: "5%", left: "center" },
    series: [
      {
        name: "Assignment Status",
        type: "pie",
        radius: ["40%", "70%"],
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 26, fontWeight: "bold" } },
        data: assignmentStatusData,
      },
    ],
  };

  

  const submissionOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Submission Status",
        type: "pie",
        radius: ["40%", "70%"],
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 30, fontWeight: "bold" } },
        labelLine: { show: false },
        data: submissionData,
      },
    ],
  };

  function processScoreData(studentCount) {
    const rawScores = [];
    for (let i = 0; i < studentCount; i++) {
      rawScores.push(+(Math.random() * 10).toFixed(2));
    }
    const bins = [
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
    ];
    const counts = new Array(10).fill(0);
    rawScores.forEach((score) => {
      if (score === 10) {
        counts[9]++;
      } else {
        const binIndex = Math.floor(score);
        counts[binIndex]++;
      }
    });
    return { bins, counts };
  }

  const { bins: scoreBins, counts: scoreCounts } = processScoreData(35);

  const studentScoreChartOption = {
    xAxis: {
      type: "category",
      data: scoreBins,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: scoreCounts,
        type: "bar",
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hàng đầu tiên */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Assignment Overview
          </h2>
          <ReactECharts
            option={assignmentStatusOption}
            style={{ height: 350 }}
          />
        </div>
        <div className="col-span-3 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Submission Overview
          </h2>
          <ReactECharts option={submissionOption} style={{ height: 350 }} />
        </div>
      </div>

      {/* Hàng thứ hai - Thêm lại biểu đồ điểm */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Student Score Distribution
          </h2>
          <ReactECharts
            option={studentScoreChartOption}
            style={{ height: 400 }}
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorClassDashboard;
