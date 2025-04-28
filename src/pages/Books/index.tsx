import React, { useState } from 'react';
import { Typography, Card, Row, Col, Input, Select, Pagination, Empty, Breadcrumb, Tabs } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { BookOutlined, SearchOutlined } from '@ant-design/icons';
import BookCard from './components/BookCard';
import './style.css';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Datos de prueba mientras no hay backend
const mockBooks = [
  {
    id: 1,
    title: 'Phong Thủy Nhà Ở',
    slug: 'phong-thuy-nha-o',
    author: 'Nguyễn Văn A',
    coverImageURL: 'https://via.placeholder.com/150x200',
    category: 'phong-thuy',
    isFree: true,
    price: 0,
    rating: 4,
    viewCount: 1502
  },
  {
    id: 2,
    title: 'Nghệ Thuật Xem Tướng Người',
    slug: 'nghe-thuat-xem-tuong-nguoi',
    author: 'Trần Thị B',
    coverImageURL: 'https://via.placeholder.com/150x200',
    category: 'nhan-tuong',
    isFree: false,
    price: 150000,
    rating: 5,
    viewCount: 2240
  },
  {
    id: 3,
    title: 'Bí Quyết Tử Vi Đẩu Số',
    slug: 'bi-quyet-tu-vi-dau-so',
    author: 'Lê Văn C',
    coverImageURL: 'https://via.placeholder.com/150x200',
    category: 'tu-vi',
    isFree: false,
    price: 200000,
    rating: 4.5,
    viewCount: 1820
  },
  {
    id: 4,
    title: 'Cổ Học Tinh Hoa - Tập 1',
    slug: 'co-hoc-tinh-hoa-tap-1',
    author: 'Nhiều tác giả',
    coverImageURL: 'https://via.placeholder.com/150x200',
    category: 'co-hoc-tinh-hoa',
    isFree: true,
    price: 0,
    rating: 5,
    viewCount: 3250
  }
];

// Categorías de prueba
const categories = [
  { id: 1, name: 'Phong Thủy', slug: 'phong-thuy' },
  { id: 2, name: 'Nhân Tướng Học', slug: 'nhan-tuong' },
  { id: 3, name: 'Tử Vi', slug: 'tu-vi' },
  { id: 4, name: 'Cổ Học Tinh Hoa', slug: 'co-hoc-tinh-hoa' }
];

const BooksLibrary: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [activeTab, setActiveTab] = useState<string>(category || 'all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Filtrar libros por categoría y término de búsqueda
  const filteredBooks = mockBooks.filter(book => {
    const matchesCategory = activeTab === 'all' || book.category === activeTab;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Ordenar libros
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id; // Suponiendo que id mayor = más reciente
      case 'popular':
        return b.viewCount - a.viewCount;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Paginación
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="books-library">
      <div className="books-header">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Thư viện sách</Breadcrumb.Item>
          {activeTab !== 'all' && (
            <Breadcrumb.Item>
              {categories.find(cat => cat.slug === activeTab)?.name || ''}
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
        
        <Title level={2}>
          <BookOutlined /> Thư Viện Sách
        </Title>
        <Paragraph className="subtitle">
          Khám phá kho tàng kiến thức phong thủy, tướng số và văn hóa phương Đông
        </Paragraph>
      </div>

      <div className="books-controls">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Tìm kiếm theo tên sách hoặc tác giả"
              onSearch={handleSearch}
              enterButton={<><SearchOutlined /> Tìm kiếm</>}
              size="large"
            />
          </Col>
          <Col xs={24} md={12} className="sort-control">
            <span className="sort-label">Sắp xếp theo:</span>
            <Select 
              defaultValue="newest" 
              onChange={handleSortChange}
              size="large"
              style={{ width: 150 }}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="popular">Phổ biến nhất</Option>
              <Option value="rating">Đánh giá cao</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <Card className="books-content">
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          type="card"
          size="large"
          className="category-tabs"
        >
          <TabPane tab="Tất cả sách" key="all">
            {renderBooksList(paginatedBooks)}
          </TabPane>
          {categories.map(cat => (
            <TabPane tab={cat.name} key={cat.slug}>
              {renderBooksList(paginatedBooks)}
            </TabPane>
          ))}
        </Tabs>

        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={filteredBooks.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total) => `Tổng cộng ${total} sách`}
          />
        </div>
      </Card>
    </div>
  );
};

const renderBooksList = (books: any[]) => {
  if (books.length === 0) {
    return (
      <Empty
        description="Không tìm thấy sách nào phù hợp"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {books.map(book => (
        <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  );
};

export default BooksLibrary; 