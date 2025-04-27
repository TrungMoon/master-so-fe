export interface Article {
    id: number;
    title: string;
    excerpt: string;
    content?: string;
    category: string;
    createdAt: string;
    thumbnail?: string;
    tags: string[];
    authorId?: number;
    authorName?: string;
  }