import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ConfigProvider 
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined
} from "@ant-design/icons";

import {
  getCourseInstancesByCampusId,
  getAllCampuses,
  getAllCourses,
  getAllSemesters,
  createCourseInstance,
  updateCourseInstance,
} from "../../service/adminService";

const { Option } = Select;

// Custom theme for orange accent
const theme = {
  token: {
    colorPrimary: '#ea580c',
    colorLink: '#ea580c',
    borderRadius: 8,
  },
};

export default function AdminClassManagement() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [classes, setClasses] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    campus: "",
    semester: "",
    course: "",
    search: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateClass, setUpdateClass] = useState(null);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const campusesRes = await getAllCampuses();
        setCampuses(Array.isArray(campusesRes?.data) ? campusesRes.data : []);

        const semestersRes = await getAllSemesters();
        setSemesters(Array.isArray(semestersRes?.data) ? semestersRes.data : []);

        const coursesRes = await getAllCourses();
        setCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      } catch (err) {
        console.error(err);
        message.error("System data loading error!");
      }
    };
    fetchFiltersData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!filters.campus) {
        setClasses([]);
        return;
      }
      setLoading(true);
      try {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        message.error("Unable to load class list!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.campus]);

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const toDatetimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const toISOWithLocalTime = (localDatetime) => {
    const date = new Date(localDatetime);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  };

  const handleCreateClass = async (values) => {
    const selectedSemester = semesters.find(s => s.semesterId === Number(values.semesterId));
    if (selectedSemester) {
      const semesterStart = new Date(selectedSemester.startDate);
      const semesterEnd = new Date(selectedSemester.endDate);
      const classStart = new Date(values.startDate);
      const classEnd = new Date(values.endDate);

      if (classStart < semesterStart) {
        message.error(`The start date cannot be earlier than the semester start date (${semesterStart.toLocaleDateString('en-GB')})!`);
        return;
      }
      if (classEnd > semesterEnd) {
        message.error(`The end date cannot be later than the semester end date (${semesterEnd.toLocaleDateString('en-GB')})!`);
        return;
      }
    }

    const payload = {
      courseId: Number(values.courseId),
      campusId: Number(values.campusId),
      semesterId: Number(values.semesterId),
      sectionCode: values.sectionCode.trim(),
      requiresApproval: true,
      startDate: toISOWithLocalTime(values.startDate),
      endDate: toISOWithLocalTime(values.endDate),
      enrollmentPassword: ""
    };

    try {
      await createCourseInstance(payload);
      message.success("Class created successfully!");
      setShowAddForm(false);
      form.resetFields();

      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to create class!");
    }
  };

  const handleUpdateClass = async (values) => {
    try {
      const requestPayload = {
        courseInstanceId: Number(updateClass.courseInstanceId),
        courseId: Number(values.courseId),
        campusId: Number(values.campusId),
        semesterId: Number(values.semesterId),
        sectionCode: values.sectionCode.trim(),
        requiresApproval: true,
        enrollmentPassword: updateClass.enrollmentPassword || "",
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };

      await updateCourseInstance(requestPayload);
      message.success("Class updated successfully!");
      setShowUpdateForm(false);
      updateForm.resetFields();

      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Class update failed!");
    }
  };

  const handleOpenUpdateForm = (c) => {
    setUpdateClass(c);
    updateForm.setFieldsValue({
      courseId: c.courseId,
      semesterId: c.semesterId,
      campusId: c.campusId,
      sectionCode: c.sectionCode,
      startDate: toDatetimeLocal(c.startDate),
      endDate: toDatetimeLocal(c.endDate)
    });
    setShowUpdateForm(true);
  };

  const displayedClasses = classes.filter((c) => {
    const matchSearch =
      c.courseName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.sectionCode?.toLowerCase().includes(filters.search.toLowerCase());

    const matchCourse = filters.course ? c.courseId === Number(filters.course) : true;
    const matchSemester = filters.semester ? c.semesterId === Number(filters.semester) : true;

    return matchSearch && matchCourse && matchSemester;
  });

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.startsWith("0001")) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const columns = [
    {
      title: "Class Name",
      dataIndex: "sectionCode",
      key: "sectionCode",
      render: (text, record) => (
        <span className="font-semibold text-gray-800">{text || record.courseName}</span>
      ),
    },
    {
      title: "Course",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Semester",
      dataIndex: "semesterName",
      key: "semesterName",
    },
    {
      title: "Campus",
      dataIndex: "campusName",
      key: "campusName",
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      key: "studentCount",
      align: "center",
    },
    {
      title: "Assignments",
      dataIndex: "assignmentCount",
      key: "assignmentCount",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => formatDate(date),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenUpdateForm(record)}
          >
            Update
          </Button>
          <Button
            size="small"
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/classes/${record.courseInstanceId}`)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider theme={theme}>
      <div className="p-6 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 min-h-screen">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Class Management</h2>
          <p className="text-gray-500">Manage classes by campus, semester and course</p>
        </div>

        {/* Filters */}
        <Card 
          className="mb-6 shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select
              placeholder="Select Campus"
              allowClear
              value={filters.campus || undefined}
              onChange={(value) => handleFilterChange("campus", value || "")}
              className="w-full"
              size="large"
            >
              {campuses.map((c) => (
                <Option key={c.campusId} value={c.campusId}>
                  {c.name || c.campusName}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="All Semesters"
              allowClear
              value={filters.semester || undefined}
              onChange={(value) => handleFilterChange("semester", value || "")}
              className="w-full"
              size="large"
            >
              {semesters.map((s) => (
                <Option key={s.semesterId} value={s.semesterId}>
                  {s.name || s.semesterName}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="All Courses"
              allowClear
              value={filters.course || undefined}
              onChange={(value) => handleFilterChange("course", value || "")}
              className="w-full"
              size="large"
            >
              {courses.map((course) => (
                <Option key={course.courseId} value={course.courseId}>
                  {course.courseCode}
                </Option>
              ))}
            </Select>


            <Input
              placeholder="Search class name..."
              prefix={<SearchOutlined className="text-orange-500" />}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              allowClear
              size="large"
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddForm(true)}
              size="large"
              className="hover:scale-105 transition-transform"
            >
              Create Class
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card 
          className="shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Table
            columns={columns}
            dataSource={displayedClasses}
            rowKey="courseInstanceId"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} classes`,
            }}
            locale={{
              emptyText: filters.campus 
                ? "No classes found" 
                : "Please select a campus first"
            }}
            className="class-table"
          />
        </Card>

        {/* Create Modal */}
        <Modal
          open={showAddForm}
          onCancel={() => {
            setShowAddForm(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
          destroyOnClose
          title="Create New Class"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateClass}
            className="mt-4"
            onValuesChange={(changedValues) => {
              if (changedValues.semesterId) {
                const selectedSemester = semesters.find(s => s.semesterId === changedValues.semesterId);
                if (selectedSemester) {
                  // Auto-fill start and end dates with semester dates
                  form.setFieldsValue({
                    startDate: toDatetimeLocal(selectedSemester.startDate),
                    endDate: toDatetimeLocal(selectedSemester.endDate)
                  });
                }
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="campusId"
                label="Campus"
                rules={[{ required: true, message: "Please select campus" }]}
              >
                <Select placeholder="Select campus" size="large">
                  {campuses.map(c => (
                    <Option key={c.campusId} value={c.campusId}>
                      {c.name || c.campusName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="semesterId"
                label="Semester"
                rules={[{ required: true, message: "Please select semester" }]}
              >
                <Select placeholder="Select semester" size="large">
                  {semesters.map(s => (
                    <Option key={s.semesterId} value={s.semesterId}>
                      {s.name || s.semesterName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="courseId"
                label="Course"
                rules={[{ required: true, message: "Please select course" }]}
              >
                <Select placeholder="Select course" size="large">
                  {courses.filter(c => c.isActive).map(course => (
                    <Option key={course.courseId} value={course.courseId}>
                      {course.courseCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="sectionCode"
                label="Class Name"
                rules={[{ required: true, message: "Please enter class name" }]}
              >
                <Input placeholder="Enter class name" size="large" />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.semesterId !== currentValues.semesterId}
              >
                {({ getFieldValue }) => {
                  const semesterId = getFieldValue('semesterId');
                  const selectedSemester = semesters.find(s => s.semesterId === semesterId);
                  const minDate = selectedSemester ? toDatetimeLocal(selectedSemester.startDate) : '';
                  const maxDate = selectedSemester ? toDatetimeLocal(selectedSemester.endDate) : '';

                  return (
                    <Form.Item
                      name="startDate"
                      label="Start Date"
                      rules={[{ required: true, message: "Please select start date" }]}
                    >
                      <Input
                        type="datetime-local"
                        size="large"
                        min={minDate}
                        max={maxDate}
                        disabled={!semesterId}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.semesterId !== currentValues.semesterId}
              >
                {({ getFieldValue }) => {
                  const semesterId = getFieldValue('semesterId');
                  const selectedSemester = semesters.find(s => s.semesterId === semesterId);
                  const minDate = selectedSemester ? toDatetimeLocal(selectedSemester.startDate) : '';
                  const maxDate = selectedSemester ? toDatetimeLocal(selectedSemester.endDate) : '';

                  return (
                    <Form.Item
                      name="endDate"
                      label="End Date"
                      rules={[{ required: true, message: "Please select end date" }]}
                    >
                      <Input
                        type="datetime-local"
                        size="large"
                        min={minDate}
                        max={maxDate}
                        disabled={!semesterId}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Create Class
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Update Modal */}
        <Modal
          open={showUpdateForm}
          onCancel={() => {
            setShowUpdateForm(false);
            updateForm.resetFields();
          }}
          footer={null}
          width={800}
          destroyOnClose
          title="Update Class"
        >
          <Form form={updateForm} layout="vertical" onFinish={handleUpdateClass} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="campusId"
                label="Campus"
                rules={[{ required: true, message: "Please select campus" }]}
              >
                <Select placeholder="Select campus" size="large">
                  {campuses.map(c => (
                    <Option key={c.campusId} value={c.campusId}>
                      {c.name || c.campusName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="semesterId"
                label="Semester"
                rules={[{ required: true, message: "Please select semester" }]}
              >
                <Select placeholder="Select semester" size="large">
                  {semesters.map(s => (
                    <Option key={s.semesterId} value={s.semesterId}>
                      {s.name || s.semesterName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="courseId"
                label="Course"
                rules={[{ required: true, message: "Please select course" }]}
              >
                <Select placeholder="Select course" size="large">
                  {courses.filter(c => c.isActive).map(course => (
                    <Option key={course.courseId} value={course.courseId}>
                      {course.courseCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="sectionCode"
                label="Class Name"
                rules={[{ required: true, message: "Please enter class name" }]}
              >
                <Input placeholder="Enter class name" size="large" />
              </Form.Item>

              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: "Please select start date" }]}
              >
                <Input type="datetime-local" size="large" />
              </Form.Item>

              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date" }]}
              >
                <Input type="datetime-local" size="large" />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => setShowUpdateForm(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                Save Changes
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
          .class-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
            color: #ea580c !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #fed7aa !important;
            font-size: 13px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }

          /* Table Row Animation */
          .class-table .ant-table-tbody > tr {
            animation: slide-in-row 0.4s ease-out backwards;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .class-table .ant-table-tbody > tr:nth-child(1) { animation-delay: 0.05s; }
          .class-table .ant-table-tbody > tr:nth-child(2) { animation-delay: 0.1s; }
          .class-table .ant-table-tbody > tr:nth-child(3) { animation-delay: 0.15s; }
          .class-table .ant-table-tbody > tr:nth-child(4) { animation-delay: 0.2s; }
          .class-table .ant-table-tbody > tr:nth-child(5) { animation-delay: 0.25s; }
          .class-table .ant-table-tbody > tr:nth-child(6) { animation-delay: 0.3s; }
          .class-table .ant-table-tbody > tr:nth-child(7) { animation-delay: 0.35s; }
          .class-table .ant-table-tbody > tr:nth-child(8) { animation-delay: 0.4s; }
          .class-table .ant-table-tbody > tr:nth-child(9) { animation-delay: 0.45s; }
          .class-table .ant-table-tbody > tr:nth-child(10) { animation-delay: 0.5s; }

          /* Row Hover Effect */
          .class-table .ant-table-tbody > tr:hover {
            background: linear-gradient(90deg, #fff7ed 0%, #ffffff 100%) !important;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15) !important;
            transform: translateX(4px);
          }

          .class-table .ant-table-tbody > tr:hover td {
            border-color: #fed7aa !important;
          }

          /* Striped Rows */
          .class-table .ant-table-tbody > tr:nth-child(even) {
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
        `}</style>
      </div>
    </ConfigProvider>
  );
}