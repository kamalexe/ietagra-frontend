import React, { useState, useEffect } from "react";
import PageService from "../../services/PageService";
import SectionRegistry from "../PageBuilder/SectionRegistry";
import * as FaIcons from 'react-icons/fa';

const SideNavTandP = () => {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [sidebarData, setSidebarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const pageData = await PageService.getPageBySlug('tandpcell');
                if (pageData && pageData.sections) {
                    const mappedData = pageData.sections
                        .filter(section => section.visible) // Only show visible sections
                        .sort((a, b) => a.order - b.order)
                        .map(section => {
                            // Resolve icon
                            let IconComponent = null;
                            if (section.data.sidebarIcon && FaIcons[section.data.sidebarIcon]) {
                                IconComponent = FaIcons[section.data.sidebarIcon];
                            } else {
                                IconComponent = FaIcons['FaInfoCircle']; // Default icon
                            }

                            // Resolve Component
                            const SectionComponent = SectionRegistry[section.templateKey];

                            return {
                                title: section.data.sidebarTitle || section.title,
                                icon: <IconComponent className="w-5 h-5" />,
                                component: SectionComponent ? <SectionComponent {...section.data} /> : <div>Component Not Found</div>
                            };
                        });

                    setSidebarData(mappedData);
                    if (mappedData.length > 0) {
                        setSelectedComponent(mappedData[0].component);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch T&P cell data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);

    const handleItemClick = (index) => {
        if (sidebarData[index]) {
            setSelectedComponent(sidebarData[index].component);
            setActiveIndex(index);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Training & Placement Cell...</div>;
    }

    return (
        <section className="bg-white dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-gray-50 rounded-lg p-2 sticky top-4 border border-gray-100">
                            {sidebarData.length > 0 ? (
                                <ul className="space-y-1">
                                    {sidebarData.map((item, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleItemClick(index)}
                                            className={`cursor-pointer px-4 py-3 rounded-md transition-all duration-200 flex items-center ${activeIndex === index
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "text-gray-700 hover:bg-white hover:shadow-sm hover:text-blue-600"
                                                }`}
                                        >
                                            <div className="mr-3 flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <span className="font-medium">{item.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 bg-gray-100 rounded text-sm text-gray-500 text-center">
                                    No sections found.<br />
                                    <span className="text-xs">Configure "tandpcell" in Admin.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-0 overflow-hidden min-h-[500px]">
                        {/* We wrapped it in a nice container style */}
                        {selectedComponent ? (
                            <div className="animate-fadeIn">
                                {selectedComponent}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Select a tab to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Simple inline animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

export default SideNavTandP;