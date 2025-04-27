import React, { useState } from 'react';
import { Table, Tag, Button, Space, Typography, Input, Modal, Form, Select, Tooltip } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';

const { Title } = Typography;
const { Option } = Select;

interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  roles: string[];
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Sample data
  const users: User[] = [
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      email: 'admin@example.com',
      phone: '0901234567',
      status: 'Active',
      roles: ['Admin'],
      createdAt: '2022-01-01'
    },
    {
      id: 2,
      fullName: 'Trần Văn B',
      email: 'superadmin@example.com',
      phone: '0901234568',
      status: 'Active',
      roles: ['SuperAdmin'],
      createdAt: '2022-01-02'
    },
    {
      id: 3,
      fullName: 'Phạm Văn C',
      email: 'user1@example.com',
      phone: '0901234569',
      status: 'Active',
      roles: ['User'],
      createdAt: '2022-01-03'
    },
    {
      id: 4,
      fullName: 'Lê Thị D',
      email: 'user2@example.com',
      phone: '0901234570',
      status: 'Inactive',
      roles: ['User'],
      createdAt: '2022-01-04'
    }
  ];

  // Filter users based on search text
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchText.toLowerCase()) || 
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle edit user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      roles: user.roles
    });
    setEditModalVisible(true);
  };

  // Handle user deletion
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  // Handle edit form submission
  const handleEditSubmit = (values: any) => {
    console.log('Updated user:', { ...selectedUser, ...values });
    setEditModalVisible(false);
    // Here you would send the updated user to the backend
  };

  // Handle user deletion confirmation
  const confirmDelete = () => {
    console.log('Deleted user:', selectedUser);
    setDeleteModalVisible(false);
    // Here you would send the delete request to the backend
  };

  // Check if the current admin can edit a specific user
  const canEditUser = (user: User) => {
    // Super Admin can edit any user
    if (isSuperAdmin()) return true;
    
    // Admin can't edit SuperAdmin or other Admins
    if (user.roles.includes('SuperAdmin') || user.roles.includes('Admin')) {
      return false;
    }
    
    return hasPermission('edit_users');
  };

  // Check if the current admin can delete a specific user
  const canDeleteUser = (user: User) => {
    // Only Super Admin can delete users
    if (!isSuperAdmin()) return false;
    
    // Super Admin can't delete themselves
    if (user.roles.includes('SuperAdmin')) {
      return false;
    }
    
    return hasPermission('delete_users');
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map(role => {
            let color = 'blue';
            if (role === 'SuperAdmin') color = 'red';
            if (role === 'Admin') color = 'green';
            return <Tag color={color} key={role}>{role}</Tag>;
          })}
        </>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Tooltip title={canEditUser(record) ? 'Chỉnh sửa' : 'Bạn không có quyền chỉnh sửa người dùng này'}>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              disabled={!canEditUser(record)}
            />
          </Tooltip>
          <Tooltip title={canDeleteUser(record) ? 'Xóa' : 'Bạn không có quyền xóa người dùng này'}>
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
              disabled={!canDeleteUser(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="user-management">
      <Title level={2}>Quản lý người dùng</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên hoặc email"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300, marginRight: 16 }}
        />
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      
      {/* Edit User Modal */}
      <Modal
        title="Chỉnh sửa người dùng"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Suspended">Suspended</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="roles"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select mode="multiple" disabled={!isSuperAdmin()}>
              <Option value="User">User</Option>
              <Option value="Admin">Admin</Option>
              {isSuperAdmin() && <Option value="SuperAdmin">SuperAdmin</Option>}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Lưu thay đổi
            </Button>
            <Button onClick={() => setEditModalVisible(false)}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Delete User Confirmation Modal */}
      <Modal
        title="Xác nhận xóa người dùng"
        visible={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.fullName}</strong>?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default UserManagement; 