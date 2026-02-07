import React, { useState, useEffect, useCallback } from 'react';
import DepartmentService from '../../services/DepartmentService';
import MemberService from '../../services/MemberService';
import { PlusIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, CloudArrowUpIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';

const StudentProfileManager = () => {
    const { role, department: userDept } = useSelector((state) => state.user);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editStudent, setEditStudent] = useState(null);
    const [formData, setFormData] = useState({});

    // Upload State
    const [uploading, setUploading] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await MemberService.getMembers({ type: 'student' });
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await DepartmentService.getAllDepartments();
            setDepartments(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
    }, [fetchStudents]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredStudents(students);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = students.filter(s =>
                s.name.toLowerCase().includes(lowerQuery) ||
                (s.email && s.email.toLowerCase().includes(lowerQuery)) ||
                (s.enrollmentNo && s.enrollmentNo.toLowerCase().includes(lowerQuery))
            );
            setFilteredStudents(filtered);
        }
    }, [searchQuery, students]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Arrays handling
            const payload = { ...formData };
            if (typeof payload.skills === 'string') {
                payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (typeof payload.achievements === 'string') {
                payload.achievements = payload.achievements.split(',').map(s => s.trim()).filter(Boolean);
            }

            if (editStudent) {
                await MemberService.updateMember(editStudent._id, payload);
                toast.success("Student updated successfully");
            } else {
                payload.type = 'student'; // Ensure type is set
                await MemberService.createMember(payload);
                toast.success("Student created successfully");
            }
            setIsModalOpen(false);
            fetchStudents();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await MemberService.deleteMember(id);
            toast.success("Student deleted successfully");
            fetchStudents();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleApprove = async (student) => {
        if (!window.confirm(`Approve profile for ${student.name}?`)) return;
        try {
            await MemberService.updateMember(student._id, { isApproved: true });
            toast.success("Student approved successfully");
            fetchStudents();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const downloadTemplate = () => {
        const headers = ['name', 'email', 'enrollmentNo', 'batch', 'branch', 'department', 'bio', 'skills', 'achievements'];
        const sampleData = [
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                enrollmentNo: 'EN123456',
                batch: '2022-2026',
                branch: 'CSE',
                department: 'Computer Science & Engineering', // Or ID
                bio: 'Sample bio',
                skills: 'React, Node.js',
                achievements: 'Hackathon Winner'
            }
        ];

        const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Student_Upload_Template.xlsx");
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await MemberService.bulkUpload(formData);
            toast.success(res.message);
            fetchStudents();
            e.target.value = null; // Reset input
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const openModal = (student = null) => {
        setEditStudent(student);
        if (student) {
            setFormData({
                name: student.name,
                email: student.email,
                enrollmentNo: student.enrollmentNo,
                batch: student.batch,
                branch: student.branch,
                department: student.department?._id || student.department,
                bio: student.bio,
                skills: student.skills ? student.skills.join(', ') : '',
                achievements: student.achievements ? student.achievements.join(', ') : '',
                isApproved: student.isApproved,
                isPublic: student.isPublic
            });
        } else {
            const defaultDept = role === 'department_admin' ? (userDept?._id || userDept) : '';
            setFormData({
                department: defaultDept,
                branch: '',
                batch: '',
                isApproved: true,
                isPublic: true
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Student Profiles (Admin)</h1>
                <div className="flex gap-3">
                    <button onClick={downloadTemplate} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Template
                    </button>
                    <label className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition ${uploading ? 'opacity-50' : ''}`}>
                        <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                        {uploading ? 'Uploading...' : 'Bulk Upload (Excel)'}
                        <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    <button onClick={() => openModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Name, Email, or Enrollment No..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-10">Loading...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-10 text-gray-500">No students found</td></tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-sm text-gray-500">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{student.enrollmentNo}</div>
                                            <div className="text-sm text-gray-500">{student.batch} | {student.branch}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.department?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {student.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {!student.isApproved && (
                                                <button onClick={() => handleApprove(student)} className="text-green-600 hover:text-green-900 mr-4">
                                                    Approve
                                                </button>
                                            )}
                                            <button onClick={() => openModal(student)} className="text-blue-600 hover:text-blue-900 mr-4">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-900">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {editStudent ? 'Edit Student' : 'Add New Student'}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name *</label>
                                            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={formData.name || ''}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email *</label>
                                            <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={formData.email || ''}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox"
                                                checked={formData.isApproved || false}
                                                onChange={e => setFormData({ ...formData, isApproved: e.target.checked })}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Approved</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox"
                                                checked={formData.isPublic || false}
                                                onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Public Visible</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Enrollment No *</label>
                                            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={formData.enrollmentNo || ''}
                                                onChange={e => setFormData({ ...formData, enrollmentNo: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Batch *</label>
                                            <input type="text" required placeholder="e.g. 2022-2026" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={formData.batch || ''}
                                                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Branch *</label>
                                            <input type="text" required placeholder="e.g. CSE" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                value={formData.branch || ''}
                                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                            />
                                        </div>
                                        {role === 'admin' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Department *</label>
                                                <select required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                    value={formData.department || ''}
                                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                                >
                                                    <option value="">Select Department</option>
                                                    {departments.map(d => (
                                                        <option key={d._id} value={d._id}>{d.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                                        <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            rows="2"
                                            value={formData.bio || ''}
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
                                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            value={formData.skills || ''}
                                            onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                        />
                                    </div>

                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:col-start-2 sm:text-sm">
                                            {editStudent ? 'Update' : 'Create'}
                                        </button>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
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

export default StudentProfileManager;
