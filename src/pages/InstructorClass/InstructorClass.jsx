import React, { useState } from "react";

const InstructorClass = () => {
  const [search, setSearch] = useState("");

  const classesData = [
    { subject: "Thiết kế UI/UX", code: "WDU391", className: "SE1819", students: 35, status: "Đang học" },
    { subject: "Lập trình Web", code: "WED201", className: "SE1718", students: 32, status: "Đang học" },
    { subject: "Cơ sở dữ liệu", code: "CSD302", className: "SE1817", students: 29, status: "Đã kết thúc" },
    { subject: "Phân tích dữ liệu", code: "PMG391", className: "SE1920", students: 31, status: "Đang học" },
    { subject: "Toán cao cấp", code: "MAD201", className: "SE1921", students: 30, status: "Sắp bắt đầu" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Đang học":
        return "bg-green-100 text-green-700";
      case "Đã kết thúc":
        return "bg-yellow-100 text-yellow-700";
      case "Sắp bắt đầu":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredClasses = classesData.filter((cls) =>
    cls.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Danh sách lớp học</h2>
          <p className="text-sm text-gray-500">Quản lý và theo dõi các lớp học hiện tại</p>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600 text-sm">
            <th className="px-4 py-2 font-medium">Tên môn học</th>
            <th className="px-4 py-2 font-medium">Tên lớp học</th>
            <th className="px-4 py-2 font-medium">Số sinh viên</th>
            <th className="px-4 py-2 font-medium">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {filteredClasses.map((cls, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">{cls.subject}</div>
                  <div className="text-xs text-gray-500">{cls.code}</div>
                </div>
              </td>
              <td className="px-4 py-3">{cls.className}</td>
              <td className="px-4 py-3">{cls.students}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(cls.status)}`}>
                  {cls.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorClass;
