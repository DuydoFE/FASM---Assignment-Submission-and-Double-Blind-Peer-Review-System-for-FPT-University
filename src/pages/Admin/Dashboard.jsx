import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);

  const username = "AdminUser"; // Current account name

  const stats = [
    { title: "Total Classes", value: 12, color: "#FFA726" },
    { title: "Total Students", value: 300, color: "#FFB74D" },
    { title: "Total Teachers", value: 15, color: "#FF9800" },
    { title: "Assignments Created", value: 45, color: "#FB8C00" },
    { title: "Assignments Graded", value: 32, color: "#F57C00" },
  ];

  const chartData = [
    { name: "Class 1", assignments: 5 },
    { name: "Class 2", assignments: 8 },
    { name: "Class 3", assignments: 4 },
    { name: "Class 4", assignments: 6 },
    { name: "Class 5", assignments: 3 },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      
      {/* Orange header bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "#FF9800", // orange
        color: "#fff",
        position: "relative",
        zIndex: 1000,
      }}>
        <h2 style={{ margin: 0 }}>📊 Admin Dashboard</h2>

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {username} ▼
          </button>
          {showMenu && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "100%",
              background: "#fff",
              color: "#333",
              borderRadius: "6px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              padding: "10px",
              minWidth: "150px",
              zIndex: 2000,
            }}>
              <div style={{ padding: "8px", cursor: "pointer" }}>Manage Profile</div>
              <div style={{ padding: "8px", cursor: "pointer" }}>Settings</div>
              <div style={{ padding: "8px", cursor: "pointer", color: "red" }}>Logout</div>
            </div>
          )}
        </div>
      </div>

      {/* Body content */}
      <div style={{ padding: "30px" }}>
        
        {/* Statistics section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                background: stat.color,
                color: "#fff",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ fontSize: "1.2rem" }}>{stat.title}</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "10px" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart section */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginBottom: "20px", color: "#333" }}>📈 Assignments by Class</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="assignments" fill="#FF7043" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
