import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Bars3Icon,
    PencilIcon,
    EyeIcon,
    EyeSlashIcon,
    TrashIcon,
    PlusIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import PageService from '../../services/PageService';
import TemplatePicker from './components/TemplatePicker';
import SectionForm from './components/SectionForm';

// Mock initial data
const PageBuilder = ({ slug: propSlug }) => { // Accept slug as prop
    const params = useParams();
    const slug = propSlug || params.slug; // Use prop if available, else param
    const [sections, setSections] = useState([]);
    const [pageTitle, setPageTitle] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('draft');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null); // eslint-disable-line no-unused-vars
    const [notification, setNotification] = useState(null); // { message, type }

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const pageData = await PageService.getPageBySlug(slug);
                if (pageData) {
                    setSections(pageData.sections || []);
                    setPageTitle(pageData.title || slug);
                    setStatus(pageData.status || 'draft');
                }
            } catch (err) {
                console.error("Failed to fetch page:", err);
                setError("Page not found or failed to load. You might be creating a new page.");
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSections(items);
    };

    const toggleVisibility = (id) => {
        setSections(sections.map(sec =>
            sec.id === id ? { ...sec, visible: !sec.visible } : sec
        ));
    };

    const deleteSection = (e, id) => {
        e.stopPropagation();
        console.log('Attempting to delete section:', id);
        // Temporary bypass confirm for debugging
        // if (window.confirm('Are you sure you want to delete this section?')) {
        const sectionExists = sections.some(sec => sec.id === id);
        console.log('Section exists in state checking:', sectionExists);

        const newSections = sections.filter(sec => sec.id !== id);
        console.log('Sections before:', sections.length, 'After:', newSections.length);
        setSections(newSections);
    // }
    };

    const handleAddSection = (templateKey, variant = null, initialData = {}) => {
        const newSection = {
            id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            templateKey,
            title: templateKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) + (variant ? ` (${variant})` : ''),
            visible: true,
            data: { ...initialData, variant: variant || initialData.variant }
        };
        setSections([...sections, newSection]);
        setIsPickerOpen(false);
    };

    const handleSaveSection = (id, newData) => {
        setSections(sections.map(sec =>
            sec.id === id ? { ...sec, data: newData } : sec
        ));
        setEditingSection(null);
    };

    const handleSavePage = async () => {
        setIsSaving(true);
        try {
            // In a real app, you might want to validate or format data before saving
            const pageData = {
                title: pageTitle || slug,
                slug: slug,
                sections: sections,
                status: status
            };

            await PageService.updatePage(slug, pageData);
            showToast('Page saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save page:', error);
            showToast('Failed to save page. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center">Loading page...</div>;

    return (
        <div className="h-full flex flex-col relative">
            {/* Toast Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg transform transition-all duration-300 ease-in-out flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link to="/admin/pages" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                        <ChevronLeftIcon className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editing: {slug}</h1>
                        <p className="text-sm text-gray-500">Drag to reorder sections</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-4">
                        <button
                            onClick={() => setStatus('draft')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${status === 'draft'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Draft
                        </button>
                        <button
                            onClick={() => setStatus('published')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${status === 'published'
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Published
                        </button>
                    </div>
                    <button
                        onClick={() => window.open(`/${slug}`, '_blank')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Preview
                    </button>
                    <button
                        onClick={handleSavePage}
                        disabled={isSaving}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Builder Playground */}
            <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 overflow-y-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="builder-sections">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4 max-w-3xl mx-auto"
                            >
                                {sections.map((section, index) => (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`bg-white rounded-lg shadow-sm border ${snapshot.isDragging ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} p-4 flex items-center justify-between group transition-all`}
                                                style={{ ...provided.draggableProps.style }}
                                            >
                                                <div className="flex items-center flex-1">
                                                    <div {...provided.dragHandleProps} className="mr-4 text-gray-400 hover:text-gray-600 cursor-move">
                                                        <Bars3Icon className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                                                        <p className="text-xs text-gray-500 font-mono mt-0.5">{section.templateKey}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => toggleVisibility(section.id)}
                                                        className={`p-1.5 rounded-md hover:bg-gray-100 ${section.visible ? 'text-gray-400 hover:text-gray-600' : 'text-orange-400 bg-orange-50'}`}
                                                        title={section.visible ? "Hide Section" : "Show Section"}
                                                    >
                                                        {section.visible ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSection(section)}
                                                        className="p-1.5 rounded-md hover:bg-gray-100 text-blue-600 hover:text-blue-800"
                                                        title="Edit Content"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => deleteSection(e, section.id)}
                                                        className="p-1.5 rounded-md hover:bg-red-50 text-red-400 hover:text-red-600"
                                                        title="Delete Section"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                {/* Add Section Button */}
                                <button
                                    onClick={() => setIsPickerOpen(true)}
                                    className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center"
                                >
                                    <PlusIcon className="h-8 w-8 mb-2" />
                                    <span className="font-medium">Add New Section</span>
                                </button>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Modals/Drawers */}
            {isPickerOpen && (
                <TemplatePicker currentSlug={slug} onClose={() => setIsPickerOpen(false)} onSelect={handleAddSection} />
            )}

            {editingSection && (
                <SectionForm
                    section={editingSection}
                    onClose={() => setEditingSection(null)}
                    onSave={handleSaveSection}
                />
            )}
        </div>
    );
};

export default PageBuilder;