import React, { useState, useEffect } from 'react';
import GalleryConfigService from '../../services/GalleryConfigService';
import UploadService from '../../services/UploadService';
import { toast } from 'react-hot-toast';

const GalleryPageConfig = () => {
    const [config, setConfig] = useState({
        heroTitle: '',
        heroTitleHighlight: '',
        heroSubtitle: '',
        heroBackgroundImage: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const data = await GalleryConfigService.getConfig();
            setConfig(data);
        } catch (error) {
            toast.error("Failed to load config");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await UploadService.uploadFile(file);
            // UploadService returns the file object which has a url property
            if (data && data.url) {
                setConfig(prev => ({ ...prev, heroBackgroundImage: data.url }));
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Upload successful but no URL returned");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await GalleryConfigService.updateConfig(config);
            toast.success("Gallery configuration updated!");
        } catch (error) {
            toast.error("Failed to update config");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading configuration...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gallery Page Configuration</h1>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Main Title</label>
                        <input
                            type="text"
                            name="heroTitle"
                            value={config.heroTitle}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="e.g. University Media Gallery"
                        />
                        <p className="text-xs text-gray-500 mt-1">The main heading text.</p>
                    </div>

                    {/* Highlight */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title Highlight Text</label>
                        <input
                            type="text"
                            name="heroTitleHighlight"
                            value={config.heroTitleHighlight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="e.g. Media Gallery"
                        />
                        <p className="text-xs text-gray-500 mt-1">This part of the title will be colored differently (indigo).</p>
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle / Description</label>
                        <textarea
                            name="heroSubtitle"
                            value={config.heroSubtitle}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Subtext below the main title..."
                        />
                    </div>

                    {/* Background Image */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">Background Image</label>

                        {/* File Upload */}
                        <div className="flex items-center gap-4">
                            <label className={`flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            Upload New Image
                                        </>
                                    )}
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <span className="text-xs text-gray-500">OR paste URL directly below</span>
                        </div>

                        <input
                            type="text"
                            name="heroBackgroundImage"
                            value={config.heroBackgroundImage}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Preview */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Live Preview (Approximate)</label>
                        <div className="relative h-64 rounded-xl overflow-hidden bg-gray-900 flex flex-col items-center justify-center text-center px-4">
                            <div className="absolute inset-0 opacity-40">
                                <img
                                    src={config.heroBackgroundImage || 'https://via.placeholder.com/1920x600'}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                />
                            </div>
                            <div className="relative z-10">
                                <h1 className="text-3xl font-black text-white mb-2">
                                    {config.heroTitle?.replace(config.heroTitleHighlight, '')} <span className="text-indigo-400">{config.heroTitleHighlight}</span>
                                </h1>
                                <p className="text-gray-200 max-w-lg mx-auto">{config.heroSubtitle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : 'Save Configuration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GalleryPageConfig;
