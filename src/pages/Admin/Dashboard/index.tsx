import React from 'react';
import { Typography, Row, Col, Card, Statistic, Button, List, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { UserOutlined, FileTextOutlined, PictureOutlined, NotificationOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const AdminDashboard: React.FC = () => {
  const { user, hasPermission, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  // Sample admin menu items
  const adminMenuItems = [
    {
      title: 'Quản lý bài viết',
      description: 'Duyệt, chỉnh sửa và xóa bài viết',
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
      path: '/admin/story-moderation',
      permission: 'approve_story'
    },
    {
      title: 'Quản lý người dùng',
      description: 'Xem và quản lý thông tin người dùng',
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      path: '/admin/users',
      permission: 'view_users'
    },
    {
      title: 'Quản lý slide',
      description: 'Chỉnh sửa ảnh slide trên trang chủ',
      icon: <PictureOutlined style={{ fontSize: 24 }} />,
      path: '/admin/slides',
      permission: 'manage_slides'
    },
    {
      title: 'Quản lý quảng cáo',
      description: 'Chỉnh sửa banner quảng cáo',
      icon: <NotificationOutlined style={{ fontSize: 24 }} />,
      path: '/admin/ads',
      permission: 'manage_ads'
    }
  ];

  // Additional items only for SuperAdmin
  const superAdminItems = [
    {
      title: 'Phân quyền người dùng',
      description: 'Thay đổi vai trò và quyền hạn người dùng',
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      path: '/admin/user-roles',
      permission: 'manage_user_roles'
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Chỉnh sửa các thiết lập hệ thống',
      icon: <SettingOutlined style={{ fontSize: 24 }} />,
      path: '/admin/settings',
      permission: 'manage_settings'
    }
  ];

  // Combine items based on permissions
  const menuItems = [
    ...adminMenuItems.filter(item => hasPermission(item.permission)),
    ...(isSuperAdmin() ? superAdminItems : [])
  ];

  return (
    <div className="admin-dashboard">
      <Title level={2}>Dashboard Quản Trị</Title>
      
      <Paragraph>
        Xin chào, <strong>{user?.fullName}</strong>! 
        {isSuperAdmin() ? ' (Super Admin)' : ' (Admin)'}
      </Paragraph>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Người dùng" 
              value={1250} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Bài viết" 
              value={578} 
              prefix={<FileTextOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Bài chờ duyệt" 
              value={12} 
              prefix={<FileTextOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Bình luận mới" 
              value={42} 
              prefix={<NotificationOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý hệ thống" key="1">
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={menuItems}
            renderItem={item => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => navigate(item.path)}
                  actions={[
                    <Button type="primary" onClick={() => navigate(item.path)}>
                      Truy cập
                    </Button>
                  ]}
                >
                  <Card.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Hoạt động gần đây" key="2">
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: 'Bài viết "Cách đặt bát hương đúng vị trí" được phê duyệt',
                time: '2 giờ trước',
                user: 'Nguyễn Văn A'
              },
              {
                title: 'Người dùng mới đăng ký',
                time: '3 giờ trước',
                user: 'Trần Thị B'
              },
              {
                title: 'Bài viết "Xem tuổi xây nhà 2024" bị từ chối',
                time: '6 giờ trước',
                user: 'Lê Văn C'
              }
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={`${item.time} - bởi ${item.user}`}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 