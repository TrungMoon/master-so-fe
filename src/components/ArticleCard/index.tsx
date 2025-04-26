import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './style.css';

const { Meta } = Card;
const { Text } = Typography;

export interface ArticleProps {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  publishDate?: string;
  viewCount?: number;
}

interface ArticleCardProps {
  article: ArticleProps;
  showStats?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, showStats = false }) => {
  const navigate = useNavigate();
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'phong-thuy':
        return 'Phong Thủy';
      case 'nhan-tuong':
        return 'Nhân Tướng';
      case 'tu-vi':
        return 'Tử Vi';
      default:
        return category;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'phong-thuy':
        return 'blue';
      case 'nhan-tuong':
        return 'green';
      case 'tu-vi':
        return 'purple';
      default:
        return 'default';
    }
  };

  const handleClick = () => {
    navigate(`/articles/${article.category}/${article.id}`);
  };

  return (
    <Card
      hoverable
      className="article-card"
      cover={
        <div className="article-image-container">
          <img 
            alt={article.title} 
            src={article.image} 
            className="article-image"
          />
          <Tag color={getCategoryColor(article.category)} className="category-tag">
            {getCategoryName(article.category)}
          </Tag>
        </div>
      }
      onClick={handleClick}
    >
      <Meta
        title={article.title}
        description={
          <div>
            <Text className="article-description">
              {article.description.length > 100 
                ? `${article.description.substring(0, 100)}...` 
                : article.description}
            </Text>
            
            {showStats && article.publishDate && (
              <div className="article-stats">
                <Space>
                  <Text type="secondary">
                    <CalendarOutlined /> {article.publishDate}
                  </Text>
                  {article.viewCount && (
                    <Text type="secondary">
                      <EyeOutlined /> {article.viewCount}
                    </Text>
                  )}
                </Space>
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default ArticleCard;