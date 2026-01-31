import React, { useEffect, useState, useCallback } from 'react';
import EventService from '../../services/EventService';
import { getToken } from '../../services/LocalStorageService';
import { useSelector } from 'react-redux';
import DepartmentService from '../../services/DepartmentService';
import TestimonialService from '../../services/TestimonialService';
import { PencilIcon, TrashIcon, PlusIcon, ShareIcon, XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Helper Components for Array Management

const SpeakerManager = ({ speakers, onChange }) => {
    const [newSpeaker, setNewSpeaker] = useState({ name: '', designation: '', image: '', bio: '' });

    const addSpeaker = () => {
        if (!newSpeaker.name) return alert('Name is required');
        onChange([...speakers, newSpeaker]);
        setNewSpeaker({ name: '', designation: '', image: '', bio: '' });
    };

    const removeSpeaker = (index) => {
        const updated = speakers.filter((_, i) => i !== index);
        onChange(updated);
    };

    return (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-900">Speakers</h4>
            <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Name" className="border p-2 rounded" value={newSpeaker.name} onChange={e => setNewSpeaker({ ...newSpeaker, name: e.target.value })} />
                <input type="text" placeholder="Designation" className="border p-2 rounded" value={newSpeaker.designation} onChange={e => setNewSpeaker({ ...newSpeaker, designation: e.target.value })} />
                <input type="text" placeholder="Image URL" className="border p-2 rounded" value={newSpeaker.image} onChange={e => setNewSpeaker({ ...newSpeaker, image: e.target.value })} />
                <input type="text" placeholder="Bio" className="border p-2 rounded" value={newSpeaker.bio} onChange={e => setNewSpeaker({ ...newSpeaker, bio: e.target.value })} />
            </div>
            <button type="button" onClick={addSpeaker} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Speaker</button>

            <ul className="space-y-2 mt-2">
                {speakers.map((s, i) => (
                    <li key={i} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                        <div className="text-sm">
                            <span className="font-bold">{s.name}</span> - <span className="text-gray-500">{s.designation}</span>
                        </div>
                        <button type="button" onClick={() => removeSpeaker(i)} className="text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AgendaManager = ({ agenda, onChange }) => {
    const [newItem, setNewItem] = useState({ time: '', title: '', description: '', speakerName: '' });

    const addItem = () => {
        if (!newItem.time || !newItem.title) return alert('Time and Title are required');
        onChange([...agenda, newItem]);
        setNewItem({ time: '', title: '', description: '', speakerName: '' });
    };

    const removeItem = (index) => {
        const updated = agenda.filter((_, i) => i !== index);
        onChange(updated);
    };

    return (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-900">Agenda</h4>
            <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Time (e.g. 10:00 AM)" className="border p-2 rounded" value={newItem.time} onChange={e => setNewItem({ ...newItem, time: e.target.value })} />
                <input type="text" placeholder="Title" className="border p-2 rounded" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                <input type="text" placeholder="Description" className="border p-2 rounded" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                <input type="text" placeholder="Speaker Name (Optional)" className="border p-2 rounded" value={newItem.speakerName} onChange={e => setNewItem({ ...newItem, speakerName: e.target.value })} />
            </div>
            <button type="button" onClick={addItem} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Agenda Item</button>

            <ul className="space-y-2 mt-2">
                {agenda.map((item, i) => (
                    <li key={i} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                        <div className="text-sm">
                            <span className="font-bold text-blue-600">{item.time}</span>: <span className="font-medium">{item.title}</span>
                        </div>
                        <button type="button" onClick={() => removeItem(i)} className="text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const GalleryManager = ({ gallery, onChange }) => {
    const [newItem, setNewItem] = useState({ url: '', caption: '', type: 'image', category: 'event', isPublished: true });

    const addItem = () => {
        if (!newItem.url) return alert('URL is required');
        // Ensure default sequence is array length (append to end)
        const itemWithDefaults = { ...newItem, sequence: gallery.length };
        onChange([...gallery, itemWithDefaults]);
        setNewItem({ url: '', caption: '', type: 'image', category: 'event', isPublished: true });
    };

    const removeItem = (index) => {
        const updated = gallery.filter((_, i) => i !== index);
        onChange(updated);
    };

    const togglePublish = (index) => {
        const updated = [...gallery];
        updated[index].isPublished = !updated[index].isPublished;
        onChange(updated);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(gallery);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update sequence based on new index
        const sequencedItems = items.map((item, index) => ({ ...item, sequence: index }));
        onChange(sequencedItems);
    };

    return (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-900">Gallery (Drag to Reorder)</h4>
            <div className="flex gap-2 items-center flex-wrap">
                <select className="border p-2 rounded bg-white text-sm" value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                </select>
                <select className="border p-2 rounded bg-white text-sm" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                    <option value="event">Event Only</option>
                    <option value="department">Department</option>
                    <option value="university">University</option>
                </select>
                <input type="text" placeholder="URL" className="border p-2 rounded flex-1 text-sm" value={newItem.url} onChange={e => setNewItem({ ...newItem, url: e.target.value })} />
                <input type="text" placeholder="Caption" className="border p-2 rounded flex-1 text-sm" value={newItem.caption} onChange={e => setNewItem({ ...newItem, caption: e.target.value })} />
                <label className="flex items-center space-x-1 text-sm">
                    <input type="checkbox" checked={newItem.isPublished} onChange={e => setNewItem({ ...newItem, isPublished: e.target.checked })} />
                    <span>Publish</span>
                </label>
                <button type="button" onClick={addItem} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="gallery">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2"
                        >
                            {gallery.map((item, index) => (
                                <Draggable key={index} draggableId={`item-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`relative group border rounded overflow-hidden bg-white shadow-sm ${!item.isPublished ? 'opacity-60 grayscale' : ''}`}
                                        >
                                            <div className="absolute top-0 left-0 bg-white/80 p-1 rounded-br z-10 cursor-move">
                                                <ArrowsUpDownIcon className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <img src={item.url} alt={item.caption} className="h-24 w-full object-cover" />
                                            <div className="p-2 text-xs">
                                                <p className="truncate font-medium">{item.category}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <button type="button" onClick={() => togglePublish(index)} className={`px-1 rounded border ${item.isPublished ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-500 border-gray-200'}`}>
                                                        {item.isPublished ? 'Live' : 'Hidden'}
                                                    </button>
                                                    <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:bg-red-50 p-1 rounded"><XMarkIcon className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

const ResourcesManager = ({ resources, onChange }) => {
    const [newItem, setNewItem] = useState({ title: '', url: '' });

    const addItem = () => {
        if (!newItem.title || !newItem.url) return alert('Title and URL are required');
        onChange([...resources, newItem]);
        setNewItem({ title: '', url: '' });
    };

    const removeItem = (index) => {
        const resourcesUpdated = resources.filter((_, i) => i !== index);
        onChange(resourcesUpdated);
    };

    return (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-900">Resources</h4>
            <div className="flex gap-2">
                <input type="text" placeholder="Title" className="border p-2 rounded flex-1" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                <input type="text" placeholder="URL (PDF/Link)" className="border p-2 rounded flex-1" value={newItem.url} onChange={e => setNewItem({ ...newItem, url: e.target.value })} />
                <button type="button" onClick={addItem} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add</button>
            </div>

            <ul className="space-y-2 mt-2">
                {resources.map((item, i) => (
                    <li key={i} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                        <div className="text-sm truncate">
                            <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{item.title}</a>
                        </div>
                        <button type="button" onClick={() => removeItem(i)} className="text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const EventTestimonialManager = ({ eventId, departmentId }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', role: '', message: '', rating: 5, image: '', type: 'text', videoUrl: '', category: 'event' });

    const fetchTestimonials = useCallback(async () => {
        setLoading(true);
        try {
            const data = await TestimonialService.getTestimonialsByEvent(eventId);
            setTestimonials(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (eventId) fetchTestimonials();
    }, [eventId, fetchTestimonials]);

    const addItem = async () => {
        if (!newItem.name || !newItem.message || !newItem.role) return alert('Name, Role and Message are required');

        try {
            // If departmentId is not passed (e.g. General event), we might need to handle this. 
            // For now assuming even General events might have a "General" department or the user needs to select one?
            // HACK: If no departmentId, we'll try to find one or alert.
            // Ideally, we should allow selecting department if it's null.
            // Assuming current simple case: Use passed departmentId. 
            if (!departmentId) {
                // Fallback or Alert?
                // Let's alert for now if critical.
                // OR hardcode a department? Let's assume the user MUST link it to a department.
                // We'll add a department selector if needed later.
                alert("Event must belong to a department to add testimonials (Backend requirement).");
                return;
            }

            await TestimonialService.createTestimonial({
                ...newItem,
                event: eventId,
                department: departmentId
            });
            setNewItem({ name: '', role: '', message: '', rating: 5, image: '', type: 'text', videoUrl: '', category: 'event' });
            fetchTestimonials();
        } catch (error) {
            alert(error.message);
        }
    };

    const removeItem = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await TestimonialService.deleteTestimonial(id);
            setTestimonials(testimonials.filter(t => t._id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-900">Event Testimonials</h4>
            <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Name" className="border p-2 rounded" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                <input type="text" placeholder="Role (e.g. Student)" className="border p-2 rounded" value={newItem.role} onChange={e => setNewItem({ ...newItem, role: e.target.value })} />
                <input type="text" placeholder="Message" className="border p-2 rounded col-span-2" value={newItem.message} onChange={e => setNewItem({ ...newItem, message: e.target.value })} />
                <input type="number" placeholder="Rating (1-5)" className="border p-2 rounded" min="1" max="5" value={newItem.rating} onChange={e => setNewItem({ ...newItem, rating: parseInt(e.target.value) })} />
                <input type="text" placeholder="Image URL" className="border p-2 rounded" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} />

                <select className="border p-2 rounded bg-white" value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })}>
                    <option value="text">Text Only</option>
                    <option value="image">With Image</option>
                    <option value="video">Video Testimonial</option>
                </select>
                {newItem.type === 'video' && (
                    <input type="text" placeholder="Video URL" className="border p-2 rounded" value={newItem.videoUrl} onChange={e => setNewItem({ ...newItem, videoUrl: e.target.value })} />
                )}
            </div>
            <button type="button" onClick={addItem} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Add Testimonial</button>

            {loading ? <p>Loading...</p> : (
                <ul className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                    {testimonials.map((item) => (
                        <li key={item._id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                            <div className="text-sm">
                                <span className="font-bold">{item.name}</span>: <span className="text-gray-600 truncate">{item.message.substring(0, 30)}...</span>
                            </div>
                            <button type="button" onClick={() => removeItem(item._id)} className="text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        date: '',
        place: '',
        description: '',
        image: '',
        department: '',
        joinLink: '',
        registrationDeadline: '',
        isRegistrationOpen: false,
        speakers: [],
        agenda: [],
        gallery: [],
        resources: []
    });
    const [activeTab, setActiveTab] = useState('Basic Info');
    const [editingId, setEditingId] = useState(null);
    const [activeShareMenu, setActiveShareMenu] = useState(null);
    const [departments, setDepartments] = useState([]);
    const { role } = useSelector(state => state.user);

    const shareEvent = (event, platform) => {
        const backendUrl = 'http://localhost:5000/api'; // Or use process.env.REACT_APP_API_BASE_URL
        const shareBridgeUrl = `${backendUrl}/events/share/event/${event._id}`;

        // Helper to strip HTML and get clean text
        const stripHtml = (html) => {
            const tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        };

        const cleanDescription = stripHtml(event.description);
        const shortDescription = cleanDescription.length > 100
            ? cleanDescription.substring(0, 100) + '...'
            : cleanDescription;

        const introMessage = "Check out our new event: ";
        const title = event.title;
        const text = encodeURIComponent(`${introMessage}${title}\n\n${shortDescription}`);
        const url = encodeURIComponent(shareBridgeUrl);

        const shareLinks = {
            whatsapp: `https://api.whatsapp.com/send?text=${text}%0A%0A${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        };

        window.open(shareLinks[platform], '_blank');
        setActiveShareMenu(null);
    };

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await EventService.getAdminEvents();
            setEvents(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load events:", err);
            setError("Failed to load events.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
        if (role === 'admin') {
            loadDepartments();
        }
    }, [role]);

    const loadDepartments = async () => {
        try {
            const data = await DepartmentService.getAllDepartments();
            setDepartments(data);
        } catch (err) {
            console.error("Failed to load departments:", err);
        }
    };

    const handleOpenModal = (event = null) => {
        if (event) {
            setEditingId(event._id);
            setFormData({
                title: event.title,
                subtitle: event.subtitle || '',
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
                place: event.place,
                description: event.description,
                image: event.image,
                department: event.department?._id || event.department || '',
                joinLink: event.joinLink || '',
                registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '',
                isRegistrationOpen: event.isRegistrationOpen || false,
                speakers: Array.isArray(event.speakers) ? event.speakers : [],
                agenda: Array.isArray(event.agenda) ? event.agenda : [],
                gallery: Array.isArray(event.gallery) ? event.gallery : [],
                resources: Array.isArray(event.resources) ? event.resources : []
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                subtitle: '',
                date: '',
                place: '',
                description: '',
                image: '',
                department: '',
                joinLink: '',
                registrationDeadline: '',
                isRegistrationOpen: false,
                speakers: [],
                agenda: [],
                gallery: [],
                resources: []
            });
        }
        setActiveTab('Basic Info');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.date || !formData.place || !formData.description) {
            alert("Please fill in all required fields: Title, Date, Place, and Description.");
            return;
        }

        try {
            const dataToSubmit = { ...formData };

            // Sanitize Department
            if (!dataToSubmit.department) {
                dataToSubmit.department = null;
            }

            // No need to parse JSON fields manually as they are already objects/arrays

            if (editingId) {
                await EventService.updateEvent(editingId, dataToSubmit);
                alert("Event updated successfully!");
                handleCloseModal(); // Close ONLY on success
                loadEvents();
            } else {
                await EventService.createEvent(dataToSubmit);
                alert("Event created successfully!");
                handleCloseModal(); // Close ONLY on success
                loadEvents();
            }
        } catch (err) {
            console.error("Submit Error:", err);
            alert("Failed to save event: " + (err.message || "Unknown error"));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await EventService.deleteEvent(id);
                loadEvents();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const downloadSample = () => {
        const headers = ['Title', 'Date', 'Place', 'Description', 'Image'];
        const csvContent = `data:text/csv;charset=utf-8,${headers.join(",")}\nAnnual Tech Fest,2023-11-25,Main Auditorium,A grand technology festival featuring various events.,https://via.placeholder.com/150`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "events_upload_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await EventService.bulkUpload(formData);
            alert("Upload Successful!");
            loadEvents();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload Failed: " + error.message);
        } finally {
            e.target.value = null;
        }
    };

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            // Needed service method or direct fetch.
            // Using direct fetch to the new endpoint matching EventService base URL
            const { access_token } = getToken();

            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': access_token ? `Bearer ${access_token}` : ''
                },
                body: formData
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Upload failed');

            setFormData(prev => ({ ...prev, image: data.data.url }));
        } catch (error) {
            console.error(error);
            alert("Image upload failed: " + error.message);
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    if (loading) return <div className="p-4 text-center">Loading events...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Events Management</h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 gap-2">
                    <button onClick={downloadSample} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Template
                    </button>
                    <label className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        Import Excel
                        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                    </label>
                    <button
                        onClick={() => handleOpenModal()}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Event
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-4">{error}</div>}

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(events) && events.length > 0 && events.map((event) => (
                            <tr key={event._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {event.image && <img className="h-10 w-10 rounded-full mr-3 object-cover" src={event.image} alt="" />}
                                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {event.department?.name || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(event.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.place}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-3">
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveShareMenu(activeShareMenu === event._id ? null : event._id)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Share Event"
                                            >
                                                <ShareIcon className="h-5 w-5" />
                                            </button>

                                            {activeShareMenu === event._id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveShareMenu(null)}></div>
                                                    <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-2xl border border-gray-100 py-2 z-20 animate-fade-in origin-top-right">
                                                        <button onClick={() => shareEvent(event, 'whatsapp')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2 transition-colors">
                                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> WhatsApp
                                                        </button>
                                                        <button onClick={() => shareEvent(event, 'linkedin')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors">
                                                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> LinkedIn
                                                        </button>
                                                        <button onClick={() => shareEvent(event, 'facebook')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-800 flex items-center gap-2 transition-colors">
                                                            <span className="w-2 h-2 rounded-full bg-blue-700"></span> Facebook
                                                        </button>
                                                        <button onClick={() => shareEvent(event, 'twitter')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2 transition-colors">
                                                            <span className="w-2 h-2 rounded-full bg-black"></span> Twitter (X)
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <button onClick={() => handleOpenModal(event)} className="text-indigo-600 hover:text-indigo-900">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!Array.isArray(events) || events.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No events found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 overflow-hidden z-[1000]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>

                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex-shrink-0">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {editingId ? 'Edit Event' : 'Add New Event'}
                                        </h3>
                                        <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="border-b border-gray-200">
                                        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                                            {['Basic Info', 'Speakers', 'Agenda', 'Gallery', 'Resources', 'Testimonials'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    type="button"
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`${activeTab === tab
                                                        ? 'border-indigo-500 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                </div>
                                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                                    <div className="space-y-4 pb-4">
                                        {activeTab === 'Basic Info' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                                                    <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Optional subtitle" />
                                                </div>
                                                {role === 'admin' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Department</label>
                                                        <select
                                                            name="department"
                                                            value={formData.department}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        >
                                                            <option value="">General (No Department)</option>
                                                            {Array.isArray(departments) && departments.map(dept => (
                                                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                                    <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Place</label>
                                                    <input type="text" name="place" value={formData.place} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Image</label>
                                                    <div className="mt-1 flex items-center space-x-4">
                                                        {formData.image && (
                                                            <img src={formData.image} alt="Preview" className="h-20 w-32 object-cover rounded border" />
                                                        )}
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                name="image"
                                                                value={formData.image}
                                                                onChange={handleChange}
                                                                placeholder="Enter Image URL or Upload"
                                                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                        </div>
                                                        <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                            <span>Upload</span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                            />
                                                        </label>
                                                        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Description (HTML Content)</label>
                                                    <textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        required
                                                        rows={5}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-sm"
                                                    ></textarea>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Join Link (Virtual)</label>
                                                        <input type="url" name="joinLink" value={formData.joinLink} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://..." />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                                                        <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <input type="checkbox" name="isRegistrationOpen" checked={formData.isRegistrationOpen} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                                    <label className="ml-2 block text-sm text-gray-900">Open Registration</label>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'Speakers' && (
                                            <SpeakerManager speakers={formData.speakers} onChange={val => setFormData({ ...formData, speakers: val })} />
                                        )}

                                        {activeTab === 'Agenda' && (
                                            <AgendaManager agenda={formData.agenda} onChange={val => setFormData({ ...formData, agenda: val })} />
                                        )}

                                        {activeTab === 'Gallery' && (
                                            <GalleryManager gallery={formData.gallery} onChange={val => setFormData({ ...formData, gallery: val })} />
                                        )}

                                        {activeTab === 'Resources' && (
                                            <ResourcesManager resources={formData.resources} onChange={val => setFormData({ ...formData, resources: val })} />
                                        )}

                                        {activeTab === 'Testimonials' && (
                                            editingId ? (
                                                <EventTestimonialManager eventId={editingId} departmentId={formData.department} />
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                                                    <p>Please save the event first to add testimonials.</p>
                                                    <p className="text-xs mt-2 text-gray-400">Testimonials are linked to existing events.</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse flex-shrink-0 border-t border-gray-200">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Save
                                    </button>
                                    <button type="button" onClick={handleCloseModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsList;
