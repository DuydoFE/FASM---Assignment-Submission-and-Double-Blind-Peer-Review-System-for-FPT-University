import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getAllConfigs, updateConfig } from "../../service/adminService";
import { Card, Table, Modal, Form, Input, Button, Tag, Space } from "antd";
import { EditOutlined, SettingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

export default function AdminSystemSetting() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ configValue: "", description: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingConfig, setPendingConfig] = useState(null);

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
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ configValue: "", description: "" });
    setShowEditModal(false);
  };

  const handleSave = async (config) => {
    try {
      const request = {
        configKey: config.configKey,
        configValue: editForm.configValue,
        description: config.description,
        updatedByUserId: 1
      };
      const res = await updateConfig(request);
      toast.success(res?.data?.message || "Configuration updated successfully!");
      setEditingId(null);
      setShowEditModal(false);
      fetchConfigs();
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Failed to update configuration.";
      toast.error(errorMsg);
    }
  };

  const getBorderColor = (key) => {
    if (key.toLowerCase().includes("token")) return "border-yellow-400";
    if (key.toLowerCase().includes("score")) return "border-green-400";
    if (key.toLowerCase().includes("word")) return "border-blue-400";
    return "border-gray-300";
  };

  const getTagColor = (key) => {
    if (key.toLowerCase().includes("token")) return "gold";
    if (key.toLowerCase().includes("score")) return "green";
    if (key.toLowerCase().includes("word")) return "blue";
    return "default";
  };

  const hasChanges = () => {
    const original = settings.find(s => s.configId === editingId);
    return original && editForm.configValue !== original.configValue;
  };

  const columns = [
    {
      title: "Key",
      dataIndex: "configKey",
      key: "configKey",
      width: "25%",
      render: (text) => (
        <Tag color={getTagColor(text)} className="font-semibold">
          {text}
        </Tag>
      ),
    },
    {
      title: "Value",
      dataIndex: "configValue",
      key: "configValue",
      width: "20%",
      render: (text) => <span className="font-medium text-gray-900">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "35%",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "15%",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: "5%",
      align: "center",
      render: (_, record) => (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
            className="text-blue-600 hover:text-blue-700"
          />
        </motion.div>
      ),
    },
  ];

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 text-lg">Loading configurations...</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <Toaster position="top-right" />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-[#F36F21] flex items-center gap-2 mb-6"
      >
        <SettingOutlined /> System Configuration Panel
      </motion.h2>

      {/* Configuration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.map((config, index) => (
          <motion.div
            key={config.configId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              className={`shadow-md hover:shadow-lg transition-all border-t-4 ${getBorderColor(
                config.configKey
              )}`}
              actions={[
                <Button
                  key="edit"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(config)}
                  style={{ background: "#1890ff" }}
                >
                  Edit Configuration
                </Button>,
              ]}
            >
              <div className="space-y-2">
                <Tag color={getTagColor(config.configKey)} className="font-semibold mb-2">
                  {config.configKey}
                </Tag>
                <p className="text-gray-600 text-sm mb-2">{config.description}</p>
                <p className="text-lg font-bold text-gray-900">{config.configValue}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Updated: {new Date(config.updatedAt).toLocaleString()}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Preview Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🔍 Configurations Preview
        </h3>
        <Table
          columns={columns}
          dataSource={settings}
          rowKey="configId"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </motion.div>

      {/* Edit Modal */}
      <Modal
        title={
          <span className="text-xl font-semibold text-[#F36F21]">
            Edit Configuration
          </span>
        }
        open={showEditModal}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        {editingId && (
          <Form layout="vertical" className="mt-4">
            <Form.Item
              label={
                <span className="font-semibold">
                  Configuration Key
                </span>
              }
            >
              <Tag
                color={getTagColor(
                  settings.find(s => s.configId === editingId)?.configKey
                )}
                className="text-base py-1 px-3"
              >
                {settings.find(s => s.configId === editingId)?.configKey}
              </Tag>
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Value</span>}
              required
            >
              <Input
                name="configValue"
                value={editForm.configValue}
                onChange={handleEditChange}
                placeholder="Enter configuration value"
                className="text-base"
              />
            </Form.Item>

            <Form.Item label={<span className="font-semibold">Description</span>}>
              <Input.TextArea
                value={settings.find(s => s.configId === editingId)?.description}
                disabled
                rows={2}
                className="bg-gray-100"
              />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                icon={hasChanges() ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                onClick={() => {
                  setPendingConfig(settings.find(s => s.configId === editingId));
                  setShowConfirm(true);
                }}
                disabled={!hasChanges()}
                style={{
                  background: hasChanges() ? "#52c41a" : undefined,
                }}
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* Confirm Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold text-[#F36F21]">
            ℹ️ Confirm Update
          </span>
        }
        open={showConfirm}
        onCancel={() => {
          setShowConfirm(false);
          setPendingConfig(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setShowConfirm(false);
              setPendingConfig(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            style={{ background: "#52c41a" }}
            onClick={() => {
              handleSave(pendingConfig);
              setShowConfirm(false);
              setPendingConfig(null);
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        <p className="text-gray-600">
          Are you sure you want to update this configuration?
        </p>
      </Modal>
    </motion.div>
  );
}
