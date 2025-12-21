import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../../service/adminService";
import { Toaster, toast } from "react-hot-toast";
import { Table, Button, Modal, Form, Input, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

/* ================= HELPER ================= */
const getErrorMessage = (error, defaultMsg = "Something went wrong") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors) return error.response.data.errors.join(", ");
  if (error?.message) return error.message;
  return defaultMsg;
};

/* ================= MAIN COMPONENT ================= */
export default function AdminAcademicYearManagement() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [newYearData, setNewYearData] = useState({
    campusId: 1,
    name: "",
    startDate: "",
    endDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  const [confirmConfig, setConfirmConfig] = useState(null);

  /* ================= UTIL ================= */
  const mapYear = (item) => ({
    id: item.academicYearId,
    campusId: item.campusId,
    campusName: item.campusName,
    name: item.name,
    startDate: item.startDate,
    endDate: item.endDate,
    semesterCount: item.semesterCount,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const formatForEdit = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  /* ================= LOAD ================= */
  const loadYears = async () => {
    setLoading(true);
    try {
      const res = await getAllAcademicYears();
      setYears((res?.data || []).map(mapYear));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load academic years"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  /* ================= ADD ================= */
  const handleYearNameChange = (value, isEdit = false) => {
    if (!/^\d{0,4}$/.test(value)) return;

    const updated = { name: value };
    if (value.length === 4) {
      updated.startDate = `${value}-01-01T00:00`;
      updated.endDate = `${value}-12-31T23:59`;
    }

    if (isEdit) {
      setEditingValues((prev) => ({ ...prev, ...updated }));
    } else {
      setNewYearData((prev) => ({ ...prev, ...updated }));
    }
  };

  const handleAddNewYear = async () => {
    if (!/^\d{4}$/.test(newYearData.name)) {
      toast.error("Year must be in format YYYY (e.g., 2025)");
      return;
    }

    const toastId = toast.loading("Processing...");
    try {
      const res = await createAcademicYear(newYearData);
      const msg = res?.data?.message || "New academic year added successfully";
      toast.success(msg, { id: toastId });

      setShowAddForm(false);
      setNewYearData({ campusId: 1, name: "", startDate: "", endDate: "" });
      loadYears();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add new academic year"), { id: toastId });
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (year) => {
    setEditingId(year.id);
    const editValues = {
      name: year.name,
      startDate: formatForEdit(year.startDate),
      endDate: formatForEdit(year.endDate),
    };
    setEditingValues(editValues);
    setOriginalValues(editValues);
    setShowEditForm(true);
  };

  const hasChanges = () => {
    return (
      editingValues.name !== originalValues.name ||
      editingValues.startDate !== originalValues.startDate ||
      editingValues.endDate !== originalValues.endDate
    );
  };

  const handleSaveEdit = () => {
    if (!hasChanges()) return;

    setConfirmConfig({
      title: "Update Academic Year",
      message: "Are you sure you want to save these changes?",
      onConfirm: async () => {
        setConfirmConfig(null);

        const toastId = toast.loading("Updating academic year...");
        try {
          const original = years.find((y) => y.id === editingId);

          await updateAcademicYear({
            academicYearId: editingId,
            campusId: original.campusId,
            name: editingValues.name,
            startDate: editingValues.startDate,
            endDate: editingValues.endDate,
          });

          toast.success("Academic year updated successfully", { id: toastId });
          setEditingId(null);
          setShowEditForm(false);
          loadYears();
        } catch (error) {
          toast.error(getErrorMessage(error, "Failed to update academic year"), { id: toastId });
        }
      },
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setConfirmConfig({
      title: "Delete Academic Year",
      message: "Are you sure you want to delete this academic year?",
      onConfirm: async () => {
        setConfirmConfig(null);

        const toastId = toast.loading("Deleting academic year...");
        try {
          await deleteAcademicYear(id);
          toast.success("Academic year deleted successfully", { id: toastId });
          loadYears();
        } catch (error) {
          toast.error(getErrorMessage(error, "Failed to delete academic year"), { id: toastId });
        }
      },
    });
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Academic Year",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: "25%",
      render: (text) => formatDate(text),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: "25%",
      render: (text) => formatDate(text),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      align: "center",
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: (
              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2">
                <EditOutlined /> Update
              </motion.div>
            ),
            onClick: () => handleEdit(record),
          },
          { type: "divider" },
          {
            key: "delete",
            label: (
              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2">
                <DeleteOutlined /> Delete
              </motion.div>
            ),
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  /* ================= RENDER ================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
    >
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-[#F36F21] flex items-center gap-2"
        >
          <CalendarOutlined /> Academic Year Management
        </motion.h2>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddForm(true)}
            style={{
              background: "#F36F21",
              borderColor: "#F36F21",
              height: "40px",
              fontWeight: "600",
            }}
          >
            Create Academic Year
          </Button>
        </motion.div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <Table
          columns={columns}
          dataSource={years}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* ================= ADD FORM MODAL ================= */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Add Academic Year</span>}
        open={showAddForm}
        onCancel={() => {
          setShowAddForm(false);
          setNewYearData({ campusId: 1, name: "", startDate: "", endDate: "" });
        }}
        footer={null}
        width={500}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Academic Year" required>
            <Input
              value={newYearData.name}
              onChange={(e) => handleYearNameChange(e.target.value)}
              placeholder="Academic Year (e.g., 2025)"
              maxLength={4}
            />
          </Form.Item>

          <Form.Item label="Start Date">
            <Input
              type="datetime-local"
              disabled
              value={newYearData.startDate}
              className="bg-gray-100 cursor-not-allowed"
            />
          </Form.Item>

          <Form.Item label="End Date">
            <Input
              type="datetime-local"
              disabled
              value={newYearData.endDate}
              className="bg-gray-100 cursor-not-allowed"
            />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                if (!/^\d{4}$/.test(newYearData.name)) {
                  toast.error("Academic Year must be yyyy (e.g. 2025)");
                  return;
                }
                setConfirmConfig({
                  title: "Create Academic Year",
                  message: "Are you sure you want to create this academic year?",
                  onConfirm: async () => {
                    setConfirmConfig(null);
                    await handleAddNewYear();
                  },
                });
              }}
              style={{ background: "#F36F21" }}
            >
              Create
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ================= EDIT FORM MODAL ================= */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Edit Academic Year</span>}
        open={showEditForm}
        onCancel={() => {
          setShowEditForm(false);
          setEditingId(null);
        }}
        footer={null}
        width={500}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Academic Year" required>
            <Input
              value={editingValues.name}
              onChange={(e) => handleYearNameChange(e.target.value, true)}
              placeholder="Academic Year (e.g., 2025)"
              maxLength={4}
            />
          </Form.Item>

          <Form.Item label="Start Date">
            <Input
              type="datetime-local"
              disabled
              value={editingValues.startDate}
              className="bg-gray-100 cursor-not-allowed"
            />
          </Form.Item>

          <Form.Item label="End Date">
            <Input
              type="datetime-local"
              disabled
              value={editingValues.endDate}
              className="bg-gray-100 cursor-not-allowed"
            />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setShowEditForm(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSaveEdit}
              disabled={!hasChanges()}
              style={{ background: hasChanges() ? "#1890ff" : undefined }}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ================= CONFIRM MODAL ================= */}
      {confirmConfig && (
        <Modal
          title={
            <span className={confirmConfig.title.includes("Delete") ? "text-red-600" : "text-[#F36F21]"}>
              {confirmConfig.title.includes("Delete") ? "⚠️ " : "ℹ️ "}
              {confirmConfig.title}
            </span>
          }
          open={true}
          onCancel={() => setConfirmConfig(null)}
          footer={[
            <Button key="cancel" onClick={() => setConfirmConfig(null)}>
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              danger={confirmConfig.title.includes("Delete")}
              onClick={confirmConfig.onConfirm}
            >
              Confirm
            </Button>,
          ]}
        >
          <p>{confirmConfig.message}</p>
        </Modal>
      )}
    </motion.div>
  );
}
