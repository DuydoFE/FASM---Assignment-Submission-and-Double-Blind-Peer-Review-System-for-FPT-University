import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Spin, Alert, Descriptions, Typography, Tag } from "antd"; 
import { UserOutlined } from "@ant-design/icons";
import { getUserById } from "../../service/userService";
import { selectUser } from "../../redux/features/userSlice";

const { Title } = Typography;

const ProfilePage = () => {
  const currentUser = useSelector(selectUser); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.userId) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await getUserById(currentUser.userId);

          if (response.data && response.data.statusCode === 200) {
            setUserData(response.data.data);
          } else {
            throw new Error(response.data.message || "Failed to get user data.");
          }
          setError(null);
        } catch (err) {
          setError(err.message || "Failed to fetch user data. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
      setError("No user is logged in or user ID is missing.");
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto mt-10 p-4">
        <Alert
          message="Error"
          description={error || "User data could not be loaded."}
          type="error"
          showIcon
        />
      </div>
    );
  }

 
  const fullName = `${userData.firstName} ${userData.lastName}`;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card
        style={{ maxWidth: 800, margin: '0 auto' }}
        className="shadow-lg"
      >
        <div className="flex flex-col items-center text-center">
          <Avatar
            size={128}
            src={userData.avatarUrl || `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=random`}
            icon={<UserOutlined />}
            className="border-4 border-gray-100 shadow-md -mt-16"
          />
          <Title level={2} className="mt-4">{fullName}</Title>
          <div className="mt-2">
           
            {userData.roles?.map(role => (
              <Tag color="blue" key={role}>{role}</Tag>
            ))}
          </div>
        </div>
        
        <Descriptions bordered column={1} className="mt-8">
          <Descriptions.Item label="Username">{userData.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Full Name">{fullName}</Descriptions.Item>
      
          <Descriptions.Item label="Student Code">{userData.studentCode || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Campus">{userData.campusName || 'N/A'}</Descriptions.Item>
           <Descriptions.Item label="Status">
            <Tag color={userData.isActive ? 'green' : 'red'}>
              {userData.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="User ID">{userData.id}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;