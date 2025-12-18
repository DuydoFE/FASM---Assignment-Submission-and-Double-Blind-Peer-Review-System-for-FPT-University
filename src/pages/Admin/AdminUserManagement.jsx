import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, UserPlus } from "lucide-react";
import {
  getAllUsers,
  getAllCampuses,
  getAllMajors,
  importStudents,
  importInstructors,
  createUser,
} from "../../service/adminService";
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Card,
  Modal,
  Form,
  message,
  Upload as AntUpload,
  ConfigProvider
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  UploadOutlined
} from "@ant-design/icons";

const { Option } = Select;

// Custom theme for orange accent
const theme = {
  token: {
    colorPrimary: '#ea580c',
    colorLink: '#ea580c',
    borderRadius: 8,
  },
};

function AdminCreateUserForm({ campuses, majors, onClose, onUserCreated }) {
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    form.resetFields(['username', 'password', 'email', 'firstName', 'lastName', 'studentCode', 'avatarUrl', 'campusId', 'majorId', 'isActive']);
  };

  const handleSubmit = async (values) => {
    Modal.confirm({
      title: "Create new user?",
      content: "Are you sure you want to create this user with the provided information?",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const payload = {
            ...values,
            role: selectedRole,
            username: selectedRole === "Instructor" 
              ? values.firstName?.trim().toLowerCase().replace(/\s+/g, "")
              : values.username,
          };
          
          const res = await createUser(payload);
          message.success(res?.data?.message || "User created successfully");
          const allUsers = await getAllUsers();
          onUserCreated?.(Array.isArray(allUsers?.data) ? allUsers.data : []);
          onClose();
        } catch (err) {
          message.error(err?.response?.data?.message || "Create user failed");
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Create New User</h2>
      
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card size="small" title="Step 1: Select User Role" className="mb-4">
          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              placeholder="Choose role..."
              onChange={handleRoleChange}
              size="large"
            >
              <Option value="Student">Student</Option>
              <Option value="Instructor">Instructor</Option>
            </Select>
          </Form.Item>
          {!selectedRole && (
            <p className="text-sm text-gray-400">Please select a role to continue</p>
          )}
        </Card>

        {selectedRole && (
          <Card size="small" title="Step 2: User Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRole === "Student" && (
                <>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: "Please enter username" }]}
                  >
                    <Input placeholder="Enter username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Please enter password" }]}
                  >
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>
                </>
              )}
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
              
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
              
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
              
              <Form.Item
                name="studentCode"
                label="User Code"
                rules={[{ required: true, message: "Please enter user code" }]}
              >
                <Input placeholder="Enter user code" />
              </Form.Item>
              
              <Form.Item name="avatarUrl" label="Avatar URL">
                <Input placeholder="Enter avatar URL (optional)" />
              </Form.Item>
              
              <Form.Item
                name="campusId"
                label="Campus"
                rules={[{ required: true, message: "Please select campus" }]}
              >
                <Select placeholder="Select campus">
                  {campuses.map((c) => (
                    <Option key={c.id || c.campusId} value={c.id || c.campusId}>
                      {c.name || c.campusName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              {selectedRole === "Student" && (
                <Form.Item
                  name="majorId"
                  label="Major"
                  rules={[{ required: true, message: "Please select major" }]}
                >
                  <Select placeholder="Select major">
                    {majors.map((m) => (
                      <Option key={m.majorId} value={m.majorId}>
                        {m.majorName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              
              <Form.Item
                name="isActive"
                label="Status"
                initialValue={true}
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select>
                  <Option value={true}>Active</Option>
                  <Option value={false}>Inactive</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="flex justify-end mt-6">
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  Create User
                </Button>
              </Space>
            </div>
          </Card>
        )}
      </Form>
    </div>
  );
}

export default function AdminUserManagement() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    campus: "",
    role: "",
    major: "",
    search: "",
  });
  const [users, setUsers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const roles = ["Student", "Instructor"];

  useEffect(() => {
    fetchUsers();
    getAllCampuses().then((res) => setCampuses(Array.isArray(res?.data) ? res.data : []));
    getAllMajors().then((res) => setMajors(Array.isArray(res?.data) ? res.data : []));
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const isAnyFilterSelected = filters.campus || filters.role || filters.major || filters.search;

  const filteredUsers = isAnyFilterSelected
    ? users
        .filter((u) => !u.roles?.includes("Admin"))
        .filter((u) => {
          return (
            (filters.campus ? u.campusName === filters.campus : true) &&
            (filters.role ? u.roles?.includes(filters.role) : true) &&
            (filters.major ? u.majorName === filters.major : true) &&
            (filters.search
              ? Object.values(u)
                  .join(" ")
                  .toLowerCase()
                  .includes(filters.search.toLowerCase())
              : true)
          );
        })
    : [];

  const handleImportStudents = async (file) => {
    try {
      const res = await importStudents(file);
      message.success(res?.message || res?.data?.message || "Import students successfully");
      await fetchUsers();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to import students");
    }
  };

  const handleImportInstructors = async (file) => {
    try {
      const res = await importInstructors(file);
      message.success(res?.message || res?.data?.message || "Import instructors successfully");
      await fetchUsers();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to import instructors");
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => (
        <div className="font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {record.firstName?.[0]?.toUpperCase()}{record.lastName?.[0]?.toUpperCase()}
          </div>
          <span>{`${record.firstName} ${record.lastName}`}</span>
        </div>
      ),
    },
    {
      title: "User Code",
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
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span className="text-blue-600 hover:text-blue-800 transition-colors">
          {email}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => (
        <Space>
          {roles?.map((role) => (
            <Tag
              key={role}
              color={role === "Student" ? "blue" : "green"}
              className="font-medium px-3 py-1"
            >
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Campus",
      dataIndex: "campusName",
      key: "campusName",
      render: (campus) => (
        <span className="text-gray-700">{campus}</span>
      ),
    },
    {
      title: "Major",
      dataIndex: "majorName",
      key: "majorName",
      render: (major) => (
        <span className="text-gray-700">{major}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag
          color={isActive ? "success" : "error"}
          className="font-medium px-3 py-1"
        >
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            {isActive ? "Active" : "Inactive"}
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
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/users/${record.id}`)}
          className="hover:scale-110 transition-transform"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider theme={theme}>
      <div className="p-6 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">User Management</h2>
            <p className="text-gray-500">Manage students and instructors</p>
          </div>
          <Space size="middle">
            <AntUpload
              accept=".xlsx, .xls"
              showUploadList={false}
              beforeUpload={(file) => {
                handleImportStudents(file);
                return false;
              }}
            >
              <Button
                icon={<UploadOutlined />}
                className="hover:scale-105 transition-transform"
              >
                Import Students
              </Button>
            </AntUpload>
            
            <AntUpload
              accept=".xlsx, .xls"
              showUploadList={false}
              beforeUpload={(file) => {
                handleImportInstructors(file);
                return false;
              }}
            >
              <Button
                icon={<UploadOutlined />}
                className="hover:scale-105 transition-transform"
              >
                Import Instructors
              </Button>
            </AntUpload>
            
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowCreateUserModal(true)}
              className="hover:scale-105 transition-transform shadow-md"
            >
              Add User
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Card
          className="mb-6 shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              placeholder="Select Campus"
              allowClear
              value={filters.campus || undefined}
              onChange={(value) => handleFilterChange("campus", value || "")}
              className="w-full"
              size="large"
            >
              {campuses.map((c) => (
                <Option key={c.id || c.campusId} value={c.name || c.campusName}>
                  {c.name || c.campusName}
                </Option>
              ))}
            </Select>
            
            <Select
              placeholder="Select Role"
              allowClear
              value={filters.role || undefined}
              onChange={(value) => handleFilterChange("role", value || "")}
              className="w-full"
              size="large"
            >
              {roles.map((r) => (
                <Option key={r} value={r}>
                  {r}
                </Option>
              ))}
            </Select>
            
            <Select
              placeholder="Select Major"
              allowClear
              value={filters.major || undefined}
              onChange={(value) => handleFilterChange("major", value || "")}
              className="w-full"
              size="large"
            >
              {majors.map((m) => (
                <Option key={m.majorId} value={m.majorName}>
                  {m.majorName}
                </Option>
              ))}
            </Select>
            
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined className="text-orange-500" />}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              allowClear
              size="large"
            />
          </div>
        </Card>

        {/* User Table */}
        <Card
          className="shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            locale={{
              emptyText: isAnyFilterSelected
                ? "No users found for selected filters"
                : "No users available"
            }}
            className="user-table"
          />
        </Card>

        {/* Modal Create User */}
        <Modal
          open={showCreateUserModal}
          onCancel={() => setShowCreateUserModal(false)}
          footer={null}
          width={800}
          destroyOnClose
        >
          <AdminCreateUserForm
            campuses={campuses}
            majors={majors}
            onClose={() => setShowCreateUserModal(false)}
            onUserCreated={(updatedUsers) => {
              setUsers(updatedUsers);
              setShowCreateUserModal(false);
            }}
          />
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

          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
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

          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }

          /* Table Header Styling */
          .user-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
            color: #ea580c !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #fed7aa !important;
            font-size: 13px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }

          /* Table Row Animation */
          .user-table .ant-table-tbody > tr {
            animation: slide-in-row 0.4s ease-out backwards;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .user-table .ant-table-tbody > tr:nth-child(1) { animation-delay: 0.05s; }
          .user-table .ant-table-tbody > tr:nth-child(2) { animation-delay: 0.1s; }
          .user-table .ant-table-tbody > tr:nth-child(3) { animation-delay: 0.15s; }
          .user-table .ant-table-tbody > tr:nth-child(4) { animation-delay: 0.2s; }
          .user-table .ant-table-tbody > tr:nth-child(5) { animation-delay: 0.25s; }
          .user-table .ant-table-tbody > tr:nth-child(6) { animation-delay: 0.3s; }
          .user-table .ant-table-tbody > tr:nth-child(7) { animation-delay: 0.35s; }
          .user-table .ant-table-tbody > tr:nth-child(8) { animation-delay: 0.4s; }
          .user-table .ant-table-tbody > tr:nth-child(9) { animation-delay: 0.45s; }
          .user-table .ant-table-tbody > tr:nth-child(10) { animation-delay: 0.5s; }

          /* Row Hover Effect */
          .user-table .ant-table-tbody > tr:hover {
            background: linear-gradient(90deg, #fff7ed 0%, #ffffff 100%) !important;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15) !important;
            transform: translateX(4px);
          }

          .user-table .ant-table-tbody > tr:hover td {
            border-color: #fed7aa !important;
          }

          /* Striped Rows */
          .user-table .ant-table-tbody > tr:nth-child(even) {
            background-color: #fafafa;
          }

          /* Button Styling */
          .ant-btn-primary {
            box-shadow: 0 2px 8px rgba(234, 88, 12, 0.2);
          }

          .ant-btn-primary:hover {
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3) !important;
          }

          /* Tag Animation */
          .ant-tag {
            transition: all 0.3s ease;
          }

          .ant-tag:hover {
            transform: scale(1.05);
          }

          /* Pagination Styling */
          .ant-pagination-item-active {
            border-color: #ea580c !important;
            background-color: #fff7ed !important;
          }

          .ant-pagination-item-active a {
            color: #ea580c !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
