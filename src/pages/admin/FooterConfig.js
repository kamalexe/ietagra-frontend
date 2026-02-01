import React, { useState, useEffect } from 'react';
import FooterService from '../../services/FooterService';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const FooterConfig = () => {
    const [config, setConfig] = useState({
        institute: { name: '', subtitle: '', logoUrl: '' },
        contact: { address: '', email: '', phone: '' },
        usefulLinks: [],
        helpLinks: [],
        socialMedia: [],
        credits: { text: '', heartColor: '' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await FooterService.getFooterConfig();
                if (data) setConfig(data);
            } catch (err) {
                console.error("Failed to load footer config:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e, section, field) => {
        setConfig({
            ...config,
            [section]: {
                ...config[section],
                [field]: e.target.value
            }
        });
    };

    const handleArrayChange = (index, field, value, arrayName) => {
        const newArray = [...config[arrayName]];
        newArray[index] = { ...newArray[index], [field]: value };
        setConfig({ ...config, [arrayName]: newArray });
    };

    const addItem = (arrayName, template) => {
        setConfig({ ...config, [arrayName]: [...config[arrayName], template] });
    };

    const removeItem = (index, arrayName) => {
        const newArray = config[arrayName].filter((_, i) => i !== index);
        setConfig({ ...config, [arrayName]: newArray });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await FooterService.updateFooterConfig(config);
            setMessage({ type: 'success', text: 'Footer configuration saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save changes.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Footer Configuration</h1>
            
            {message && (
                <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Institute Info */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Institute Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Institute Name</label>
                            <input 
                                type="text" 
                                value={config.institute.name}
                                onChange={(e) => handleChange(e, 'institute', 'name')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                            <input 
                                type="text" 
                                value={config.institute.subtitle}
                                onChange={(e) => handleChange(e, 'institute', 'subtitle')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700">Logo URl (Relative or Absolute)</label>
                            <input 
                                type="text" 
                                value={config.institute.logoUrl}
                                onChange={(e) => handleChange(e, 'institute', 'logoUrl')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea 
                                value={config.contact.address}
                                onChange={(e) => handleChange(e, 'contact', 'address')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="text" 
                                value={config.contact.email}
                                onChange={(e) => handleChange(e, 'contact', 'email')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input 
                                type="text" 
                                value={config.contact.phone}
                                onChange={(e) => handleChange(e, 'contact', 'phone')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>
                </section>

                {/* Useful Links */}
                <section>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-semibold">Useful Links</h2>
                        <button 
                            type="button" 
                            onClick={() => addItem('usefulLinks', { name: '', href: '' })}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" /> Add Link
                        </button>
                    </div>
                    {config.usefulLinks.map((link, index) => (
                        <div key={index} className="flex gap-4 mb-2 items-start">
                            <input 
                                type="text" 
                                placeholder="Link Name"
                                value={link.name}
                                onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'usefulLinks')}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                            <input 
                                type="text" 
                                placeholder="URL"
                                value={link.href}
                                onChange={(e) => handleArrayChange(index, 'href', e.target.value, 'usefulLinks')}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                            <button 
                                type="button" 
                                onClick={() => removeItem(index, 'usefulLinks')}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </section>

                 {/* Help Links */}
                 <section>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-semibold">Help Links</h2>
                        <button 
                            type="button" 
                            onClick={() => addItem('helpLinks', { name: '', href: '' })}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" /> Add Link
                        </button>
                    </div>
                    {config.helpLinks.map((link, index) => (
                        <div key={index} className="flex gap-4 mb-2 items-start">
                            <input 
                                type="text" 
                                placeholder="Link Name"
                                value={link.name}
                                onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'helpLinks')}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                            <input 
                                type="text" 
                                placeholder="URL"
                                value={link.href}
                                onChange={(e) => handleArrayChange(index, 'href', e.target.value, 'helpLinks')}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                            <button 
                                type="button" 
                                onClick={() => removeItem(index, 'helpLinks')}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </section>

                {/* Social Media */}
                <section>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-semibold">Social Media</h2>
                         <button 
                            type="button" 
                            onClick={() => addItem('socialMedia', { platform: '', url: '' })}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" /> Add Social
                        </button>
                    </div>
                     {config.socialMedia.map((item, index) => (
                        <div key={index} className="flex gap-4 mb-2 items-start">
                             <select
                                value={item.platform}
                                onChange={(e) => handleArrayChange(index, 'platform', e.target.value, 'socialMedia')}
                                className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                             >
                                <option value="Facebook">Facebook</option>
                                <option value="Twitter">Twitter</option>
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Discord">Discord</option>
                                <option value="Github">Github</option>
                                <option value="YouTube">YouTube</option>
                             </select>
                            <input 
                                type="text" 
                                placeholder="Profile URL"
                                value={item.url}
                                onChange={(e) => handleArrayChange(index, 'url', e.target.value, 'socialMedia')}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                            <button 
                                type="button" 
                                onClick={() => removeItem(index, 'socialMedia')}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </section>

                {/* Credits */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Credits & Branding</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Footer Credits Text</label>
                            <input 
                                type="text" 
                                value={config.credits.text}
                                onChange={(e) => handleChange(e, 'credits', 'text')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-5">
                    <button
                        type="submit"
                        disabled={saving}
                        className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FooterConfig;
