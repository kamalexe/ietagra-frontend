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
        <div className="w-full px-8 py-12 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    🚀 Project Statistics
                </h1>

                {/* Filters */}
                <div className="flex flex-col gap-6 mb-10  shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700">

                    {/* Batch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Batch
                        </label>
                        <select
                            value={batchFilter}
                            onChange={e => setBatchFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
        rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 
        dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 
        dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 
        dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            {branchOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Button */}
                    <div>
                        <button
                            onClick={handleFilter}
                            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 
        rounded-lg shadow-md hover:bg-blue-500 active:bg-blue-700 
        transition-all duration-200"
                        >
                            Apply
                        </button>
                    </div>

                </div>




                {/* Projects Table */}
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-xl">
                    <table className="hidden md:table w-full text-left">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">Batch</th>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Project</th>
                                <th className="px-6 py-3">Technology</th>
                                <th className="px-6 py-3">Branch</th>
                                <th className="px-6 py-3">Supervisor</th>
                                <th className="px-6 py-3">GitHub</th>
                                <th className="px-6 py-3">PPT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProjects.map((project, i) => (
                                <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                    <td className="px-6 py-4 font-medium">{project.fields.student_batch}</td>
                                    <td className="px-6 py-4">{project.fields.student_name}</td>
                                    <td className="px-6 py-4">{project.fields.project_name}</td>
                                    <td className="px-6 py-4">{project.fields.technology}</td>
                                    <td className="px-6 py-4">{project.fields.student_branch}</td>
                                    <td className="px-6 py-4">{project.fields.supervisor}</td>
                                    <td className="px-6 py-4">
                                        {project.fields.github_link ? (
                                            <a
                                                href={project.fields.github_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {project.fields.ppt_link ? (
                                            <a
                                                href={project.fields.ppt_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 p-4">
                        {sortedProjects.map((project, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span className="font-medium text-gray-800 dark:text-white">{project.fields.student_name}</span>
                                    ({project.fields.student_batch}, {project.fields.student_branch})
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {project.fields.project_name}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    Tech: {project.fields.technology}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Supervisor: {project.fields.supervisor}
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-sm">
                                    {project.fields.github_link ? (
                                        <a
                                            href={project.fields.github_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            GitHub
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">GitHub: N/A</span>
                                    )}
                                    {project.fields.ppt_link ? (
                                        <a
                                            href={project.fields.ppt_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            PPT
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">PPT: N/A</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Projects;
