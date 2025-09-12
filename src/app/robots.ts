import { MetadataRoute } from 'next';

// Replace with your actual domain
const BASE_URL = 'https://your-domain.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/account', '/order-confirmation'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
