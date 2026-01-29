import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  canonical, 
  type = 'website',
  name = 'PlagZap',
  image = 'https://plagzap.xyz/plagzap-logo.png',
  schema,
  keywords,
  author = 'Abhishek Kumar'
}) => {
  const siteUrl = 'https://plagzap.xyz';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | PlagZap` : 'PlagZap - AI Plagiarism Detection & Content Originality'}</title>
      <meta name="description" content={description || 'PlagZap is the leading AI plagiarism checker and content originality tool for creators, students, and agencies. Ensure your content is 100% authentic.'} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || 'PlagZap - AI Plagiarism Checker'} />
      <meta property="og:description" content={description || 'Ensure content originality with PlagZap, the AI-powered plagiarism detection tool.'} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'PlagZap - AI Plagiarism Checker'} />
      <meta name="twitter:description" content={description || 'Ensure content originality with PlagZap.'} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
