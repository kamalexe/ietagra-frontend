import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, BuildingLibraryIcon, XMarkIcon, Cog6ToothIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CampusService from '../../services/CampusService';
import axiosInstance from '../../api/axiosConfig';

const CampusesList = () => {
    const [campuses, setCampuses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', slug: '', address: '', description: '',
        image: '',
        phone: '', email: '', website: '', mapUrl: '', facilities: '', order: 0
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadCampuses();
    }, []);

    const loadCampuses = async () => {
        try {
            const data = await CampusService.getAllCampuses();
            // Sort by order ascending
            const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
            setCampuses(sortedData);
        } catch (err) {
            console.error("Failed to load campuses", err);
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(campuses);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state immediately
        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index
        }));
        setCampuses(updatedItems);

        // Prepare orders for sync
        const orders = updatedItems.map((item, index) => ({
            id: item._id,
            order: index
        }));

        try {
            await CampusService.reorderCampuses(orders);
            // toast.success("Order updated"); // If toast is available, but alert might be too annoying here
        } catch (error) {
            console.error("Failed to update order", error);
            toast.error("Failed to save new order: " + error.message);
            loadCampuses(); // Revert on failure
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData({
            name: '', slug: '', address: '', description: '',
            image: '',
            phone: '', email: '', website: '', mapUrl: '', facilities: '', order: 0
        });
        setIsModalOpen(true);
    };

    const openEditModal = (campus) => {
        setEditingId(campus._id);
        setFormData({
            name: campus.name,
            slug: campus.slug,
            address: campus.address || '',
            description: campus.description || '',
            image: campus.image || '',
            phone: campus.phone || '',
            email: campus.email || '',
            website: campus.website || '',
            mapUrl: campus.mapUrl || '',
            facilities: campus.facilities ? campus.facilities.join(', ') : '',
            order: campus.order || 0
        });
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setUploading(true);
        try {
            const res = await axiosInstance.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, image: res.data.data.url }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed: " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const slug = formData.slug.toLowerCase().trim().replace(/\s+/g, '-');
        const campusData = {
            ...formData,
            slug,
            facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f)
        };

        try {
            if (editingId) {
                await CampusService.updateCampus(editingId, campusData);
                toast.success('Campus updated successfully!');
            } else {
                await CampusService.createCampus(campusData);
                toast.success('Campus created successfully!');
            }
            setIsModalOpen(false);
            loadCampuses();
        } catch (error) {
            toast.error('Error saving campus: ' + error.message);
        }
    };

    const handleDelete = async (id, slug) => {
        if (window.confirm("Are you sure? This will delete the campus, its page, and potentially associated courses.")) {
            try {
                await CampusService.deleteCampus(id);
                setCampuses(campuses.filter(c => c._id !== id));
            } catch (err) {
                toast.error("Failed to delete: " + err.message);
            }
        }
    };

    const handleSeed = async () => {
        if (window.confirm("Warning: This will clear ALL existing campuses and courses and refill them with school-standard data. Do you want to proceed?")) {
            try {
                await CampusService.seedCampuses();
                toast.success('Data seeded successfully!');
                loadCampuses();
            } catch (err) {
                toast.error("Failed to seed: " + err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Campuses</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage university campuses.</p>
                </div>
                <div className="flex space-x-3 text-sm">
                    <button
                        onClick={handleSeed}
                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <BuildingLibraryIcon className="-ml-1 mr-2 h-5 w-5" />
                        Seed Initial Data
                    </button>
                    <Link
                        to="/admin/pages/campus"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" />
                        Manage Listing Page
                    </Link>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Add Campus
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <DragDropContext onDragEnd={onDragEnd}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 w-10"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campus Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center">Order</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <Droppable droppableId="campuses">
                            {(provided) => (
                                <tbody
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="bg-white divide-y divide-gray-200"
                                >
                                    {campuses.map((campus, index) => (
                                        <Draggable key={campus._id} draggableId={campus._id} index={index}>
                                            {(provided, snapshot) => (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`${snapshot.isDragging ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400">
                                                        <div {...provided.dragHandleProps} className="cursor-move">
                                                            <Bars3Icon className="h-5 w-5" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {campus.image ? (
                                                            <img src={campus.image} alt={campus.name} className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                                                                <BuildingLibraryIcon className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campus.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/campus/{campus.slug}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campus.address}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {campus.order || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-3">
                                                            <button onClick={() => openEditModal(campus)} className="text-indigo-600 hover:text-indigo-900">
                                                                <Cog6ToothIcon className="h-5 w-5" />
                                                            </button>
                                                            <Link to={`/admin/pages/${encodeURIComponent(`campus/${campus.slug}`)}`} className="text-blue-600 hover:text-blue-900">
                                                                <PencilSquareIcon className="h-5 w-5" />
                                                            </Link>
                                                            <a href={`/campus/${campus.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                                                                <EyeIcon className="h-5 w-5" />
                                                            </a>
                                                            <button onClick={() => handleDelete(campus._id, campus.slug)} className="text-red-400 hover:text-red-600">
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </tbody>
                            )}
                        </Droppable>
                    </table>
                </DragDropContext>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{editingId ? 'Edit Campus' : 'Add New Campus'}</h3>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Campus Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Campus Image</label>
                                    <div className="mt-1 flex items-center space-x-4">
                                        {formData.image && (
                                            <div className="relative h-20 w-20 border rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img src={formData.image} alt="Campus" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image: '' })}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-1"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            />
                                            <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Website</label>
                                    <input
                                        type="url"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Display Order (Lower comes first)</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Facilities (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Wi-Fi, Library, Hostel, etc."
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.facilities}
                                        onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.mapUrl}
                                        onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                                    />
                                </div>
                                <div className="mt-5 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm" disabled={uploading}>
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
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

export default CampusesList;
