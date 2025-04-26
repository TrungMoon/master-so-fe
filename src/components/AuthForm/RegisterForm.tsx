import React from 'react';
import { Form, Input, Button, Divider, Typography, notification, DatePicker } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: moment.Moment | null;
}

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required('Vui lòng nhập họ tên')
        .min(3, 'Họ tên phải có ít nhất 3 ký tự'),
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
      password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
      phone: Yup.string()
        .required('Vui lòng nhập số điện thoại'),
      dateOfBirth: Yup.date()
        .required('Vui lòng chọn ngày sinh'),
    }),
    onSubmit: async (values) => {
      try {
        const { fullName, email, password, phone, dateOfBirth } = values;
        await register({
          fullName,
          email,
          password,
          phone,
          dateOfBirth: dateOfBirth?.toDate() || new Date(),
        });
        notification.success({
          message: 'Registration successful',
          description: 'You have successfully registered. Please login.',
        });
        navigate('/login');
      } catch (error) {
        notification.error({
          message: 'Registration failed',
          description: error instanceof Error ? error.message : 'Something went wrong',
        });
      }
    },
  });

  return (
    <div className="auth-form">
      <Title level={2} style={{ textAlign: 'center' }}>Đăng Ký</Title>
      <Divider />
      
      <Form layout="vertical" onFinish={formik.handleSubmit} style={{ width: '100%' }}>
        <Form.Item 
          label="Họ và Tên"
          validateStatus={formik.errors.fullName && formik.touched.fullName ? 'error' : ''}
          help={formik.touched.fullName && formik.errors.fullName}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập họ và tên"
            name="fullName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
          />
        </Form.Item>

        <Form.Item 
          label="Email"
          validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
          help={formik.touched.email && formik.errors.email}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email của bạn"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
        </Form.Item>

        <Form.Item 
          label="Số điện thoại"
          validateStatus={formik.errors.phone && formik.touched.phone ? 'error' : ''}
          help={formik.touched.phone && formik.errors.phone}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Nhập số điện thoại"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
        </Form.Item>

        <Form.Item 
          label="Ngày sinh"
          validateStatus={formik.errors.dateOfBirth && formik.touched.dateOfBirth ? 'error' : ''}
          help={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Chọn ngày sinh"
            name="dateOfBirth"
            format="DD/MM/YYYY"
            onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
            onBlur={formik.handleBlur}
            value={formik.values.dateOfBirth}
            suffixIcon={<CalendarOutlined />}
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

        <Form.Item
          label="Xác nhận mật khẩu"
          validateStatus={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'error' : ''}
          help={formik.touched.confirmPassword && formik.errors.confirmPassword}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu của bạn"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Đăng Ký
          </Button>
        </Form.Item>
      </Form>
      
      <div style={{ textAlign: 'center' }}>
        <a href="/login">Đã có tài khoản? Đăng nhập ngay</a>
      </div>
    </div>
  );
};

export default RegisterForm; 