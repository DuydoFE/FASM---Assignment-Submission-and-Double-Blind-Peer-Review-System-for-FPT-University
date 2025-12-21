import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../service/adminService";
import toast, { Toaster } from "react-hot-toast";
import { Table, Button, Modal, Form, Select, Input, Dropdown, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const getApiMessage = (errorOrResponse) => {
  if (!errorOrResponse) return "Unknown error";
  if (errorOrResponse.response?.data?.message) return errorOrResponse.response.data.message;
  if (errorOrResponse?.data?.message) return errorOrResponse.data.message;
  if (errorOrResponse.message) return errorOrResponse.message;
  return "Unknown error";
};

export default function AdminSemesterManagement() {
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [newSemester, setNewSemester] = useState({
    academicYearId: "",
    name: "",
    startDate: "",
    endDate: "",
  });
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterYearId, setFilterYearId] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    semesterId: null,
    callback: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAcademicYears();
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    setLoading(true);
    try {
      const res = await getAllSemesters();
      if (res?.data) setSemesters(res.data);
    } catch (err) {
      toast.error(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadAcademicYears = async () => {
    try {
      const res = await getAllAcademicYears();
      if (res?.data) setAcademicYears(res.data);
    } catch (err) {
      toast.error(getApiMessage(err));
    }
  };

  const semesterOptions = (academicYearName) => [
    `Spring ${academicYearName}`,
    `Summer ${academicYearName}`,
    `Fall ${academicYearName}`,
  ];

  const getPresetDates = (name, academicYearObj) => {
    if (!academicYearObj || !academicYearObj.name) return { startDate: "", endDate: "" };

    const parsedYear = academicYearObj.name.match(/^(\d{4})/)?.[1];
    if (!parsedYear) return { startDate: "", endDate: "" };

    const y = Number(parsedYear);

    const format = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;

    let start, end;

    switch (name) {
      case "Spring":
        start = new Date(y, 0, 1, 0, 0, 0, 0);
        end = new Date(y, 3, 30, 23, 59, 59, 999);
        break;

      case "Summer":
        start = new Date(y, 4, 1, 0, 0, 0, 0);
        end = new Date(y, 7, 31, 23, 59, 59, 999);
        break;

      case "Fall":
        start = new Date(y, 8, 1, 0, 0, 0, 0);
        end = new Date(y, 11, 31, 23, 59, 59, 999);
        break;

      default:
        start = new Date(y, 0, 1, 0, 0, 0, 0);
        end = new Date(y, 11, 31, 23, 59, 59, 999);
    }

    return {
      startDate: format(start),
      endDate: format(end),
    };
  };

  const handleSubmit = async () => {
    if (!newSemester.name || !newSemester.startDate || !newSemester.endDate)
      return toast.error("Please fill all fields");

    const formatForAPI = (value) => {
      if (!value) return null;
      return value.length === 16 ? value + ":00" : value;
    };

    const payload = {
      academicYearId: Number(newSemester.academicYearId),
      name: newSemester.name,
      startDate: formatForAPI(newSemester.startDate),
      endDate: formatForAPI(newSemester.endDate),
    };

    try {
      const res = await createSemester(payload);
      toast.success(getApiMessage(res));
      loadSemesters();
      setShowAddForm(false);
      setNewSemester({ academicYearId: "", name: "", startDate: "", endDate: "" });
    } catch (err) {
      toast.error(getApiMessage(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteSemester(id);
      toast.success(getApiMessage(res));
      loadSemesters();
    } catch (err) {
      toast.error(getApiMessage(err));
    }
  };

  const normalizeDate = (value) => {
    if (!value) return null;
    return value.length === 16 ? value + ":00" : value;
  };

  const hasChanged = (currentEdit) => {
    const original = semesters.find(s => s.semesterId === currentEdit.semesterId);
    if (!original) return false;

    return (
      original.academicYearId !== currentEdit.academicYearId ||
      original.name !== currentEdit.name ||
      (original.startDate?.slice(0, 16) || "") !== (currentEdit.startDate || "") ||
      (original.endDate?.slice(0, 16) || "") !== (currentEdit.endDate || "")
    );
  };

  const handleSaveEdit = async () => {
    if (!editing.academicYearId) return toast.error("Please select an academic year");
    if (!editing.name.trim()) return toast.error("Please enter semester name");
    if (!editing.startDate || !editing.endDate) return toast.error("Please select start and end date");

    try {
      const payload = {
        ...editing,
        startDate: normalizeDate(editing.startDate),
        endDate: normalizeDate(editing.endDate),
      };
      const res = await updateSemester(payload);
      if (res?.data) {
        const academicYear = academicYears.find(
          (y) => y.academicYearId === res.data.academicYearId
        );

        setSemesters(
          semesters.map((s) =>
            s.semesterId === editing.semesterId
              ? { ...res.data, academicYearName: academicYear?.name || "" }
              : s
          )
        );
        setEditing(null);
        setShowEditModal(false);
        toast.success(getApiMessage(res));
      }
    } catch (err) {
      toast.error(getApiMessage(err));
    }
  };

  const displayedSemesters = filterYearId
    ? semesters.filter((s) => s.academicYearId === Number(filterYearId))
    : [];

  const columns = [
    {
      title: "Academic Year",
      dataIndex: "academicYearName",
      key: "academicYearName",
      width: "25%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "startDate",
      width: "20%",
      render: (text) => text?.split("T")[0] || "-",
    },
    {
      title: "End",
      dataIndex: "endDate",
      key: "endDate",
      width: "20%",
      render: (text) => text?.split("T")[0] || "-",
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
            onClick: () => {
              setEditing({
                ...record,
                startDate: record.startDate ? record.startDate.slice(0, 16) : "",
                endDate: record.endDate ? record.endDate.slice(0, 16) : "",
              });
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
            onClick: () =>
              setConfirmModal({
                isOpen: true,
                type: "delete",
                semesterId: record.semesterId,
                callback: () => handleDelete(record.semesterId),
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
      <Toaster position="top-right" reverseOrder={false} />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-[#F36F21] flex items-center gap-2"
      >
        <CalendarOutlined /> Semester Management
      </motion.h2>

      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4">
        <Select
          placeholder="Select Academic Year to filter"
          style={{ minWidth: 250 }}
          value={filterYearId || undefined}
          onChange={(value) => setFilterYearId(value)}
          allowClear
        >
          {academicYears.map((year) => (
            <Select.Option key={year.academicYearId} value={year.academicYearId}>
              {year.name}
            </Select.Option>
          ))}
        </Select>

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
            Create Semester
          </Button>
        </motion.div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <Table
          columns={columns}
          dataSource={displayedSemesters}
          rowKey="semesterId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: !filterYearId
              ? "Select an academic year to see semesters"
              : "No semesters found",
          }}
        />
      </div>

      {/* CREATE MODAL */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Add New Semester</span>}
        open={showAddForm}
        onCancel={() => {
          setShowAddForm(false);
          setNewSemester({ academicYearId: "", name: "", startDate: "", endDate: "" });
        }}
        footer={null}
        width={500}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Academic Year" required>
            <Select
              placeholder="Select Academic Year"
              value={newSemester.academicYearId || undefined}
              onChange={(value) =>
                setNewSemester({ ...newSemester, academicYearId: value })
              }
            >
              {academicYears.map((year) => (
                <Select.Option key={year.academicYearId} value={year.academicYearId}>
                  {year.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Semester Name" required>
            <Select
              placeholder="Select Semester Name"
              value={newSemester.name || undefined}
              onChange={(value) => {
                const selectedYear = academicYears.find(
                  (y) => y.academicYearId === Number(newSemester.academicYearId)
                );
                const dates = getPresetDates(value.split(" ")[0], selectedYear);
                setNewSemester({
                  ...newSemester,
                  name: value,
                  startDate: dates.startDate,
                  endDate: dates.endDate,
                });
              }}
              disabled={!newSemester.academicYearId}
            >
              {newSemester.academicYearId &&
                semesterOptions(
                  academicYears.find((y) => y.academicYearId === newSemester.academicYearId)?.name
                ).map((option) => (
                  <Select.Option
                    key={option}
                    value={option}
                    disabled={semesters.some(
                      (s) => s.name === option && s.academicYearId === newSemester.academicYearId
                    )}
                  >
                    {option}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Start Date">
            <Input
              type="datetime-local"
              value={newSemester.startDate}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </Form.Item>

          <Form.Item label="End Date">
            <Input
              type="datetime-local"
              value={newSemester.endDate}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit} style={{ background: "#F36F21" }}>
              Create
            </Button>
          </div>
        </Form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title={<span className="text-xl font-semibold text-[#F36F21]">Edit Semester</span>}
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setEditing(null);
        }}
        footer={null}
        width={500}
      >
        {editing && (
          <Form layout="vertical" className="mt-4">
            <Form.Item label="Academic Year" required>
              <Select
                value={editing.academicYearId}
                onChange={(value) => {
                  const selectedYear = academicYears.find((y) => y.academicYearId === value);
                  const semesterShortName = editing.name.split(" ")[0] || "";
                  const dates = getPresetDates(semesterShortName, selectedYear);
                  setEditing({
                    ...editing,
                    academicYearId: value,
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                  });
                }}
              >
                {academicYears.map((year) => (
                  <Select.Option key={year.academicYearId} value={year.academicYearId}>
                    {year.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Semester Name" required>
              <Select
                value={editing.name}
                onChange={(value) => {
                  const selectedYear = academicYears.find(
                    (y) => y.academicYearId === editing.academicYearId
                  );
                  const shortName = value.split(" ")[0];
                  const dates = getPresetDates(shortName, selectedYear);
                  setEditing({
                    ...editing,
                    name: value,
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                  });
                }}
              >
                {editing.academicYearId &&
                  semesterOptions(
                    academicYears.find((y) => y.academicYearId === editing.academicYearId)?.name
                  ).map((option) => (
                    <Select.Option
                      key={option}
                      value={option}
                      disabled={semesters.some(
                        (s) =>
                          s.name === option &&
                          s.academicYearId === editing.academicYearId &&
                          s.semesterId !== editing.semesterId
                      )}
                    >
                      {option}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item label="Start Date">
              <Input
                type="datetime-local"
                value={editing.startDate || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </Form.Item>

            <Form.Item label="End Date">
              <Input
                type="datetime-local"
                value={editing.endDate || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button
                type="primary"
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: "edit",
                    semesterId: editing.semesterId,
                    callback: handleSaveEdit,
                  })
                }
                disabled={!hasChanged(editing)}
                style={{ background: hasChanged(editing) ? "#1890ff" : undefined }}
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
          <span className={confirmModal.type === "delete" ? "text-red-600" : "text-[#F36F21]"}>
            {confirmModal.type === "delete" ? "⚠️ " : "ℹ️ "}
            {confirmModal.type === "delete"
              ? "Delete Semester"
              : "Save Changes"}
          </span>
        }
        open={confirmModal.isOpen}
        onCancel={() => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          if (confirmModal.type === "edit") setEditing(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setConfirmModal({ ...confirmModal, isOpen: false });
              if (confirmModal.type === "edit") setEditing(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger={confirmModal.type === "delete"}
            onClick={() => {
              if (confirmModal.callback) confirmModal.callback();
              setConfirmModal({ ...confirmModal, isOpen: false });
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>
          {confirmModal.type === "delete"
            ? "Are you sure you want to delete this semester?"
            : "Are you sure you want to save changes?"}
        </p>
      </Modal>
    </motion.div>
  );
}
