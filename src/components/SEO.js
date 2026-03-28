import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
    title = 'Institute of Engineering & Technology, Agra',
    description = 'Official website of Institute of Engineering & Technology, Dr. B. R. Ambedkar University, Agra.',
    keywords = 'IET Agra, Engineering College Agra, Dr. B. R. Ambedkar University, IET Khandari',
    name = 'IET Agra',
    type = 'website',
    image = '/logo192.png', // Fallback image if needed, ensure this path is correct or use an import
    url, // Default to current URL handling inside component
    schemaType = 'CollegeOrUniversity',
    schemaData = {}
}) {
    // If url is not provided, use window.location.href safely (check for window existence for SSR compatibility)
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    // AI SEO: Structured Data (JSON-LD)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": schemaType,
        "name": title,
        "description": description,
        "url": currentUrl,
        ...schemaData
    };

    if (schemaType === 'CollegeOrUniversity' || schemaType === 'Department') {
        structuredData.parentOrganization = {
            "@type": "CollegeOrUniversity",
            "name": "Institute of Engineering & Technology, Agra",
            "url": "https://ietagra.iotabuild.in"
        };
    }

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | IET Agra</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* AI SEO: Dynamic JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            {/* Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            <meta property="og:url" content={currentUrl} />
            
             {/* Twitter Card tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
