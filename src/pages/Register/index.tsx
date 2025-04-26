import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import RegisterForm from '../../components/AuthForm/RegisterForm';
import '../Login/style.css';

const { Title } = Typography;

const Register: React.FC = () => {
  return (
    <div className="login-container">
      <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
        <Col xs={22} sm={20} md={16} lg={12}>
          <Card className="login-card" bordered={false}>
            <div className="text-center">
              <Title level={2} className="app-title">MasterSo - Phong Thủy</Title>
              <p className="app-subtitle">Đăng ký để trải nghiệm đầy đủ các tính năng phong thủy</p>
            </div>
            <RegisterForm />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register; 