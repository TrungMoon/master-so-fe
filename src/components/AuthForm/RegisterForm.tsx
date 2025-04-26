import React from 'react';
import { Form, Input, Button, DatePicker, Divider, Typography } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, PhoneOutlined, CalendarOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      phone: '',
      dateOfBirth: null,
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required('Vui lòng nhập họ và tên'),
      phone: Yup.string()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
      dateOfBirth: Yup.date()
        .required('Vui lòng chọn ngày sinh')
        .max(new Date(), 'Ngày sinh không hợp lệ'),
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
      password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
    }),
    onSubmit: async (values) => {
      try {
        await register({
          fullName: values.fullName,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth as unknown as Date,
          email: values.email,
          password: values.password,
        });
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
  });

  const disabledDate = (current: Dayjs) => {
    return current && current > dayjs();
  };

  return (
    <div className="auth-form">
      <Title level={2} style={{ textAlign: 'center' }}>Đăng Ký</Title>
      <Divider />
      
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        <Form.Item 
          label="Họ và tên"
          validateStatus={formik.errors.fullName && formik.touched.fullName ? 'error' : ''}
          help={formik.touched.fullName && formik.errors.fullName}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập họ và tên đầy đủ"
            name="fullName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
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
          help={formik.touched.dateOfBirth && formik.errors.dateOfBirth as string}
        >
          <DatePicker 
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày sinh"
            disabledDate={disabledDate}
            onChange={(date) => {
              formik.setFieldValue('dateOfBirth', date ? date.toDate() : null);
            }}
            onBlur={formik.handleBlur}
            name="dateOfBirth"
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item 
          label="Email"
          validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
          help={formik.touched.email && formik.errors.email}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email"
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
            placeholder="Nhập mật khẩu"
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
            placeholder="Xác nhận mật khẩu"
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