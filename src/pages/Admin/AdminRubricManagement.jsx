import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Table, Dropdown, Input, Select, Button, Modal, Form, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined, CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  getAllMajors,
  getAllCourses,
  getAllRubricTemplates,
  createRubricTemplate,
  updateRubricTemplate,
  deleteRubricTemplate,
} from "../../service/adminService";

export default function AdminRubricManagement() {
  const navigate = useNavigate();
  const [rubrics, setRubrics] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRubric, setCurrentRubric] = useState(null);
  const [newRubric, setNewRubric] = useState({ title: "", majorId: 0, courseId: 0, isPublic: true });
  const [search, setSearch] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [courses, setCourses] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadMajors();
        await loadCourses();
        await loadRubrics();
      } catch (err) { }
    };
    fetchData();
  }, []);

  const loadMajors = async () => {
    try {
      const res = await getAllMajors();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        setMajors(res.data);
      } else {
        toast.error(res?.message || "Failed to load majors.");
      }
    } catch (err) {
      toast.error("Server error loading majors.");
    }
  };

  const loadCourses = async () => {
    try {
      const res = await getAllCourses();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        setCourses(res.data);
      } else {
        toast.error(res?.message || "Failed to load courses.");
      }
    } catch (err) {
      toast.error("Server error loading courses.");
    }
  };

  const loadRubrics = async () => {
    setLoading(true);
    try {
      const res = await getAllRubricTemplates();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        const mapped = res.data.map((r) => {
          const major = majors.find((m) => m.majorId === r.majorId);
          return {
            id: r.templateId,
            title: r.title,
            majorId: r.majorId,
            majorName: r.majorName || major?.majorName || "-",
            courseId: r.courseId,
            courseName: r.courseName || "-",
            criteria: r.criteriaTemplates?.map((c) => c.title).join(", ") || "-",
            criteriaCount: r.criteriaTemplates?.length || 0,
            assignmentsUsing: r.assignmentsUsingTemplate?.length || 0,
            createdBy: r.createdByUserName,
            createdAt: new Date(r.createdAt).toLocaleString(),
            isPublic: r.isPublic,
          };
        });
        setRubrics(mapped);
      } else {
        toast.error(res?.message || "Failed to load rubrics.");
      }
    } catch (err) {
      toast.error("Failed to load rubrics from server.");
    } finally {
      setLoading(false);
    }
  };

  const isChanged =
    currentRubric &&
    (newRubric.title !== currentRubric.title ||
      newRubric.majorId !== currentRubric.majorId ||
      newRubric.courseId !== currentRubric.courseId ||
      newRubric.isPublic !== currentRubric.isPublic);

  const getApiMessage = (res, defaultMsg = "Operation failed") => {
    return res?.message || defaultMsg;
  };

  const handleCreateRubric = async (values) => {
    if (!newRubric.title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    if (!newRubric.courseId) {
      toast.error("Please select a course.");
      return;
    }

    try {
      const payload = {
        title: newRubric.title,
        courseId: newRubric.courseId,
        createdByUserId: 1,
      };
      const res = await createRubricTemplate(payload);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(getApiMessage(res, "Rubric created successfully!"));
        setShowCreateModal(false);
        setNewRubric({ title: "", majorId: 0, courseId: 0, isPublic: true });
        await loadRubrics();
      } else {
        toast.error(getApiMessage(res, "Failed to create rubric."));
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Server error creating rubric.");
    }
  };

  const handleUpdateRubric = async (values) => {
    if (!newRubric.title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    try {
      const payload = {
        templateId: currentRubric.id,
        title: newRubric.title,
        majorId: newRubric.majorId,
        courseId: newRubric.courseId
      };
      const res = await updateRubricTemplate(payload);
      if (res?.statusCode === 200) {
        toast.success(getApiMessage(res, "Rubric updated successfully!"));
        setShowEditModal(false);
        await loadRubrics();
      } else {
        toast.error(getApiMessage(res, "Failed to update rubric."));
      }
    } catch (err) {
      toast.error("Server error updating rubric.");
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteRubric = async (id) => {
    const rubric = rubrics.find((r) => r.id === id);
    setDeleteTarget(rubric);
  };

  const confirmDeleteRubric = async () => {
    if (!deleteTarget) return;

    try {
      const res = await deleteRubricTemplate(deleteTarget.id);
      if (res?.statusCode === 200) {
        toast.success(getApiMessage(res, "Rubric deleted successfully!"));
        setRubrics(rubrics.filter((r) => r.id !== deleteTarget.id));
      } else {
        toast.error(getApiMessage(res, "Failed to delete rubric."));
      }
    } catch (err) {
      toast.error("Server error deleting rubric.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDeleteRubric = () => setDeleteTarget(null);

  const openEditModal = (rubric) => {
    setCurrentRubric(rubric);
    setNewRubric({ title: rubric.title, majorId: rubric.majorId, courseId: rubric.courseId || 0, isPublic: rubric.isPublic });
    setShowEditModal(true);
  };

  const filteredRubrics = rubrics.filter(
    (r) =>
      (selectedCourseId === 0 || r.courseId === selectedCourseId) &&
      r.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "# Criteria",
      dataIndex: "criteriaCount",
      key: "criteriaCount",
      align: "center",
    },
    {
      title: "Assignments Using",
      dataIndex: "assignmentsUsing",
      key: "assignmentsUsing",
      align: "center",
    },
    {
      title: "Public",
      dataIndex: "isPublic",
      key: "isPublic",
      align: "center",
      render: (isPublic) => (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isPublic ? (
            <CheckCircleOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
          ) : (
            <CloseCircleOutlined style={{ fontSize: "20px", color: "#ff4d4f" }} />
          )}
        </motion.div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 80,
      render: (_, record) => {
        const items = [
          {
            key: "view",
            label: (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2"
              >
                <EyeOutlined /> View
              </motion.div>
            ),
            onClick: () => navigate(`/admin/rubrics/${record.id}`),
          },
          {
            key: "edit",
            label: (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2"
              >
                <EditOutlined /> Update
              </motion.div>
            ),
            onClick: () => openEditModal(record),
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-red-600"
              >
                <DeleteOutlined /> Delete
              </motion.div>
            ),
            danger: true,
            onClick: () => handleDeleteRubric(record.id),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="text"
                icon={<MoreOutlined style={{ fontSize: "20px" }} />}
              />
            </motion.div>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <Toaster position="top-right" reverseOrder={false} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-[#F36F21] flex items-center gap-2">
          📋 Rubric Management
        </h2>
      </motion.div>

      {/* Search + Course Filter + Add button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4"
      >
        <Input
          placeholder="Search rubrics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
          size="large"
        />

        <Select
          value={selectedCourseId}
          onChange={(value) => setSelectedCourseId(value)}
          style={{ minWidth: "180px" }}
          size="large"
        >
          <Select.Option value={0}>-- Select Course --</Select.Option>
          {courses.map((c) => (
            <Select.Option key={c.courseId} value={c.courseId}>
              {c.courseCode}
            </Select.Option>
          ))}
        </Select>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowCreateModal(true)}
            size="large"
            style={{ backgroundColor: "#F36F21", borderColor: "#F36F21" }}
          >
            Create Rubric
          </Button>
        </motion.div>
      </motion.div>

      {/* Rubrics table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Table
          columns={columns}
          dataSource={filteredRubrics}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} rubrics`,
          }}
          locale={{ emptyText: "No rubrics found" }}
        />
      </motion.div>

      {/* CREATE MODAL */}
      <Modal
        title="Create New Rubric"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
      >
        <Form onFinish={handleCreateRubric} layout="vertical">
          <Form.Item
            label="Rubric Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              value={newRubric.title}
              onChange={(e) => setNewRubric({ ...newRubric, title: e.target.value })}
              placeholder="Rubric Title"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Course"
            name="courseId"
            rules={[{ required: true, message: "Please select a course" }]}
          >
            <Select
              value={newRubric.courseId}
              onChange={(value) => setNewRubric({ ...newRubric, courseId: value })}
              size="large"
            >
              <Select.Option value={0}>Select Course</Select.Option>
              {courses.map((c) => (
                <Select.Option key={c.courseId} value={c.courseId}>
                  {c.courseCode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#F36F21", borderColor: "#F36F21" }}
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title="Edit Rubric"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        <Form onFinish={handleUpdateRubric} layout="vertical">
          <Form.Item
            label="Rubric Title"
            name="title"
            initialValue={newRubric.title}
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              value={newRubric.title}
              onChange={(e) => setNewRubric({ ...newRubric, title: e.target.value })}
              placeholder="Rubric Title"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Course"
            name="courseId"
            initialValue={newRubric.courseId}
            rules={[{ required: true, message: "Please select a course" }]}
          >
            <Select
              value={newRubric.courseId}
              onChange={(value) => setNewRubric({ ...newRubric, courseId: value })}
              size="large"
            >
              <Select.Option value={0}>Select Course</Select.Option>
              {courses.map((c) => (
                <Select.Option key={c.courseId} value={c.courseId}>
                  {c.courseCode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!isChanged}
                style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
              >
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        title="Confirm Delete"
        open={!!deleteTarget}
        onCancel={cancelDeleteRubric}
        footer={[
          <Button key="cancel" onClick={cancelDeleteRubric}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={confirmDeleteRubric}>
            Delete
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete <span className="font-bold">{deleteTarget?.title}</span>?
        </p>
      </Modal>
    </div>
  );
}
