import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Tag,
  Space,
  Card,
  Modal,
  Form,
  message,
  ConfigProvider,
  Upload as AntUpload,
  Descriptions
} from "antd";
import {
  ArrowLeftOutlined,
  UserAddOutlined,
  TeamOutlined,
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined
} from "@ant-design/icons";

import {
  getCourseInstanceById,
  getCourseStudentsByCourseInstance,
  getCourseInstructorsByCourseInstance,
  deleteCourseInstructor,
  deleteCourseStudent,
  importStudentsFromExcel,
  createCourseStudent,
  createCourseInstructor,
} from "../../service/adminService";

// Custom theme for orange accent
const theme = {
  token: {
    colorPrimary: '#ea580c',
    colorLink: '#ea580c',
    borderRadius: 8,
  },
};

export default function AdminClassDetailsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addStudentForm] = Form.useForm();
  const [addInstructorForm] = Form.useForm();

  const [classInfo, setClassInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const changedByUserId = 1;
  const hasInstructor = instructors.length > 0;

  const [confirmModal, setConfirmModal] = useState({ show: false, user: null, type: "student" });
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [addInstructorModal, setAddInstructorModal] = useState(false);

  const refreshData = async () => {
    try {
      const [studentRes, instructorRes] = await Promise.all([
        getCourseStudentsByCourseInstance(id),
        getCourseInstructorsByCourseInstance(id),
      ]);

      setUsers(Array.isArray(studentRes?.data) ? studentRes.data : []);

      setInstructors(
        Array.isArray(instructorRes?.data)
          ? instructorRes.data.map((inst) => ({
              courseInstructorId: inst.id,
              courseInstanceId: inst.courseInstanceId,
              userId: inst.userId,
              instructorName: inst.instructorName,
              instructorEmail: inst.instructorEmail,
            }))
          : []
      );
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const classData = await getCourseInstanceById(id);
        setClassInfo(classData?.data || classData);
        await refreshData();
      } catch (err) {
        console.error("Error loading class details:", err);
        message.error("Failed to load class details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleConfirmRemove = async () => {
    if (!confirmModal.user) return;

    setLoading(true);
    try {
      const res = confirmModal.type === "student"
        ? await deleteCourseStudent(
            confirmModal.user.userId,
            id,
            confirmModal.user.courseStudentId
          )
        : await deleteCourseInstructor(
            confirmModal.user.courseInstructorId,
            confirmModal.user.courseInstanceId,
            confirmModal.user.instructorId || confirmModal.user.userId
          );

      message.success(res?.data?.message || res?.message || "Removed successfully!");
      await refreshData();
      setConfirmModal({ show: false, user: null, type: "student" });
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || err?.message || "Remove failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleImportFile = async (file) => {
    try {
      setLoading(true);
      const res = await importStudentsFromExcel(id, file, changedByUserId);
      message.success(res?.data?.message || res?.message || "Import students successful!");
      await refreshData();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || err?.message || "Import failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (values) => {
    try {
      setLoading(true);
      const res = await createCourseStudent({
        courseInstanceId: id,
        userId: 0,
        studentCode: values.studentCode,
        status: "Enrolled",
        changedByUserId,
      });
      message.success(res?.data?.message || res?.message || "Student added successfully!");
      setAddStudentModal(false);
      addStudentForm.resetFields();
      await refreshData();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || err?.message || "Failed to add student!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async (values) => {
    if (instructors.length > 0) {
      message.warning("This class already has an instructor!");
      return;
    }

    try {
      setLoading(true);
      const res = await createCourseInstructor({
        courseInstanceId: id,
        userName: values.userName,
        isMainInstructor: true,
      });
      message.success(res?.data?.message || res?.message || "Instructor added successfully!");
      setAddInstructorModal(false);
      addInstructorForm.resetFields();
      await refreshData();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || err?.message || "Failed to add instructor!");
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    {
      title: "Name",
      dataIndex: "studentName",
      key: "studentName",
      render: (name) => (
        <div className="font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {name?.[0]?.toUpperCase()}
          </div>
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "Student ID",
      dataIndex: "studentCode",
      key: "studentCode",
      render: (code) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {code}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "studentEmail",
      key: "studentEmail",
      render: (email) => (
        <span className="text-blue-600 hover:text-blue-800 transition-colors">
          {email}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      render: (role) => (
        <Tag color="blue" className="font-medium px-3 py-1">
          {role || "Student"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "Active" ? "success" : "error"}
          className="font-medium px-3 py-1"
        >
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${status === "Active" ? 'bg-green-500' : 'bg-red-500'}`} />
            {status}
          </span>
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => setConfirmModal({ show: true, user: record, type: "student" })}
        >
          Remove
        </Button>
      ),
    },
  ];

  const instructorColumns = [
    {
      title: "Name",
      dataIndex: "instructorName",
      key: "instructorName",
      render: (name) => (
        <div className="font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
            {name?.[0]?.toUpperCase()}
          </div>
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "instructorEmail",
      key: "instructorEmail",
      render: (email) => (
        <span className="text-blue-600 hover:text-blue-800 transition-colors">
          {email}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => setConfirmModal({ show: true, user: record, type: "instructor" })}
        >
          Remove
        </Button>
      ),
    },
  ];

  if (loading && !classInfo) return <p className="p-6 text-gray-500">Loading details...</p>;
  if (!classInfo) return <p className="p-6 text-gray-500">Class not found</p>;

  return (
    <ConfigProvider theme={theme}>
      <div className="p-6 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 min-h-screen">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/classes")}
            className="mb-4"
          >
            Back to Classes
          </Button>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Class Detail</h2>
          <p className="text-gray-500">View class information, students and instructors</p>
        </div>

        {/* Class Info Card */}
        <Card 
          className="mb-6 shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <Descriptions
            title="Class Information"
            bordered
            column={{ xs: 1, sm: 2, md: 2 }}
          >
            <Descriptions.Item label="Class Name">
              <span className="font-semibold">{classInfo.className || classInfo.sectionCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Course">
              <span className="font-semibold">{classInfo.courseCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Semester">
              <span className="font-semibold">{classInfo.semesterName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={classInfo.isActive ? "success" : "error"}
                className="font-medium px-3 py-1"
              >
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${classInfo.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  {classInfo.isActive ? "Active" : "Inactive"}
                </span>
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Action Buttons */}
        <Card 
          className="mb-6 shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <Space wrap>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setAddStudentModal(true)}
            >
              Add Student
            </Button>

            <Button
              icon={<TeamOutlined />}
              onClick={() => setAddInstructorModal(true)}
              disabled={hasInstructor}
            >
              Add Instructor
            </Button>

            <AntUpload
              accept=".xlsx, .xls"
              showUploadList={false}
              beforeUpload={(file) => {
                handleImportFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>
                Import Excel
              </Button>
            </AntUpload>

            <Button
              type="primary"
              ghost
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/admin/classes/${id}/assignments`)}
            >
              View Assignments
            </Button>
          </Space>

          {hasInstructor && (
            <p className="text-sm text-orange-600 mt-3 flex items-center gap-1">
              <span>⚠️</span>
              <span>This class already has an instructor.</span>
            </p>
          )}
        </Card>

        {/* Student List */}
        <Card 
          title={
            <span className="flex items-center gap-2">
              <TeamOutlined className="text-orange-600" />
              <span>Class Members ({users.length})</span>
            </span>
          }
          className="mb-6 shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Table
            columns={studentColumns}
            dataSource={users}
            rowKey="courseStudentId"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} students`,
            }}
            locale={{
              emptyText: "No students found"
            }}
            className="student-table"
          />
        </Card>

        {/* Instructor List */}
        <Card 
          title={
            <span className="flex items-center gap-2">
              <TeamOutlined className="text-orange-600" />
              <span>Instructors ({instructors.length})</span>
            </span>
          }
          className="shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.25s' }}
        >
          <Table
            columns={instructorColumns}
            dataSource={instructors}
            rowKey="courseInstructorId"
            loading={loading}
            pagination={false}
            locale={{
              emptyText: "No instructors found"
            }}
            className="instructor-table"
          />
        </Card>

        {/* Confirm Remove Modal */}
        <Modal
          open={confirmModal.show}
          onCancel={() => setConfirmModal({ show: false, user: null, type: "student" })}
          onOk={handleConfirmRemove}
          okText="Remove"
          okButtonProps={{ danger: true, loading }}
          cancelButtonProps={{ disabled: loading }}
          title="Confirm Removal"
        >
          <p>
            Are you sure you want to remove{" "}
            <strong>{confirmModal.user?.studentName || confirmModal.user?.instructorName}</strong>?
          </p>
        </Modal>

        {/* Add Student Modal */}
        <Modal
          open={addStudentModal}
          onCancel={() => {
            setAddStudentModal(false);
            addStudentForm.resetFields();
          }}
          footer={null}
          title="Add Student"
          destroyOnClose
        >
          <Form
            form={addStudentForm}
            layout="vertical"
            onFinish={handleAddStudent}
            className="mt-4"
          >
            <Form.Item
              name="studentCode"
              label="Student Code"
              rules={[{ required: true, message: "Please enter student code" }]}
            >
              <Input placeholder="Enter student code" size="large" />
            </Form.Item>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setAddStudentModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={<UserAddOutlined />}>
                Add Student
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Add Instructor Modal */}
        <Modal
          open={addInstructorModal}
          onCancel={() => {
            setAddInstructorModal(false);
            addInstructorForm.resetFields();
          }}
          footer={null}
          title="Add Instructor"
          destroyOnClose
        >
          <Form
            form={addInstructorForm}
            layout="vertical"
            onFinish={handleAddInstructor}
            className="mt-4"
          >
            <Form.Item
              name="userName"
              label="Instructor Username"
              rules={[{ required: true, message: "Please enter instructor username" }]}
            >
              <Input placeholder="Enter instructor username" size="large" />
            </Form.Item>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setAddInstructorModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={<TeamOutlined />}>
                Add Instructor
              </Button>
            </div>
          </Form>
        </Modal>

        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in-row {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out backwards;
          }

          /* Table Header Styling */
          .student-table .ant-table-thead > tr > th,
          .instructor-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
            color: #ea580c !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #fed7aa !important;
            font-size: 13px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }

          /* Table Row Animation */
          .student-table .ant-table-tbody > tr,
          .instructor-table .ant-table-tbody > tr {
            animation: slide-in-row 0.4s ease-out backwards;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .student-table .ant-table-tbody > tr:nth-child(1),
          .instructor-table .ant-table-tbody > tr:nth-child(1) { animation-delay: 0.05s; }
          .student-table .ant-table-tbody > tr:nth-child(2),
          .instructor-table .ant-table-tbody > tr:nth-child(2) { animation-delay: 0.1s; }
          .student-table .ant-table-tbody > tr:nth-child(3),
          .instructor-table .ant-table-tbody > tr:nth-child(3) { animation-delay: 0.15s; }
          .student-table .ant-table-tbody > tr:nth-child(4),
          .instructor-table .ant-table-tbody > tr:nth-child(4) { animation-delay: 0.2s; }
          .student-table .ant-table-tbody > tr:nth-child(5),
          .instructor-table .ant-table-tbody > tr:nth-child(5) { animation-delay: 0.25s; }
          .student-table .ant-table-tbody > tr:nth-child(6),
          .instructor-table .ant-table-tbody > tr:nth-child(6) { animation-delay: 0.3s; }
          .student-table .ant-table-tbody > tr:nth-child(7),
          .instructor-table .ant-table-tbody > tr:nth-child(7) { animation-delay: 0.35s; }
          .student-table .ant-table-tbody > tr:nth-child(8),
          .instructor-table .ant-table-tbody > tr:nth-child(8) { animation-delay: 0.4s; }
          .student-table .ant-table-tbody > tr:nth-child(9),
          .instructor-table .ant-table-tbody > tr:nth-child(9) { animation-delay: 0.45s; }
          .student-table .ant-table-tbody > tr:nth-child(10),
          .instructor-table .ant-table-tbody > tr:nth-child(10) { animation-delay: 0.5s; }

          /* Row Hover Effect */
          .student-table .ant-table-tbody > tr:hover,
          .instructor-table .ant-table-tbody > tr:hover {
            background: linear-gradient(90deg, #fff7ed 0%, #ffffff 100%) !important;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15) !important;
            transform: translateX(4px);
          }

          .student-table .ant-table-tbody > tr:hover td,
          .instructor-table .ant-table-tbody > tr:hover td {
            border-color: #fed7aa !important;
          }

          /* Striped Rows */
          .student-table .ant-table-tbody > tr:nth-child(even),
          .instructor-table .ant-table-tbody > tr:nth-child(even) {
            background-color: #fafafa;
          }

          /* Pagination Styling */
          .ant-pagination-item-active {
            border-color: #ea580c !important;
            background-color: #fff7ed !important;
          }

          .ant-pagination-item-active a {
            color: #ea580c !important;
          }

          /* Descriptions Styling */
          .ant-descriptions-item-label {
            font-weight: 600;
            color: #6b7280;
          }

          .ant-descriptions-item-content {
            color: #1f2937;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}