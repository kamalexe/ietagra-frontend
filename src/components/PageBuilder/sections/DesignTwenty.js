import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventService from '../../../services/EventService';

const DesignTwenty = ({ id,
    title = "Our Events",
    subtitle = "",
    content = "",
    backgroundImage = "https://picsum.photos/200/300",
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
    }, [limit]); 

    if (loading) return <div className="text-center py-10">Loading events...</div>;

    return (
        <section id={id} className="bg-white pb-20">
            {/* Header Section */}
            <div className="relative h-64 bg-cover bg-center flex items-center justify-center mb-16" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider mb-2">{title}</h1>
                    {subtitle && <p className="text-xl text-gray-200 font-light">{subtitle}</p>}
                </div>
            </div>

            <div className="container mx-auto px-4">
                {content && (
                    <div className="prose max-w-4xl mx-auto mb-12 text-center text-gray-700" dangerouslySetInnerHTML={{ __html: content }}></div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={event.image || "https://via.placeholder.com/600x400"}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-red-600 shadow-sm">
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-2">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event.place}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                                    <Link to={`/events/${event.slug || event._id}`}>
                                        {event.title}
                                    </Link>
                                </h3>

                                <div className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1">
                                    {event.subtitle}
                                </div>

                                <Link
                                    to={`/events/${event.slug || event._id}`}
                                    className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 mt-auto transition-colors group/link"
                                >
                                    Read More
                                    <svg className="w-4 h-4 ml-2 transform transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No upcoming events found.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DesignTwenty;
