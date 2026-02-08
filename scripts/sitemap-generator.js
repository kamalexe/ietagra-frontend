const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Base URL of the website
const BASE_URL = 'https://ietagra.iotabuild.in';
// API Base URL - modify this if your backend is hosted elsewhere during generation
const API_BASE_URL = 'http://localhost:5000/api';

// Static routes to include in the sitemap
const staticRoutes = [
    '/',
    '/events',
    '/gallery',
    '/login',
    '/changepassword',
    '/sendpasswordresetemail'
];

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

const generateSitemap = async () => {
    try {
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static routes
        staticRoutes.forEach(route => {
            sitemap += `
    <url>
        <loc>${BASE_URL}${route}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>`;
        });

        // Fetch Dynamic Pages
        try {
            console.log('Fetching pages from', `${API_BASE_URL}/pages/public/list`);
            const pagesResponse = await axios.get(`${API_BASE_URL}/pages/public/list`);
            const pages = pagesResponse.data.data || [];

            pages.forEach(page => {
                if (page.slug) {
                    sitemap += `
    <url>
        <loc>${BASE_URL}/${page.slug}</loc>
        <lastmod>${formatDate(new Date(page.updatedAt || new Date()))}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
                }
            });
            console.log(`Added ${pages.length} dynamic pages.`);
        } catch (error) {
            console.warn('Failed to fetch pages for sitemap:', error.message);
        }

        // Fetch Events
        try {
            console.log('Fetching events from', `${API_BASE_URL}/events`);
            const eventsResponse = await axios.get(`${API_BASE_URL}/events`);
            const events = eventsResponse.data.data || [];

            events.forEach(event => {
                // Prefer slug if available, else use ID
                const eventPath = event.slug ? `/events/${event.slug}` : `/events/${event._id}`;
                sitemap += `
    <url>
        <loc>${BASE_URL}${eventPath}</loc>
        <lastmod>${formatDate(new Date(event.updatedAt || event.createdAt || new Date()))}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`;
            });
            console.log(`Added ${events.length} events.`);
        } catch (error) {
            console.warn('Failed to fetch events for sitemap:', error.message);
        }

        sitemap += `
</urlset>`;

        // Correct path to the public directory
        const publicDir = path.resolve(__dirname, '../public');
        const sitemapPath = path.join(publicDir, 'sitemap.xml');

        fs.writeFileSync(sitemapPath, sitemap);
        console.log(`Sitemap generated at ${sitemapPath}`);

    } catch (error) {
        console.error('Sitemap generation failed:', error);
    }
};

generateSitemap();
