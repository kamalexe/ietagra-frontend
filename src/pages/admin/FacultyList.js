import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';

import FacultyService from '../../services/FacultyService';

const FacultyList = () => {
    // State for faculty list
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch faculty on mount
    React.useEffect(() => {
        loadFaculty();
    }, []);

    const loadFaculty = async () => {
        try {
            setLoading(true);
            const data = await FacultyService.getAllFaculty();
            setFaculty(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load faculty:", err);
            setError("Failed to load faculty list.");
        } finally {
            setLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ name: '', designation: '', department: '', email: '', image: '' });

    const departments = ['Computer Science', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & Comm.', 'Electrical Engineering', 'Applied Science'];

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData(member);
        } else {
            setEditingMember(null);
            setFormData({ name: '', designation: '', department: departments[0], email: '', image: '' });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                await FacultyService.deleteFaculty(id);
                setFaculty(faculty.filter(f => f._id !== id));
            } catch (err) {
                alert("Failed to delete faculty member: " + err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                // Update
                const updated = await FacultyService.updateFaculty(editingMember._id, formData);
                setFaculty(faculty.map(f => f._id === editingMember._id ? updated : f));
            } else {
                // Create
                const created = await FacultyService.createFaculty(formData);
                setFaculty([...faculty, created]);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert("Failed to save faculty member: " + err.message);
        }
    };

    // Helper to generate initials for avatar placeholder
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage faculty directory and details.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Faculty
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {faculty.map((person) => (
                        <li key={person._id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                        {person.image ? (
                                            <img src={person.image} alt={person.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-gray-500 font-medium">{getInitials(person.name)}</span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                        <div className="text-sm text-gray-500">{person.designation}</div>
                                        <div className="text-xs text-gray-400">{person.department}</div>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleOpenModal(person)}
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(person._id)}
                                        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button onClick={() => setIsModalOpen(false)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    {editingMember ? 'Edit Faculty Member' : 'Add New Faculty'}
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">Designation</label>
                                            <input type="text" required value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="/images/..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm">
                                            {editingMember ? 'Update Faculty' : 'Add Faculty'}
                                        </button>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyList;
