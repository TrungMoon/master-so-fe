import React from 'react';
import { Form, Input, Button, Divider, Typography } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
      password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        navigate('/');
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  return (
    <div className="auth-form">
      <Title level={2} style={{ textAlign: 'center' }}>Đăng Nhập</Title>
      <Divider />
      
      <Form layout="vertical" onFinish={formik.handleSubmit} style={{ width: '100%' }}>
        <Form.Item 
          label="Email"
          validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
          help={formik.touched.email && formik.errors.email}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập email của bạn"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          validateStatus={formik.errors.password && formik.touched.password ? 'error' : ''}
          help={formik.touched.password && formik.errors.password}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu của bạn"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>
      
      <div style={{ textAlign: 'center' }}>
        <a href="/register">Chưa có tài khoản? Đăng ký ngay</a>
      </div>
    </div>
  );
};

export default LoginForm; 