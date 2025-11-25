import React from "react";
import ReactECharts from "echarts-for-react";

const ScoreDistributionChart = ({ bins, counts }) => {
  const option = {
    xAxis: {
      type: "category",
      data: bins,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: counts,
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
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Student Score Distribution
      </h2>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
};

export default ScoreDistributionChart;