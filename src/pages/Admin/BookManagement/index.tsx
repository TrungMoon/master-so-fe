import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Tooltip, 
  Modal, 
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  DatePicker,
  Switch,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  UploadOutlined,
  FileTextOutlined,
  BookOutlined,
  EyeOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../../contexts/AuthContext';
import './style.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

// Datos de prueba mientras no hay backend
const mockBooks = [
  {
    id: 1,
    title: 'Phong Thủy Nhà Ở',
    slug: 'phong-thuy-nha-o',
    author: 'Nguyễn Văn A',
    category: 'phong-thuy',
    isFree: true,
    price: 0,
    viewCount: 1502,
    downloadCount: 128,
    createdAt: '2024-01-15',
    isPublished: true,
    addedBy: 'admin@example.com'
  },
  {
    id: 2,
    title: 'Nghệ Thuật Xem Tướng Người',
    slug: 'nghe-thuat-xem-tuong-nguoi',
    author: 'Trần Thị B',
    category: 'nhan-tuong',
    isFree: false,
    price: 150000,
    viewCount: 2240,
    downloadCount: 89,
    createdAt: '2024-02-10',
    isPublished: true,
    addedBy: 'admin@example.com'
  },
  {
    id: 3,
    title: 'Bí Quyết Tử Vi Đẩu Số',
    slug: 'bi-quyet-tu-vi-dau-so',
    author: 'Lê Văn C',
    category: 'tu-vi',
    isFree: false,
    price: 200000,
    viewCount: 1820,
    downloadCount: 76,
    createdAt: '2024-03-05',
    isPublished: false,
    addedBy: 'moderator@example.com'
  }
];

// Categorías de prueba
const categories = [
  { id: 1, name: 'Phong Thủy', slug: 'phong-thuy' },
  { id: 2, name: 'Nhân Tướng Học', slug: 'nhan-tuong' },
  { id: 3, name: 'Tử Vi', slug: 'tu-vi' },
  { id: 4, name: 'Cổ Học Tinh Hoa', slug: 'co-hoc-tinh-hoa' }
];

interface BookType {
  id: number;
  title: string;
  slug: string;
  author: string;
  category: string;
  isFree: boolean;
  price: number;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  isPublished: boolean;
  addedBy: string;
}

const BookManagement: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const [books, setBooks] = useState<BookType[]>(mockBooks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<BookType | null>(null);
  const [form] = Form.useForm();
  
  const columns: ColumnsType<BookType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a href={`/books/${record.slug}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text) => {
        const category = categories.find(cat => cat.slug === text);
        return <Tag color="blue">{category?.name || text}</Tag>;
      },
    },
    {
      title: 'Loại',
      dataIndex: 'isFree',
      key: 'isFree',
      render: (isFree) => (
        isFree ? 
          <Tag color="success">Miễn phí</Tag> : 
          <Tag color="purple">Premium</Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    {
      title: 'Lượt tải',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      sorter: (a, b) => a.downloadCount - b.downloadCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished) => (
        isPublished ? 
          <Tag color="green">Đang hiển thị</Tag> : 
          <Tag color="orange">Đang ẩn</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              type="primary" 
              ghost
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              icon={<DeleteOutlined />} 
              onClick={() => showDeleteConfirm(record)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showDeleteConfirm = (book: BookType) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa sách "${book.title}"?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        handleDelete(book.id);
      },
    });
  };

  const handleDelete = (id: number) => {
    setBooks(books.filter(book => book.id !== id));
    message.success('Xóa sách thành công!');
  };

  const handleEdit = (book: BookType) => {
    setCurrentBook(book);
    setIsEditing(true);
    form.setFieldsValue({
      ...book,
      category: categories.find(cat => cat.slug === book.category)?.id
    });
    setIsModalVisible(true);
  };

  const handleAddNew = () => {
    setCurrentBook(null);
    setIsEditing(false);
    form.resetFields();
    form.setFieldsValue({
      isFree: true,
      price: 0,
      isPublished: true
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    const selectedCategory = categories.find(cat => cat.id === values.category);
    
    const bookData = {
      ...values,
      category: selectedCategory?.slug || '',
      slug: values.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
    };
    
    if (isEditing && currentBook) {
      // Actualizar libro existente
      setBooks(books.map(book => 
        book.id === currentBook.id ? { ...book, ...bookData } : book
      ));
      message.success('Cập nhật sách thành công!');
    } else {
      // Crear nuevo libro
      const newBook = {
        id: Math.max(...books.map(book => book.id)) + 1,
        ...bookData,
        viewCount: 0,
        downloadCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        addedBy: user?.email || ''
      };
      setBooks([...books, newBook]);
      message.success('Thêm sách mới thành công!');
    }
    
    setIsModalVisible(false);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="book-management">
      <Card className="book-management-header">
        <div className="header-content">
          <div>
            <Title level={2}>
              <BookOutlined /> Quản lý sách
            </Title>
            <Paragraph className="subtitle">
              Thêm, chỉnh sửa hoặc xóa sách trong thư viện
            </Paragraph>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddNew}
            size="large"
          >
            Thêm sách mới
          </Button>
        </div>
      </Card>
      
      <Card className="book-management-content">
        <Table 
          columns={columns} 
          dataSource={books} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total} sách`
          }}
        />
      </Card>
      
      <Modal
        title={isEditing ? "Chỉnh sửa sách" : "Thêm sách mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={isEditing ? "Cập nhật" : "Thêm sách"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="title"
            label="Tiêu đề sách"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề sách!' }]}
          >
            <Input placeholder="Nhập tiêu đề sách" />
          </Form.Item>
          
          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
          >
            <Input placeholder="Nhập tên tác giả" />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="isFree"
            label="Loại sách"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Miễn phí" 
              unCheckedChildren="Premium" 
              onChange={(checked) => {
                if (checked) {
                  form.setFieldsValue({ price: 0 });
                }
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Giá sách (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập giá sách!' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => value ? parseFloat(value.replace(/[^\d.]/g, '')) : 0}
              disabled={form.getFieldValue('isFree')}
              min={0}
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả sách"
          >
            <TextArea rows={4} placeholder="Nhập mô tả sách" />
          </Form.Item>
          
          <Form.Item
            name="coverImage"
            label="Ảnh bìa sách"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload 
              listType="picture" 
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="bookFile"
            label="File sách (PDF)"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload 
              listType="text" 
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<FileTextOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="isPublished"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Đang hiển thị" 
              unCheckedChildren="Đang ẩn" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookManagement; 