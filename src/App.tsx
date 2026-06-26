import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import CalculatorView from './components/CalculatorView';
import GuideView from './components/GuideView';
import SearchView from './components/SearchView';
import { AboutView, ContactView, PrivacyView, TermsView, DisclaimerView } from './components/LegalViews';

interface RouteState {
  name: string;
  params: Record<string, any>;
}

// Helper to parse the current window path/query into a RouteState
function parseLocation(): RouteState {
  const path = window.location.pathname;
  const search = window.location.search;

  // 1. Home path
  if (path === '/' || path === '') {
    return { name: 'home', params: {} };
  }

  // 2. Categories path: /categories/:slug
  if (path.startsWith('/categories/')) {
    const slug = path.replace('/categories/', '');
    return { name: 'category', params: { slug } };
  }

  // 3. Calculators path: /calculators/:slug
  if (path.startsWith('/calculators/')) {
    const slug = path.replace('/calculators/', '');
    return { name: 'calculator', params: { slug } };
  }

  // 4. Guides path: /guides/:slug
  if (path.startsWith('/guides/')) {
    const slug = path.replace('/guides/', '');
    return { name: 'guide', params: { slug } };
  }

  // 5. Search path: /search?q=:query
  if (path === '/search') {
    const searchParams = new URLSearchParams(search);
    const q = searchParams.get('q') || '';
    return { name: 'search', params: { q } };
  }

  // 6. Legal and Info pages
  if (path === '/about') return { name: 'about', params: {} };
  if (path === '/contact') return { name: 'contact', params: {} };
  if (path === '/privacy') return { name: 'privacy', params: {} };
  if (path === '/terms') return { name: 'terms', params: {} };
  if (path === '/disclaimer') return { name: 'disclaimer', params: {} };

  // Fallback to home
  return { name: 'home', params: {} };
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
      
      case 'calculator':
        return <CalculatorView calculatorSlug={route.params.slug} onNavigate={handleNavigate} />;
      
      case 'guide':
        return <GuideView guideSlug={route.params.slug} onNavigate={handleNavigate} />;
      
      case 'search':
        return <SearchView initialQuery={route.params.q} onNavigate={handleNavigate} />;
      
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

      default:
        return <HomeView onNavigate={handleNavigate} />;
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
