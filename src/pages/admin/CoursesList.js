import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import CourseService from '../../services/CourseService';
import CampusService from '../../services/CampusService';
import DepartmentService from '../../services/DepartmentService';
import PageService from '../../services/PageService';

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', campusId: '', duration: '', description: '', order: 0, departmentIds: [] });

    useEffect(() => {
        loadCourses();
        loadCampuses();
        loadDepartments();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await CourseService.getAllCourses();
            setCourses(data);
        } catch (err) {
            console.error("Failed to load courses", err);
        }
    };

    const loadCampuses = async () => {
        try {
            const data = await CampusService.getAllCampuses();
            setCampuses(data);
        } catch (err) {
            console.error("Failed to load campuses", err);
        }
    };

    const loadDepartments = async () => {
        try {
            const data = await DepartmentService.getAllDepartments();
            setDepartments(data || []);
        } catch (err) {
            console.error("Failed to load departments", err);
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData({ name: '', slug: '', campusId: campuses[0]?._id || '', duration: '', description: '', order: 0, departmentIds: [] });
        setIsModalOpen(true);
    };

    const openEditModal = (course) => {
        setEditingId(course._id);
        setFormData({
            name: course.name,
            slug: course.slug,
            campusId: course.campusId?._id || course.campusId,
            duration: course.duration || '',
            description: course.description || '',
            order: course.order || 0,
            departmentIds: course.departmentIds ? course.departmentIds.map(d => d._id || d) : []
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const slug = formData.slug.toLowerCase().trim().replace(/\s+/g, '-');

        try {
            if (editingId) {
                await CourseService.updateCourse(editingId, { ...formData, slug });
                alert('Course updated successfully!');
            } else {
                await CourseService.createCourse({ ...formData, slug });
                alert('Course created successfully!');
            }
            setIsModalOpen(false);
            loadCourses();
        } catch (error) {
            alert('Error saving course: ' + error.message);
        }
    };

    const handleDelete = async (id, slug, campusId) => {
        if (window.confirm("Are you sure? This will delete the course and its page.")) {
            try {
                const campus = campuses.find(c => c._id === campusId);
                await CourseService.deleteCourse(id);
                if (campus) {
                    try {
                        await PageService.deletePage(`campus/${campus.slug}/${slug}`);
                    } catch (pageErr) {
                        console.warn("Could not delete associated page:", pageErr);
                    }
                }
                setCourses(courses.filter(c => c._id !== id));
            } catch (err) {
                alert("Failed to delete: " + err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage courses for each campus.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add Course
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departments</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {courses.map((course) => (
                            <tr key={course._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.campusId?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                        {course.departmentIds && course.departmentIds.length > 0 ? (
                                            course.departmentIds.map(dept => (
                                                <span key={dept._id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    {dept.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">None</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {course.campusId ? `/campus/${course.campusId.slug}/${course.slug}` : `/${course.slug}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-3">
                                        <button onClick={() => openEditModal(course)} className="text-indigo-600 hover:text-indigo-900">
                                            <Cog6ToothIcon className="h-5 w-5" />
                                        </button>
                                        {course.campusId && (
                                            <Link to={`/admin/pages/${encodeURIComponent(`campus/${course.campusId.slug}/${course.slug}`)}`} className="text-blue-600 hover:text-blue-900">
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {course.campusId && (
                                            <a href={`/campus/${course.campusId.slug}/${course.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                                                <EyeIcon className="h-5 w-5" />
                                            </a>
                                        )}
                                        <button onClick={() => handleDelete(course._id, course.slug, course.campusId?._id)} className="text-red-400 hover:text-red-600">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{editingId ? 'Edit Course' : 'Add New Course'}</h3>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Campus</label>
                                    <select
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.campusId}
                                        onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                                    >
                                        <option value="">Select Campus</option>
                                        {campuses.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Course Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Departments (Many-to-Many)</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-200 rounded-md bg-gray-50">
                                        {departments.map(dept => (
                                            <label key={dept._id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                    checked={formData.departmentIds.includes(dept._id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            departmentIds: checked
                                                                ? [...prev.departmentIds, dept._id]
                                                                : prev.departmentIds.filter(id => id !== dept._id)
                                                        }));
                                                    }}
                                                />
                                                <span>{dept.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 italic">Select all departments where this course is offered.</p>
                                </div>
                                <div className="mt-5 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesList;
