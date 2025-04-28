import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Badge } from 'antd';
import { 
  HomeOutlined, 
  AppstoreOutlined, 
  ToolOutlined, 
  UserOutlined, 
  BookOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.less';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Extract the first part of the path to determine active tab
  const currentPath = location.pathname.split('/')[1] || 'home';
  
  const navItems = [
    { key: 'home', icon: <HomeOutlined />, text: 'Trang chủ', link: '/' },
    { key: 'articles', icon: <AppstoreOutlined />, text: 'Bài viết', link: '/articles/phong-thuy' },
    { key: 'tools', icon: <ToolOutlined />, text: 'Công cụ', link: '/tools' },
    { key: 'books', icon: <BookOutlined />, text: 'Sách', link: '/books' },
    { key: 'profile', icon: <UserOutlined />, text: 'Tài khoản', link: user ? '/profile' : '/login' }
  ];

  return (
    <div className="mobile-navigation">
      <Row justify="space-around" align="middle">
        {navItems.map(item => (
          <Col span={4} key={item.key}>
            <Link 
              to={item.link} 
              className={`nav-item ${currentPath === item.key ? 'active' : ''}`}
            >
              <div className="nav-icon">
                {item.key === 'profile' && !user ? (
                  <Badge dot color="red">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </div>
              <div className="nav-text">{item.text}</div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MobileNavigation; 