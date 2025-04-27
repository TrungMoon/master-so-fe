import api from './api';

export interface SearchParams {
  query: string;
  tags?: string[];
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  createdAt: string;
  thumbnail?: string;
  tags: string[];
  type: 'article' | 'story' | 'product'; // For future product integration
  url: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Mock data for frontend development until BE is ready
const mockSearchData: SearchResult[] = [
  {
    id: 1,
    title: 'Phong thủy phòng ngủ',
    excerpt: 'Những điều cần lưu ý về phong thủy trong phòng ngủ',
    content: 'Phong thủy phòng ngủ là một yếu tố quan trọng...',
    category: 'phong-thuy',
    createdAt: '2023-07-15',
    thumbnail: 'https://example.com/images/phong-thuy-1.jpg',
    tags: ['phong thủy', 'nhà ở', 'phòng ngủ'],
    type: 'article',
    url: '/articles/phong-thuy/1'
  },
  {
    id: 2,
    title: 'Cách xem tướng mặt cơ bản',
    excerpt: 'Hướng dẫn cách xem tướng mặt đơn giản cho người mới',
    content: 'Xem tướng mặt là một trong những phương pháp...',
    category: 'tuong-so',
    createdAt: '2023-08-20',
    tags: ['tướng số', 'tướng mặt', 'cơ bản'],
    type: 'article',
    url: '/articles/tuong-so/2'
  },
  {
    id: 3,
    title: 'Chia sẻ về trải nghiệm học tướng số',
    excerpt: 'Câu chuyện của tôi khi bắt đầu học tướng số',
    content: 'Tôi bắt đầu tìm hiểu về tướng số vào năm 2020...',
    category: 'stories',
    createdAt: '2023-06-10',
    tags: ['chia sẻ', 'tướng số', 'trải nghiệm'],
    type: 'story',
    url: '/stories/3'
  }
];

const searchService = {
  // Search articles, stories, and products (future) by query and tags
  search: async (params: SearchParams): Promise<SearchResponse> => {
    try {
      // When backend is ready, uncomment this:
      // const response = await api.get('/search', { params });
      // return response.data;
      
      // Mock implementation for frontend development
      const { query, tags, category, page = 1, pageSize = 10 } = params;
      
      // Filter by query (case-insensitive)
      const queryLower = query.toLowerCase();
      let filteredResults = mockSearchData.filter(item => 
        item.title.toLowerCase().includes(queryLower) || 
        item.content.toLowerCase().includes(queryLower) ||
        item.excerpt.toLowerCase().includes(queryLower)
      );
      
      // Filter by tags if provided
      if (tags && tags.length > 0) {
        filteredResults = filteredResults.filter(item => 
          tags.some(tag => item.tags.includes(tag))
        );
      }
      
      // Filter by category if provided
      if (category) {
        filteredResults = filteredResults.filter(item => 
          item.category === category
        );
      }
      
      // Calculate pagination
      const totalCount = filteredResults.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const paginatedResults = filteredResults.slice(startIndex, startIndex + pageSize);
      
      return {
        results: paginatedResults,
        totalCount,
        currentPage: page,
        totalPages
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },
  
  // Get tag suggestions for autocomplete
  getTagSuggestions: async (query: string): Promise<string[]> => {
    try {
      // When backend is ready, uncomment this:
      // const response = await api.get('/tags/suggestions', { params: { query } });
      // return response.data;
      
      // Mock implementation
      const allTags = Array.from(new Set(mockSearchData.flatMap(item => item.tags)));
      return allTags.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Return top 5 matches
    } catch (error) {
      console.error('Tag suggestion error:', error);
      throw error;
    }
  }
};

export default searchService; 