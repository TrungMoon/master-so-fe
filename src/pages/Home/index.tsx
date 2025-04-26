import React from 'react';
import { Typography, Row, Col, Card, Button, Carousel, List, Divider, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, ToolOutlined, StarOutlined, RightOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './style.css';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

// Mock data for featured articles
const featuredArticles = [
  {
    id: 1,
    title: 'Cân Xương Tính Lượng: Giải mã vận mệnh qua con số',
    description: 'Phương pháp cổ xưa giúp đoán vận mệnh thông qua các con số trong ngày sinh của bạn...',
    category: 'phong-thuy',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Cách bố trí văn phòng theo phong thủy để thăng tiến',
    description: 'Những nguyên tắc phong thủy cơ bản giúp bạn bố trí văn phòng làm việc hợp lý...',
    category: 'phong-thuy',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Nhân tướng học: Đọc vị tính cách qua khuôn mặt',
    description: 'Những dấu hiệu trên khuôn mặt tiết lộ điều gì về tính cách và vận mệnh của bạn...',
    category: 'nhan-tuong',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 4,
    title: 'Tứ trụ mệnh lý: Hướng dẫn cơ bản cho người mới',
    description: 'Tìm hiểu về cách phân tích tứ trụ mệnh lý và ý nghĩa của nó trong việc đoán vận mệnh...',
    category: 'tu-vi',
    image: 'https://via.placeholder.com/300x200',
  },
];

// Mock data for proverbs
const proverbs = [
  {
    id: 1,
    content: 'Tướng tùy tâm sinh, tâm tùy tướng diệt',
    meaning: 'Tướng mạo thay đổi theo tâm tính, khi tâm thay đổi, tướng mạo cũng sẽ thay đổi theo',
  },
  {
    id: 2,
    content: 'Nhất động bất như nhất tĩnh',
    meaning: 'Một phần động không bằng một phần tĩnh (trong phong thủy)',
  },
  {
    id: 3,
    content: 'Nhân phải sinh tờ địa lý, địa lý sinh tờ nhân phải',
    meaning: 'Con người phải sinh ra từ đất đai có khí tốt, đất đai tốt sinh ra con người tốt',
  },
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToolAccess = () => {
    if (user) {
      navigate('/tools/calculator');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      {/* Banner Section */}
      <Carousel autoplay className="home-carousel">
        <div>
          <div className="carousel-content" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x400)' }}>
            <div className="carousel-text">
              <Title level={2}>Khám phá Vận Mệnh của Bạn</Title>
              <Paragraph>
                Tìm hiểu tương lai thông qua phương pháp Cân Xương Tính Lượng cổ xưa
              </Paragraph>
              <Button type="primary" size="large" onClick={handleToolAccess}>
                Dùng ngay <RightOutlined />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="carousel-content" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x400)' }}>
            <div className="carousel-text">
              <Title level={2}>Khám Phá Nhân Tướng Học</Title>
              <Paragraph>
                Tìm hiểu ý nghĩa của các nét tướng trên khuôn mặt và cơ thể
              </Paragraph>
              <Button type="primary" size="large" onClick={() => navigate('/articles/nhan-tuong')}>
                Tìm hiểu thêm <RightOutlined />
              </Button>
            </div>
          </div>
        </div>
      </Carousel>

      {/* Main Content */}
      <div className="content-section">
        {/* Featured Articles */}
        <div className="section">
          <div className="section-header">
            <Title level={3}><BookOutlined /> Bài Viết Nổi Bật</Title>
            <Button type="link" onClick={() => navigate('/articles/all')}>
              Xem tất cả <RightOutlined />
            </Button>
          </div>
          
          <Row gutter={[16, 16]}>
            {featuredArticles.map(article => (
              <Col xs={24} sm={12} md={8} lg={6} key={article.id}>
                <Card
                  hoverable
                  cover={<img alt={article.title} src={article.image} />}
                  onClick={() => navigate(`/articles/${article.category}/${article.id}`)}
                  className="article-card"
                >
                  <Tag color="blue">{article.category === 'phong-thuy' ? 'Phong Thủy' : 
                                    article.category === 'nhan-tuong' ? 'Nhân Tướng' : 'Tử Vi'}</Tag>
                  <Meta 
                    title={article.title} 
                    description={article.description.length > 70 ? 
                      `${article.description.substring(0, 70)}...` : article.description} 
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Tools Access Section */}
        <div className="section tools-section">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <div className="tools-content">
                <Title level={3}><ToolOutlined /> Công Cụ Tính Toán</Title>
                <Paragraph>
                  Khám phá vận mệnh của bạn qua phương pháp Cân Xương Tính Lượng cổ xưa. 
                  Nhập thông tin ngày sinh và nhận phân tích chi tiết về cuộc đời bạn.
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleToolAccess}
                >
                  {user ? 'Dùng công cụ ngay' : 'Đăng nhập để sử dụng'}
                </Button>
                {!user && (
                  <Paragraph className="note">
                    *Bạn cần đăng nhập để sử dụng công cụ này
                  </Paragraph>
                )}
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="tools-image">
                <img 
                  src="https://via.placeholder.com/500x300" 
                  alt="Công cụ tính toán" 
                  style={{ width: '100%', borderRadius: '8px' }} 
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Proverbs Section */}
        <div className="section">
          <Title level={3}><StarOutlined /> Ca Dao & Tục Ngữ Về Tướng Số</Title>
          <Divider />
          
          <List
            itemLayout="vertical"
            dataSource={proverbs}
            renderItem={item => (
              <List.Item>
                <div className="proverb-item">
                  <Title level={4} className="proverb-content">"{item.content}"</Title>
                  <Paragraph className="proverb-meaning">{item.meaning}</Paragraph>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;