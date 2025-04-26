import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import LoginForm from '../../components/AuthForm/LoginForm';
import './style.css';

const { Title } = Typography;

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <Card className="login-card" bordered={false}>
            <div className="text-center">
              <Title level={2} className="app-title">MasterSo - Phong Thủy</Title>
              <p className="app-subtitle">Đăng nhập để trải nghiệm đầy đủ các tính năng</p>
            </div>
            <LoginForm />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login; 