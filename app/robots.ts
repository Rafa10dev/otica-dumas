import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: ['/', '/catalogo', '/sobre', '/contato'], disallow: ['/admin', '/login', '/api'] }, sitemap: 'https://oticadumas.com.br/sitemap.xml' };
}
