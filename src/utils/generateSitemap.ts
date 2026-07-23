import { categories } from '../data/categories';
import { calculators } from '../data/calculators';
import { guides } from '../data/guides';
import { programmaticSEOPages } from '../data/programmaticSEO';
import { blogArticles } from '../data/blog';

const BASE_URL = 'https://moneymetrichubs.com';

export function generateSitemapXml(lastmodDate: string = '2026-07-22'): string {
  const corePages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'blog', priority: '0.9', changefreq: 'daily' },
    { path: 'compare', priority: '0.8', changefreq: 'weekly' },
    { path: 'preferences', priority: '0.5', changefreq: 'monthly' },
    { path: 'newsletter', priority: '0.7', changefreq: 'weekly' },
    { path: 'sitemap', priority: '0.6', changefreq: 'weekly' },
    { path: 'dashboard', priority: '0.7', changefreq: 'daily' },
    { path: 'about', priority: '0.6', changefreq: 'monthly' },
    { path: 'contact', priority: '0.5', changefreq: 'monthly' },
    { path: 'privacy', priority: '0.4', changefreq: 'monthly' },
    { path: 'terms', priority: '0.4', changefreq: 'monthly' },
    { path: 'disclaimer', priority: '0.4', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 1. Core Pages
  xml += `  <!-- Core Pages -->\n`;
  corePages.forEach((page) => {
    const loc = page.path ? `${BASE_URL}/${page.path}` : `${BASE_URL}/`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // 2. Category Pages
  xml += `\n  <!-- Category Hubs -->\n`;
  categories.forEach((cat) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/categories/${cat.slug}</loc>\n`;
    xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 3. Calculators
  xml += `\n  <!-- Financial Calculators -->\n`;
  calculators.forEach((calc) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/calculators/${calc.slug}</loc>\n`;
    xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  // 4. Educational Guides
  xml += `\n  <!-- Educational Guides -->\n`;
  guides.forEach((guide) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/guides/${guide.slug}</loc>\n`;
    xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 5. Programmatic SEO Pages
  xml += `\n  <!-- Programmatic SEO Scenarios -->\n`;
  programmaticSEOPages.forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/${page.type}/${page.slug}</loc>\n`;
    xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // 6. Blog Articles (Source of truth: src/data/blog.ts)
  xml += `\n  <!-- Mathematical Finance Blog Articles -->\n`;
  blogArticles.forEach((article) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${article.slug}</loc>\n`;
    xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}
