import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResearchService from '../../../services/ResearchService';
import { UserGroupIcon, LinkIcon } from '@heroicons/react/24/outline';
import { fadeIn, staggerContainer } from '../../../utils/animations';

const DesignThirtyFour = ({ id, title, subtitle, badge, departmentId, company_id }) => {
    const [research, setResearch] = useState([]);
    const [loading, setLoading] = useState(true);
    // Use company_id as fallback for departmentId if not explicitly provided
    // In PageBuilder, 'company_id' is often used to pass the department ID context
    const effectiveDepartmentId = departmentId || company_id;

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                // Determine if we need to filter by department
                // The backend ResearchService.getAllResearch doesn't take params yet in our wrapper service
                // but the Controller supports req.query.department.
                // We might need to handle filtering on client side if service doesn't support params yet,
                // OR ideally update the service. For now let's try to assume we can modify the service or
                // just filter client side if the API returns everything.

                // Let's check ResearchService implementation again...
                // It does: fetch(`${API_BASE_URL}/research`) without params.
                // So we will fetch all and filter client-side for now to avoid modifying Service if not strictly necessary,
                // although updating service is better. Let's do client side filtering to be safe first.

                const data = await ResearchService.getAllResearch();

                if (effectiveDepartmentId) {
                    const filtered = data.filter(item =>
                        // Handle populated or raw ID
                        (item.department?._id || item.department) === effectiveDepartmentId
                    );
                    setResearch(filtered);
                } else {
                    setResearch(data);
                }
            } catch (error) {
                console.error("DesignThirtyFour: Failed to fetch research", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResearch();
    }, [effectiveDepartmentId]);

    if (loading) return (
        <div id={id} className="py-20 flex justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-7xl px-4">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (research.length === 0) return null;

    return (
        <section id={id} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    {badge && (
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide uppercase mb-2">
                            {badge}
                        </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title || "Research & Publications"}
                    </h2>
                    {subtitle && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    {research.map((paper) => (
                        <motion.div
                            key={paper._id}
                            variants={fadeIn}
                            className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {paper.year}
                                        </span>
                                        {paper.publication && (
                                            <span className="text-sm text-gray-500 font-medium">
                                                {paper.publication}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                                        {paper.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium">
                                            {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                                        </span>
                                    </div>

                                    {paper.description && (
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {paper.description}
                                        </p>
                                    )}
                                </div>

                                {paper.link && (
                                    <div className="flex-shrink-0">
                                        <a
                                            href={paper.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                            View Paper
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default DesignThirtyFour;
