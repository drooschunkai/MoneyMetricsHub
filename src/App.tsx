import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import CategoriesView from './components/CategoriesView';
import CalculatorView from './components/CalculatorView';
import GuideView from './components/GuideView';
import SearchView from './components/SearchView';
import { AboutView, ContactView, PrivacyView, TermsView, DisclaimerView } from './components/LegalViews';

// Register Phase 3 Premium Core Components
import ProgrammaticSEOView from './components/ProgrammaticSEOView';
import UserHub from './components/UserHub';
import NewsletterView from './components/NewsletterView';
import SitemapView from './components/SitemapView';
import DashboardView from './components/DashboardView';
import ComparisonView from './components/ComparisonView';
import NotFoundView from './components/NotFoundView';
import BlogView from './components/BlogView';
import { legacyBlogRedirects } from './data/redirects';

interface RouteState {
  name: string;
  params: Record<string, any>;
}

// Helper to parse the current window path/query into a RouteState
function parseLocation(): RouteState {
  let path = window.location.pathname || '/';
  const search = window.location.search;

  // Normalize path by stripping trailing slashes (except root '/')
  if (path.length > 1 && path.endsWith('/')) {
    path = path.replace(/\/+$/, '');
  }

  // Helper to extract clean slug without trailing slashes
  const extractSlug = (prefix: string) => {
    return path.replace(prefix, '').replace(/\/+$/, '');
  };

  // 1. Home path
  if (path === '/' || path === '') {
    return { name: 'home', params: {} };
  }

  // Categories overview: /categories
  if (path === '/categories') {
    return { name: 'categories', params: {} };
  }

  // 2. Categories path: /categories/:slug
  if (path.startsWith('/categories/')) {
    const slug = extractSlug('/categories/');
    return { name: 'category', params: { slug } };
  }

  // 3. Calculators path: /calculators/:slug
  if (path.startsWith('/calculators/')) {
    const slug = extractSlug('/calculators/');
    return { name: 'calculator', params: { slug } };
  }

  // 4. Guides path: /guides/:slug
  if (path.startsWith('/guides/')) {
    const slug = extractSlug('/guides/');
    return { name: 'guide', params: { slug } };
  }

  // 5. Search path: /search?q=:query
  if (path === '/search') {
    const searchParams = new URLSearchParams(search);
    const q = searchParams.get('q') || '';
    return { name: 'search', params: { q } };
  }

  // 6. Phase 1 Programmatic SEO Template Routes
  if (path.startsWith('/mortgage/')) {
    const slug = extractSlug('/mortgage/');
    return { name: 'seo-page', params: { slug } };
  }
  if (path.startsWith('/compound-interest/')) {
    const slug = extractSlug('/compound-interest/');
    return { name: 'seo-page', params: { slug } };
  }
  if (path.startsWith('/retirement/')) {
    const slug = extractSlug('/retirement/');
    return { name: 'seo-page', params: { slug } };
  }
  if (path.startsWith('/fire/')) {
    const slug = extractSlug('/fire/');
    return { name: 'seo-page', params: { slug } };
  }
  if (path.startsWith('/salary/')) {
    const slug = extractSlug('/salary/');
    return { name: 'seo-page', params: { slug } };
  }

  // 7. Phase 3 & 6 Core Navigation Routes
  if (path === '/newsletter') return { name: 'newsletter', params: {} };
  if (path === '/sitemap') return { name: 'sitemap', params: {} };
  if (path === '/dashboard' || path === '/search-console') return { name: 'dashboard', params: {} };
  if (path === '/compare') return { name: 'compare', params: {} };
  if (path === '/preferences' || path === '/hub') return { name: 'preferences', params: {} };

  // Blog routes
  if (path === '/blog') {
    return { name: 'blog', params: {} };
  }
  if (path.startsWith('/blog/')) {
    const slug = extractSlug('/blog/');
    if (legacyBlogRedirects[slug]) {
      const targetUrl = legacyBlogRedirects[slug];
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', targetUrl);
      }
      const targetSlug = targetUrl.replace('/blog/', '');
      return { name: 'blog', params: { slug: targetSlug } };
    }
    return { name: 'blog', params: { slug } };
  }

  // 8. Legal and Info pages
  if (path === '/about') return { name: 'about', params: {} };
  if (path === '/contact') return { name: 'contact', params: {} };
  if (path === '/privacy') return { name: 'privacy', params: {} };
  if (path === '/terms') return { name: 'terms', params: {} };
  if (path === '/disclaimer') return { name: 'disclaimer', params: {} };

  // Fallback to 404
  return { name: '404', params: {} };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseLocation());

  // Listen to browser navigation buttons (back / forward)
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom navigation callback
  const handleNavigate = (path: string) => {
    // Prefix relative paths with slashes to keep them root-relative
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    window.history.pushState({}, '', cleanPath);
    setRoute(parseLocation());
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Render active route component
  const renderContent = () => {
    switch (route.name) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      
      case 'category':
        return <CategoryView categorySlug={route.params.slug} onNavigate={handleNavigate} />;
      
      case 'categories':
        return <CategoriesView onNavigate={handleNavigate} />;
      
      case 'calculator':
        return <CalculatorView calculatorSlug={route.params.slug} onNavigate={handleNavigate} />;
      
      case 'guide':
        return <GuideView guideSlug={route.params.slug} onNavigate={handleNavigate} />;
      
      case 'search':
        return <SearchView initialQuery={route.params.q} onNavigate={handleNavigate} />;
      
      // Phase 1 Programmatic View Dispatch
      case 'seo-page':
        return <ProgrammaticSEOView slug={route.params.slug} onNavigate={handleNavigate} />;

      // Secondary Core Views Dispatch
      case 'newsletter':
        return <NewsletterView />;
      
      case 'blog':
        return <BlogView articleSlug={route.params.slug} onNavigate={handleNavigate} />;
      
      case 'sitemap':
        return <SitemapView onNavigate={handleNavigate} />;
      
      case 'dashboard':
        return <DashboardView />;
      
      case 'compare':
        return <ComparisonView />;
      
      case 'preferences':
        return <UserHub onNavigate={handleNavigate} />;

      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      
      case 'contact':
        return <ContactView />;
      
      case 'privacy':
        return <PrivacyView />;
      
      case 'terms':
        return <TermsView />;
      
      case 'disclaimer':
        return <DisclaimerView />;

      case '404':
        return <NotFoundView onNavigate={handleNavigate} />;

      default:
        return <NotFoundView onNavigate={handleNavigate} />;
    }
  };

  // Re-map route state to string for navbar styling highlight
  const getActivePill = () => {
    if (route.name === 'home') return '';
    return route.name;
  };

  return (
    <Layout activeRoute={getActivePill()} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
}
