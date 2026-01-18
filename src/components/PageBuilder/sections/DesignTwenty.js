import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventService from '../../../services/EventService';

const DesignTwenty = ({
    title = "Events 2023",
    subtitle = "",
    content = "",
    backgroundImage = "https://d3ahzzdje1trpm.cloudfront.net/assets/images/banner/sms-banner-3.jpg",
    limit
}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await EventService.getAllEvents();
                // If limit is provided, slice the data
                const displayedEvents = limit ? data.slice(0, parseInt(limit)) : data;
                setEvents(displayedEvents);
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [limit]); // Re-fetch or re-process if limit changes (though re-fetch happens on mount effectively)

    if (loading) return <div className="text-center py-10">Loading events...</div>;

    return (
        <section className="bg-white">
            {/* Header Section */}
            <section className="relative h-64 bg-cover bg-center flex items-center justify-center mb-10" style={{ backgroundImage: `url(${backgroundImage})` }}>
                {/* Overlay or Text Shadow if needed for legibility */}
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold text-white uppercase tracking-wider">{title}</h1>
                    {subtitle && <p className="text-xl text-white mt-2 font-light">{subtitle}</p>}
                </div>
            </section>

            <div className="container mx-auto px-4 pb-20">
                {content && (
                    <div className="prose max-w-4xl mx-auto mb-12 text-center text-gray-700" dangerouslySetInnerHTML={{ __html: content }}></div>
                )}

                <section className="inner-page event-detail" id="event-detail">
                    {events.map((event, index) => (
                        <div key={event._id} className="flex flex-col md:flex-row gap-8 mb-12 border-b border-gray-100 pb-12 last:border-0 last:pb-0">
                            {/* Logic to alternate image/text side based on index for variety, or keep standard */}
                            {/* User HTML used alternating infra-right (order-1) vs infra-left. Let's replicate alternating. */}
                            <div className={`md:w-1/2 w-full ${index % 2 === 0 ? 'order-1 md:order-1' : ''}`}> {/* If index is odd, maybe default order. If even, swap? The user HTML shows alternating. */}
                                {/* Wait, user HTML:
                                     Row 1: infra-right order-1 (Image Right) -> Text Left
                                     Row 2: infra-left (Image Left) -> Text Right
                                 */}
                                <div className="overflow-hidden rounded-lg shadow-md h-full">
                                    <img src={event.image || "https://via.placeholder.com/600x400"} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                                </div>
                            </div>

                            <div className={`md:w-1/2 w-full flex flex-col justify-center ${index % 2 === 0 ? 'order-2 md:order-0' : ''}`}>
                                <div className="infra-content">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2 border-l-4 border-red-600 pl-3">
                                        <Link to={`/events/${event.slug || event._id}`} className="hover:text-red-700 transition-colors">
                                            {event.title}
                                        </Link>
                                    </h3>
                                    <p className="text-gray-600 mb-4 bg-gray-50 p-2 rounded inline-block text-sm">
                                        <b className="text-red-600">Date :</b> {new Date(event.date).toLocaleDateString()} <span className="mx-2">|</span> <b className="text-red-600">Place :</b> {event.place}
                                    </p>
                                    <div className="text-gray-700 text-justify line-clamp-4">
                                        {/* Simple truncate for list view, full view on detail page */}
                                        {event.subtitle}
                                    </div>
                                    <Link to={`/events/${event.slug || event._id}`} className="inline-block mt-4 text-red-600 font-semibold hover:underline">
                                        Read More &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && <p className="text-center text-gray-500">No events found.</p>}
                </section>
            </div>
        </section>
    );
};

export default DesignTwenty;
