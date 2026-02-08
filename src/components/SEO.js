import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, name, type, image, url }) {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | IET Agra</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
            
             {/* Twitter Card tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}

SEO.defaultProps = {
    title: 'Institute of Engineering & Technology, Agra',
    description: 'Official website of Institute of Engineering & Technology, Dr. B. R. Ambedkar University, Agra.',
    keywords: 'IET Agra, Engineering College Agra, Dr. B. R. Ambedkar University, IET Khandari',
    name: 'IET Agra',
    type: 'website',
    image: '%PUBLIC_URL%/logo192.png', // Fallback image if needed, ensure this path is correct or use an import
    url: window.location.href // Default to current URL
};
