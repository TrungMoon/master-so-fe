import api from './api';

export interface SearchParams {
  query: string;
  tags?: string[];
  category?: string;
  page?: number;
  pageSize?: number;
  contentTypes?: string[]; // Add contentTypes to filter by article, story, book, etc.
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
  type: 'article' | 'story' | 'product' | 'book'; // Added 'book' type
  url: string;
  author?: string; // Added for books
  publishYear?: number; // Added for books
  isFree?: boolean; // Added for books
  price?: number; // Added for books
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
  },
  // Thêm mock data cho sách
  {
    id: 101,
    title: 'Phong Thủy Ứng Dụng',
    excerpt: 'Cuốn sách hướng dẫn phong thủy ứng dụng cho cuộc sống hiện đại',
    content: 'Cuốn sách Phong Thủy Ứng Dụng cung cấp kiến thức nền tảng...',
    category: 'phong-thuy',
    createdAt: '2023-09-15',
    thumbnail: 'https://example.com/images/book-phong-thuy.jpg',
    tags: ['phong thủy', 'sách', 'ứng dụng'],
    type: 'book',
    url: '/books/101',
    author: 'Nguyễn Văn A',
    publishYear: 2022,
    isFree: false,
    price: 150000
  },
  {
    id: 102,
    title: 'Nhân Tướng Học Căn Bản',
    excerpt: 'Tổng hợp kiến thức cơ bản về nhân tướng học truyền thống',
    content: 'Nhân Tướng Học Căn Bản giúp bạn tìm hiểu về cách xem tướng...',
    category: 'tuong-so',
    createdAt: '2023-10-20',
    thumbnail: 'https://example.com/images/book-tuong-so.jpg',
    tags: ['tướng số', 'sách', 'cơ bản'],
    type: 'book',
    url: '/books/102',
    author: 'Trần Văn B',
    publishYear: 2021,
    isFree: true,
    price: 0
  }
];

const searchService = {
  // Search articles, stories, books, and products by query and tags
  search: async (params: SearchParams): Promise<SearchResponse> => {
    try {
      // When backend is ready, uncomment this:
      // const response = await api.get('/search', { params });
      // return response.data;
      
      // Mock implementation for frontend development
      const { query, tags, category, page = 1, pageSize = 10, contentTypes } = params;
      
      // Filter by query (case-insensitive)
      const queryLower = query.toLowerCase();
      let filteredResults = mockSearchData.filter(item => 
        item.title.toLowerCase().includes(queryLower) || 
        item.content.toLowerCase().includes(queryLower) ||
        item.excerpt.toLowerCase().includes(queryLower) ||
        // Thêm tìm kiếm theo tác giả cho sách
        (item.author && item.author.toLowerCase().includes(queryLower))
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

      // Filter by content types if provided
      if (contentTypes && contentTypes.length > 0) {
        filteredResults = filteredResults.filter(item => 
          contentTypes.includes(item.type)
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
  },

  // Get author suggestions for book search
  getAuthorSuggestions: async (query: string): Promise<string[]> => {
    try {
      // When backend is ready, uncomment this:
      // const response = await api.get('/authors/suggestions', { params: { query } });
      // return response.data;
      
      // Mock implementation
      const bookResults = mockSearchData.filter(item => item.type === 'book');
      const allAuthors = Array.from(
        new Set(
          bookResults
            .map(book => book.author)
            .filter(author => author !== undefined) as string[]
        )
      );
      
      return allAuthors.filter(author => 
        author.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Return top 5 matches
    } catch (error) {
      console.error('Author suggestion error:', error);
      throw error;
    }
  }
};

export default searchService; 