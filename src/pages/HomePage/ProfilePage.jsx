

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Spin, Alert, Descriptions, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUserById } from "../../service/userService"; // Import service
import { selectUser } from "../../redux/features/userSlice";

const { Title } = Typography;

const ProfilePage = () => {
  const currentUser = useSelector(selectUser); // Lấy thông tin user từ Redux
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await getUserById(currentUser.id);
          setUserData(response.data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch user data. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
        // Xử lý trường hợp không có người dùng đăng nhập
        setLoading(false);
        setError("No user is logged in.");
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card
        style={{ maxWidth: 800, margin: '0 auto' }}
        className="shadow-lg"
      >
        <div className="flex flex-col items-center text-center">
          <Avatar
            size={128}
            src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.username}&background=random`}
            icon={<UserOutlined />}
            className="border-4 border-white -mt-16"
          />
          <Title level={2} className="mt-4">{userData?.fullName || userData?.username}</Title>
          <p className="text-gray-500">{userData?.roles.join(', ')}</p>
        </div>
        <Descriptions bordered column={1} className="mt-8">
          <Descriptions.Item label="Username">{userData?.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData?.email}</Descriptions.Item>
          <Descriptions.Item label="Full Name">{userData?.fullName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{userData?.phoneNumber || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="User ID">{userData?.id}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;