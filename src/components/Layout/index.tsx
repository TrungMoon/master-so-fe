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
  SearchOutlined,
  AppstoreOutlined,
  ReadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.less'; // File CSS cho layout
import { useAuth } from '../../contexts/AuthContext';
import MobileNavigation from './MobileNavigation';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

type MenuItem = Required<MenuProps>['items'][number];

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, isAdmin, isSuperAdmin } = useAuth();

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
        icon: <AppstoreOutlined />,
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
      {
        key: 'books',
        icon: <BookOutlined />,
        label: <Link to="/books">Thư viện sách</Link>,
      },
    ];

    // Add admin menu items if user is admin
    if (isAdmin() || isSuperAdmin()) {
      baseItems.push({
        key: 'admin',
        icon: <SettingOutlined />,
        label: 'Quản trị',
        children: [
          { key: 'admin-stories', label: <Link to="/admin/stories">Kiểm duyệt bài viết</Link> },
        ],
      });
    }

    // Add user menu items
    if (user) {
      baseItems.push({
        key: 'profile',
        icon: <UserOutlined />,
        label: user.fullName || user.email,
        children: [
          {
            key: 'profile',
            label: <Link to="/profile">Thông tin cá nhân</Link>,
          },
          isAdmin() || isSuperAdmin() ? (
            {
              key: 'admin',
              label: <Link to="/admin/dashboard">Quản lý</Link>,
            }
          ) : null,
          {
            key: 'logout',
            label: <span onClick={logout}>Đăng xuất</span>,
          },
        ].filter(Boolean),
      });
    }

    return baseItems;
  };

  const items = buildMenuItems();

  // Drawer functions
  const showSearchDrawer = () => setSearchVisible(true);
  const closeSearchDrawer = () => setSearchVisible(false);
  
  // Menu drawer functions
  const showMenuDrawer = () => setMenuVisible(true);
  const closeMenuDrawer = () => setMenuVisible(false);

  // Handle search submission
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      closeSearchDrawer();
    }
  };

  // Check if current page isn't home to show back button on mobile
  const showBackButton = location.pathname !== '/';

  return (
    <Layout className="layout">
      {/* --- Navbar --- */}
      <Header className="header">
        <div className="header-content">
          <Row justify="space-between" align="middle" style={{ height: '100%' }}>
            
            {/* 1. Logo */}
            <Col
              xs={{ span: 8, order: 1 }}
              sm={{ span: 8, order: 1 }}
              md={1}
              className="logo-wrapper"
            >
              <div className="logo">
                <Link to="/">DQT</Link>
              </div>
            </Col>

            {/* 2. Search (mobile only) */}
            <Col
              xs={{ span: 8, order: 2 }}
              sm={{ span: 8, order: 2 }}
              md={0}
              className="mobile-search"
              style={{ textAlign: 'center' }}
            >
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={showSearchDrawer}
                className="control-button"
                style={{ color: 'white' }}
              />
            </Col>

            {/* 3. Menu (mobile only) */}
            <Col
              xs={{ span: 8, order: 3 }}
              sm={{ span: 8, order: 3 }}
              md={0}
              className="mobile-menu"
              style={{ textAlign: 'right' }}
            >
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={showMenuDrawer}
                className="control-button"
                style={{ color: 'white' }}
              />
            </Col>

            {/* Desktop Menu - now in same row as logo */}
            <Col xs={0} sm={0} md={19} className="desktop-menu">
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
                style={{ width: '100%', marginTop: 16, marginLeft: -30 }}
              />
            </Col>

            {/* Auth Section (Desktop) */}
            <Col xs={0} sm={0} md={1} className="auth-section">
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
          </Row>
        </div>
      </Header>

      {/* Mobile Drawer (for search) */}
      <Drawer
        title="Tìm kiếm"
        placement="right"
        onClose={closeSearchDrawer}
        open={searchVisible}
      >
        {/* Search Bar (Mobile) */}
        <div className="mobile-search-container">
          <Search
            placeholder="Tìm kiếm..."
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
        </div>
      </Drawer>
      
      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeMenuDrawer}
        open={menuVisible}
        width={280}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.split('/')[1] || 'home']}
          style={{ border: 'none' }}
          items={items}
          onClick={() => {
            // Close menu drawer when a menu item is clicked
            closeMenuDrawer();
          }}
        />
        
        {/* Login/Register buttons if user not logged in */}
        {!user && (
          <div className="mobile-auth-buttons">
            <Button type="primary" block style={{ marginTop: 16 }}>
              <Link to="/login">Đăng Nhập</Link>
            </Button>
            <Button block style={{ marginTop: 8 }}>
              <Link to="/register">Đăng Ký</Link>
            </Button>
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
      
      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </Layout>
  );
};

export default LayoutComponent;