import { getCollection } from 'astro:content';

export async function GET() {
  const site = 'https://thiruna.com';

  // Get all pages
  const pages = [
    { url: '/', lastmod: new Date().toISOString() },
    { url: '/blogs/', lastmod: new Date().toISOString() },
    { url: '/contact/', lastmod: new Date().toISOString() },
    { url: '/my-resume/', lastmod: new Date().toISOString() },
    { url: '/projects/', lastmod: new Date().toISOString() },
  ];

  // Get blog posts
  const posts = await getCollection('blogs', ({ data }) => !data.draft);
  const blogPages = posts.map(post => ({
    url: `/blogs/${post.slug}/`,
    lastmod: post.data.publishedDate.toISOString(),
  }));

  const allPages = [...pages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `  <url>
      <loc>${site}${page.url}</loc>
      <lastmod>${page.lastmod}</lastmod>
    </url>`).join('\n')}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}