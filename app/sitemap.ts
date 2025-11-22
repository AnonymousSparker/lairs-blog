import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/posts';

// REPLACE this with your actual live domain
const BASE_URL = 'https://lairsbug-blogs.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Generate entries for every blog post
  const posts = blogPosts.map((post) => ({
    url: `${BASE_URL}/post/${post.id}`,
    lastModified: new Date(post.date), // Uses your post's date
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 2. Return the full list (Static pages + Blog posts)
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...posts,
  ];
}