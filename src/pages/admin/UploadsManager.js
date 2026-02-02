import React, { useState, useEffect } from 'react';
import { 
    CloudArrowUpIcon, 
    TrashIcon, 
    DocumentIcon, 
    ClipboardDocumentCheckIcon, 
    ClipboardDocumentIcon 
} from '@heroicons/react/24/outline';
import UploadService from '../../services/UploadService';

const UploadsManager = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const data = await UploadService.getFiles();
            setFiles(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load files:", err);
            setError('Failed to load files. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await UploadService.uploadFile(file);
            showNotification('File uploaded successfully');
            fetchFiles(); // Refresh list
        } catch (err) {
            console.error("Upload failed:", err);
            showNotification(err.message || 'Failed to upload file', 'error');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
            return;
        }

        try {
            await UploadService.deleteFile(publicId);
            showNotification('File deleted successfully');
            setFiles(files.filter(f => f.filename !== publicId));
        } catch (err) {
            console.error("Delete failed:", err);
            showNotification(err.message || 'Failed to delete file', 'error');
        }
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        showNotification('URL copied to clipboard');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Uploads Manager</h1>
                    <p className="text-sm text-gray-500">Manage your uploaded images and documents</p>
                </div>
                <div>
                    <label 
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <CloudArrowUpIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Upload New File
                            </>
                        )}
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleFileUpload} 
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <span>{notification.message}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 p-4 rounded-md mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="spinner">Loading...</div>
                </div>
            ) : files.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by uploading a new file.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {files.map((file) => (
                        <div key={file.filename} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-w-10 aspect-h-7 bg-gray-100 relative">
                                {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <img 
                                        src={file.url} 
                                        alt={file.filename} 
                                        className="object-cover w-full h-48"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-48">
                                        <DocumentIcon className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100 space-x-2">
                                    <button 
                                        onClick={() => window.open(file.url, '_blank')}
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-sm"
                                        title="View File"
                                    >
                                        <DocumentIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-gray-500 truncate mb-1" title={file.filename}>{file.filename}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <button 
                                        onClick={() => copyToClipboard(file.url)}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                                        Copy Link
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(file.filename)}
                                        className="text-gray-400 hover:text-red-600"
                                        title="Delete File"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadsManager;
