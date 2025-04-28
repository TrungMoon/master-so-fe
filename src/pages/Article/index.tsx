import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Input, Pagination, Select, Typography, Breadcrumb, Empty, Spin, Space, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { SearchOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';
import ArticleCard, { ArticleProps } from '../../components/ArticleCard';
import './style.css';

// Mock articles data
import { mockArticles } from './mockData';

const { Title } = Typography;
const { Option } = Select;

interface ArticlePageProps {
  category?: string;
}

const Article: React.FC<ArticlePageProps> = (props) => {
  const params = useParams<{ category?: string }>();
  const categoryFromProps = props.category;
  const categoryFromParams = params.category;
  
  // Use category from props if provided, otherwise from URL params
  const category = categoryFromProps || categoryFromParams;
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const articlesPerPage = 9;

  // Sort options
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Mobile filter drawer
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  
  // Ref for filter section to measure height
  const filterSectionRef = useRef<HTMLDivElement>(null);

  // Get category title
  const getCategoryTitle = (categorySlug: string | undefined) => {
    switch (categorySlug) {
      case 'phong-thuy':
        return 'Phong Thủy';
      case 'nhan-tuong':
        return 'Nhân Tướng';
      case 'tu-vi':
        return 'Tử Vi';
      case 'all':
      default:
        return 'Tất cả bài viết';
    }
  };

  // Load articles on initial load and when category changes
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      let result = [...mockArticles];
      
      // Filter by category if not 'all'
      if (category && category !== 'all') {
        result = result.filter(article => article.category === category);
      }
      
      setArticles(result);
      setTotalArticles(result.length);
      setLoading(false);
      // Reset to first page when category changes
      setCurrentPage(1);
    }, 500);
  }, [category]);

  // Filter and sort articles when search or sort changes
  useEffect(() => {
    let result = [...articles];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(searchLower) || 
        article.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        // Assuming each article has a publishDate in ISO format
        result = result.sort((a, b) => {
          if (a.publishDate && b.publishDate) {
            return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
          }
          return 0;
        });
        break;
      case 'oldest':
        result = result.sort((a, b) => {
          if (a.publishDate && b.publishDate) {
            return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
          }
          return 0;
        });
        break;
      case 'popular':
        // Sort by view count if available
        result = result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      default:
        break;
    }
    
    setFilteredArticles(result);
    setTotalArticles(result.length);
  }, [articles, search, sortBy]);

  // Get current page articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Toggle filter visibility on mobile
  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearch('');
  };

  return (
    <div className="articles-page">
      <div className="article-header">
        {/* Breadcrumb - visible only on desktop */}
        <div className="desktop-only">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
            <Breadcrumb.Item>{getCategoryTitle(category)}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        
        <Title level={2}>{getCategoryTitle(category)}</Title>
      </div>

      {/* Mobile filter toggle button */}
      <div className={`mobile-filter-toggle ${isMobile ? '' : 'desktop-only'}`}>
        <Space>
          {search && (
            <span className="search-query">
              Tìm kiếm: "{search}" 
              <Button 
                type="text" 
                size="small" 
                icon={<CloseOutlined />} 
                onClick={clearSearch}
              />
            </span>
          )}
          <Button 
            type="primary" 
            icon={<FilterOutlined />} 
            onClick={toggleFilter}
          >
            Bộ lọc
          </Button>
        </Space>
      </div>

      {/* Filter section - conditionally visible on mobile */}
      <div 
        className={`filter-section ${filterVisible || !isMobile ? 'visible' : 'hidden'}`}
        ref={filterSectionRef}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12} lg={16}>
            <Input
              placeholder="Tìm kiếm bài viết..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Select
              defaultValue="newest"
              style={{ width: '100%' }}
              onChange={value => setSortBy(value)}
              value={sortBy}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="oldest">Cũ nhất</Option>
              <Option value="popular">Phổ biến nhất</Option>
            </Select>
          </Col>
          
          {/* Mobile only - Apply filter button */}
          {isMobile && (
            <Col xs={24} className="mobile-only">
              <Button 
                type="primary" 
                block 
                onClick={toggleFilter}
              >
                Áp dụng
              </Button>
            </Col>
          )}
        </Row>
      </div>

      <div className="articles-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : currentArticles.length > 0 ? (
          <>
            {/* Articles list - using different layouts for mobile and desktop */}
            <div className={isMobile ? 'mobile-article-list' : 'grid-view article-list'}>
              <Row gutter={[16, 16]}>
                {currentArticles.map(article => (
                  <Col xs={24} sm={12} md={8} key={article.id}>
                    <ArticleCard article={article} showStats={!isMobile} />
                  </Col>
                ))}
              </Row>
            </div>
            
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                pageSize={articlesPerPage}
                total={totalArticles}
                onChange={handlePageChange}
                showSizeChanger={false}
                size={isMobile ? 'small' : 'default'}
                simple={isMobile}
              />
            </div>
          </>
        ) : (
          <Empty
            description="Không tìm thấy bài viết nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
};

export default Article; 