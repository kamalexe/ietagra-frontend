import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import PageService from '../../services/PageService';

const PagesList = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            const data = await PageService.getAllPages();
            setPages(data || []);
        } catch (error) {
            console.error("Failed to load pages", error);
        } finally {
            setLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPage, setNewPage] = useState({ title: '', slug: '' });
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePage = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        // Simple slug generation if not provided or cleanup
        const slug = newPage.slug || newPage.title.toLowerCase().replace(/\s+/g, '-');

        try {
            const pageData = {
                title: newPage.title,
                slug: slug,
                sections: []
            };

            await PageService.createPage(pageData);
            await loadPages(); // Reload list

            setIsModalOpen(false);
            setNewPage({ title: '', slug: '' });
            alert('Page created successfully!');
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeletePage = async (slug) => {
        if (window.confirm('Are you sure you want to delete this page?')) {
            try {
                await PageService.deletePage(slug);
                setPages(pages.filter(p => p.slug !== slug));
            } catch (error) {
                alert('Failed to delete page');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage all static and dynamic pages of the website.</p>
                </div>
                {user && user.role === 'admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Create New Page
                    </button>
                )}
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title / Slug
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Modified
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pages.map((page) => (
                            <tr key={page._id || page.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                                            <DocumentTextIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{page.title}</div>
                                            <div className="text-sm text-gray-500">/{page.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {page.status || 'draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-3">
                                        <Link to={`/admin/pages/${encodeURIComponent(page.slug)}`} className="text-blue-600 hover:text-blue-900" title="Edit Content">
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </Link>
                                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600" title="View Live">
                                            <EyeIcon className="h-5 w-5" />
                                        </a>
                                        {user && user.role === 'admin' && (
                                            <button onClick={() => handleDeletePage(page.slug)} className="text-red-400 hover:text-red-600" title="Delete">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Page Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button onClick={() => setIsModalOpen(false)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start w-full">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Create New Page
                                    </h3>
                                    <form onSubmit={handleCreatePage} className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Page Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                value={newPage.title}
                                                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Slug (URL Path)</label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                    /
                                                </span>
                                                <input
                                                    type="text"
                                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                                                    placeholder="e.g. contact-us"
                                                    value={newPage.slug}
                                                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">Leave blank to generate from title.</p>
                                        </div>
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                disabled={isCreating}
                                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${isCreating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                                            >
                                                {isCreating ? 'Creating...' : 'Create Page'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagesList;
