import React from "react";
import ReactECharts from "echarts-for-react";

const SubmissionStatusChart = ({ data }) => {
  const option = {
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
        data: data,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Submission Overview
      </h2>
      <ReactECharts option={option} style={{ height: 350 }} />
    </div>
  );
};

export default SubmissionStatusChart;