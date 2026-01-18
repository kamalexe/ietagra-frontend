import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventService from '../../../services/EventService';

const DesignTwentyOne = () => {
    const { id } = useParams(); // Should work if the page is at /events/:id or similar
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // If used in a context where ID is not in params (e.g. preview), we might need mock data or handling.

    useEffect(() => {
        const fetchEvent = async () => {
            // Check if we have an ID. If not, maybe show a placeholder or return.
            if (!id && !window.location.href.includes('admin')) {
                // If strictly no ID and not admin preview, maybe do nothing? 
                // But for admin preview (TemplatePicker), we want dummy data.
                // We'll handle dummy data in render or state init.
                return;
            }

            if (!id) return; // In admin or no-param view

            try {
                let data;
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    data = await EventService.getEvent(id);
                } else {
                    data = await EventService.getEventBySlug(id);
                }
                setEvent(data);
            } catch (err) {
                console.error("Failed to load event", err);
                setError("Event not found");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // Handle Preview / No ID case
    let displayEvent = event;
    if (!id || (!event && loading)) {
        // Should we show a placeholder for the PageBuilder preview?
        // If we are just mounting it without params.
        if (!id) {
            displayEvent = {
                title: "Sample Event Title",
                date: new Date().toISOString(),
                place: "Conference Hall, IET Agra",
                image: "https://via.placeholder.com/1200x500",
                description: "This is a preview of the Event Detail section. In a real scenario, this will be populated by the event data corresponding to the URL."
            };
        }
    }

    if (loading && id) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-600">Event not found.</div>;
    if (!displayEvent) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Banner Header */}
            <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: displayEvent.image ? `url(${displayEvent.image})` : 'none', backgroundColor: '#333' }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">{displayEvent.title}</h1>
                        {displayEvent.subtitle && <h2 className="text-xl md:text-2xl font-light mb-4 text-gray-200">{displayEvent.subtitle}</h2>}
                        <div className="flex flex-wrap gap-4 text-sm md:text-base font-medium">
                            <span className="bg-red-600 px-3 py-1 rounded">
                                <i className="far fa-calendar-alt mr-2"></i>
                                {displayEvent.date ? new Date(displayEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date'}
                            </span>
                            <span className="bg-blue-600 px-3 py-1 rounded">
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                {displayEvent.place}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="prose max-w-none text-gray-800 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: displayEvent.description }}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignTwentyOne;
