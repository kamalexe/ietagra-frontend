import React, { useState, useEffect } from 'react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [batchFilter, setBatchFilter] = useState('');
    const [supervisorFilter, setSupervisorFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        fetch("https://project-iet-tnp-bk.vercel.app/api/projects/projects-list-approved/")
            .then(res => res.json())
            .then(result => {
                setProjects(result);
                setFilteredProjects(result);
            })
            .catch(error => console.log(error));
    }, []);

    const handleFilter = () => {
        const filteredData = projects.filter(project => {
            return (
                (batchFilter === '' || project.fields.student_batch === batchFilter) &&
                (supervisorFilter === '' || project.fields.supervisor === supervisorFilter) &&
                (branchFilter === '' || project.fields.student_branch === branchFilter)
            );
        });
        setFilteredProjects(filteredData);
    };

    const batchOptions = [...new Set(projects.map(p => p.fields.student_batch))];
    const supervisorOptions = [...new Set(projects.map(p => p.fields.supervisor))];
    const branchOptions = [...new Set(projects.map(p => p.fields.student_branch))];

    const handleSort = column => {
        if (column === 'package') {
            if (sortBy === 'package') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
                setSortBy('package');
                setSortOrder('asc');
            }
        }
    };

    const sortedProjects = [...filteredProjects];
    if (sortBy === 'package') {
        sortedProjects.sort((a, b) => {
            const aValue = parseFloat(a.fields.student_salary);
            const bValue = parseFloat(b.fields.student_salary);
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });
    }

    return (
        <div className="w-full">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                🚀 Project Statistics
            </h1>

            {/* Filters */}
            <div className="flex flex-col gap-6 mb-10 shadow-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-700 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Batch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Batch
                        </label>
                        <select
                            value={batchFilter}
                            onChange={e => setBatchFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
                            rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {batchOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Supervisor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Supervisor
                        </label>
                        <select
                            value={supervisorFilter}
                            onChange={e => setSupervisorFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
                            rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {supervisorOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Branch
                        </label>
                        <select
                            value={branchFilter}
                            onChange={e => setBranchFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
                            rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {branchOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Apply Button */}
                    <div className="flex items-end">
                        <button
                            onClick={handleFilter}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md 
                            hover:shadow-lg active:scale-95 transition-all duration-200 font-medium"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100">
                <table className="hidden md:table w-full text-left">
                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Batch</th>
                            <th className="px-6 py-3 font-semibold">Student</th>
                            <th className="px-6 py-3 font-semibold">Project</th>
                            <th className="px-6 py-3 font-semibold">Technology</th>
                            <th className="px-6 py-3 font-semibold">Branch</th>
                            <th className="px-6 py-3 font-semibold">Supervisor</th>
                            <th className="px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedProjects.map((project, i) => (
                            <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{project.fields.student_batch}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{project.fields.student_name}</td>
                                <td className="px-6 py-4 text-gray-700">{project.fields.project_name}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                        {project.fields.technology}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{project.fields.student_branch}</td>
                                <td className="px-6 py-4 text-gray-600">{project.fields.supervisor}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        {project.fields.github_link ? (
                                            <a
                                                href={project.fields.github_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-black transition-colors"
                                                title="View on GitHub"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                            </a>
                                        ) : (
                                                <span className="text-gray-300 pointer-events-none">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                                </span>
                                        )}
                                        {project.fields.ppt_link ? (
                                            <a
                                                href={project.fields.ppt_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
                                            >
                                                PPT
                                            </a>
                                        ) : (
                                                <span className="text-gray-300 text-sm">PPT</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {sortedProjects.map((project, i) => (
                        <div key={i} className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="mb-2">
                                <p className="font-bold text-gray-900 dark:text-white">{project.fields.project_name}</p>
                                <p className="text-xs text-blue-600 font-medium">{project.fields.technology}</p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span className="font-semibold">{project.fields.student_name}</span> ({project.fields.student_batch})
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                                Supervisor: {project.fields.supervisor}
                            </p>
                            <div className="flex gap-4 pt-3 border-t border-gray-100">
                                {project.fields.github_link ? (
                                    <a href={project.fields.github_link} target="_blank" rel="noopener noreferrer" className="text-gray-700 text-sm flex items-center gap-1 hover:text-black">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                        GitHub
                                    </a>
                                ) : <span className="text-gray-300 text-sm">GitHub</span>}
                                {project.fields.ppt_link ? (
                                    <a href={project.fields.ppt_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                                        View PPT
                                    </a>
                                ) : <span className="text-gray-300 text-sm">PPT</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
