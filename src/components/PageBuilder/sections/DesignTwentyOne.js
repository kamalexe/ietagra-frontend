import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventService from '../../../services/EventService';
import TestimonialService from '../../../services/TestimonialService';
import DesignThirtyOne from './DesignThirtyOne';

const DesignTwentyOne = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState(null); // 'success', 'error', 'already_registered'

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id && !window.location.href.includes('admin')) return;
            if (!id) return;

            try {
                let data;
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    data = await EventService.getEvent(id);
                } else {
                    data = await EventService.getEventBySlug(id);
                }
                setEvent(data);

                // Fetch testimonials if event exists
                if (data && data._id) {
                    try {
                        const testimonialData = await TestimonialService.getTestimonialsByEvent(data._id);
                        setTestimonials(testimonialData);
                    } catch (tErr) {
                        console.error("Failed to load testimonials", tErr);
                    }
                }
            } catch (err) {
                console.error("Failed to load event", err);
                setError("Event not found");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!event?._id) return;
        setRegistering(true);
        try {
            await EventService.registerEvent(event._id);
            setRegistrationStatus('success');
            alert('Successfully registered for the event!');
        } catch (err) {
            console.error("Registration failed", err);
            setRegistrationStatus('error');
            alert(err.message || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    let displayEvent = event;
    if (!id || (!event && loading)) {
        if (!id) {
            displayEvent = {
                title: "Sample Event Title",
                date: new Date().toISOString(),
                place: "Conference Hall, IET Agra",
                image: "https://via.placeholder.com/1200x500",
                description: "This is a preview of the Event Detail section.",
                speakers: [
                    { name: "John Doe", designation: "Tech Lead", bio: "Expert in AI", image: "https://via.placeholder.com/150" },
                    { name: "Jane Smith", designation: "Product Manager", bio: "Building scalable products", image: "https://via.placeholder.com/150" }
                ],
                agenda: [
                    { time: "10:00 AM", title: "Keynote", description: "Opening remarks", speakerName: "John Doe" },
                    { time: "11:00 AM", title: "Panel Discussion", description: "Future of Tech" }
                ],
                gallery: [
                    { url: "https://via.placeholder.com/300", type: "image", caption: "Previous Event" },
                    { url: "https://via.placeholder.com/300", type: "image" }
                ],
                isRegistrationOpen: true
            };
        }
    }

    if (loading && id) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-600">Event not found.</div>;
    if (!displayEvent) return null;

    return (
        <div id={id} className="bg-gray-50 min-h-screen font-sans">
            {/* Banner Header */}
            <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: displayEvent.image ? `url(${displayEvent.image})` : 'none', backgroundColor: '#333' }}>
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
                    <div className="text-white max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">{displayEvent.title}</h1>
                        {displayEvent.subtitle && <h2 className="text-xl md:text-2xl font-light mb-6 text-gray-200">{displayEvent.subtitle}</h2>}

                        <div className="flex flex-wrap gap-4 text-sm md:text-base font-medium mb-8">
                            <span className="bg-red-600 px-4 py-2 rounded-full flex items-center shadow-lg">
                                <i className="far fa-calendar-alt mr-2"></i>
                                {displayEvent.date ? new Date(displayEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date'}
                            </span>
                            <span className="bg-blue-600 px-4 py-2 rounded-full flex items-center shadow-lg">
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                {displayEvent.place}
                            </span>
                        </div>

                        {displayEvent.isRegistrationOpen && (
                            <button
                                onClick={handleRegister}
                                disabled={registering || registrationStatus === 'success'}
                                className={`px-8 py-3 rounded-full font-bold text-lg shadow-xl transition transform hover:scale-105 ${registrationStatus === 'success'
                                    ? 'bg-green-500 cursor-default'
                                    : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                                    }`}
                            >
                                {registering ? 'Registering...' : registrationStatus === 'success' ? 'Registered' : 'Register Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* About Section */}
                    <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-4">About Event</h3>
                        <div className="prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: displayEvent.description }}></div>
                    </section>

                    {/* Speakers Section */}
                    {displayEvent.speakers && displayEvent.speakers.length > 0 && (
                        <section>
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-purple-500 pl-4">Speakers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {displayEvent.speakers.map((speaker, idx) => (
                                    <div key={idx} className="bg-white rounded-xl shadow-sm p-6 flex items-start space-x-4 border border-gray-100 hover:shadow-md transition">
                                        <img src={speaker.image || 'https://via.placeholder.com/100'} alt={speaker.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{speaker.name}</h4>
                                            <p className="text-blue-600 text-sm font-medium mb-2">{speaker.designation}</p>
                                            <p className="text-gray-500 text-sm line-clamp-3">{speaker.bio}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Agenda Section */}
                    {displayEvent.agenda && displayEvent.agenda.length > 0 && (
                        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-green-500 pl-4">Agenda</h3>
                            <div className="space-y-6">
                                {displayEvent.agenda.map((item, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-start border-l-2 border-gray-200 pl-6 relative">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                                        <div className="md:w-32 flex-shrink-0 font-bold text-gray-500 mb-1 md:mb-0">{item.time}</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                                            {item.speakerName && <p className="text-sm text-blue-600 font-medium mb-1">By {item.speakerName}</p>}
                                            <p className="text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gallery Section */}
                    {displayEvent.gallery && displayEvent.gallery.length > 0 && (
                        <section>
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-indigo-500 pl-4">Event Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {displayEvent.gallery.map((item, idx) => (
                                    <div key={idx} className="relative group overflow-hidden rounded-xl h-48">
                                        <img src={item.url} alt={item.caption || 'Event image'} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                                        {item.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 translate-y-full group-hover:translate-y-0 transition">
                                                {item.caption}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Testimonials Section */}
                    {testimonials && testimonials.length > 0 && (
                        <section>
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-yellow-500 pl-4">What People Say</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {testimonials.map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col">
                                        <div className="flex items-center mb-4">
                                            <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                            <div>
                                                <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                <p className="text-sm text-gray-500">{item.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic flex-grow">"{item.message}"</p>
                                        <div className="mt-4 flex text-yellow-400 text-sm">
                                            {[...Array(item.rating || 5)].map((_, i) => (
                                                <i key={i} className="fas fa-star"></i>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Resources Section */}
                    {displayEvent.resources && displayEvent.resources.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-xl mb-4 text-gray-800">Resources</h3>
                            <ul className="space-y-3">
                                {displayEvent.resources.map((res, idx) => (
                                    <li key={idx}>
                                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-blue-600 transition">
                                            <i className="fas fa-file-download mr-3 text-gray-400"></i>
                                            <span className="font-medium">{res.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Join Link */}
                    {displayEvent.joinLink && (
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center">
                            <h3 className="font-bold text-xl mb-2 text-blue-900">Virtual Event</h3>
                            <p className="text-blue-700 mb-4 text-sm">Join the event via the link below</p>
                            <a href={displayEvent.joinLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                Join Meeting
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesignTwentyOne;
