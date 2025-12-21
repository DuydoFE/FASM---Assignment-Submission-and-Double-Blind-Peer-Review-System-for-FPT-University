import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllMajors,
  createMajor,
  updateMajor,
  deleteMajor,
} from "../../service/adminService";
import { Table, Button, Modal, Form, Input, Select, Dropdown, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

export default function AdminMajorManagement() {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newMajor, setNewMajor] = useState({
    majorCode: "",
    majorName: "",
  });

  const [editingMajor, setEditingMajor] = useState(null);
  const [originalMajor, setOriginalMajor] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null);

  const validateNewMajor = () => {
    if (!newMajor.majorCode.trim()) {
      toast.error("Major Code is required");
      return false;
    }

    if (!newMajor.majorName.trim()) {
      toast.error("Major Name is required");
      return false;
    }

    return true;
  };

  const isAddFormInvalid =
    !newMajor.majorCode.trim() || !newMajor.majorName.trim();

  const loadMajors = async () => {
    setLoading(true);
    try {
      const res = await getAllMajors();
      setMajors(res?.data || []);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to load majors";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMajors();
  }, []);

  const openEdit = (major) => {
    const majorCopy = {
      majorId: major.majorId,
      majorCode: major.majorCode,
      majorName: major.majorName,
      isActive: major.isActive,
    };
    setEditingMajor(majorCopy);
    setOriginalMajor(majorCopy);
    setShowEditModal(true);
  };

  const isUnchanged =
    editingMajor &&
    originalMajor &&
    editingMajor.majorCode === originalMajor.majorCode &&
    editingMajor.majorName === originalMajor.majorName &&
    editingMajor.isActive === originalMajor.isActive;

  const getMessageFromResponse = (res) => {
    return (
      res?.data?.message ||
      res?.data?.data?.message ||
      res?.message ||
      ""
    );
  };

  const handleConfirm = async () => {
    try {
      let res;

      if (confirmAction.type === "create") {
        res = await createMajor(newMajor);
        toast.success(getMessageFromResponse(res));
        setNewMajor({ majorCode: "", majorName: "" });
        setShowAddModal(false);
      }

      if (confirmAction.type === "update") {
        res = await updateMajor(editingMajor);
        toast.success(getMessageFromResponse(res));
        setEditingMajor(null);
        setOriginalMajor(null);
        setShowEditModal(false);
      }

      if (confirmAction.type === "delete") {
        res = await deleteMajor(confirmAction.payload);
        toast.success(getMessageFromResponse(res));
      }

      await loadMajors();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.message ||
        "Action failed";
      toast.error(errorMessage);
    } finally {
      setConfirmAction(null);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "majorCode",
      key: "majorCode",
      width: "30%",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "majorName",
      key: "majorName",
      width: "50%",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: "10%",
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
            onClick: () => openEdit(record),
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
            onClick: () =>
              setConfirmAction({
                type: "delete",
                payload: record.majorId,
              }),
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
          <BookOutlined /> Major Management
        </motion.h2>

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
            Create Major
          </Button>
        </motion.div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <Table
          columns={columns}
          dataSource={majors}
          rowKey="majorId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* ADD MODAL */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Add New Major</span>}
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          setNewMajor({ majorCode: "", majorName: "" });
        }}
        footer={null}
        width={500}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Major Code" required>
            <Input
              placeholder="Major Code"
              value={newMajor.majorCode}
              onChange={(e) =>
                setNewMajor({ ...newMajor, majorCode: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Major Name" required>
            <Input
              placeholder="Major Name"
              value={newMajor.majorName}
              onChange={(e) =>
                setNewMajor({ ...newMajor, majorName: e.target.value })
              }
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button
              type="primary"
              disabled={isAddFormInvalid}
              onClick={() => {
                if (!validateNewMajor()) return;
                setConfirmAction({ type: "create" });
              }}
              style={{ background: isAddFormInvalid ? undefined : "#52c41a" }}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Update Major</span>}
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setEditingMajor(null);
          setOriginalMajor(null);
        }}
        footer={null}
        width={500}
      >
        {editingMajor && (
          <Form layout="vertical" className="mt-4">
            <Form.Item label="Major Code" required>
              <Input
                value={editingMajor.majorCode}
                onChange={(e) =>
                  setEditingMajor({
                    ...editingMajor,
                    majorCode: e.target.value,
                  })
                }
              />
            </Form.Item>

            <Form.Item label="Major Name" required>
              <Input
                value={editingMajor.majorName}
                onChange={(e) =>
                  setEditingMajor({
                    ...editingMajor,
                    majorName: e.target.value,
                  })
                }
              />
            </Form.Item>

            <Form.Item label="Status" required>
              <Select
                value={editingMajor.isActive}
                onChange={(value) =>
                  setEditingMajor({
                    ...editingMajor,
                    isActive: value,
                  })
                }
              >
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMajor(null);
                  setOriginalMajor(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => setConfirmAction({ type: "update" })}
                disabled={isUnchanged}
                style={{ background: isUnchanged ? undefined : "#1890ff" }}
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* CONFIRM MODAL */}
      <Modal
        title={
          <span className="text-lg font-semibold text-red-600">
            ⚠️ Confirm Action
          </span>
        }
        open={confirmAction !== null}
        onCancel={() => setConfirmAction(null)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmAction(null)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={handleConfirm}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>This action cannot be undone. Are you sure?</p>
      </Modal>
    </motion.div>
  );
}
