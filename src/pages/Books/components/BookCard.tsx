import React from 'react';
import { Card, Typography, Rate, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';
import { BookOutlined, DownloadOutlined, EyeOutlined, RiseOutlined } from '@ant-design/icons';
import '../style.css';

const { Meta } = Card;
const { Text } = Typography;

interface BookProps {
  id: number;
  title: string;
  slug: string;
  author: string;
  coverImageURL: string;
  category: string;
  isFree: boolean;
  price: number;
  rating: number;
  viewCount: number;
}

interface BookCardProps {
  book: BookProps;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(book.price);

  return (
    <Link to={`/books/${book.slug}`}>
      <Card
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            <img 
              alt={book.title} 
              src={book.coverImageURL} 
              style={{ height: 200, objectFit: 'cover' }}
            />
            <Tag 
              color={book.isFree ? 'success' : 'purple'} 
              className={`book-badge ${book.isFree ? 'free' : 'premium'}`}
            >
              {book.isFree ? 'Miễn phí' : 'Premium'}
            </Tag>
          </div>
        }
        actions={[
          <div key="views">
            <EyeOutlined /> {book.viewCount}
          </div>,
          <div key="rating">
            <Rate disabled defaultValue={book.rating} count={1} /> {book.rating}
          </div>,
          book.isFree ? (
            <Button 
              type="link" 
              icon={<DownloadOutlined />} 
              size="small"
              onClick={(e) => {
                e.preventDefault();
                // Lógica para descargar libro
                console.log('Download book:', book.id);
              }}
            >
              Tải về
            </Button>
          ) : (
            <Text type="secondary">
              {formattedPrice}
            </Text>
          )
        ]}
      >
        <Meta
          title={book.title}
          description={
            <div>
              <Text type="secondary">{book.author}</Text>
              <div>
                <Tag color="blue">
                  <BookOutlined /> {book.category}
                </Tag>
              </div>
            </div>
          }
        />
      </Card>
    </Link>
  );
};

export default BookCard; 