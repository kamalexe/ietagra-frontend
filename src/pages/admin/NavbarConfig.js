import React, { useState, useEffect, useRef } from 'react';
import NavbarService from '../../services/NavbarService';
import FileService from '../../services/FileService';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const NavbarConfig = () => {
    const [config, setConfig] = useState({
        logoUrl: '',
        navLinks: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [message, setMessage] = useState(null);
    const [expandedLinks, setExpandedLinks] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await NavbarService.getNavbarConfig();
                if (data) setConfig(data);
            } catch (err) {
                console.error("Failed to load navbar config:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const toggleExpand = (index) => {
        setExpandedLinks(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleTopLinkChange = (index, field, value) => {
        const newLinks = [...config.navLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setConfig({ ...config, navLinks: newLinks });
    };

    const addTopLink = () => {
        setConfig({
            ...config,
            navLinks: [...config.navLinks, { label: '', path: '', dropdownItems: [] }]
        });
    };

    const removeTopLink = (index) => {
        const newLinks = config.navLinks.filter((_, i) => i !== index);
        setConfig({ ...config, navLinks: newLinks });
    };

    const handleDropdownChange = (linkIndex, dropIndex, field, value) => {
        const newLinks = [...config.navLinks];
        const newDropdowns = [...newLinks[linkIndex].dropdownItems];
        newDropdowns[dropIndex] = { ...newDropdowns[dropIndex], [field]: value };
        newLinks[linkIndex].dropdownItems = newDropdowns;
        setConfig({ ...config, navLinks: newLinks });
    };

    const addDropdownItem = (linkIndex) => {
        const newLinks = [...config.navLinks];
        newLinks[linkIndex].dropdownItems = [
            ...(newLinks[linkIndex].dropdownItems || []),
            { label: '', path: '' }
        ];
        setConfig({ ...config, navLinks: newLinks });
    };

    const removeDropdownItem = (linkIndex, dropIndex) => {
        const newLinks = [...config.navLinks];
        newLinks[linkIndex].dropdownItems = newLinks[linkIndex].dropdownItems.filter((_, i) => i !== dropIndex);
        setConfig({ ...config, navLinks: newLinks });
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingLogo(true);
        setMessage(null);
        try {
            const data = await FileService.uploadFile(file);
            if (data && data.url) {
                setConfig(prev => ({ ...prev, logoUrl: data.url }));
                setMessage({ type: 'success', text: 'Logo uploaded successfully!' });
            }
        } catch (err) {
            console.error("Upload error:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to upload logo.' });
        } finally {
            setUploadingLogo(false);
            // Clear the input so the same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await NavbarService.updateNavbarConfig(config);
            setMessage({ type: 'success', text: 'Navbar configuration saved successfully!' });
        } catch (err) {
            console.error("Save error:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to save navbar configuration.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Configuration...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Navbar Configuration</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your website's main navigation structure and branding.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 animate-slide-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-10">
                {/* Brand Logo */}
                <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-900">
                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-xl font-bold">Branding</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Logo URL</label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <div className="flex-1 w-full space-y-2">
                                    <input
                                        type="text"
                                        value={config.logoUrl}
                                        onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                                        placeholder="./images/logo.png"
                                        className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-3 bg-white"
                                    />
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingLogo}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors disabled:opacity-50"
                                        >
                                            <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                                            {uploadingLogo ? 'Uploading...' : 'Upload Image'}
                                        </button>
                                        <p className="text-[10px] text-gray-400">Preferred size: 200x200px. formats: PNG, JPG.</p>
                                    </div>
                                </div>
                                {config.logoUrl && (
                                    <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 shadow-inner p-2 flex items-center justify-center shrink-0 overflow-hidden">
                                        <img src={config.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Links */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-gray-900">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                            <h2 className="text-xl font-bold">Menu Structure</h2>
                        </div>
                        <button
                            type="button"
                            onClick={addTopLink}
                            className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-bold rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            <PlusIcon className="h-4 w-4 mr-1.5 stroke-[3]" /> Add Menu Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {config.navLinks.map((link, index) => (
                            <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 bg-gray-50/50 p-4 border-b border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Label (e.g. Academics)"
                                            value={link.label}
                                            onChange={(e) => handleTopLinkChange(index, 'label', e.target.value)}
                                            className="rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border p-2.5 bg-white font-medium"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Path (e.g. /about)"
                                            value={link.path || ''}
                                            disabled={link.dropdownItems && link.dropdownItems.length > 0}
                                            onChange={(e) => handleTopLinkChange(index, 'path', e.target.value)}
                                            className={`rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border p-2.5 bg-white ${link.dropdownItems && link.dropdownItems.length > 0 ? 'opacity-50 cursor-not-allowed italic' : ''}`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(index)}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Manage Dropdown"
                                        >
                                            {expandedLinks[index] ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeTopLink(index)}
                                            className="p-2 text-red-400 hover:text-red-700 transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown Items Manager */}
                                {expandedLinks[index] && (
                                    <div className="p-6 bg-white animate-fade-in">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest">Dropdown Items</h4>
                                            <button
                                                type="button"
                                                onClick={() => addDropdownItem(index)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <PlusIcon className="h-3 w-3 stroke-[3]" /> Add Sub-Item
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {(link.dropdownItems || []).map((dropItem, dropIndex) => (
                                                <div key={dropIndex} className="flex gap-3 items-center group">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200 shrink-0"></div>
                                                    <input
                                                        type="text"
                                                        placeholder="Sub-menu Label"
                                                        value={dropItem.label}
                                                        onChange={(e) => handleDropdownChange(index, dropIndex, 'label', e.target.value)}
                                                        className="flex-1 rounded-xl border-gray-100 text-sm border p-2 focus:ring-1 focus:ring-blue-500 bg-white"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Sub-menu Path"
                                                        value={dropItem.path}
                                                        onChange={(e) => handleDropdownChange(index, dropIndex, 'path', e.target.value)}
                                                        className="flex-1 rounded-xl border-gray-100 text-sm border p-2 focus:ring-1 focus:ring-blue-500 bg-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDropdownItem(index, dropIndex)}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!link.dropdownItems || link.dropdownItems.length === 0) && (
                                                <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                    No sub-menu items. This is a single link.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </form>

            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default NavbarConfig;
