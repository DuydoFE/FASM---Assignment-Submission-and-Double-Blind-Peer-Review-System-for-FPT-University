import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getAllConfigs, updateConfig } from "../../service/adminService";

export default function AdminSystemSetting() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ configValue: "", description: "" });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await getAllConfigs();
      setSettings(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load system configurations.");
      setLoading(false);
    }
  };

  const handleEditClick = (config) => {
    setEditingId(config.configId);
    setEditForm({ configValue: config.configValue, description: config.description });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ configValue: "", description: "" });
  };

  const handleSave = async (config) => {
    try {
      const request = {
        configKey: config.configKey,
        configValue: editForm.configValue,
        description: editForm.description,
        updatedByUserId: 1, // default
      };

      await updateConfig([request]);
      toast.success("✅ Configuration updated successfully!");
      setEditingId(null);
      fetchConfigs();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update configuration.");
    }
  };

  const getBorderColor = (key) => {
    if (key.toLowerCase().includes("token")) return "border-yellow-400";
    if (key.toLowerCase().includes("score")) return "border-green-400";
    if (key.toLowerCase().includes("word")) return "border-blue-400";
    return "border-gray-300";
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 text-lg">Loading configurations...</p>
    );

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        ⚙️ System Configuration Panel
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.map((config) => (
          <div
            key={config.configId}
            className={`bg-white rounded-xl shadow-md p-6 border-t-4 ${getBorderColor(
              config.configKey
            )} hover:shadow-lg transition`}
          >
            <p className="text-gray-700 font-semibold mb-1">{config.configKey}</p>
            <p className="text-gray-400 mb-3 text-sm">{config.description}</p>
            <p className="text-gray-500 text-xs mb-3">
              Updated At: {new Date(config.updatedAt).toLocaleString()}
            </p>

            {editingId === config.configId ? (
              <>
                <input
                  type="text"
                  name="configValue"
                  value={editForm.configValue}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none mb-2"
                  placeholder="Value"
                />
                <input
                  type="text"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none mb-2"
                  placeholder="Description"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleSave(config)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => handleEditClick(config)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-2"
              >
                Edit Configuration
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          🔍 Configurations Preview
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Key
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Value
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {settings.map((config) => (
                <tr key={config.configId}>
                  <td className="px-4 py-2 text-sm text-gray-700">{config.configKey}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{config.configValue}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{config.description}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(config.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
