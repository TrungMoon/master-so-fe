import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Button } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  PictureOutlined, 
  NotificationOutlined, 
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, hasPermission, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate menu items based on user permissions
  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
      permission: 'access_dashboard'
    },
    {
      key: '/admin/story-moderation',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/story-moderation">Quản lý bài viết</Link>,
      permission: 'approve_story'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý người dùng</Link>,
      permission: 'view_users'
    },
    {
      key: '/admin/slides',
      icon: <PictureOutlined />,
      label: <Link to="/admin/slides">Quản lý slide</Link>,
      permission: 'manage_slides'
    },
    {
      key: '/admin/ads',
      icon: <NotificationOutlined />,
      label: <Link to="/admin/ads">Quản lý quảng cáo</Link>,
      permission: 'manage_ads'
    }
  ];

  // Only add settings menu for SuperAdmin
  if (isSuperAdmin()) {
    menuItems.push({
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Cài đặt hệ thống</Link>,
      permission: 'manage_settings'
    });
  }

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  // User dropdown menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={256}
      >
        <div className="admin-logo">
          {!collapsed && <span>MasterSo Admin</span>}
          {collapsed && <span>MS</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={filteredMenuItems}
        />
      </Sider>
      <Layout>
        <Header className="admin-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="trigger-button"
          />
          <div className="admin-header-right">
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div className="admin-user-info">
                <Avatar icon={<UserOutlined />} />
                {!collapsed && <span className="admin-username">{user?.fullName}</span>}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 