import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import FacultyService from '../../../services/FacultyService';

const DesignTwelve = ({ id, title, items: initialItems = [], departmentId }) => {
    const [items, setItems] = useState(initialItems);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If no items provided manually, and we have a departmentId, fetch dynamically
        if ((!initialItems || initialItems.length === 0) && departmentId) {
            const fetchFaculty = async () => {
                setLoading(true);
                try {
                    const facultyData = await FacultyService.getPublicFacultyByDepartment(departmentId);
                    // Map backend faculty model to the structure expected by DesignTwelve
                    const formattedFaculty = facultyData.map(f => ({
                        name: f.name,
                        designation: f.designation,
                        specialization: f.specialization,
                        email: f.email,
                        image: f.image,
                        achievements: f.achievements || [],
                        totalAchievements: f.achievements ? f.achievements.length : 0
                    }));
                    setItems(formattedFaculty);
                } catch (error) {
                    console.error("DesignTwelve: Failed to fetch faculty", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchFaculty();
        } else {
            setItems(initialItems);
        }
    }, [initialItems, departmentId]);

    if (loading) {
        return (
            <div id={id} className="py-20 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section id={id} className="container mx-auto max-w-7xl px-4 py-12">
             {title && (
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {items && items.length > 0 ? (
                    items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100 hover:border-blue-200 transition-all flex flex-col h-full hover:shadow-lg"
                        >
                            <div className="flex flex-col items-center text-center flex-grow">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 mb-4 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-white ring-2 ring-blue-100">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{item.name?.charAt(0)}</span>
                                    )}
                                </div>

                                <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h4>

                                {item.designation && (
                                    <p className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full inline-block">
                                        {item.designation}
                                    </p>
                                )}

                                {item.specialization && (
                                    <p className="text-gray-600 text-sm mt-2 italic">{item.specialization}</p>
                                )}

                                {item.email && (
                                    <p className="mt-2 text-sm text-blue-500 hover:underline flex items-center justify-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <a href={`mailto:${item.email}`}>{item.email}</a>
                                    </p>
                                )}

                                {(item.achievements?.length > 0) && (
                                    <div className="mt-4 text-left w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 flex-grow">
                                        <h5 className="font-medium text-gray-700 text-sm mb-2 border-b border-gray-200 pb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                            </svg>
                                            Achievements:
                                        </h5>
                                        <ul className="space-y-2">
                                            {item.achievements.slice(0, 2).map((ach, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                                                    <span className="text-sm text-gray-600">{ach}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {item.totalAchievements > 2 && (
                                            <button className="mt-3 text-sm text-white bg-blue-500 hover:bg-blue-600 font-medium flex items-center mx-auto px-3 py-1 rounded-md transition-colors w-full justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                                Show all ({item.totalAchievements})
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-10 text-center text-gray-500">
                        {loading ? 'Fetching records...' : 'No faculty records found for this department.'}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DesignTwelve;
