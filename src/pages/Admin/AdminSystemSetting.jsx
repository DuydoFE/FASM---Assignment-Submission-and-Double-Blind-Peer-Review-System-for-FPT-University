import React, { useState } from "react";

export default function AdminSystemSetting() {
  const [settings, setSettings] = useState({
    aiTokenLimit: 5000,
    aiResponseWordLimit: 300,
    scorePrecision: 0.25,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("✅ Cấu hình đã được lưu thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold text-orange-500">
        ⚙️ System Configuration Panel
      </h2>

      {/* Thông tin chung */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Token Limit */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500">
          <p className="text-gray-500 mb-2">AI Token Limit</p>
          <input
            type="number"
            name="aiTokenLimit"
            value={settings.aiTokenLimit}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <p className="text-sm text-gray-600 mt-2">
            Giới hạn số lượng token AI được phép dùng trong mỗi phiên.
          </p>
        </div>

        {/* Response Word Limit */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
          <p className="text-gray-500 mb-2">AI Response Word Limit</p>
          <input
            type="number"
            name="aiResponseWordLimit"
            value={settings.aiResponseWordLimit}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <p className="text-sm text-gray-600 mt-2">
            Số lượng từ tối đa AI có thể phản hồi trong mỗi câu trả lời.
          </p>
        </div>

        {/* Score Precision */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
          <p className="text-gray-500 mb-2">Score Precision</p>
          <select
            name="scorePrecision"
            value={settings.scorePrecision}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
          >
            <option value={0.25}>0.25</option>
            <option value={0.5}>0.5</option>
            <option value={0.75}>0.75</option>
            <option value={1}>1.0</option>
          </select>
          <p className="text-sm text-gray-600 mt-2">
            Quy định mức độ chi tiết khi nhập điểm (ví dụ 0.25, 0.5...).
          </p>
        </div>
      </div>

      {/* Khu vực xem trước & lưu */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          🔍 Current Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400">
            <p className="text-sm text-gray-500">AI Token Limit</p>
            <h4 className="text-xl font-bold text-orange-600">
              {settings.aiTokenLimit}
            </h4>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-gray-500">Response Word Limit</p>
            <h4 className="text-xl font-bold text-blue-600">
              {settings.aiResponseWordLimit}
            </h4>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-400">
            <p className="text-sm text-gray-500">Score Precision</p>
            <h4 className="text-xl font-bold text-green-600">
              {settings.scorePrecision}
            </h4>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            💾 Save Configuration
          </button>
        </div>
      </div>

      {/* Cảnh báo hệ thống */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">⚠️ Notes & Warnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <p className="text-yellow-700 font-medium">
              Token limit quá thấp có thể khiến AI dừng giữa chừng.
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <p className="text-red-700 font-medium">
              Cấu hình không hợp lệ có thể ảnh hưởng đến tính chính xác của điểm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
