import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../service/adminService";
import { Table, Button, Modal, Form, Input, Select, Dropdown, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, BookOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseName: "",
    isActive: true,
  });

  const [editCourse, setEditCourse] = useState({
    courseId: 0,
    courseCode: "",
    courseName: "",
    isActive: true,
  });

  const [originalCourse, setOriginalCourse] = useState(null);
  const isChanged =
    editCourse.courseCode !== originalCourse?.courseCode ||
    editCourse.courseName !== originalCourse?.courseName ||
    editCourse.isActive !== originalCourse?.isActive;

  /* ================= LOAD ================= */
  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await getAllCourses();
      setCourses(res?.data || []);
      setFilteredCourses(res?.data || []);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((c) =>
        c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, courses]);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!newCourse.courseCode || !newCourse.courseName) {
      toast.error("Please fill all fields");
      return;
    }

    const id = toast.loading("Creating course...");
    try {
      const res = await createCourse(newCourse);
      toast.success(res?.message || "Created successfully!", { id });
      setShowAddModal(false);
      setNewCourse({ courseCode: "", courseName: "", isActive: true });
      loadCourses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed", { id });
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = () => {
    setConfirmConfig({
      message: "Are you sure you want to update this course?",
      onConfirm: async () => {
        const id = toast.loading("Updating...");
        try {
          const res = await updateCourse(editCourse);
          toast.success(res?.message || "Updated successfully!", { id });
          setShowEditModal(false);
          loadCourses();
        } catch (err) {
          toast.error(err?.response?.data?.message || "Update failed", { id });
        }
      },
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = (courseId) => {
    setConfirmConfig({
      message: "Are you sure you want to delete this course?",
      onConfirm: async () => {
        const id = toast.loading("Deleting...");
        try {
          const res = await deleteCourse(courseId);
          toast.success(res?.message || "Deleted successfully!", { id });
          loadCourses();
        } catch (err) {
          toast.error(err?.response?.data?.message || "Delete failed", { id });
        }
      },
    });
  };

  const columns = [
    {
      title: "Course Code",
      dataIndex: "courseCode",
      key: "courseCode",
      width: "25%",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
      width: "45%",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: "15%",
      align: "center",
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Active
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Inactive
          </Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
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
            onClick: () => {
              setEditCourse(record);
              setOriginalCourse(record);
              setShowEditModal(true);
            },
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
            onClick: () => handleDelete(record.courseId),
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
          <BookOutlined /> Course Management
        </motion.h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by course code or name..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            style={{
              background: "#F36F21",
              borderColor: "#F36F21",
              height: "40px",
              fontWeight: "600",
            }}
          >
            Create Course
          </Button>
        </motion.div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="courseId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* ADD MODAL */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Create Course</span>}
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          setNewCourse({ courseCode: "", courseName: "", isActive: true });
        }}
        footer={null}
        width={500}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Course Code" required>
            <Input
              placeholder="Course Code"
              value={newCourse.courseCode}
              onChange={(e) =>
                setNewCourse({ ...newCourse, courseCode: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Course Name" required>
            <Input
              placeholder="Course Name"
              value={newCourse.courseName}
              onChange={(e) =>
                setNewCourse({ ...newCourse, courseName: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Status" required>
            <Select
              value={newCourse.isActive}
              onChange={(value) =>
                setNewCourse({
                  ...newCourse,
                  isActive: value,
                })
              }
            >
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleCreate}
              style={{ background: "#52c41a" }}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Update Course</span>}
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setEditCourse({ courseId: 0, courseCode: "", courseName: "", isActive: true });
          setOriginalCourse(null);
        }}
        footer={null}
        width={500}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Course Code" required>
            <Input
              value={editCourse.courseCode}
              onChange={(e) =>
                setEditCourse({ ...editCourse, courseCode: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Course Name" required>
            <Input
              value={editCourse.courseName}
              onChange={(e) =>
                setEditCourse({ ...editCourse, courseName: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Status" required>
            <Select
              value={editCourse.isActive}
              onChange={(value) =>
                setEditCourse({
                  ...editCourse,
                  isActive: value,
                })
              }
            >
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleUpdate}
              disabled={!isChanged}
              style={{ background: isChanged ? "#1890ff" : undefined }}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* CONFIRM MODAL */}
      <Modal
        title={
          <span className="text-lg font-semibold text-red-600">
            ⚠️ Confirm Action
          </span>
        }
        open={confirmConfig !== null}
        onCancel={() => setConfirmConfig(null)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setConfirmConfig(null)}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={async () => {
              await confirmConfig.onConfirm();
              setConfirmConfig(null);
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>{confirmConfig?.message}</p>
      </Modal>
    </motion.div>
  );
}
