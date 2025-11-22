import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // You can disallow private paths if you ever make an admin dashboard
      // disallow: '/admin/', 
    },
    sitemap: 'https://lairsbug-blogs.netlify.app/sitemap.xml',
  };
}