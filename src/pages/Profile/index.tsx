import React from 'react';
import { Card, Typography, Descriptions, Button, Avatar, Space, Divider } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './style.css';

const { Title } = Typography;

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Không tìm thấy thông tin người dùng.</div>;
  }

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
          <Title level={3}>{user.fullName}</Title>
        </div>

        <Divider />

        <Descriptions title="Thông tin cá nhân" bordered>
          <Descriptions.Item label="Họ và tên" span={3}>{user.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={3}>{user.phone || 'Chưa cập nhật'}</Descriptions.Item>
        </Descriptions>

        <div className="profile-actions">
          <Space>
            <Button type="primary" icon={<EditOutlined />}>Cập nhật thông tin</Button>
            <Button icon={<LockOutlined />}>Đổi mật khẩu</Button>
            <Button danger onClick={logout}>Đăng xuất</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Profile; 