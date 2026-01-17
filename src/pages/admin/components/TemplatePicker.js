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
            key: 'design_three',
            name: 'Colored Cards Grid',
            description: 'Two-column colored cards with icons.',
            demoData: {
                items: [
                    { title: "Vision", content: "To be a center of excellence...", icon: "FaEye", colorTheme: "green" },
                    { title: "Mission", content: "To provide quality education...", icon: "FaBullseye", colorTheme: "teal" }
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
            key: 'design_five',
            name: 'SWOT Analysis',
            description: 'Strengths, Weaknesses, Opportunities, Threats display.',
            demoData: {
                title: "Department SWOT",
                description: "Analysis of our current standing.",
                swotData: {
                    strengths: ["Experienced Faculty", "Modern Labs"],
                    weaknesses: ["Limited Space"],
                    opportunities: ["Industry Collaboration"],
                    threats: ["Growing Competition"]
                }
            }
        },
        {
            key: 'design_six',
            name: 'Gradient Feature Grid',
            description: 'Dark gradient background with white transparent cards.',
            demoData: {
                title: "Why Choose Us?",
                items: [
                    { title: "Excellence", description: "Top notch quality.", icon: "FaAward" },
                    { title: "Innovation", description: "Cutting edge tech.", icon: "FaLightbulb" },
                    { title: "Community", description: "Strong alumni network.", icon: "FaUsers" }
                ]
            }
        },
        {
            key: 'design_seven',
            name: 'Tabs Component',
            description: 'Tabbed interface for organizing content.',
            demoData: {
                tabs: [
                    {
                        id: "tab1",
                        label: "Overview",
                        icon: "FaInfoCircle",
                        sections: [
                            {
                                id: "inner-1",
                                templateKey: "design_one",
                                data: { title: "Overview Content", variant: "simple", description: "This is inside a tab." }
                            }
                        ]
                    },
                    {
                        id: "tab2",
                        label: "Details",
                        icon: "FaList",
                        sections: []
                    }
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
        {
            key: 'design_ten',
            name: 'Icon Features (Top)',
            description: 'Clean grid with icons on top of cards.',
            demoData: {
                title: "Our Core Values",
                description: "What drives us forward.",
                features: [
                    { title: "Integrity", description: "Honesty in all we do.", icon: "🛡️" },
                    { title: "Quality", description: "Pursuit of excellence.", icon: "⭐" },
                    { title: "Growth", description: "Continuous improvement.", icon: "📈" }
                ]
            }
        },
        {
            key: 'design_eleven',
            name: 'Split Feature (Text/Image)',
            description: 'Side-by-side text and image section.',
            demoData: {
                title: "About The Department",
                description: "Detailed description of the department's history and achievements.",
                image: "https://via.placeholder.com/600x400",
                buttonText: "Learn More",
                buttonLink: "#",
                reverse: false
            }
        },
        {
            key: 'design_twelve',
            name: 'Faculty Grid (Detailed)',
            description: 'Detailed cards for faculty or team members with achievements.',
            demoData: {
                title: "Our Faculty",
                items: [
                    {
                        name: "Er. Subodh Sharma",
                        designation: "Assistant Professor",
                        specialization: "Data Structures, JAVA",
                        email: "faculty@ietagra.ac.in",
                        image: "/images/subodh.jpg",
                        achievements: ["M.Tech. qualified faculty"],
                        totalAchievements: 1
                    },
                    {
                        name: "Er. Saurabh Garg",
                        designation: "Assistant Professor",
                        specialization: "Digital Electronics",
                        email: "faculty@ietagra.ac.in",
                        image: "/images/saurabh.png",
                        achievements: ["Has qualified GATE five times"],
                        totalAchievements: 1
                    },
                    {
                        name: "Er. Prashant Maharishi",
                        designation: "Assistant Professor",
                        specialization: "DBMS",
                        email: "faculty@ietagra.ac.in",
                        image: "/images/Prashant.png",
                        achievements: ["Participated in EBOOTATHAN (2021)"],
                        totalAchievements: 3
                    }
                ]
            }
        },
        {
            key: 'design_thirteen',
            name: 'Departments Grid',
            description: 'Grid of departmental cards with icons and gradients.',
            demoData: {
                title: "Our Departments",
                items: [
                    {
                        title: "Computer Science & Engineering",
                        description: "Master programming, algorithms, AI and software development with modern computing infrastructure.",
                        link: "/departments/cse",
                        icon: "💻",
                        gradient: "from-green-500 to-emerald-400"
                    },
                    {
                        title: "Electronics Engineering",
                        description: "Learn about circuits, devices, and communication systems with cutting-edge technology.",
                        link: "/departments/ece",
                        icon: "🔌",
                        gradient: "from-red-500 to-pink-500"
                    },
                    {
                        title: "Electrical Engineering",
                        description: "Dive into the study of electricity, power systems, and electronics with hands-on projects.",
                        link: "/departments/ee",
                        icon: "⚡",
                        gradient: "from-purple-500 to-indigo-500"
                    },
                    {
                        title: "Civil Engineering",
                        description: "Design and build the infrastructure of tomorrow with sustainable practices.",
                        link: "/departments/civil",
                        icon: "🏗️",
                        gradient: "from-teal-500 to-cyan-400"
                    },
                    {
                        title: "Mechanical Engineering",
                        description: "Explore the world of machines, thermodynamics, and manufacturing.",
                        link: "/departments/me",
                        icon: "🔧",
                        gradient: "from-blue-500 to-cyan-400"
                    },
                    {
                        title: "Applied Science and Mathematics",
                        description: "Strengthen your foundation in mathematics and science.",
                        link: "/departments/asm",
                        icon: "📐",
                        gradient: "from-yellow-500 to-orange-400"
                    }
                ]
            }
        },
        {
            key: 'design_fourteen',
            name: 'Feature Grid (2 Cols)',
            description: 'Two column features with icons and gradients, supports external links.',
            demoData: {
                title: "Training & Placement and Clubs",
                items: [
                    {
                        title: "Training & Placement Cell",
                        description: "Enhance your employability with our dedicated training programs, workshops, and placement assistance.",
                        link: "/tnpcell",
                        icon: "📈",
                        gradient: "from-yellow-500 to-orange-400",
                        target: "_blank"
                    },
                    {
                        title: "IET Club Nest",
                        description: "Join our vibrant student clubs to explore your interests, develop skills, and make lasting friendships.",
                        link: "https://ietclubnest.vercel.app/",
                        icon: "🎉",
                        gradient: "from-pink-500 to-red-400",
                        target: "_blank"
                    }
                ]
            }
        },
        {
            key: 'design_fifteen',
            name: 'Image Carousel',
            description: 'Full-width auto-playing image slider with captions.',
            demoData: {
                title: "Campus Tour",
                items: [
                    {
                        image: "/images/building2.jpg",
                        title: "IET Agra Campus",
                        description: "Explore our beautiful campus"
                    },
                    {
                        image: "/images/college_tour.jpg",
                        title: "College Tour",
                        description: "Students on a college tour"
                    },
                    {
                        image: "/images/college_teachers.png",
                        title: "Faculty Members",
                        description: "Dedicated faculty members"
                    }
                ]
            },
        },
        {
            key: 'design_sixteen',
            name: 'Student Projects Table',
            description: 'Table listing student projects with details and links.',
            demoData: {
                title: "Student Projects",
                description: "List of major projects by final year students.",
                projects: [
                    {
                        batch: "2024",
                        studentName: "John Doe",
                        projectName: "AI Chatbot",
                        technology: "Python, NLP",
                        branch: "CSE",
                        supervisor: "Dr. Smith",
                        githubLink: "https://github.com",
                        pptLink: "https://google.com"
                    },
                    {
                        batch: "2024",
                        studentName: "Jane Smith",
                        projectName: "Smart Grid",
                        technology: "IoT, Arduino",
                        branch: "EE",
                        supervisor: "Prof. Johnson",
                        githubLink: "#",
                        pptLink: "#"
                    }
                ]
            }
        },
        {
            key: 'design_seventeen',
            name: 'GATE Qualified Table',
            description: 'Dedicated table for GATE Qualified student records.',
            demoData: {
                title: "GATE Qualifiers",
                description: "List of students who qualified GATE."
            }
        }
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
