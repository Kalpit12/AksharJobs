import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "AksharJobs - Find Your Dream Job",
  description = "Discover amazing job opportunities with AksharJobs. Connect with top employers, showcase your skills, and advance your career with our comprehensive job search platform.",
  keywords = "jobs, career, employment, job search, recruitment, hiring, professional network, resume, skills",
  image = "/assets/og-image.jpg",
  url = "https://aksharjobs.com",
  type = "website",
  structuredData = null,
  canonical = null
}) => {
  const fullTitle = title.includes("AksharJobs") ? title : `${title} | AksharJobs`;
  const fullUrl = canonical || url;
  const fullImage = image.startsWith('http') ? image : `${process.env.REACT_APP_BASE_URL || 'https://aksharjobs.com'}${image}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AksharJobs",
    "description": description,
    "url": fullUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${fullUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AksharJobs",
      "logo": {
        "@type": "ImageObject",
        "url": `${fullImage}`
      }
    }
  };

  const structuredDataToUse = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="AksharJobs" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="AksharJobs" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@aksharjobs" />
      <meta name="twitter:creator" content="@aksharjobs" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.aksharjobs.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//api.aksharjobs.com" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredDataToUse)}
      </script>
    </Helmet>
  );
};

export default SEO;
