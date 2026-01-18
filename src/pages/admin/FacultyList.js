import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import FacultyService from '../../services/FacultyService';
import DepartmentService from '../../services/DepartmentService';
import FileService from '../../services/FileService';

const FacultyList = () => {
    // State for faculty list
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Department Selection State
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [deptQuery, setDeptQuery] = useState('');

    // Fetch faculty on mount
    React.useEffect(() => {
        loadFaculty();
        loadDepartments();
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

    const loadDepartments = async () => {
        try {
            const data = await DepartmentService.getAllDepartments();
            setDepartmentOptions(data || []);
        } catch (err) {
            console.error("Failed to load departments:", err);
        }
    };

    const downloadSample = () => {
        const headers = ['Name', 'Designation', 'Department', 'Email', 'Specialization', 'Achievements', 'Image'];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + "Dr. John Doe,Professor,Computer Science,john.doe@example.com,AI & ML,\"Best Researcher 2024, Gold Medalist\",https://example.com/image.jpg";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "faculty_upload_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ name: '', designation: '', department: '', email: '', image: '', specialization: '', achievements: '' });

    const handleOpenModal = (member = null) => {
        setDeptQuery('');
        if (member) {
            setEditingMember(member);
            setFormData({
                ...member,
                achievements: member.achievements ? member.achievements.join('\n') : ''
            });
        } else {
            setEditingMember(null);
            setFormData({ name: '', designation: '', department: '', email: '', image: '', specialization: '', achievements: '' });
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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await FacultyService.bulkUpload(formData);
            alert("Upload Successful!");
            loadFaculty(); // Reload list
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload Failed: " + error.message);
        } finally {
            e.target.value = null; // Reset input
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const data = await FileService.uploadFile(file);
            setFormData(prev => ({ ...prev, image: data.url }));
        } catch (error) {
            alert("Image upload failed: " + error.message);
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                achievements: formData.achievements.split('\n').filter(line => line.trim() !== '')
            };

            if (editingMember) {
                // Update
                const updated = await FacultyService.updateFaculty(editingMember._id, payload);
                setFaculty(faculty.map(f => f._id === editingMember._id ? updated : f));
            } else {
                // Create
                const created = await FacultyService.createFaculty(payload);
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

    const filteredDepartments =
        deptQuery === ''
            ? departmentOptions
            : departmentOptions.filter((dept) => {
                return dept.name.toLowerCase().includes(deptQuery.toLowerCase());
            });


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage faculty directory and details.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={downloadSample} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Template
                    </button>
                    <label className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        Import Excel
                        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                    </label>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Faculty
                    </button>
                </div>
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

                                        {/* Department Combobox */}
                                        <div className="sm:col-span-3 relative z-20">
                                            <Combobox value={formData.department} onChange={(val) => setFormData({ ...formData, department: val })}>
                                                <Combobox.Label className="block text-sm font-medium text-gray-700">Department</Combobox.Label>
                                                <div className="relative mt-1">
                                                    <Combobox.Input
                                                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                                        onChange={(event) => setDeptQuery(event.target.value)}
                                                        displayValue={(deptName) => deptName}
                                                        placeholder="Select or type..."
                                                    />
                                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </Combobox.Button>

                                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {filteredDepartments.map((dept) => (
                                                            <Combobox.Option
                                                                key={dept._id}
                                                                value={dept.name}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                    }`
                                                                }
                                                            >
                                                                {({ active, selected }) => (
                                                                    <>
                                                                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                                            {dept.name}
                                                                        </span>
                                                                        {selected && (
                                                                            <span
                                                                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-blue-600'
                                                                                    }`}
                                                                            >
                                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))}
                                                        {deptQuery.length > 0 && !filteredDepartments.some(d => d.name.toLowerCase() === deptQuery.toLowerCase()) && (
                                                            <Combobox.Option
                                                                value={deptQuery}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                    }`
                                                                }
                                                            >
                                                                Create "{deptQuery}"
                                                            </Combobox.Option>
                                                        )}
                                                    </Combobox.Options>
                                                </div>
                                            </Combobox>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Specialization</label>
                                        <input type="text" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Achievements (one per line)</label>
                                        <textarea rows={3} value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="/images/..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                            <label className={`mt-1 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {uploading ? 'Uploading...' : 'Upload'}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                            </label>
                                        </div>
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
