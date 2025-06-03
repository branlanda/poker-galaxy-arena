
import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface SEOContextType {
  updateSEO: (data: SEOData) => void;
  resetSEO: () => void;
}

const SEOContext = createContext<SEOContextType | null>(null);

const DEFAULT_SEO: SEOData = {
  title: 'PokerPlatform - Professional Online Poker',
  description: 'Join the ultimate online poker experience. Play Texas Hold\'em, tournaments, and cash games with players worldwide.',
  keywords: 'poker, texas holdem, online poker, poker games, tournaments, cash games',
  ogTitle: 'PokerPlatform - Professional Online Poker',
  ogDescription: 'Join the ultimate online poker experience. Play Texas Hold\'em, tournaments, and cash games with players worldwide.',
  ogImage: '/og-image.jpg',
  ogType: 'website'
};

const PAGE_SEO: Record<string, SEOData> = {
  '/': {
    title: 'PokerPlatform - Professional Online Poker',
    description: 'Join the ultimate online poker experience with tournaments, cash games, and professional gameplay.',
    keywords: 'poker, online poker, texas holdem, poker platform, poker games'
  },
  '/lobby': {
    title: 'Poker Lobby - Find Your Game | PokerPlatform',
    description: 'Browse active poker tables, join cash games, and find the perfect match for your skill level.',
    keywords: 'poker lobby, poker tables, cash games, poker rooms'
  },
  '/tournaments': {
    title: 'Poker Tournaments - Compete for Big Prizes | PokerPlatform',
    description: 'Join exciting poker tournaments with guaranteed prize pools. From freerolls to high-stakes events.',
    keywords: 'poker tournaments, poker competition, prize pools, tournament poker'
  },
  '/profile': {
    title: 'Player Profile - Track Your Poker Journey | PokerPlatform',
    description: 'View your poker statistics, achievements, and game history. Track your progress and improve your game.',
    keywords: 'poker profile, poker stats, poker achievements, poker history'
  },
  '/leaderboards': {
    title: 'Poker Leaderboards - Top Players | PokerPlatform',
    description: 'See the best poker players, tournament champions, and rising stars in our community.',
    keywords: 'poker leaderboards, top poker players, poker rankings, poker champions'
  }
};

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const updateMetaTag = (name: string, content: string, property?: boolean) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  const updateCanonicalLink = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  };

  const updateSEO = (data: SEOData) => {
    const seoData = { ...DEFAULT_SEO, ...data };

    // Update title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update meta tags
    if (seoData.description) {
      updateMetaTag('description', seoData.description);
    }

    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords);
    }

    // Update Open Graph tags
    if (seoData.ogTitle) {
      updateMetaTag('og:title', seoData.ogTitle, true);
    }

    if (seoData.ogDescription) {
      updateMetaTag('og:description', seoData.ogDescription, true);
    }

    if (seoData.ogImage) {
      updateMetaTag('og:image', seoData.ogImage, true);
    }

    if (seoData.ogType) {
      updateMetaTag('og:type', seoData.ogType, true);
    }

    // Update canonical URL
    const canonicalUrl = seoData.canonicalUrl || window.location.href;
    updateCanonicalLink(canonicalUrl);
    updateMetaTag('og:url', canonicalUrl, true);

    // Handle noindex
    if (seoData.noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Add structured data for poker
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PokerPlatform",
      "description": seoData.description,
      "url": window.location.origin,
      "applicationCategory": "Game",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  };

  const resetSEO = () => {
    updateSEO(DEFAULT_SEO);
  };

  // Update SEO based on current route
  useEffect(() => {
    const pageSEO = PAGE_SEO[location.pathname] || {};
    updateSEO(pageSEO);
  }, [location.pathname]);

  return (
    <SEOContext.Provider value={{ updateSEO, resetSEO }}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within SEOProvider');
  }
  return context;
};
