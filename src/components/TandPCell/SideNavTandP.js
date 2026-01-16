import React, { useState } from "react";
import PlacementServices from "./CellComponent/PlacementServices";
import TrainingServices from "./CellComponent/TrainingServices";
import Placements from "./CellComponent/Placements";
import MoocCourse from "./CellComponent/MoocCourse";
import Achievements from "./CellComponent/Achievements";
import GateQualified from "./CellComponent/GateQualified"
import Projects from "./CellComponent/Projects";


console.log({
    PlacementServices,
    TrainingServices,
    Placements,
    MoocCourse,
    Achievements,
    GateQualified,
    Projects
});

const SideNavTandP = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const sidebarData = [
        {
            title: "Placement Services",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
            ),
            component: <PlacementServices />,
        },
        {
            title: "Placement Training",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" fill="currentColor">
                    <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z" /></svg>
            ),
            component: <TrainingServices />,
        },
        {
            title: "Placements",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" fill="currentColor">
                    <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z" /></svg>
            ),
            component: <Placements />,
        },
        {
            title: "Mooc Courses",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            ),
            component: <MoocCourse />,
        },
        {
            title: "Project",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
            ),
            component: <Projects />,
        },
        {
            title: "Achievements",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
            ),
            component: <Achievements />,
        },
        {
            title: "Gate Qualified",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
            ),
            component: <GateQualified />,
        },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pt-[80px]">
            {/* Mobile Navigation (Sticky Top) */}
            <div className="md:hidden sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 overflow-x-auto no-scrollbar transition-all duration-300">
                <div className="flex px-4 py-3 gap-3 min-w-max">
                    {sidebarData.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                            ${activeIndex === index
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <span className="w-4 h-4">{item.icon}</span>
                            <span>{item.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Sidebar (Sticky Left) */}
            <aside className="hidden md:block w-72 bg-white border-r border-gray-200 shrink-0 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto z-30">
                <div className="p-6 sticky top-0 bg-white z-10 border-b border-gray-50/50 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                        T&P Cell
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Training & Placement</p>
                </div>

                <div className="p-4 space-y-2">
                    {sidebarData.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm group relative overflow-hidden
                            ${activeIndex === index
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 translate-x-1"
                                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1"
                                }`}
                        >
                            <span className={`p-1 rounded-lg transition-colors duration-200 ${activeIndex === index ? "bg-white/20" : "bg-gray-100 group-hover:bg-blue-100"}`}>
                                {item.icon}
                            </span>
                            <span className="relative z-10">{item.title}</span>

                            {/* Active Indicator Dot */}
                            {activeIndex === index && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 lg:p-10 w-full max-w-[100vw] overflow-hidden">
                <div className="max-w-7xl mx-auto h-full px-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[500px] animate-fade-in-up">
                        <div className="mb-8 pb-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                                    {sidebarData[activeIndex].title}
                                </h1>
                                <p className="text-gray-500 mt-2 font-medium">
                                    Overview and details for {sidebarData[activeIndex].title.toLowerCase()}
                                </p>
                            </div>
                        </div>
                        <div className="prose max-w-none">
                            {sidebarData[activeIndex].component}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SideNavTandP;