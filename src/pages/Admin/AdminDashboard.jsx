import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Users, Clock, CheckCircle, ChevronDown, Calendar } from 'lucide-react';
import { getAllAcademicYears, getSemestersByAcademicYear, getSemesterStatistics } from '../../service/adminService';

function AdminDashboard() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [statisticsData, setStatisticsData] = useState(null);
  const chartRef = useRef(null);
  const gradeChartRef = useRef(null);

  // Default values (will be replaced with API data)
  const userStats = {
    instructors: statisticsData?.totalInstructors || 0,
    students: statisticsData?.totalStudents || 0
  };

  const assignmentStatus = {
    active: statisticsData?.totalActiveAssignments || 0,
    inReview: statisticsData?.totalInReviewAssignments || 0,
    closed: statisticsData?.totalClosedAssignments || 0
  };

  const rubricStats = {
    rubrics: statisticsData?.totalRubricsUsed || 0,
    criteria: statisticsData?.totalCriteriaUsed || 0
  };

  const lowSubmissionAssignments = statisticsData?.lowestSubmissionAssignments?.map(item => ({
    name: item.assignmentTitle,
    course: `${item.courseName} - ${item.className}`,
    percentage: item.submissionRate
  })) || [];

  // Fetch academic years from API
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        setLoading(true);
        const response = await getAllAcademicYears();
        
        // Extract academic years from the response data
        const years = response.data.map(year => ({
          id: year.academicYearId,
          name: year.name,
          campusId: year.campusId,
          campusName: year.campusName,
          startDate: year.startDate,
          endDate: year.endDate,
          semesterCount: year.semesterCount
        }));
        
        setAcademicYears(years);
        
        // Set the first year as selected if available
        if (years.length > 0) {
          setSelectedAcademicYear(years[0]);
        }
      } catch (error) {
        console.error('Error fetching academic years:', error);
        setAcademicYears([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicYears();
  }, []);

  // Fetch semesters when academic year is selected
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!selectedAcademicYear?.id) {
        setSemesters([]);
        setSelectedSemester('');
        return;
      }

      try {
        setLoadingSemesters(true);
        const response = await getSemestersByAcademicYear(selectedAcademicYear.id);
        
        // Extract semesters from the response data
        const semesterList = response.data.map(semester => ({
          id: semester.semesterId,
          name: semester.name,
          startDate: semester.startDate,
          endDate: semester.endDate,
          academicYearId: semester.academicYearId
        }));
        
        setSemesters(semesterList);
        
        // Set the first semester as selected if available
        if (semesterList.length > 0) {
          setSelectedSemester(semesterList[0].name);
        } else {
          setSelectedSemester('');
        }
      } catch (error) {
        console.error('Error fetching semesters:', error);
        setSemesters([]);
        setSelectedSemester('');
      } finally {
        setLoadingSemesters(false);
      }
    };

    fetchSemesters();
  }, [selectedAcademicYear]);

  // Fetch statistics when academic year or semester changes
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!selectedAcademicYear?.id || !selectedSemester) {
        setStatisticsData(null);
        return;
      }

      // Find the semester ID from the selected semester name
      const semester = semesters.find(s => s.name === selectedSemester);
      if (!semester) {
        return;
      }

      try {
        setLoadingStatistics(true);
        const response = await getSemesterStatistics(selectedAcademicYear.id, semester.id);
        
        if (response.statusCode === 200 && response.data) {
          setStatisticsData(response.data);
        }
      } catch (error) {
        console.error('Error fetching semester statistics:', error);
        setStatisticsData(null);
      } finally {
        setLoadingStatistics(false);
      }
    };

    fetchStatistics();
  }, [selectedAcademicYear, selectedSemester, semesters]);

  // Update submission chart when statistics data changes
  useEffect(() => {
    if (chartRef.current && statisticsData?.submissionRate) {
      const myChart = echarts.init(chartRef.current);
      
      const submissionData = statisticsData.submissionRate;
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          }
        },
        legend: {
          top: '5%',
          left: 'center',
          textStyle: {
            fontSize: 12,
            color: '#374151'
          }
        },
        series: [
          {
            name: 'Submission Rate',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: submissionData.notSubmitted.count, name: 'Not Submitted', itemStyle: { color: '#ef4444' } },
              { value: submissionData.submitted.count, name: 'Submitted', itemStyle: { color: '#3b82f6' } },
              { value: submissionData.graded.count, name: 'Graded', itemStyle: { color: '#22c55e' } }
            ]
          }
        ]
      };
      
      myChart.setOption(option);
      
      setTimeout(() => {
        myChart.resize();
      }, 100);
      
      const handleResize = () => {
        myChart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, [statisticsData]);

  // Update grade distribution chart when statistics data changes
  useEffect(() => {
    if (gradeChartRef.current && statisticsData?.scoreDistribution) {
      const scoreData = statisticsData.scoreDistribution;
      const ranges = scoreData.map(item => item.rangeLabel);
      const counts = scoreData.map(item => item.count);
      const percents = scoreData.map(item => item.percentage);
      
      const chart = echarts.init(gradeChartRef.current);
      
      const option = {
        grid: {
          left: 80,
          right: 100,
          top: 20,
          bottom: 40,
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: {
          type: "category",
          data: ranges,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            fontSize: 14,
            color: "#374151",
            fontWeight: 500,
          },
        },
        series: [
          {
            type: "bar",
            data: counts,
            barWidth: 24,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#60a5fa' }
              ]),
              borderRadius: [0, 8, 8, 0],
            },
            label: {
              show: true,
              position: "right",
              formatter: (params) => {
                const value = counts[params.dataIndex];
                const percent = percents[params.dataIndex];
                return `{val|${value}}  {per|${percent}%}`;
              },
              rich: {
                val: {
                  color: "#111827",
                  fontWeight: 600,
                  fontSize: 14,
                },
                per: {
                  color: "#6b7280",
                  fontSize: 13,
                  padding: [0, 0, 0, 6],
                },
              },
            },
          },
        ],
        tooltip: {
          show: true,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          },
          formatter: (params) => {
            const range = ranges[params.dataIndex];
            const value = counts[params.dataIndex];
            const percent = percents[params.dataIndex];
            return `
              <div style="padding: 4px;">
                <b style="color: #111827;">Grade Range: ${range}</b><br />
                Count: ${value}<br />
                Percentage: ${percent}%
              </div>
            `;
          },
        },
      };
      
      chart.setOption(option);
      
      const handleResize = () => {
        chart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [statisticsData]);

  return (
    <div className="min-h-screen p-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">System Overview</h1>
            {loadingStatistics && (
              <p className="text-sm text-gray-500 mt-2">Loading statistics...</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Academic Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  {loading ? 'Loading...' : selectedAcademicYear?.name || 'Select Year'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {yearDropdownOpen && !loading && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {academicYears.length > 0 ? academicYears.map((year) => (
                    <button
                      key={year.id}
                      onClick={() => {
                        setSelectedAcademicYear(year);
                        setYearDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        selectedAcademicYear?.id === year.id ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      {year.name}
                    </button>
                  )) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No academic years found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Semester Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={!selectedAcademicYear || loadingSemesters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  {loadingSemesters ? 'Loading...' : selectedSemester || 'Select Semester'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {dropdownOpen && !loadingSemesters && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {semesters.length > 0 ? semesters.map((semester) => (
                    <button
                      key={semester.id}
                      onClick={() => {
                        setSelectedSemester(semester.name);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        selectedSemester === semester.name ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      {semester.name}
                    </button>
                  )) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No semesters found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - User Statistics and Assignment Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">User Statistics</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Instructors</div>
                  <div className="text-4xl font-bold text-gray-900">{userStats.instructors.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Students</div>
                  <div className="text-4xl font-bold text-gray-900">{userStats.students.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Assignment Status Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignment Status Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Active */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-700">{assignmentStatus.active}</div>
                </div>

                {/* In Review */}
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 text-yellow-600 mb-3">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">In Review</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-700">{assignmentStatus.inReview}</div>
                </div>

                {/* Closed */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Closed</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-700">{assignmentStatus.closed.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Rubric and Criteria Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Rubric and Criteria Overview</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Rubrics</div>
                  <div className="text-4xl font-bold text-gray-900">{rubricStats.rubrics.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Criteria</div>
                  <div className="text-4xl font-bold text-gray-900">{rubricStats.criteria.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Low Submission Assignments & Submission Rate */}
          <div className="lg:col-span-1 space-y-6">
            {/* Low Submission Assignments */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Low Submission Assignments</h2>
                <span className="text-sm font-medium text-red-500">Top 3</span>
              </div>
              <div className="space-y-4">
                {lowSubmissionAssignments.map((assignment, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{assignment.name}</h3>
                      <span className="text-red-500 font-bold text-sm">{assignment.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Users className="w-3 h-3" />
                      <span>{assignment.course}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Rate Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submission Rate</h2>
              <div ref={chartRef} style={{ width: '100%', height: '300px' }}></div>
            </div>
          </div>
        </div>

        {/* Grade Distribution Chart - Full Width at Bottom */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Score Distribution by Range</h2>
          <div ref={gradeChartRef} style={{ width: '100%', height: '500px' }}></div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;