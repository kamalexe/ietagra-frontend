import React, { useEffect, useState } from 'react';
import TestimonialService from '../../services/TestimonialService';
import DepartmentService from '../../services/DepartmentService';
import FileService from '../../services/FileService';
import { useSelector } from 'react-redux';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const TestimonialsList = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const { role } = useSelector(state => state.user);
    const [formData, setFormData] = useState({ 
        name: '', 
        role: '', 
        message: '', 
        rating: 5, 
        image: '', 
        department: '',
        type: 'text',
        videoUrl: ''
    });
    const [editingId, setEditingId] = useState(null);

    const loadTestimonials = async () => {
        try {
            setLoading(true);
            const data = await TestimonialService.getAllTestimonials();
            setTestimonials(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load testimonials:", err);
            setError("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    };

    const loadDepartments = async () => {
        try {
            const data = await DepartmentService.getAllDepartments();
            setDepartments(data);
        } catch (err) {
            console.error("Failed to load departments:", err);
        }
    };

    useEffect(() => {
        loadTestimonials();
        if (role === 'admin') {
            loadDepartments();
        }
    }, [role]);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                name: item.name,
                role: item.role,
                message: item.message,
                rating: item.rating,
                image: item.image || '',
                department: item.department?._id || item.department || '',
                type: item.type || 'text',
                videoUrl: item.videoUrl || ''
            });
        } else {
            setEditingId(null);
            setFormData({ 
                name: '', 
                role: '', 
                message: '', 
                rating: 5, 
                image: '', 
                department: '',
                type: 'text',
                videoUrl: ''
            });
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
                await TestimonialService.updateTestimonial(editingId, formData);
                alert("Testimonial updated successfully!");
            } else {
                await TestimonialService.createTestimonial(formData);
                alert("Testimonial created successfully!");
            }
            handleCloseModal();
            loadTestimonials();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            try {
                await TestimonialService.deleteTestimonial(id);
                loadTestimonials();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const data = await FileService.uploadFile(file);
            setFormData(prev => ({ ...prev, image: data.url }));
            alert("Image uploaded successfully!");
        } catch (error) {
            alert("Image upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading testimonials...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Testimonials Management</h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Testimonial
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-4">{error}</div>}

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {testimonials.map((item) => (
                            <tr key={item._id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {item.image && <img className="h-10 w-10 rounded-full mr-3 object-cover" src={item.image} alt="" />}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {item.department?.name || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.type === 'video' ? 'bg-red-100 text-red-800' :
                                            item.type === 'image' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item.type || 'text'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.rating} / 5
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-3">
                                        <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {testimonials.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No testimonials found.</td>
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
                                        {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                                <input type="text" name="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                                                <input type="number" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                            </div>
                                            {role === 'admin' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                                    <select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                        <option value="">Select Department</option>
                                                        {departments.map(dept => (
                                                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Message</label>
                                            <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Content Type</label>
                                                <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                    <option value="text">Text Only</option>
                                                    <option value="image">Image</option>
                                                    <option value="video">Video (YouTube)</option>
                                                </select>
                                            </div>
                                            {formData.type === 'video' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">YouTube Video URL</label>
                                                    <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://youtube.com/watch?v=..." />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                                            <div className="mt-1 flex items-center space-x-4">
                                                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                                <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    {uploading ? 'Uploading...' : 'Upload'}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                                </label>
                                            </div>
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

export default TestimonialsList;
