import React, { useState, useEffect } from 'react';
import DesignTwenty from '../components/PageBuilder/sections/DesignTwenty';
import PageService from '../services/PageService';
import PageRenderer from '../components/PageBuilder/PageRenderer';

const EventsPage = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await PageService.getPageBySlug('events');
                setPageData(data);
            } catch (err) {
                console.log("No dynamic config for events page found, using default.");
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    // If dynamic sections exist, use PageRenderer
    if (pageData && pageData.sections && pageData.sections.length > 0) {
        return <PageRenderer slug="events" data={pageData} />;
    }

    // Default Fallback
    return (
        <div className="events-page">
            <DesignTwenty />
        </div>
    );
};

export default EventsPage;
