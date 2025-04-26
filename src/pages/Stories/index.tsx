import React from 'react';
import { Row, Col, Typography, Breadcrumb, Card, Tag, Divider } from 'antd';
import { HomeOutlined, ClockCircleOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './style.css';

const { Title, Paragraph } = Typography;

// Dữ liệu mẫu cho các câu chuyện
const stories = [
  {
    id: 1,
    title: 'Phong Thủy cho phòng khách hiện đại',
    summary: 'Những nguyên tắc phong thủy cơ bản giúp thiết kế phòng khách hợp mệnh, tăng vận khí và mang lại sự thịnh vượng cho gia chủ.',
    image: 'https://via.placeholder.com/400x300',
    author: 'Nguyễn Văn A',
    date: '20/10/2023',
    views: 1258,
    tags: ['Phong thủy', 'Phòng khách', 'Thiết kế']
  },
  {
    id: 2,
    title: 'Cách bố trí bàn thờ gia tiên theo phong thủy',
    summary: 'Hướng dẫn chi tiết về vị trí, kích thước và cách bài trí bàn thờ gia tiên hợp phong thủy, mang lại may mắn cho gia đình.',
    image: 'https://via.placeholder.com/400x300',
    author: 'Trần Thị B',
    date: '15/11/2023',
    views: 857,
    tags: ['Bàn thờ', 'Gia tiên', 'Tâm linh']
  },
  {
    id: 3,
    title: 'Những điều cấm kỵ khi xây nhà theo phong thủy',
    summary: 'Tổng hợp những điều kiêng kỵ quan trọng trong phong thủy khi xây dựng nhà ở mà gia chủ cần biết để tránh vận xui, mang lại tài lộc.',
    image: 'https://via.placeholder.com/400x300',
    author: 'Lê Văn C',
    date: '05/12/2023',
    views: 2145,
    tags: ['Xây nhà', 'Kiêng kỵ', 'Vận mệnh']
  },
  {
    id: 4,
    title: 'Cách hóa giải hướng nhà không hợp tuổi',
    summary: 'Những phương pháp hóa giải khi đã mua phải nhà có hướng không hợp tuổi, giúp giảm thiểu tác động xấu và cải thiện vận khí.',
    image: 'https://via.placeholder.com/400x300',
    author: 'Phạm Thị D',
    date: '18/12/2023',
    views: 1672,
    tags: ['Hướng nhà', 'Hóa giải', 'Mệnh']
  },
];

const Stories: React.FC = () => {
  return (
    <div className="stories-container">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chuyện Linh Tinh</Breadcrumb.Item>
      </Breadcrumb>

      <div className="stories-header">
        <Title level={2}>Chuyện Linh Tinh</Title>
        <Paragraph className="subtitle">
          Tổng hợp các bài viết, câu chuyện thú vị về phong thủy, tâm linh và những 
          kinh nghiệm quý báu giúp bạn hiểu thêm về văn hóa phương Đông.
        </Paragraph>
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        {stories.map(story => (
          <Col xs={24} sm={24} md={12} lg={12} xl={12} key={story.id}>
            <Card className="story-card" hoverable>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={8}>
                  <div className="story-image-container">
                    <img src={story.image} alt={story.title} className="story-image" />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={16}>
                  <div className="story-content">
                    <Title level={4} className="story-title">
                      <Link to={`/stories/${story.id}`}>{story.title}</Link>
                    </Title>
                    <Paragraph className="story-summary">{story.summary}</Paragraph>
                    
                    <div className="story-footer">
                      <div className="story-tags">
                        {story.tags.map(tag => (
                          <Tag key={tag} color="blue">{tag}</Tag>
                        ))}
                      </div>
                      
                      <div className="story-meta">
                        <span className="author">
                          <UserOutlined /> {story.author}
                        </span>
                        <span className="date">
                          <ClockCircleOutlined /> {story.date}
                        </span>
                        <span className="views">
                          <EyeOutlined /> {story.views} lượt xem
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Stories; 