import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PlusIcon, ArrowUpTrayIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
    { id: 'gate', label: 'GATE Qualified' },
    { id: 'placement', label: 'Placements' },
    { id: 'project', label: 'Projects' },
    { id: 'mooc', label: 'MOOC Courses' },
    { id: 'achievement', label: 'Achievements' }
];

const SAMPLE_HEADERS = {
    gate: ['studentName', 'batch', 'branch', 'enrollmentNo', 'gateScore', 'rank', 'year'],
    placement: ['studentName', 'batch', 'branch', 'enrollmentNo', 'company', 'package', 'designation'],
    project: ['studentName', 'batch', 'branch', 'enrollmentNo', 'projectName', 'technology', 'supervisor', 'githubLink', 'pptLink'],
    mooc: ['studentName', 'batch', 'branch', 'enrollmentNo', 'courseName', 'platform', 'score'],
    achievement: ['studentName', 'batch', 'branch', 'enrollmentNo', 'title', 'description', 'date']
};

const StudentDataManager = () => {
    const { access_token } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('gate');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchRecords();
    }, [activeTab]);

    const downloadSample = () => {
        const headers = SAMPLE_HEADERS[activeTab] || ['studentName', 'batch', 'branch'];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + "Example Student,2024,CSE,123456";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${activeTab}_sample.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/student-records?category=${activeTab}`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            setRecords(res.data.data);
        } catch (error) {
            console.error("Error fetching records:", error);
            alert("Failed to fetch records");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', activeTab);

        setUploading(true);
        try {
            await axios.post('http://localhost:5000/api/student-records/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${access_token}`
                }
            });
            alert("Upload Successful!");
            fetchRecords();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload Failed: " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/student-records/${id}`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            setRecords(records.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                category: activeTab,
                studentName: formData.studentName,
                enrollmentNo: formData.enrollmentNo,
                batch: formData.batch,
                branch: formData.branch,
                metadata: { ...formData.metadata } // Flattened in form, nested in payload
            };

            // Heuristic to put non-standard fields into metadata
            Object.keys(formData).forEach(key => {
                if (!['studentName', 'enrollmentNo', 'batch', 'branch', 'metadata'].includes(key)) {
                    payload.metadata[key] = formData[key];
                }
            });

            if (editRecord) {
                await axios.put(`http://localhost:5000/api/student-records/${editRecord._id}`, payload, {
                    headers: { Authorization: `Bearer ${access_token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/student-records', payload, {
                    headers: { Authorization: `Bearer ${access_token}` }
                });
            }
            setIsModalOpen(false);
            setEditRecord(null);
            setFormData({});
            fetchRecords();
        } catch (error) {
            console.error(error);
            alert("Save failed");
        }
    };

    const openModal = (record = null) => {
        setEditRecord(record);
        if (record) {
            setFormData({
                studentName: record.studentName,
                enrollmentNo: record.enrollmentNo,
                batch: record.batch,
                branch: record.branch,
                ...record.metadata // Spread metadata for easier editing
            });
        } else {
            setFormData({});
        }
        setIsModalOpen(true);
    };

    const renderFormFields = () => {
        // Generic fields + Category specific hints
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name *</label>
                        <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.studentName || ''}
                            onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Batch</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.batch || ''}
                            onChange={e => setFormData({ ...formData, batch: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Branch</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.branch || ''}
                            onChange={e => setFormData({ ...formData, branch: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Enrollment No</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.enrollmentNo || ''}
                            onChange={e => setFormData({ ...formData, enrollmentNo: e.target.value })}
                        />
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h4 className="text-sm font-bold text-gray-500 mb-2">Additional Data (Category Specific)</h4>
                    {/* Dynamic Fields based on Category could go here, or just generic inputs for now */}
                    {activeTab === 'project' && (
                        <div className="grid grid-cols-1 gap-4">
                            <input placeholder="Project Name" className="border p-2 rounded"
                                value={formData.projectName || ''} onChange={e => setFormData({ ...formData, projectName: e.target.value })} />
                            <input placeholder="Technology (comma separated)" className="border p-2 rounded"
                                value={formData.technology || ''} onChange={e => setFormData({ ...formData, technology: e.target.value })} />
                            <input placeholder="Supervisor" className="border p-2 rounded"
                                value={formData.supervisor || ''} onChange={e => setFormData({ ...formData, supervisor: e.target.value })} />
                            <input placeholder="GitHub Link" className="border p-2 rounded"
                                value={formData.githubLink || ''} onChange={e => setFormData({ ...formData, githubLink: e.target.value })} />
                            <input placeholder="PPT Link" className="border p-2 rounded"
                                value={formData.pptLink || ''} onChange={e => setFormData({ ...formData, pptLink: e.target.value })} />
                        </div>
                    )}
                    {activeTab === 'gate' && (
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Gate Score" className="border p-2 rounded"
                                value={formData.gateScore || ''} onChange={e => setFormData({ ...formData, gateScore: e.target.value })} />
                            <input placeholder="All India Rank" className="border p-2 rounded"
                                value={formData.rank || ''} onChange={e => setFormData({ ...formData, rank: e.target.value })} />
                            <input placeholder="Year" className="border p-2 rounded"
                                value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                        </div>
                    )}
                    {activeTab === 'placement' && (
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Company" className="border p-2 rounded"
                                value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            <input placeholder="Package (LPA)" className="border p-2 rounded"
                                value={formData.package || ''} onChange={e => setFormData({ ...formData, package: e.target.value })} />
                            <input placeholder="Designation" className="border p-2 rounded"
                                value={formData.designation || ''} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                        </div>
                    )}
                    {/* Fallback for other metadata */}
                    {!['project', 'gate', 'placement'].includes(activeTab) && (
                        <p className="text-xs text-gray-500">For this category, upload via Excel or ensure Excel columns match required metadata.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Student Data Management</h1>
                <div className="flex gap-3">
                    <button onClick={downloadSample} className="flex items-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm">
                        <ArrowUpTrayIcon className="w-4 h-4 mr-2 rotate-180" />
                        Download Template
                    </button>
                    <label className={`flex items-center px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition ${uploading ? 'opacity-50' : ''}`}>
                        <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                        {uploading ? "Uploading..." : "Import Excel"}
                        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    <button onClick={() => openModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === cat.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Table */}
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {records.length > 0 ? (
                                records.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.batch}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.branch}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {/* Quick peek at metadata */}
                                            {Object.entries(record.metadata || {}).slice(0, 3).map(([k, v]) => (
                                                <span key={k} className="mr-2 inline-block bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                    {k}: {v}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openModal(record)} className="text-blue-600 hover:text-blue-900 mr-4">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(record._id)} className="text-red-600 hover:text-red-900">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No records found. Upload an Excel file or add manually.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSave}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                        {editRecord ? 'Edit Record' : 'Add New Record'}
                                    </h3>
                                    {renderFormFields()}
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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

export default StudentDataManager;
