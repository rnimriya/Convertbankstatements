export interface BlogPostTranslation {
  title: string;
  excerpt: string;
  content?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featureImage: string;
  author: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  translations?: Record<string, BlogPostTranslation>;
}

export interface BlogComment {
  id: string;
  postSlug: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  parentId: string | null;   // null = top-level, string = reply to that comment id
}
