import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO as SEODefaults } from '@utils/constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = SEODefaults.TITLE,
  description = SEODefaults.DESCRIPTION,
  keywords = SEODefaults.KEYWORDS,
  image = SEODefaults.OG_IMAGE,
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
}) => {
  const siteUrl = 'https://luiscedillo.com';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* No Index if specified */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Preload important assets */}
      <link rel="preload" href={fullImageUrl} as="image" />
    </Helmet>
  );
};

export default SEO;
