import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import { Users, FileText, BarChart3, Upload, LayoutDashboard, BookOpenText } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const InstructorSideBar = () => {
  const location = useLocation();
  const params = useParams();
  const [collapsed, setCollapsed] = useState(false);

  const storedId = typeof window !== 'undefined' ? sessionStorage.getItem('currentCourseInstanceId') : null;
  const courseInstanceId = params?.courseInstanceId || params?.id || location.state?.courseInstanceId || storedId || null;

  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Statistic',
      icon: <LayoutDashboard className="w-6 h-6" />,
      path: `/instructor/class-statistic/${courseInstanceId}`,
    },
    {
      key: 'manage-class',
      label: 'Class List',
      icon: <Users className="w-6 h-6" />,
      path: `/instructor/manage-class/${courseInstanceId}`,
    },
    {
      key: 'assignment',
      label: 'Assignment',
      icon: <BookOpenText className="w-6 h-6" />,
      path: `/instructor/manage-assignment/${courseInstanceId}`,
    },
    {
      key: 'rubric',
      label: 'Rubric',
      icon: <FileText className="w-6 h-6" />,
      path: `/instructor/manage-rubric/${courseInstanceId}`,
    },
    {
      key: 'grading',
      label: 'Grading Score',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/instructor/manage-grading',
    },
    {
      key: 'publish',
      label: 'Publish Score',
      icon: <Upload className="w-6 h-6" />,
      path: '/instructor/publish-score',
    },
  ];

  // Get current selected key based on pathname
  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const matchedItem = menuItems.find(item => currentPath === item.path);
    return matchedItem ? [matchedItem.key] : [];
  };

  const handleMenuClick = (e) => {
    const selectedItem = menuItems.find(item => item.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.path, { state: { courseInstanceId } });
    }
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-20 z-40 transition-all duration-300 ${
        collapsed ? 'w-25' : 'w-64'
      }`}
    >
      <div className={`border-b border-gray-200 flex items-center ${collapsed ? 'justify-center p-4' : 'justify-between p-6'}`}>
        {!collapsed && <h1 className="text-xl font-semibold text-gray-800">Class Management</h1>}
        <Button
          type="text"
          onClick={toggleCollapsed}
          icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '18px' }} /> : <MenuFoldOutlined style={{ fontSize: '18px' }} />}
          className="flex items-center justify-center transition-colors"
          style={{
            width: collapsed ? '100%' : 'auto',
            height: '40px',
            borderRadius: '8px'
          }}
        />
      </div>

      <div className="p-4">
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          onClick={handleMenuClick}
          items={menuItems}
          inlineCollapsed={collapsed}
          style={{
            border: 'none',
            background: 'transparent'
          }}
          className="instructor-sidebar-menu"
        />
      </div>

      <style jsx>{`
        :global(.instructor-sidebar-menu .ant-menu-item) {
          border-radius: 10px;
          margin-bottom: 12px;
          padding: 20px 24px;
          height: auto;
          min-height: 60px;
          line-height: 1.6;
          display: flex;
          align-items: center;
          font-size: 17px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        :global(.instructor-sidebar-menu .ant-menu-item-selected) {
          background-color: #fff7ed !important;
          color: #ea580c !important;
          border-left: 5px solid #ea580c;
          padding-left: 19px !important;
          font-weight: 600;
        }
        
        :global(.instructor-sidebar-menu .ant-menu-item:hover) {
          background-color: #f9fafb;
          transform: translateX(2px);
        }
        
        :global(.instructor-sidebar-menu .ant-menu-item .ant-menu-title-content) {
          margin-left: 16px;
          font-size: 17px;
        }

        :global(.instructor-sidebar-menu .ant-menu-item-icon) {
          font-size: 24px !important;
        }

        :global(.instructor-sidebar-menu.ant-menu-inline-collapsed .ant-menu-item) {
          padding: 20px 0 !important;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
        }

        :global(.instructor-sidebar-menu.ant-menu-inline-collapsed .ant-menu-item-selected) {
          border-left: none;
          padding: 20px 0 !important;
          background-color: #fff7ed !important;
        }

        :global(.instructor-sidebar-menu.ant-menu-inline-collapsed .ant-menu-item-icon) {
          margin: 0 !important;
          font-size: 26px !important;
        }
      `}</style>
    </div>
  );
};

export default InstructorSideBar;
