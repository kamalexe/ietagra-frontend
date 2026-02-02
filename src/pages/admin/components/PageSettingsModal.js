import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';

const PageSettingsModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                metaTitle: initialData.metaTitle || '',
                metaDescription: initialData.metaDescription || '',
                metaKeywords: initialData.metaKeywords || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Page Settings" maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Page Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="e.g. About Us"
                    />
                    <p className="mt-1 text-xs text-gray-500">Internal title for the page.</p>
                </div>

                <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">SEO Configuration</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                name="metaTitle"
                                id="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Displayed in search results and browser tab"
                            />
                        </div>

                        <div>
                            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                                Meta Description
                            </label>
                            <textarea
                                name="metaDescription"
                                id="metaDescription"
                                rows={3}
                                value={formData.metaDescription}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Brief summary of the page content for search engines"
                            />
                        </div>

                        <div>
                            <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700">
                                Meta Keywords
                            </label>
                            <input
                                type="text"
                                name="metaKeywords"
                                id="metaKeywords"
                                value={formData.metaKeywords}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Comma separated keywords e.g. college, admission, agra"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PageSettingsModal;
