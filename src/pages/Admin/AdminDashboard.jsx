import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  getAllCourseInstances,
  getAllAcademicYears,
  getAllSemesters,
  getAllCampuses,
} from "../../service/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersByCampus: {},
    classesByCampus: {},
    totalAcademicYears: 0,
    totalSemesters: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, classesRes, academicYearsRes, semestersRes, campusesRes] = await Promise.all([
          getAllUsers(),
          getAllCourseInstances(),
          getAllAcademicYears(),
          getAllSemesters(),
          getAllCampuses(),
        ]);

        const campuses = campusesRes.data || [];
        const users = usersRes.data || [];
        const classes = classesRes.data || [];
        const academicYears = academicYearsRes.data || [];
        const semesters = semestersRes.data || [];

        // Tính tổng user theo campus (chỉ student & instructor)
        const usersByCampus = {};
        campuses.forEach(campus => {
          usersByCampus[campus.campusName] = users.filter(
            user => user.campusId === campus.campusId && 
            (user.roles.includes("student") || user.roles.includes("instructor"))
          ).length;
        });

        // Tính tổng lớp học theo campus
        const classesByCampus = {};
        campuses.forEach(campus => {
          classesByCampus[campus.campusName] = classes.filter(
            course => course.campusId === campus.campusId
          ).length;
        });

        setStats({
          usersByCampus,
          classesByCampus,
          totalAcademicYears: academicYears.length,
          totalSemesters: semesters.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">
        📊 System Activity Dashboard
      </h2>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats.usersByCampus).map(([campusName, count]) => (
          <div key={campusName} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-green-500">
            <p className="text-gray-500">Users - {campusName}</p>
            <h3 className="text-3xl font-bold text-green-600">{count}</h3>
          </div>
        ))}

        {Object.entries(stats.classesByCampus).map(([campusName, count]) => (
          <div key={campusName} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-blue-500">
            <p className="text-gray-500">Classes - {campusName}</p>
            <h3 className="text-3xl font-bold text-blue-600">{count}</h3>
          </div>
        ))}

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-purple-500">
          <p className="text-gray-500">Academic Years</p>
          <h3 className="text-3xl font-bold text-purple-600">{stats.totalAcademicYears}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-yellow-500">
          <p className="text-gray-500">Semesters</p>
          <h3 className="text-3xl font-bold text-yellow-600">{stats.totalSemesters}</h3>
        </div>
      </div>
    </div>
  );
}
