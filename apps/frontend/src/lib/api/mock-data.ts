import { Post, User, Tag, Comment } from "@/src/types";

export const mockUser: User = {
  id: 1,
  email: "john@example.com",
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  bio: "Passionate developer and tech enthusiast. Writing about code, life, and everything in between.",
  createdAt: new Date().toISOString(),
};

export const mockTags: Tag[] = [
  { id: 1, name: "Technology", slug: "technology" },
  { id: 2, name: "Lifestyle", slug: "lifestyle" },
  { id: 3, name: "Programming", slug: "programming" },
  { id: 4, name: "Design", slug: "design" },
];

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Building Modern Web Applications with Next.js 15",
    slug: "building-modern-web-applications-with-nextjs-15",
    excerpt: "Learn how to leverage the latest features of Next.js 15 and React 19 to build high-performance web applications.",
    content: "Next.js 15 introduces several groundbreaking features that change how we think about web development. From improved server components to more efficient rendering strategies, there's a lot to cover. In this post, we'll dive deep into the core concepts and practical implementation details of building modern apps.",
    coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2000&auto=format&fit=crop",
    author: mockUser,
    tags: [mockTags[0], mockTags[2]],
    likeCount: 42,
    commentCount: 5,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    title: "The Art of Minimalist UI Design",
    slug: "the-art-of-minimalist-ui-design",
    excerpt: "Why less is more when it comes to user interfaces. Exploring the principles of minimalism in digital products.",
    content: "Minimalism isn't just about removing elements; it's about focusing on what's essential. A minimalist UI should provide clarity, ease of use, and a sense of calm. Let's look at some examples and principles that make minimalist designs effective.",
    coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop",
    author: mockUser,
    tags: [mockTags[3]],
    likeCount: 28,
    commentCount: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 3,
    title: "Understanding React Server Components",
    slug: "understanding-react-server-components",
    excerpt: "A comprehensive guide to RSC and how they differ from client-side rendering.",
    content: "React Server Components are a paradigm shift in how we build React applications. They allow us to render components on the server while maintaining the interactivity of client components where needed. This leads to better performance and smaller bundle sizes.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop",
    author: mockUser,
    tags: [mockTags[2]],
    likeCount: 56,
    commentCount: 8,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const mockComments: Comment[] = [
  {
    id: 1,
    content: "Great article! This really helped me understand the new features.",
    author: {
      id: 2,
      email: "jane@example.com",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      createdAt: new Date().toISOString(),
    },
    postId: 1,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];
