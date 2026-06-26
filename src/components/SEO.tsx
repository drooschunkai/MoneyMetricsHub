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
    const baseUrl = 'https://moneymetricshub.com';
    const canonicalUrl = `${baseUrl}/${slug}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Manage JSON-LD Schemas
    // Remove existing custom JSON-LD schemas
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"].mmh-schema');
    existingSchemas.forEach((el) => el.remove());

    const schemas: any[] = [];

    // 1. Organization Schema (always inject for brand trust)
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://moneymetricshub.com/#organization',
      'name': 'MoneyMetricsHub',
      'url': 'https://moneymetricshub.com',
      'logo': 'https://moneymetricshub.com/logo.png',
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
        '@id': 'https://moneymetricshub.com/#website',
        'url': 'https://moneymetricshub.com',
        'name': 'MoneyMetricsHub',
        'description': 'Smarter Financial Decisions Through Better Numbers',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://moneymetricshub.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      };
      schemas.push(websiteSchema);
    } else if (schemaType === 'calculator') {
      // WebApplication Schema
      const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': `https://moneymetricshub.com/${slug}#webapp`,
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
        '@id': `https://moneymetricshub.com/${slug}#article`,
        'headline': title,
        'description': description,
        'url': `${baseUrl}/${slug}`,
        'publisher': {
          '@type': 'Organization',
          'name': 'MoneyMetricsHub',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://moneymetricshub.com/logo.png'
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
