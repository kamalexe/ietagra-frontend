import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SectionRegistry from '../../../components/PageBuilder/SectionRegistry';

const TemplatePicker = ({ onClose, onSelect }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const templates = [
        {
            key: 'design_one',
            variant: 'hero',
            name: 'Hero Banner',
            description: 'Full-width banner with background image, title, and buttons.',
            demoData: {
                title: "Institute of Engineering & Technology",
                description: "Dr. B. R. Ambedkar University, Agra",
                variant: "hero",
                buttons: [{ text: "Explore", link: "#", primary: true }]
            }
        },
        {
            key: 'design_one',
            variant: 'simple',
            name: 'Simple Title & Text',
            description: 'Centered heading with description text.',
            demoData: {
                title: "About Us",
                badge: "Info",
                description: "Brief introduction to the section content.",
                variant: "simple"
            }
        },
        {
            key: 'design_two',
            name: 'Features Grid (3 Cols)',
            description: 'Grid of cards with icons and descriptions.',
            demoData: {
                items: [
                    { title: "Feature 1", description: "Description 1", icon: "FaStar" },
                    { title: "Feature 2", description: "Description 2", icon: "FaHeart" },
                    { title: "Feature 3", description: "Description 3", icon: "FaBolt" }
                ]
            }
        },
        {
            key: 'design_four',
            name: 'Faculty / Team Grid',
            description: 'Cards with circular photos for team members.',
            demoData: {
                title: "Our Team",
                items: [
                    { name: "Dr. Smith", position: "Professor", image: "https://via.placeholder.com/150" },
                    { name: "Prof. Doe", position: "HOD", image: "https://via.placeholder.com/150" }
                ]
            }
        },
        {
            key: 'design_eight',
            name: 'Carousel & Content',
            description: 'Split view with image slider and detailed content.',
            demoData: {
                title: "Infrastructure",
                content: "State of the art labs and classrooms.",
                images: [{ src: "https://via.placeholder.com/400" }]
            }
        },
        {
            key: 'design_nine',
            name: 'News / Publications',
            description: 'List views for events, news, or publications.',
            demoData: {
                title: "Recent News",
                items: [
                    { title: "Event One", description: "Details about event.", date: "Jan 10" },
                    { title: "Publication", description: "Research paper published.", date: "Feb 15" }
                ]
            }
        },
    ];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % templates.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
    };

    const currentTemplate = templates[currentIndex];
    const Component = SectionRegistry[currentTemplate.key];

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Enter') onSelect(currentTemplate.key, currentTemplate.variant, currentTemplate.demoData);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, currentTemplate]); // Re-bind when index changes to capture current state if needed, though simpler ref usage is also possible.

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="inline-block bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all align-middle sm:max-w-5xl sm:w-full relative">

                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                                Select Component ({currentIndex + 1}/{templates.length})
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{currentTemplate.name} - {currentTemplate.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            type="button"
                            className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            title="Close (Esc)" // Accessible hint
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Carousel Body */}
                    <div className="relative bg-gray-100 h-[60vh] flex items-center justify-center p-8 overflow-hidden group">

                        {/* Prev Button */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 z-20 p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition-all border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60 group-hover:opacity-100"
                            title="Previous (Left Arrow)"
                        >
                            <ChevronLeftIcon className="h-8 w-8" />
                        </button>

                        {/* Preview Container */}
                        <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-xl overflow-y-auto border border-gray-200 relative scrollbar-hide">
                            {/* Interaction Shield - prevents clicking inside the preview */}
                            <div className="absolute inset-0 z-10 bg-transparent cursor-default"></div>

                            {/* Rendered Component - Scaled Up for single view */}
                            <div className="transform origin-top-left scale-[0.6] sm:scale-[0.85] w-[166%] sm:w-[117%] h-full p-4 pointer-events-none select-none">
                                {Component ? (
                                    <Component {...currentTemplate.demoData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">Preview Not Available</div>
                                )}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 z-20 p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition-all border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60 group-hover:opacity-100"
                            title="Next (Right Arrow)"
                        >
                            <ChevronRightIcon className="h-8 w-8" />
                        </button>
                    </div>

                    {/* Footer / Controls */}
                    <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        {/* Indicators */}
                        <div className="flex space-x-2">
                            {templates.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                                    title={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        {/* Confirm Action */}
                        <button
                            onClick={() => onSelect(currentTemplate.key, currentTemplate.variant, currentTemplate.demoData)}
                            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Use This Template
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TemplatePicker;
