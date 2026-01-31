// AlbumList - Admin Interface for Gallery Albums
import React, { useEffect, useState } from 'react';
import AlbumService from '../../services/AlbumService';
import DepartmentService from '../../services/DepartmentService';
import { getToken } from '../../services/LocalStorageService';
import { useSelector } from 'react-redux';
import { 
    PencilIcon, 
    TrashIcon, 
    PlusIcon, 
    FolderIcon, 
    PhotoIcon, 
    XMarkIcon,
    PlayCircleIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';
import Modal from '../../components/common/Modal';

const AlbumList = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // UI States
    const [activeView, setActiveView] = useState('list'); // 'list' or 'manage'
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
    
    // Library/Media Loading
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loadingMedia, setLoadingMedia] = useState(false);
    
    // Form States
    const [albumFormData, setAlbumFormData] = useState({ title: '', category: 'Others', description: '', coverImage: '', department: '' });
    const [mediaFormData, setMediaFormData] = useState({ src: '', type: 'image', caption: '', videoUrl: '' });
    const [editingAlbumId, setEditingAlbumId] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Departments & Role
    const [departments, setDepartments] = useState([]);

    // Get user info from Redux
    const { role: userRole, department: userDept } = useSelector(state => state.user);

    const categories = ['Events', 'Campus', 'Academic', 'Sports', 'Others'];

    const loadAlbums = async () => {
        try {
            setLoading(true);
            const data = await AlbumService.getAlbums();
            setAlbums(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load albums:", err);
            setError("Failed to load albums.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlbums();
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const data = await DepartmentService.getAllDepartments();
            setDepartments(data);
        } catch (err) {
            console.error("Failed to load departments", err);
        }
    };

    // Album Actions
    const handleOpenAlbumModal = (album = null) => {
        if (album) {
            setEditingAlbumId(album._id);
            setAlbumFormData({
                title: album.title,
                category: album.category,
                description: album.description || '',
                coverImage: album.coverImage,
                department: album.department || '' // Keep existing or empty
            });
        } else {
            setEditingAlbumId(null);
            // Auto-fill department for department_admin
            const defaultDept = userRole === 'department_admin' ? (userDept?._id || userDept || '') : '';
            setAlbumFormData({
                title: '',
                category: 'Others',
                description: '',
                coverImage: '',
                department: defaultDept
            });
        }
        setIsAlbumModalOpen(true);
    };

    const handleAlbumSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAlbumId) {
                await AlbumService.updateAlbum(editingAlbumId, albumFormData);
                alert("Album updated successfully!");
            } else {
                await AlbumService.createAlbum(albumFormData);
                alert("Album created successfully!");
            }
            setIsAlbumModalOpen(false);
            loadAlbums();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteAlbum = async (id) => {
        if (window.confirm("Are you sure you want to delete this album? This will NOT delete the actual images from the server.")) {
            try {
                await AlbumService.deleteAlbum(id);
                loadAlbums();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    // Manage Media Actions
    const handleManageAlbum = (album) => {
        setCurrentAlbum(album);
        setActiveView('manage');
    };

    const handleAddMedia = () => {
        setMediaFormData({ src: '', type: 'image', caption: '', videoUrl: '' });
        setIsMediaModalOpen(true);
    };

    const handleMediaSubmit = async (e) => {
        e.preventDefault();
        const updatedMedia = [...(currentAlbum.media || []), mediaFormData];
        try {
            const updated = await AlbumService.updateAlbum(currentAlbum._id, { media: updatedMedia });
            setCurrentAlbum(updated);
            setIsMediaModalOpen(false);
            loadAlbums();
        } catch (err) {
            alert("Failed to add media: " + err.message);
        }
    };

    const handleRemoveMedia = async (index) => {
        if (window.confirm("Remove this item from the album?")) {
            const updatedMedia = (currentAlbum.media || []).filter((_, i) => i !== index);
            try {
                const updated = await AlbumService.updateAlbum(currentAlbum._id, { media: updatedMedia });
                setCurrentAlbum(updated);
                loadAlbums();
            } catch (err) {
                alert("Failed to remove media: " + err.message);
            }
        }
    };

    // Media Library
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

    const handleOpenLibrary = (targetField) => {
        setIsLibraryModalOpen(targetField); // Stores 'coverImage' or 'mediaSrc'
        fetchUploadedFiles();
    };

    const selectFromLibrary = (url) => {
        if (isLibraryModalOpen === 'coverImage') {
            setAlbumFormData(prev => ({ ...prev, coverImage: url }));
        } else if (isLibraryModalOpen === 'mediaSrc') {
            setMediaFormData(prev => ({ ...prev, src: url }));
        }
        setIsLibraryModalOpen(false);
    };

    const handleImageUpload = async (e, target) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
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
            
            if (target === 'coverImage') {
                setAlbumFormData(prev => ({ ...prev, coverImage: data.data.url }));
            } else {
                setMediaFormData(prev => ({ ...prev, src: data.data.url }));
            }
        } catch (error) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading && activeView === 'list') return <div className="p-4 text-center">Loading albums...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeView === 'list' ? (
                /* ALBUMS LIST VIEW */
                <>
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Albums Management</h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4 gap-2">
                            <button
                                onClick={() => handleOpenAlbumModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Create Album
                            </button>
                        </div>
                    </div>

                    {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-4">{error}</div>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums.map((album) => (
                            <div key={album._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                <div className="relative aspect-[4/3] bg-gray-100 cursor-pointer" onClick={() => handleManageAlbum(album)}>
                                    <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenAlbumModal(album); }} className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-50" title="Edit Info">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album._id); }} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50" title="Delete">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                                        {album.media?.length || 0} items
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{album.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full uppercase tracking-wider">
                                            {album.category}
                                        </span>
                                        <button onClick={() => handleManageAlbum(album)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline">
                                            Manage Media
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {albums.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <FolderIcon className="mx-auto h-12 w-12 text-gray-300" />
                            <p className="mt-2 text-sm text-gray-500">No albums created yet.</p>
                        </div>
                    )}
                </>
            ) : (
                /* MANAGE ALBUM MEDIA VIEW */
                <>
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setActiveView('list')} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{currentAlbum.title}</h2>
                            <p className="text-sm text-gray-500">Manage photos and videos in this album</p>
                        </div>
                        <button
                            onClick={handleAddMedia}
                            className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            Add Media
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {(currentAlbum.media || []).map((item, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                                {item.type === 'video' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                                        <PlayCircleIcon className="h-10 w-10 text-white/80" />
                                        <span className="text-[10px] text-white/60 mt-2 truncate max-w-[80%] text-center px-1">Video</span>
                                    </div>
                                ) : (
                                    <img src={item.src} alt={item.caption} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => handleRemoveMedia(idx)} 
                                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 shadow-lg"
                                        title="Remove from Album"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                {item.caption && (
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate text-center">
                                        {item.caption}
                                    </div>
                                )}
                            </div>
                        ))}
                            {(currentAlbum.media || []).length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400 border-2 border-dashed rounded-lg">
                                This album is empty. Add some media!
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* CREATE/EDIT ALBUM MODAL */}
            <Modal
                isOpen={isAlbumModalOpen}
                onClose={() => setIsAlbumModalOpen(false)}
                title={editingAlbumId ? 'Edit Album' : 'Create New Album'}
                zIndex={50}
            >
                <form onSubmit={handleAlbumSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Album Title</label>
                        <input type="text" value={albumFormData.title} onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })} required className="w-full border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Graduation Day 2024" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                            <select value={albumFormData.category} onChange={(e) => setAlbumFormData({ ...albumFormData, category: e.target.value })} className="w-full border-gray-200 rounded-lg py-2 px-3 text-sm">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            {userRole === 'admin' ? (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                                    <select
                                        value={albumFormData.department}
                                        onChange={e => setAlbumFormData({ ...albumFormData, department: e.target.value })}
                                        className="w-full border-gray-200 rounded-lg py-2 px-3 text-sm"
                                    >
                                        <option value="">Common (University Wide)</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={userDept?.name || 'My Department'}
                                        className="w-full border-gray-200 bg-gray-50 rounded-lg py-2 px-3 text-sm text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cover Image</label>
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-14 bg-gray-100 rounded border overflow-hidden">
                                {albumFormData.coverImage ? <img src={albumFormData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" /> : <PhotoIcon className="w-full h-full p-3 text-gray-300" />}
                            </div>
                            <button type="button" onClick={() => handleOpenLibrary('coverImage')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md">Library</button>
                            <label className="text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded-md cursor-pointer">
                                Upload
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'coverImage')} />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                        <textarea value={albumFormData.description} onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })} rows={3} className="w-full border-gray-200 rounded-lg py-2 px-3 text-sm" placeholder="Optional brief about the album"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <button type="button" onClick={() => setIsAlbumModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" disabled={uploading} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
                            {uploading ? 'Processing...' : (editingAlbumId ? 'Save Changes' : 'Create Album')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ADD MEDIA MODAL */}
            <Modal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                title="Add Item to Album"
                maxWidth="max-w-md"
                zIndex={50}
            >
                <form onSubmit={handleMediaSubmit} className="space-y-4">
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                        <button type="button" onClick={() => setMediaFormData({ ...mediaFormData, type: 'image' })} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mediaFormData.type === 'image' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>PHOTO</button>
                        <button type="button" onClick={() => setMediaFormData({ ...mediaFormData, type: 'video' })} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mediaFormData.type === 'video' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>VIDEO</button>
                    </div>

                    {mediaFormData.type === 'image' ? (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Photo</label>
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-20 bg-gray-100 rounded border overflow-hidden">
                                    {mediaFormData.src ? <img src={mediaFormData.src} alt="Media Preview" className="w-full h-full object-cover" /> : <PhotoIcon className="w-full h-full p-4 text-gray-300" />}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button type="button" onClick={() => handleOpenLibrary('mediaSrc')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-md">From Library</button>
                                    <label className="text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-100 px-4 py-2 rounded-md cursor-pointer text-center">
                                        Upload New
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'mediaSrc')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">YouTube Video URL</label>
                            <input type="url" value={mediaFormData.videoUrl} onChange={(e) => setMediaFormData({ ...mediaFormData, videoUrl: e.target.value })} required className="w-full border-gray-200 rounded-lg py-2 px-3 text-sm" placeholder="https://www.youtube.com/watch?v=..." />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Caption</label>
                        <input type="text" value={mediaFormData.caption} onChange={(e) => setMediaFormData({ ...mediaFormData, caption: e.target.value })} className="w-full border-gray-200 rounded-lg py-2 px-3 text-sm" placeholder="Optional short note" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <button type="button" onClick={() => setIsMediaModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" disabled={!mediaFormData.src && !mediaFormData.videoUrl} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50">
                            Add to Album
                        </button>
                    </div>
                </form>
            </Modal>

            {/* SHARED MEDIA LIBRARY MODAL */}
            <Modal
                isOpen={isLibraryModalOpen}
                onClose={() => setIsLibraryModalOpen(false)}
                title="Media Library"
                maxWidth="max-w-4xl"
                zIndex={60}
            >
                <div className="h-96 overflow-y-auto bg-gray-50 p-4 border rounded-lg">
                    {loadingMedia ? (
                        <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {mediaFiles.map((file, idx) => (
                                <div key={idx} onClick={() => selectFromLibrary(file.url)} className="relative aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:scale-95 transition-all group">
                                    <img src={file.url} alt={`Library item ${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={() => setIsLibraryModalOpen(false)} className="text-sm font-bold text-gray-600 hover:text-gray-800 px-4 py-2 bg-gray-100 rounded">Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default AlbumList;
