import React, { useEffect, useState } from 'react';
import GalleryService from '../../services/GalleryService';
import { getToken } from '../../services/LocalStorageService';
import { useSelector } from 'react-redux';
import DepartmentService from '../../services/DepartmentService';
import { PencilIcon, TrashIcon, PlusIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const GalleryList = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [formData, setFormData] = useState({ title: '', category: 'Others', description: '', imageUrl: '', department: '' });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const { role, department } = useSelector(state => state.user);

    const categories = ['Events', 'Campus', 'Academic', 'Sports', 'Others'];

    const fetchUploadedFiles = async () => {
        setLoadingMedia(true);
        try {
            const { access_token } = getToken();
            const res = await fetch('http://localhost:5000/api/upload/files', {
                headers: {
                    'Authorization': access_token ? `Bearer ${access_token}` : ''
                }
            });
            const data = await res.json();
            if (data.success) {
                setMediaFiles(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch media", err);
        } finally {
            setLoadingMedia(false);
        }
    };

    const handleOpenMediaLibrary = () => {
        setIsMediaModalOpen(true);
        fetchUploadedFiles();
    };

    const selectMediaImage = (url) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
        setIsMediaModalOpen(false);
    };

    const [filterDepartment, setFilterDepartment] = useState('all'); // 'all', 'common', or departmentId

    const loadImages = React.useCallback(async () => {
        try {
            setLoading(true);
            let params = {};
            if (filterDepartment === 'common') {
                params.common = true;
            } else if (filterDepartment !== 'all') {
                params.department = filterDepartment;
            }

            const data = await GalleryService.getGalleryImages(params);
            setImages(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load gallery images:", err);
            setError("Failed to load gallery images.");
        } finally {
            setLoading(false);
        }
    }, [filterDepartment]);

    // Rerun loadImages when filter changes
    useEffect(() => {
        loadImages();
    }, [loadImages]);

    // Load departments only for admin
    useEffect(() => {
        if (role === 'admin') {
            const fetchDepts = async () => {
                try {
                    const data = await DepartmentService.getAllDepartments();
                    setDepartments(data);
                } catch (err) {
                    console.error("Failed to load departments:", err);
                }
            };
            fetchDepts();
        }
    }, [role]);

    const handleOpenModal = (image = null) => {
        if (image) {
            setEditingId(image._id);
            setFormData({
                title: image.title,
                category: image.category,
                description: image.description || '',
                imageUrl: image.imageUrl,
                department: image.department?._id || image.department || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                category: 'Others',
                description: '',
                imageUrl: '',
                department: role === 'department_admin' ? (department?._id || department) : ''
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        setUploading(true);
        try {
            const { access_token } = getToken();
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': access_token ? `Bearer ${access_token}` : ''
                },
                body: formDataUpload
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Upload failed');

            setFormData(prev => ({ ...prev, imageUrl: data.data.url }));
        } catch (error) {
            console.error(error);
            alert("Image upload failed: " + error.message);
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...formData };
            if (dataToSubmit.department === '') {
                dataToSubmit.department = null;
            }

            if (editingId) {
                await GalleryService.updateGalleryImage(editingId, dataToSubmit);
                alert("Gallery image updated successfully!");
            } else {
                await GalleryService.createGalleryImage(dataToSubmit);
                alert("Gallery image added successfully!");
            }
            handleCloseModal();
            loadImages();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this gallery image?")) {
            try {
                await GalleryService.deleteGalleryImage(id);
                loadImages();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (loading) return <div className="p-4 text-center">Loading gallery...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Gallery Management</h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 gap-2">
                    {role === 'admin' && (
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="all">All Images</option>
                            <option value="common">Common (University)</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Image
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-4">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image) => (
                    <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                        <div className="relative aspect-[4/3] bg-gray-100">
                            <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button onClick={() => handleOpenModal(image)} className="p-2 bg-white rounded-full text-indigo-600 mx-1 hover:bg-indigo-50">
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDelete(image._id)} className="p-2 bg-white rounded-full text-red-600 mx-1 hover:bg-red-50">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{image.title}</h3>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {image.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No images found in the gallery.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 1000 }} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                        {editingId ? 'Edit Gallery Image' : 'Add New Image'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <select name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {role === 'admin' ? (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                                <select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                    <option value="">General / All Departments</option>
                                                    {departments.map(dept => (
                                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                                <input type="text" readOnly value={department?.name || 'My Department'} className="mt-1 block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm cursor-not-allowed" />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Image</label>
                                            <div className="mt-1 flex items-center space-x-4">
                                                {formData.imageUrl && (
                                                    <img src={formData.imageUrl} alt="Preview" className="h-20 w-32 object-cover rounded border" />
                                                )}
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        name="imageUrl"
                                                        value={formData.imageUrl}
                                                        onChange={handleChange}
                                                        placeholder="Enter Image URL or Upload"
                                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleOpenMediaLibrary}
                                                    className="bg-indigo-50 py-2 px-3 border border-indigo-200 rounded-md shadow-sm text-sm leading-4 font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-1"
                                                >
                                                    <PhotoIcon className="h-4 w-4" />
                                                    Library
                                                </button>
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
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={3}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Optional short description"
                                            ></textarea>
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

            {/* Media Library Modal */}
            {isMediaModalOpen && (
                <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 1100 }} aria-labelledby="media-modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" aria-hidden="true" onClick={() => setIsMediaModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900" id="media-modal-title">Media Library</h3>
                                <button onClick={() => setIsMediaModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="bg-gray-50 px-6 py-6 h-96 overflow-y-auto">
                                {loadingMedia ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {mediaFiles.map((file, idx) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 cursor-pointer shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all group"
                                                onClick={() => selectMediaImage(file.url)}
                                            >
                                                <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                                    <span className="bg-white text-indigo-600 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 shadow-sm">Select</span>
                                                </div>
                                            </div>
                                        ))}
                                        {mediaFiles.length === 0 && (
                                            <div className="col-span-full text-center py-20 text-gray-500">
                                                No previously uploaded images found.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-100 px-6 py-3 text-right">
                                <button type="button" onClick={() => setIsMediaModalOpen(false)} className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryList;
