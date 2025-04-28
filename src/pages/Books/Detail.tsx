import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button, 
  Divider, 
  Breadcrumb, 
  Tabs, 
  Rate, 
  Tag, 
  Image, 
  Descriptions,
  List,
  Avatar,
  Form,
  Input
} from 'antd';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOutlined, 
  DownloadOutlined, 
  RiseOutlined, 
  StarOutlined, 
  TeamOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './style.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Datos de prueba mientras no hay backend
const mockBooks = [
  {
    id: 1,
    title: 'Phong Thủy Nhà Ở',
    slug: 'phong-thuy-nha-o',
    author: 'Nguyễn Văn A',
    coverImageURL: 'https://via.placeholder.com/300x400',
    category: 'phong-thuy',
    isFree: true,
    price: 0,
    rating: 4,
    viewCount: 1502,
    description: 'Cuốn sách về phong thủy nhà ở, giúp bạn hiểu về cách bố trí không gian sống hợp lý, mang lại may mắn và thịnh vượng cho gia đình. Tìm hiểu những nguyên tắc cơ bản về phong thủy và ứng dụng vào thiết kế nhà ở.',
    publishYear: 2020,
    publisher: 'Nhà xuất bản Văn Học',
    pages: 350,
    isbn: '978-604-3-28123-8',
    fileURL: '/books/sample.pdf',
    chapters: [
      { id: 1, title: 'Giới thiệu về Phong Thủy', isFree: true },
      { id: 2, title: 'Ngũ hành và ứng dụng', isFree: true },
      { id: 3, title: 'Phong thủy phòng khách', isFree: false },
      { id: 4, title: 'Phong thủy phòng ngủ', isFree: false },
      { id: 5, title: 'Phong thủy nhà bếp', isFree: false }
    ],
    reviews: [
      { id: 1, user: 'Trần Văn X', avatar: 'https://via.placeholder.com/50', rating: 5, content: 'Sách rất hay và bổ ích, giúp tôi hiểu nhiều hơn về phong thủy.', date: '2024-03-15' },
      { id: 2, user: 'Lê Thị Y', avatar: 'https://via.placeholder.com/50', rating: 4, content: 'Nội dung dễ hiểu, nhiều hình ảnh minh họa, tôi đã áp dụng một số mẹo vào nhà mình.', date: '2024-02-28' }
    ]
  }
];

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('info');
  const [commentValue, setCommentValue] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  
  // Encontrar el libro por slug
  const book = mockBooks.find(book => book.slug === id);
  
  if (!book) {
    return (
      <Card>
        <Title level={3}>Không tìm thấy sách</Title>
        <Paragraph>
          Rất tiếc, cuốn sách bạn đang tìm không có trong thư viện của chúng tôi.
        </Paragraph>
        <Button type="primary">
          <Link to="/books">Quay lại thư viện</Link>
        </Button>
      </Card>
    );
  }
  
  const canDownloadPremium = user && hasPermission('download_premium_books');
  
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  const handleDownload = () => {
    if (book.isFree || canDownloadPremium) {
      // Lógica para descargar el libro
      console.log('Downloading book:', book.id);
      window.open(book.fileURL, '_blank');
    } else {
      // Mostrar mensaje de que necesita una suscripción
      console.log('Premium book - subscription required');
    }
  };
  
  const handleSubmitComment = () => {
    if (commentValue.trim()) {
      console.log('New comment:', { rating, content: commentValue });
      // Aquí iría la lógica para enviar el comentario al backend
      setCommentValue('');
      setRating(5);
    }
  };

  return (
    <div className="book-detail">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/books">Thư viện sách</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{book.title}</Breadcrumb.Item>
      </Breadcrumb>
      
      <Card className="book-detail-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div className="book-cover">
              <Image
                src={book.coverImageURL}
                alt={book.title}
                style={{ maxWidth: '100%' }}
              />
              <div className="book-actions">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<DownloadOutlined />} 
                  onClick={handleDownload}
                  disabled={!book.isFree && !canDownloadPremium}
                  block
                >
                  {book.isFree ? 'Tải xuống miễn phí' : 'Tải xuống sách'}
                </Button>
                
                {!book.isFree && !canDownloadPremium && (
                  <Paragraph className="premium-note">
                    <RiseOutlined /> Sách này yêu cầu gói Premium để tải xuống
                  </Paragraph>
                )}
                
                <div className="book-stats">
                  <Tag icon={<StarOutlined />} color="orange">
                    Đánh giá: {book.rating}/5
                  </Tag>
                  <Tag icon={<TeamOutlined />} color="blue">
                    Lượt xem: {book.viewCount}
                  </Tag>
                </div>
                
                <Divider />
                
                <Tag color={book.isFree ? 'success' : 'purple'} style={{ fontSize: 16, padding: '5px 10px' }}>
                  {book.isFree ? 'Sách Miễn phí' : `Sách Premium - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}`}
                </Tag>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={16}>
            <div className="book-info">
              <Title level={2}>{book.title}</Title>
              <Title level={4} type="secondary">{book.author}</Title>
              <Tag color="blue" icon={<BookOutlined />} style={{ marginBottom: 20 }}>
                {book.category}
              </Tag>
              
              <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <TabPane tab="Thông tin" key="info">
                  <Paragraph>{book.description}</Paragraph>
                  
                  <Divider orientation="left">Chi tiết sách</Divider>
                  
                  <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Tác giả">{book.author}</Descriptions.Item>
                    <Descriptions.Item label="NXB">{book.publisher}</Descriptions.Item>
                    <Descriptions.Item label="Năm xuất bản">{book.publishYear}</Descriptions.Item>
                    <Descriptions.Item label="Số trang">{book.pages}</Descriptions.Item>
                    <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
                    <Descriptions.Item label="Định dạng">PDF</Descriptions.Item>
                  </Descriptions>
                </TabPane>
                
                <TabPane tab="Mục lục" key="chapters">
                  <List
                    itemLayout="horizontal"
                    dataSource={book.chapters}
                    renderItem={chapter => (
                      <List.Item 
                        actions={[
                          chapter.isFree ? (
                            <Button type="link" icon={<FileTextOutlined />}>
                              Đọc thử
                            </Button>
                          ) : (
                            <Tag color="purple">Premium</Tag>
                          )
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<FileTextOutlined />} />}
                          title={`Chương ${chapter.id}: ${chapter.title}`}
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
                
                <TabPane tab={`Đánh giá (${book.reviews.length})`} key="reviews">
                  <List
                    itemLayout="horizontal"
                    dataSource={book.reviews}
                    renderItem={review => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={review.avatar} />}
                          title={
                            <div>
                              {review.user} <Rate disabled defaultValue={review.rating} />
                            </div>
                          }
                          description={
                            <div>
                              <Paragraph>{review.content}</Paragraph>
                              <Text type="secondary">
                                <ClockCircleOutlined /> {review.date}
                              </Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  
                  {user && (
                    <>
                      <Divider orientation="left">Viết đánh giá</Divider>
                      <Form layout="vertical">
                        <Form.Item label="Đánh giá của bạn">
                          <Rate value={rating} onChange={setRating} />
                        </Form.Item>
                        <Form.Item label="Nội dung">
                          <TextArea 
                            rows={4} 
                            value={commentValue} 
                            onChange={(e) => setCommentValue(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn về cuốn sách..."
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button 
                            type="primary" 
                            icon={<MessageOutlined />}
                            onClick={handleSubmitComment}
                            disabled={!commentValue.trim()}
                          >
                            Gửi đánh giá
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  )}
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BookDetail; 