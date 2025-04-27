import React, { useState } from 'react';
import { Layout, Menu, MenuProps, Row, Col, Button, Drawer, Avatar, Dropdown, Input } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  CalculatorOutlined, 
  BookOutlined,
  MenuOutlined,
  CoffeeOutlined,
  EditOutlined,
  SettingOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.less'; // File CSS cho layout
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

type MenuItem = Required<MenuProps>['items'][number];

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, isAdmin } = useAuth();

  // Build menu items array
  const buildMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
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
      {
        key: 'stories',
        icon: <CoffeeOutlined />,
        label: 'Chuyện Linh Tinh',
        children: [
          { key: 'stories-list', label: <Link to="/stories">Danh sách</Link> },
          ...(user ? [{ key: 'stories-create', label: <Link to="/stories/create">Viết bài mới</Link> }] : []),
        ],
      },
    ];

    // Add admin menu items if user is admin
    if (isAdmin()) {
      baseItems.push({
        key: 'admin',
        icon: <SettingOutlined />,
        label: 'Quản trị',
        children: [
          { key: 'admin-stories', label: <Link to="/admin/stories">Kiểm duyệt bài viết</Link> },
        ],
      });
    }

    return baseItems;
  };

  // Mobile menu simplified items (for single line)
  const mobileMenuItems: MenuItem[] = [
    {
      key: 'home',
      label: <Link to="/">Trang Chủ</Link>,
    },
    {
      key: 'articles',
      label: <Link to="/articles/phong-thuy">Bài Viết</Link>,
    },
    {
      key: 'tools',
      label: <Link to="/tools">Công Cụ</Link>,
    },
    {
      key: 'stories',
      label: <Link to="/stories">Chuyện Linh Tinh</Link>,
    },
  ];

  const items = buildMenuItems();

  // Drawer functions
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  // Handle search submission
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <Layout className="layout">
      {/* --- Navbar --- */}
      <Header className="header">
        <div className="header-content">
          <Row justify="space-between" align="middle" style={{ height: '100%' }}>
            {/* Logo */}
            <Col xs={8} sm={4} md={3} className="logo-wrapper">
              <div className="logo">
                <Link to="/">DQT</Link>
              </div>
            </Col>

            {/* Desktop Menu - now in same row as logo */}
            <Col xs={0} sm={0} md={14} className="desktop-menu">
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname.split('/')[1] || 'home']}
                items={items}
              />
            </Col>

            {/* Search Bar (Desktop) */}
            <Col xs={0} sm={0} md={3} className="search-section">
              <Search
                placeholder="Tìm kiếm..."
                onSearch={handleSearch}
                style={{ width: '100%', marginTop: 16, marginLeft: -20 }}
              />
            </Col>

            {/* Auth Section (Desktop) */}
            <Col xs={0} sm={0} md={4} className="auth-section">
            {user ? (
              <div className="user-info">
                <Avatar>{user.fullName?.[0]}</Avatar>
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
                        onClick: logout
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

            {/* Mobile Navigation Menu */}
            <Col xs={10} sm={14} md={0} className="mobile-menu-wrapper">
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname.split('/')[1] || 'home']}
                items={mobileMenuItems}
                className="mobile-menu-line"
                disabledOverflow
              />
            </Col>

            {/* Mobile Right Controls */}
            <Col xs={6} sm={6} md={0} className="mobile-controls">
              {/* Search Icon */}
              <Button 
                type="text" 
                icon={<SearchOutlined />} 
                onClick={showDrawer}
                className="control-button"
              />
              
              {/* User/Login */}
              {user ? (
                <Avatar size="small" className="user-avatar">{user.fullName?.[0]}</Avatar>
              ) : (
                <Button size="small" type="primary" className="login-button">
                  <Link to="/login">Đăng Nhập</Link>
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </Header>

      {/* Mobile Drawer (for search and user profile) */}
      <Drawer
        title="Tìm kiếm"
        placement="right"
        onClose={onClose}
        open={visible}
      >
        {/* Search Bar (Mobile) */}
        <div className="mobile-search-container">
          <Search
            placeholder="Tìm kiếm..."
            onSearch={(value) => {
              handleSearch(value);
              onClose();
            }}
            style={{ width: '100%' }}
          />
        </div>
        
        {/* User Profile / Additional Options */}
        {user && (
          <div className="mobile-user-profile">
            <h3>Tài khoản</h3>
            <Menu
              mode="vertical"
              items={[
                { key: 'profile', label: <Link to="/profile">Hồ sơ</Link> },
                { key: 'logout', label: <span onClick={logout}>Đăng xuất</span> }
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* --- Main Content --- */}
      <Content className="content">{children}</Content>

      {/* --- Footer --- */}
      <Footer className="footer">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <h3>Về chúng tôi</h3>
            <p>Trang thông tin Phong Thủy, Tướng Số và Tử Vi uy tín, cung cấp kiến thức bổ ích và công cụ hỗ trợ.</p>
          </Col>
          <Col xs={24} md={8}>
            <h3>Liên kết</h3>
            <Menu mode="vertical" theme="light" selectable={false}>
              <Menu.Item key="home"><Link to="/">Trang chủ</Link></Menu.Item>
              <Menu.Item key="articles"><Link to="/articles/phong-thuy">Bài viết</Link></Menu.Item>
              <Menu.Item key="tools"><Link to="/tools">Công cụ</Link></Menu.Item>
              <Menu.Item key="stories"><Link to="/stories">Chuyện linh tinh</Link></Menu.Item>
            </Menu>
          </Col>
          <Col xs={24} md={8}>
            <h3>Liên hệ</h3>
            <p>Email: info@masterso.vn</p>
            <p>Điện thoại: (84) 123 456 789</p>
            <p>Địa chỉ: Thành phố Hồ Chí Minh, Việt Nam</p>
          </Col>
        </Row>
        <div className="copyright">
          <p>© {new Date().getFullYear()} MasterSo. All rights reserved.</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;