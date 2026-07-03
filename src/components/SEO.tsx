import { useEffect } from 'react';
import { FAQItem } from '../types';

interface SEOProps {
  title: string;
  description: string;
  schemaType?: 'homepage' | 'calculator' | 'guide' | 'category' | 'basic';
  slug?: string;
  faqs?: FAQItem[];
  categoryName?: string;
}

export default function SEO({
  title,
  description,
  schemaType = 'basic',
  slug = '',
  faqs = [],
  categoryName = ''
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update canonical URL
    const baseUrl = 'https://moneymetrichubs.com';
    const canonicalUrl = `${baseUrl}/${slug}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Prevent duplicate indexing on testing/staging domains (like Vercel or AI Studio previews)
    const currentHost = window.location.hostname;
    const isPrimaryDomain = currentHost === 'moneymetrichubs.com';
    const isLocalhost = currentHost.includes('localhost') || currentHost.includes('127.0.0.1');

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!isPrimaryDomain && !isLocalhost) {
      // It's a testing, staging, or preview domain -> strictly DO NOT INDEX to prevent duplicate content errors
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      // It's the primary domain or localhost -> allow standard search indexing or remove staging noindex tag
      if (metaRobots && metaRobots.getAttribute('content') === 'noindex, nofollow') {
        metaRobots.remove();
      }
    }

    // Google Analytics & Google AdSense Dynamic Loading (Loaded EXCLUSIVELY on primary domain to avoid data pollution and policy errors)
    if (isPrimaryDomain) {
      // 1. Google Analytics Setup
      const gaId = (import.meta as any).env.VITE_GA_MEASUREMENT_ID || 'G-0LYL7WF7CS';
      if (gaId && !document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        const gaInitScript = document.createElement('script');
        gaInitScript.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { 'anonymize_ip': true });
        `;
        document.head.appendChild(gaInitScript);
      }

      // 2. Google AdSense Setup
      const adsenseId = (import.meta as any).env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-5337553670771572';
      if (adsenseId && !document.querySelector(`script[src*="pagead2.googlesyndication.com"]`)) {
        const adsenseScript = document.createElement('script');
        adsenseScript.async = true;
        adsenseScript.crossOrigin = 'anonymous';
        adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
        document.head.appendChild(adsenseScript);
      }
    }

    // Manage JSON-LD Schemas
    // Remove existing custom JSON-LD schemas
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"].mmh-schema');
    existingSchemas.forEach((el) => el.remove());

    const schemas: any[] = [];

    // 1. Organization Schema (always inject for brand trust)
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://moneymetrichubs.com/#organization',
      'name': 'MoneyMetricsHub',
      'url': 'https://moneymetrichubs.com',
      'logo': 'https://moneymetrichubs.com/logo.png',
      'description': 'Premium finance calculator platform for smart financial decisions.',
      'sameAs': [
        'https://twitter.com/moneymetricshub',
        'https://github.com/moneymetricshub'
      ]
    };
    schemas.push(orgSchema);

    // 2. Specific View Schemas
    if (schemaType === 'homepage') {
      // Website + SearchAction Schema
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://moneymetrichubs.com/#website',
        'url': 'https://moneymetrichubs.com',
        'name': 'MoneyMetricsHub',
        'description': 'Smarter Financial Decisions Through Better Numbers',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://moneymetrichubs.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      };
      schemas.push(websiteSchema);
    } else if (schemaType === 'calculator') {
      // WebApplication Schema
      const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': `https://moneymetrichubs.com/${slug}#webapp`,
        'name': title.split('|')[0].trim(),
        'url': `${baseUrl}/${slug}`,
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'All',
        'browserRequirements': 'Requires JavaScript',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      };
      schemas.push(appSchema);

      // Breadcrumb Schema
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': baseUrl
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': categoryName || 'Calculators',
            'item': `${baseUrl}/categories/${categoryName?.toLowerCase() || 'investing'}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': title.split('|')[0].trim(),
            'item': `${baseUrl}/${slug}`
          }
        ]
      };
      schemas.push(breadcrumbSchema);

      // FAQ Schema
      if (faqs && faqs.length > 0) {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        };
        schemas.push(faqSchema);
      }
    } else if (schemaType === 'guide') {
      // Article Schema
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `https://moneymetrichubs.com/${slug}#article`,
        'headline': title,
        'description': description,
        'url': `${baseUrl}/${slug}`,
        'publisher': {
          '@type': 'Organization',
          'name': 'MoneyMetricsHub',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://moneymetrichubs.com/logo.png'
          }
        },
        'author': {
          '@type': 'Organization',
          'name': 'MoneyMetricsHub Editorial Team'
        }
      };
      schemas.push(articleSchema);

      // FAQ Schema
      if (faqs && faqs.length > 0) {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        };
        schemas.push(faqSchema);
      }
    }

    // Append all active schemas to head
    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.className = 'mmh-schema';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Clean up when component unmounts
      const activeSchemas = document.querySelectorAll('script[type="application/ld+json"].mmh-schema');
      activeSchemas.forEach((el) => el.remove());
    };
  }, [title, description, schemaType, slug, faqs, categoryName]);

  return null; // SEO is a headless utility
}
