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

  const [animatedStats, setAnimatedStats] = useState(stats);
  const [maxCounts, setMaxCounts] = useState({ users: 0, classes: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, classesRes, academicYearsRes, semestersRes, campusesRes] =
          await Promise.all([
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

        // Tính users theo campus
        const usersByCampus = {};
        campuses.forEach((campus) => {
          usersByCampus[campus.campusName] = users.filter(
            (user) => Number(user.campusId) === Number(campus.campusId)
          ).length;
        });

        // Tính classes theo campus
        const classesByCampus = {};
        campuses.forEach((campus) => {
          classesByCampus[campus.campusName] = classes.filter(
            (course) => course.campusId === campus.campusId
          ).length;
        });

        const maxUsers = Math.max(...Object.values(usersByCampus), 1);
        const maxClasses = Math.max(...Object.values(classesByCampus), 1);

        setMaxCounts({ users: maxUsers, classes: maxClasses });
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

  // Animate số liệu count-up
  useEffect(() => {
    const duration = 800; // ms
    const steps = 30;

    const animateCounts = (type, data) => {
      Object.entries(data).forEach(([key, end]) => {
        let start = 0;
        const increment = end / steps;
        const interval = setInterval(() => {
          start += increment;
          setAnimatedStats((prev) => ({
            ...prev,
            [type]: {
              ...prev[type],
              [key]: Math.min(Math.round(start), end),
            },
          }));
          if (start >= end) clearInterval(interval);
        }, duration / steps);
      });
    };

    animateCounts("usersByCampus", stats.usersByCampus);
    animateCounts("classesByCampus", stats.classesByCampus);
  }, [stats.usersByCampus, stats.classesByCampus]);

  const cardClass =
    "rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 transition-transform duration-300 hover:scale-105 hover:shadow-xl w-full text-center";

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
        📊 System Activity Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        {Object.entries(animatedStats.usersByCampus).map(([campusName, count]) => (
          <div
            key={campusName}
            className={`${cardClass} bg-gradient-to-r from-green-100 via-green-200 to-green-100 border-green-500`}
          >
            <div className="text-4xl mb-2">👤</div>
            <p className="text-gray-600 font-semibold">Users - {campusName}</p>
            <h3 className="text-3xl font-bold text-green-700">{count}</h3>
            <div className="w-full h-2 bg-green-300 rounded-full mt-2 overflow-hidden">
              <div
                className="h-2 bg-green-600 rounded-full transition-all duration-500"
                style={{ width: `${(count / maxCounts.users) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}

        {/* Classes */}
        {Object.entries(animatedStats.classesByCampus).map(([campusName, count]) => (
          <div
            key={campusName}
            className={`${cardClass} bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 border-blue-500`}
          >
            <div className="text-4xl mb-2">🏫</div>
            <p className="text-gray-600 font-semibold">Classes - {campusName}</p>
            <h3 className="text-3xl font-bold text-blue-700">{count}</h3>
            <div className="w-full h-2 bg-blue-300 rounded-full mt-2 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(count / maxCounts.classes) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}

        {/* Academic Years */}
        <div className={`${cardClass} bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 border-purple-500`}>
          <div className="text-4xl mb-2">🎓</div>
          <p className="text-gray-600 font-semibold">Academic Years</p>
          <h3 className="text-3xl font-bold text-purple-700">{stats.totalAcademicYears}</h3>
        </div>

        {/* Semesters */}
        <div className={`${cardClass} bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 border-yellow-500`}>
          <div className="text-4xl mb-2">📅</div>
          <p className="text-gray-600 font-semibold">Semesters</p>
          <h3 className="text-3xl font-bold text-yellow-700">{stats.totalSemesters}</h3>
        </div>
      </div>
    </div>
  );
}
