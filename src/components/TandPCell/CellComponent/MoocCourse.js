import React, { useState, useEffect, useMemo } from 'react';

const MoocCourse = () => {
    const [courses, setCourses] = useState([]);
    const [batchFilter, setBatchFilter] = useState('');
    const [platformFilter, setPlatformFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://project-iet-tnp-bk.vercel.app/api/course/course-list-approved/")
            .then(res => res.json())
            .then(
                (result) => {
                    setCourses(result);
                    setFilteredCourses(result);
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                }
            )
    }, [])

    const handleFilter = () => {
        const filteredData = courses.filter(course => {
            return (
                (batchFilter === '' || course.fields.student_batch === batchFilter) &&
                (platformFilter === '' || course.fields.course_platform === platformFilter) &&
                (branchFilter === '' || course.fields.student_branch === branchFilter)
            );
        });
        setFilteredCourses(filteredData);
    };

    const batchOptions = useMemo(() => [...new Set(courses.map(c => c.fields.student_batch))].sort(), [courses]);
    const platformOptions = useMemo(() => [...new Set(courses.map(c => c.fields.course_platform))].sort(), [courses]);
    const branchOptions = useMemo(() => [...new Set(courses.map(c => c.fields.student_branch))].sort(), [courses]);

    if (loading) {
        return <div className="text-center py-10 text-gray-500 dark:text-gray-300">Loading courses...</div>;
    }

    return (
        <div className="w-full px-8 py-12 min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    📚 MOOC Courses Completed by Students
                </h1>

                {/* Filters */}
                <div className="flex flex-col gap-6 mb-10 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700">

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
                                rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                {batchOptions.map((option, i) => (
                                    <option key={i} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {/* Platform */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Platform
                            </label>
                            <select
                                value={platformFilter}
                                onChange={e => setPlatformFilter(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 
                                rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                {platformOptions.map((option, i) => (
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
                                rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md 
                                hover:bg-blue-500 active:bg-blue-700 transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-xl">
                    <table className="hidden md:table w-full text-left">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">Batch</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Branch</th>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3">Course Name</th>
                                <th className="px-6 py-3">Certificate</th>
                                <th className="px-6 py-3">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course, i) => (
                                <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                    <td className="px-6 py-4">{course.fields.student_batch}</td>
                                    <td className="px-6 py-4">{course.fields.student_name}</td>
                                    <td className="px-6 py-4">{course.fields.student_branch}</td>
                                    <td className="px-6 py-4">{course.fields.course_platform}</td>
                                    <td className="px-6 py-4">{course.fields.course_name}</td>
                                    <td className="px-6 py-4">
                                        <a href={course.fields.course_certificate} target="_blank" rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline">
                                            View Certificate
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">{course.fields.course_duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 p-4">
                        {filteredCourses.map((course, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                                <p className="font-semibold text-gray-900 dark:text-white">{course.fields.student_name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{course.fields.student_batch} • {course.fields.student_branch}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Platform: {course.fields.course_platform}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Course: {course.fields.course_name}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Duration: {course.fields.course_duration}</p>
                                <div className="mt-2">
                                    <a href={course.fields.course_certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                        View Certificate
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MoocCourse;
