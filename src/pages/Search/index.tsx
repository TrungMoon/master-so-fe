import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Tag, Pagination, Empty, Spin, Select, Typography, Divider, Checkbox, Badge, Space, Button } from 'antd';
import { SearchOutlined, BookOutlined, FileTextOutlined, CoffeeOutlined, ShoppingOutlined } from '@ant-design/icons';
import searchService, { SearchParams, SearchResult, SearchResponse } from '../../services/searchService';
import './Search.less';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const CheckboxGroup = Checkbox.Group;

// Content type options for filtering
const contentTypeOptions = [
  { label: 'Bài viết', value: 'article', icon: <FileTextOutlined /> },
  { label: 'Chuyện linh tinh', value: 'story', icon: <CoffeeOutlined /> },
  { label: 'Sách', value: 'book', icon: <BookOutlined /> },
  { label: 'Sản phẩm', value: 'product', icon: <ShoppingOutlined /> }
];

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialTags = queryParams.getAll('tag');
  const initialCategory = queryParams.get('category') || '';
  const initialTypes = queryParams.getAll('type');

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    initialTypes.length > 0 ? initialTypes : []
  );
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showBookFilters, setShowBookFilters] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number] | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  // Show book-specific filters when book type is selected
  useEffect(() => {
    setShowBookFilters(selectedContentTypes.includes('book'));
  }, [selectedContentTypes]);

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
          contentTypes: selectedContentTypes.length > 0 ? selectedContentTypes : undefined,
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
  }, [searchQuery, currentPage, pageSize, selectedTags, selectedCategory, selectedContentTypes]);

  // Update URL query params when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    selectedTags.forEach(tag => params.append('tag', tag));
    if (selectedCategory) params.set('category', selectedCategory);
    selectedContentTypes.forEach(type => params.append('type', type));
    
    const newUrl = `/search?${params.toString()}`;
    navigate(newUrl, { replace: true });
  }, [searchQuery, selectedTags, selectedCategory, selectedContentTypes, navigate]);

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

  // Handle content type selection
  const handleContentTypeChange = (checkedValues: string[]) => {
    setSelectedContentTypes(checkedValues);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle free book filter 
  const handleFreeBookToggle = (checked: boolean) => {
    setShowFreeOnly(checked);
    setCurrentPage(1);
  };

  // Filter results for display (client-side filtering for book-specific filters)
  const getFilteredResults = () => {
    if (!searchResults) return [];
    
    let results = [...searchResults.results];
    
    // Apply book-specific filters if enabled
    if (showBookFilters) {
      // Filter by free books only
      if (showFreeOnly) {
        results = results.filter(item => 
          item.type !== 'book' || (item.type === 'book' && item.isFree === true)
        );
      }
      
      // Filter by authors if selected
      if (selectedAuthors.length > 0) {
        results = results.filter(item => 
          item.type !== 'book' || (item.type === 'book' && item.author && selectedAuthors.includes(item.author))
        );
      }
      
      // Add other book filters as needed (year range, price range, etc.)
    }
    
    return results;
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
          {result.type === 'article' && <Tag color="blue" icon={<FileTextOutlined />}>Bài viết</Tag>}
          {result.type === 'story' && <Tag color="green" icon={<CoffeeOutlined />}>Chuyện linh tinh</Tag>}
          {result.type === 'book' && 
            <Tag color="purple" icon={<BookOutlined />}>
              Sách {result.isFree ? <Badge status="success" text="Miễn phí" /> : null}
            </Tag>
          }
          {result.type === 'product' && <Tag color="gold" icon={<ShoppingOutlined />}>Sản phẩm</Tag>}
          <Text type="secondary">{result.category}</Text>
        </div>
        <Title level={4}>
          <a href={result.url}>{result.title}</a>
        </Title>
        
        {/* Show book-specific info */}
        {result.type === 'book' && (
          <div className="book-info">
            {result.author && <Text strong>Tác giả: {result.author}</Text>}
            {result.publishYear && <Text>Năm xuất bản: {result.publishYear}</Text>}
            {!result.isFree && result.price && <Text type="danger">Giá: {result.price.toLocaleString('vi-VN')}đ</Text>}
          </div>
        )}
        
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

  // Get filtered results
  const filteredResults = getFilteredResults();

  return (
    <div className="search-page">
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card className="search-header">
            <Search
              placeholder="Tìm kiếm bài viết, chuyện linh tinh, sách..."
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
            {/* Content type filter */}
            <div className="filter-section">
              <Title level={5}>Loại nội dung</Title>
              <CheckboxGroup
                options={contentTypeOptions}
                value={selectedContentTypes}
                onChange={handleContentTypeChange as any}
              />
            </div>

            <Divider />

            {/* Category filter */}
            <div className="filter-section">
              <Title level={5}>Danh mục</Title>
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

            {/* Tags filter */}
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

            {/* Book-specific filters */}
            {showBookFilters && (
              <>
                <Divider />
                <div className="filter-section">
                  <Title level={5}>Lọc sách</Title>
                  
                  <div className="book-filter-option">
                    <Checkbox 
                      checked={showFreeOnly}
                      onChange={(e) => handleFreeBookToggle(e.target.checked)}
                    >
                      Chỉ hiển thị sách miễn phí
                    </Checkbox>
                  </div>
                  
                  {/* Đây là nơi thêm các filter khác cho sách */}
                </div>
              </>
            )}
          </Card>
        </Col>

        {/* Results */}
        <Col xs={24} md={18}>
          <div className="search-results">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : searchResults && filteredResults.length > 0 ? (
              <>
                <div className="results-header">
                  <Title level={4}>Kết quả tìm kiếm ({filteredResults.length})</Title>
                </div>

                <div className="results-list">
                  {filteredResults.map(result => (
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
                  Nhập từ khóa để tìm kiếm bài viết, chuyện linh tinh, sách hoặc các nội dung khác
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