import React, { useEffect, useState } from 'react';
import EventService from '../../services/EventService';
import { getToken } from '../../services/LocalStorageService';
import { useSelector } from 'react-redux';
import DepartmentService from '../../services/DepartmentService';
import { PencilIcon, TrashIcon, PlusIcon, ShareIcon } from '@heroicons/react/24/outline';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', date: '', place: '', description: '', image: '' });
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
            const data = await EventService.getAllEvents();
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
                department: event.department?._id || event.department || ''
            });
        } else {
            setEditingId(null);
            setFormData({ title: '', subtitle: '', date: '', place: '', description: '', image: '', department: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await EventService.updateEvent(editingId, formData);
                alert("Event updated successfully!");
            } else {
                await EventService.createEvent(formData);
                alert("Event created successfully!");
            }
            handleCloseModal();
            loadEvents();
        } catch (err) {
            alert(err.message);
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
                        {events.map((event) => (
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
                        {events.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No events found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                        {editingId ? 'Edit Event' : 'Add New Event'}
                                    </h3>
                                    <div className="space-y-4">
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
                                                    {departments.map(dept => (
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
                                                rows={10}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-sm"
                                                placeholder="<p>Enter your event details here...</p>"
                                            ></textarea>
                                            <p className="mt-1 text-xs text-gray-500">HTML is supported. Use &lt;br&gt; for line breaks and &lt;p&gt; for paragraphs.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
