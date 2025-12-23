import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Spin, Alert, Descriptions, Typography, Tag, message, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getUserById, updateUserAvatar } from "../../service/userService";
import { selectUser } from "../../redux/features/userSlice";
import AvatarUpload from "../../component/AvatarUpload";
import ChangePasswordModal from "../../component/Profile/ChangePasswordModal";

const { Title } = Typography;

const ProfilePage = () => {
  const currentUser = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

  const handleAvatarChanged = async (newAvatarUrl) => {
    try {
      console.log('Uploading avatar for User ID:', currentUser.userId);
      console.log('New Avatar URL:', newAvatarUrl);
      
      const response = await updateUserAvatar(currentUser.userId, newAvatarUrl);
      
      if (response.statusCode === 200 || response.data?.statusCode === 200) {
        // Cập nhật state local để UI hiển thị ngay
        setUserData(prev => ({
          ...prev,
          avatarUrl: newAvatarUrl
        }));
        
        const successMessage = response.message || response.data?.message;
        if (successMessage) {
          message.success(successMessage);
        }
        console.log('Avatar update response:', response);
      } else {
        // Lấy error message từ backend
        const errorMessage = response.message || response.data?.message;
        throw new Error(errorMessage || 'Update failed');
      }
    } catch (error) {
      // Hiển thị error message từ backend
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg) {
        message.error(errorMsg);
      }
      console.error('Avatar update error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card
        style={{ maxWidth: 800, margin: '0 auto' }}
        className="shadow-lg"
      >
        <div className="flex flex-col items-center text-center">
          <div className="-mt-16">
            <AvatarUpload
              currentAvatar={userData.avatarUrl}
              onAvatarChanged={handleAvatarChanged}
              size={128}
            />
          </div>
          <Title level={2} className="mt-4">{fullName}</Title>
          <div className="mt-2">
           
            {userData.roles?.map(role => (
              <Tag color="blue" key={role}>{role}</Tag>
            ))}
          </div>
          
          <div className="mt-4">
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Change Password
            </Button>
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
       </Descriptions>
     </Card>

     <ChangePasswordModal
       isOpen={isPasswordModalOpen}
       onClose={() => setIsPasswordModalOpen(false)}
       userId={currentUser?.userId}
     />
   </div>
 );
};

export default ProfilePage;