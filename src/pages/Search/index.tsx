import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Tag, Pagination, Empty, Spin, Select, Typography, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import searchService, { SearchParams, SearchResult, SearchResponse } from '../../services/searchService';
import './Search.less';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialTags = queryParams.getAll('tag');
  const initialCategory = queryParams.get('category') || '';

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Perform search when query or filters change
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults(null);
        return;
      }

      setLoading(true);
      try {
        const params: SearchParams = {
          query: searchQuery,
          page: currentPage,
          pageSize,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          category: selectedCategory || undefined,
        };

        const response = await searchService.search(params);
        setSearchResults(response);
        
        // Extract unique tags from search results for filter options
        const tags = Array.from(new Set(response.results.flatMap(item => item.tags)));
        setAvailableTags(prev => Array.from(new Set([...prev, ...tags])));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, currentPage, pageSize, selectedTags, selectedCategory]);

  // Update URL query params when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    selectedTags.forEach(tag => params.append('tag', tag));
    if (selectedCategory) params.set('category', selectedCategory);
    
    const newUrl = `/search?${params.toString()}`;
    navigate(newUrl, { replace: true });
  }, [searchQuery, selectedTags, selectedCategory, navigate]);

  // Handle search submission
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Render search result card
  const renderResultCard = (result: SearchResult) => (
    <Card 
      hoverable 
      className="search-result-card"
      cover={result.thumbnail && <img alt={result.title} src={result.thumbnail} />}
    >
      <div className="card-content">
        <div className="card-type">
          {result.type === 'article' && <Tag color="blue">Bài viết</Tag>}
          {result.type === 'story' && <Tag color="green">Chuyện linh tinh</Tag>}
          {result.type === 'product' && <Tag color="gold">Sản phẩm</Tag>}
          <Text type="secondary">{result.category}</Text>
        </div>
        <Title level={4}>
          <a href={result.url}>{result.title}</a>
        </Title>
        <Text type="secondary" className="card-date">{result.createdAt}</Text>
        <Text className="card-excerpt">{result.excerpt}</Text>
        <div className="card-tags">
          {result.tags.map(tag => (
            <Tag 
              key={tag} 
              color="default" 
              className="clickable-tag"
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="search-page">
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card className="search-header">
            <Search
              placeholder="Tìm kiếm bài viết, chuyện linh tinh..."
              enterButton={<SearchOutlined />}
              size="large"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 24]}>
        {/* Filters */}
        <Col xs={24} md={6}>
          <Card title="Bộ lọc tìm kiếm">
            <div className="filter-section">
              <Title level={5}>Loại nội dung</Title>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn danh mục"
                value={selectedCategory || undefined}
                onChange={handleCategoryChange}
                allowClear
              >
                <Option value="phong-thuy">Phong Thủy</Option>
                <Option value="tuong-so">Tướng Số</Option>
                <Option value="stories">Chuyện Linh Tinh</Option>
              </Select>
            </div>

            <Divider />

            <div className="filter-section">
              <Title level={5}>Tags</Title>
              <div className="tags-container">
                {availableTags.length > 0 ? (
                  availableTags.map(tag => (
                    <Tag
                      key={tag}
                      color={selectedTags.includes(tag) ? "blue" : "default"}
                      className="clickable-tag"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Tag>
                  ))
                ) : (
                  <Text type="secondary">Không có tags nào phù hợp</Text>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* Results */}
        <Col xs={24} md={18}>
          <div className="search-results">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : searchResults && searchResults.results.length > 0 ? (
              <>
                <div className="results-header">
                  <Title level={4}>Kết quả tìm kiếm ({searchResults.totalCount})</Title>
                </div>

                <div className="results-list">
                  {searchResults.results.map(result => (
                    <div key={`${result.type}-${result.id}`} className="result-item">
                      {renderResultCard(result)}
                    </div>
                  ))}
                </div>

                <div className="results-pagination">
                  <Pagination
                    current={searchResults.currentPage}
                    total={searchResults.totalCount}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger
                    onShowSizeChange={(current, size) => {
                      setCurrentPage(1);
                      setPageSize(size);
                    }}
                  />
                </div>
              </>
            ) : searchQuery ? (
              <Empty 
                description="Không tìm thấy kết quả nào phù hợp" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            ) : (
              <div className="empty-search">
                <Title level={4}>Bắt đầu tìm kiếm</Title>
                <Text type="secondary">
                  Nhập từ khóa để tìm kiếm bài viết, chuyện linh tinh hoặc các nội dung khác
                </Text>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage; 