import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosConfig';
import { PlusIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import DepartmentService from '../../services/DepartmentService';

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
    // access_token is handled by axiosInstance interceptor
    const { role, department: userDept } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('gate');
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await DepartmentService.getAllDepartments();
                setDepartments(data);
            } catch (error) {
                console.error("Failed to fetch departments", error);
            }
        };
        fetchDepartments();
    }, []);

    // Search & Selection
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [formData, setFormData] = useState({});

    // Upload & Validation State
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/student-records?category=${activeTab}`);
            setRecords(res.data.data);
            setFilteredRecords(res.data.data);
            setSelectedIds([]);
        } catch (error) {
            console.error("Error fetching records:", error);
            alert("Failed to fetch records");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchRecords();
    }, [activeTab, fetchRecords]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredRecords(records);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = records.filter(r =>
                r.studentName.toLowerCase().includes(lowerQuery) ||
                (r.enrollmentNo && r.enrollmentNo.toLowerCase().includes(lowerQuery)) ||
                (r.batch && r.batch.toLowerCase().includes(lowerQuery))
            );
            setFilteredRecords(filtered);
        }
        // Reset selection when filter changes to avoid confusion
        setSelectedIds([]);
    }, [searchQuery, records]);

    const downloadSample = () => {
        const headers = SAMPLE_HEADERS[activeTab] || ['studentName', 'batch', 'branch'];

        // Create Data Sheet
        const ws = XLSX.utils.json_to_sheet([
            headers.reduce((acc, curr) => ({ ...acc, [curr]: "" }), {}), // Empty row
            headers.reduce((acc, curr) => ({ ...acc, [curr]: `sample_${curr}` }), {}) // Sample
        ], { header: headers });

        // Create Instructions Sheet
        const branches = departments.map(d => `${d.name} -> ${d.slug.toUpperCase()}`).join('\n');
        const instructionData = [
            { "Field": "department", "Notes": "If Admin: Use Department ID. If Dept Admin: Leave empty (auto-assigned)." },
            { "Field": "branch", "Notes": `Valid Branch Codes:\n${branches}` },
            { "Field": "batch", "Notes": "e.g., 2024, 2025" }
        ];
        const wsInfo = XLSX.utils.json_to_sheet(instructionData);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.utils.book_append_sheet(wb, wsInfo, "Instructions");
        XLSX.writeFile(wb, `${activeTab}_template.xlsx`);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            // Validate Data
            const validatedData = data.map(row => {
                const isValid = row.studentName || row.StudentName || row.Name;
                return { ...row, _isValid: !!isValid };
            });

            setPreviewData(validatedData);
            setIsPreviewOpen(true);
            e.target.value = null; // Reset input
        };
        reader.readAsBinaryString(file);
    };

    const confirmUpload = async () => {
        const validRecords = previewData.filter(r => r._isValid).map(r => {
            const { _isValid, ...rest } = r;
            // Normalize name
            const studentName = rest.studentName || rest.StudentName || rest.Name || 'Unknown';
            const enrollmentNo = rest.enrollmentNo || rest.EnrollmentNo;
            const batch = rest.batch || rest.Batch;
            const branch = rest.branch || rest.Branch;
            const { studentName: _sn, enrollmentNo: _en, batch: _ba, branch: _br, ...meta } = rest;

            return {
                studentName,
                enrollmentNo,
                batch,
                branch,
                department: role === 'department_admin'
                    ? (userDept?._id || userDept)
                    : (meta.department || ''),
                metadata: meta
            };
        });

        if (validRecords.length === 0) {
            alert("No valid records to upload.");
            return;
        }

        setUploading(true);
        try {
            await axiosInstance.post('/student-records/bulk-json', {
                records: validRecords,
                category: activeTab
            });
            alert(`Successfully uploaded ${validRecords.length} records!`);
            setIsPreviewOpen(false);
            setPreviewData([]);
            fetchRecords();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed: " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axiosInstance.delete(`/student-records/${id}`);
            setRecords(records.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) return;
        try {
            await axiosInstance.post('/student-records/delete-many', { ids: selectedIds });
            fetchRecords();
            setSelectedIds([]);
        } catch (error) {
            console.error("Bulk delete failed", error);
            alert("Bulk delete failed");
        }
    };

    const handleExport = () => {
        const dataToExport = selectedIds.length > 0
            ? records.filter(r => selectedIds.includes(r._id))
            : filteredRecords;

        const flattenedData = dataToExport.map(r => ({
            studentName: r.studentName,
            batch: r.batch,
            branch: r.branch,
            enrollmentNo: r.enrollmentNo,
            ...r.metadata // Flatten metadata
        }));

        const ws = XLSX.utils.json_to_sheet(flattenedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, `${activeTab}_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredRecords.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRecords.map(r => r._id));
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
                department: role === 'department_admin' ? (userDept?._id || userDept) : formData.department,
                metadata: { ...formData.metadata }
            };

            Object.keys(formData).forEach(key => {
                if (!['studentName', 'enrollmentNo', 'batch', 'branch', 'metadata'].includes(key)) {
                    payload.metadata[key] = formData[key];
                }
            });

            if (editRecord) {
                await axiosInstance.put(`/student-records/${editRecord._id}`, payload);
            } else {
                await axiosInstance.post('/student-records', payload);
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
                department: record.department?._id || record.department || '',
                ...record.metadata
            });
        } else {
            const defaultDeptId = role === 'department_admin' ? (userDept?._id || userDept) : '';
            // Auto-determine branch for Dept Admin
            let defaultBranch = '';
            if (role === 'department_admin' && departments.length > 0) {
                const myDept = departments.find(d => d._id === defaultDeptId);
                if (myDept) defaultBranch = myDept.slug.toUpperCase();
            }

            setFormData({
                department: defaultDeptId,
                branch: defaultBranch
            });
        }
        setIsModalOpen(true);
    };

    const renderFormFields = () => {
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
                        <div className="relative">
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-8"
                                value={formData.branch || ''}
                                onChange={e => setFormData({ ...formData, branch: e.target.value.toUpperCase() })}
                                placeholder="Auto-filled or Select"
                            />
                            {/* Optional: Add a small dropdown trigger if manually editing is allowed but they want to pick from list */}
                        </div>
                        {/* Helper text or pill to show it comes from Dept */}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Enrollment No</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.enrollmentNo || ''}
                            onChange={e => setFormData({ ...formData, enrollmentNo: e.target.value })}
                        />
                    </div>
                    {role === 'admin' && (
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                value={formData.department || ''}
                                onChange={e => {
                                    const selectedDeptId = e.target.value;
                                    const selectedDept = departments.find(d => d._id === selectedDeptId);
                                    setFormData({
                                        ...formData,
                                        department: selectedDeptId,
                                        branch: selectedDept ? selectedDept.slug.toUpperCase() : ''
                                    });
                                }}
                            >
                                <option value="">Select Department (Optional)</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="border-t pt-4">
                    <h4 className="text-sm font-bold text-gray-500 mb-2">Additional Data (Category Specific)</h4>
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
                    {activeTab === 'achievement' && (
                        <div className="grid grid-cols-1 gap-4">
                            <input placeholder="Achievement Title" className="border p-2 rounded"
                                value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <textarea placeholder="Description" className="border p-2 rounded h-24"
                                value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <input type="date" placeholder="Date" className="border p-2 rounded"
                                value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Student Data Management</h1>
                <div className="flex flex-wrap gap-3">
                    {selectedIds.length > 0 && (
                        <>
                            <button onClick={handleDeleteSelected} className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm">
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete ({selectedIds.length})
                            </button>
                        </>
                    )}
                    <button onClick={handleExport} className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        {selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export All'}
                    </button>

                    <button onClick={downloadSample} className="flex items-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Template
                    </button>
                    <label className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition ${uploading ? 'opacity-50' : ''}`}>
                        <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                        Import Excel
                        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    <button onClick={() => openModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New
                    </button>
                </div>
            </div>

            {/* Filter & Tabs */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto w-full sm:w-auto">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === cat.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </nav>
                    <div className="relative mt-2 sm:mt-0 w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>
                ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input type="checkbox"
                                                onChange={toggleSelectAll}
                                                checked={filteredRecords.length > 0 && selectedIds.length === filteredRecords.length}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRecords.length > 0 ? (
                                        filteredRecords.map((record) => (
                                            <tr key={record._id} className={selectedIds.includes(record._id) ? "bg-blue-50" : "hover:bg-gray-50"}>
                                                <td className="px-6 py-4">
                                                    <input type="checkbox"
                                                        checked={selectedIds.includes(record._id)}
                                                        onChange={() => toggleSelection(record._id)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.batch}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.branch}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {Object.entries(record.metadata || {}).slice(0, 3).map(([k, v]) => (
                                                    <span key={k} className="mr-2 inline-block bg-gray-100 px-2 py-0.5 rounded text-xs mb-1">
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
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                )}
            </div>

            {/* Edit Modal */}
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

            {/* Preview Modal for Upload */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Preview ({activeTab})</h3>
                                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metadata Preview</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {previewData.map((row, idx) => (
                                                <tr key={idx} className={row._isValid ? "bg-green-50" : "bg-red-50"}>
                                                    <td className="px-3 py-2 text-xs font-bold">
                                                        {row._isValid ? <span className="text-green-600">Valid</span> : <span className="text-red-600">Invalid</span>}
                                                    </td>
                                                    <td className="px-3 py-2 text-sm">{row.studentName || row.StudentName || row.Name || '-'}</td>
                                                    <td className="px-3 py-2 text-sm">{row.batch || row.Batch || '-'}</td>
                                                    <td className="px-3 py-2 text-sm">{row.branch || row.Branch || '-'}</td>
                                                    <td className="px-3 py-2 text-xs text-gray-500 truncate max-w-xs">
                                                        {/* rough preview of other fields */}
                                                        {JSON.stringify(row).slice(0, 50)}...
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={confirmUpload}
                                    disabled={uploading}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : `Confirm Import (${previewData.filter(r => r._isValid).length})`}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsPreviewOpen(false); setPreviewData([]); }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDataManager;
