import React, { useState } from 'react';
import { Layout, Menu, MenuProps, Row, Col, Button, Drawer, Avatar, Dropdown } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  CalculatorOutlined, 
  BookOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Layout.less'; // File CSS cho layout
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Footer } = Layout;

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  //const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null); // Mock user

  const { user, logout } = useAuth();

  // Menu items (Desktop)
  const items: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Trang Chủ</Link>,
    },
    {
      key: 'articles',
      icon: <BookOutlined />,
      label: 'Bài Viết',
      children: [
        { key: 'phong-thuy', label: <Link to="/articles/phong-thuy">Phong Thủy</Link> },
        { key: 'tuong-so', label: <Link to="/articles/tuong-so">Tướng Số</Link> },
      ],
    },
    {
      key: 'tools',
      icon: <CalculatorOutlined />,
      label: <Link to="/tools">Công Cụ</Link>,
    },
  ];

  // Mobile menu
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <Layout className="layout">
      {/* --- Navbar --- */}
      <Header className="header">
        <Row justify="space-between" align="middle">
          {/* Logo */}
          <Col xs={12} md={4}>
            <div className="logo">
              <Link to="/">MasterSo</Link>
            </div>
          </Col>

          {/* Desktop Menu */}
          <Col md={16} className="desktop-menu">
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={items}
            />
          </Col>

          {/* Auth Section (Desktop) */}
          <Col md={4} className="auth-section">
          {user ? (
  <div className="user-info">
    <Avatar>{user.fullName?.[0]}</Avatar> {/* Hiển thị chữ cái đầu */}
    <Dropdown
      menu={{
        items: [
          { 
            key: 'profile', 
            label: <Link to="/profile">Hồ sơ</Link> 
          },
          { 
            key: 'logout', 
            label: 'Đăng xuất', 
            onClick: logout // Gọi hàm logout từ context
          }
        ]
      }}
    >
      <span className="email" style={{ cursor: 'pointer' }}>
        {user.email}
      </span>
    </Dropdown>
  </div>
) : (
  <div className="auth-buttons">
    <Button type="primary">
      <Link to="/login">Đăng Nhập</Link>
    </Button>
  </div>
)}
          </Col>

          {/* Mobile Menu Toggle */}
          <Col xs={12} md={0} className="mobile-menu-toggle">
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={showDrawer}
            />
          </Col>
        </Row>
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={onClose}
        open={visible}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Drawer>

      {/* --- Main Content --- */}
      <Content className="content">{children}</Content>

      {/* --- Footer --- */}
      <Footer className="footer">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <h3>Về Chúng Tôi</h3>
            <p>Trang web kiến thức phong thủy, tướng số hàng đầu Việt Nam</p>
          </Col>

          <Col xs={24} md={8}>
            <h3>Liên Kết Nhanh</h3>
            <Menu
              mode="vertical"
              items={[
                { key: 'terms', label: <Link to="/terms">Điều Khoản</Link> },
                { key: 'privacy', label: <Link to="/privacy">Chính Sách</Link> },
              ]}
            />
          </Col>

          <Col xs={24} md={8}>
            <h3>Liên Hệ</h3>
            <p>Email: contact@masterso.com</p>
            <p>Hotline: 1900 8888</p>
          </Col>
        </Row>

        <div className="copyright">
          © {new Date().getFullYear()} MasterSo. All rights reserved.
        </div>
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;