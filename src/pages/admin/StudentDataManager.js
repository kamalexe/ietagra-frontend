import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
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
    { id: 'achievement', label: 'Achievements' },
    { id: 'other', label: 'General/Other Records' }
];

const SAMPLE_HEADERS = {
    gate: ['roll_number', 'student_name', 'student_batch', 'student_branch', 'registration_no', 'rank', 'status', 'gate_score', 'year'],
    placement: ['roll_number', 'student_name', 'student_branch', 'student_batch', 'company_name', 'student_salary', 'position_offered', 'status', 'remarks'],
    project: ['roll_number', 'student_name', 'student_batch', 'student_branch', 'status', 'topic', 'technology', 'supervisor', 'ppt_link', 'github_link'],
    mooc: ['roll_number', 'student_name', 'student_branch', 'student_batch', 'course_platform', 'course_name', 'course_duration', 'status'],
    achievement: ['studentName', 'batch', 'branch', 'enrollmentNo', 'title', 'description', 'date'],
    other: ['studentName', 'batch', 'branch', 'enrollmentNo', 'status', 'remarks']
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
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to fetch records";
            toast.error(errorMsg);
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

        // Create Data Sheet with 5 demo rows
        const sampleRows = Array.from({ length: 5 }, (_, i) =>
            headers.reduce((acc, curr) => ({
                ...acc,
                [curr]: i === 0 ? `demo_${curr}` : `demo_${curr}_${i + 1}`
            }), {})
        );
        const ws = XLSX.utils.json_to_sheet(sampleRows, { header: headers });

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

            const validatedData = data.map(row => {
                // Smart mapping for name check
                const name = row.studentName || row.StudentName || row.Name || row.student_name || row.Name;
                const isSample = name && String(name).toLowerCase().includes('sample_');
                const isValid = name && !isSample;
                return { ...row, _isValid: !!isValid, _isSample: !!isSample };
            });

            setPreviewData(validatedData);
            setIsPreviewOpen(true);
            e.target.value = null; // Reset input
        };
        reader.readAsBinaryString(file);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        const toastId = toast.loading('Uploading image...');
        try {
            const res = await axiosInstance.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.status === 'success' || res.data.success) {
                setFormData({ ...formData, studentPhoto: res.data.data.url });
                toast.success('Image uploaded successfully', { id: toastId });
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Failed to upload image', { id: toastId });
        }
        e.target.value = null;
    };

    const confirmUpload = async () => {
        const validRecords = previewData.filter(r => r._isValid && !r._isSample).map(r => {
            const { _isValid, _isSample, ...rest } = r;

            // Helper to find value by various key names
            const val = (keys) => {
                for (const k of keys) {
                    if (rest[k] !== undefined) return rest[k];
                    // Also check normalized versions
                    const normK = k.toLowerCase().replace(/ /g, '_');
                    for (const rowK of Object.keys(rest)) {
                        if (rowK.toLowerCase().replace(/ /g, '_') === normK) return rest[rowK];
                    }
                }
                return undefined;
            };

            const record = {
                category: activeTab,
                studentName: val(['studentName', 'student_name', 'Name']),
                enrollmentNo: val(['enrollmentNo', 'roll_number', 'roll_no']),
                batch: val(['batch', 'student_batch']),
                branch: val(['branch', 'student_branch']),
                status: val(['status']),
                remarks: val(['remarks']),
                studentPhoto: val(['studentPhoto', 'photo', 'profile_picture']),
                department: role === 'department_admin'
                    ? (userDept?._id || userDept)
                    : (val(['department']) || null),
                metadata: {}
            };

            // Mapping category specific fields
            if (activeTab === 'placement') {
                record.company = val(['company', 'company_name']);
                record.package = val(['package', 'student_salary', 'salary']);
                record.designation = val(['designation', 'position_offered']);
                record.offerLetter = val(['offerLetter', 'offer_letter']);
            } else if (activeTab === 'project') {
                record.projectName = val(['projectName', 'topic', 'project_name']);
                record.technology = val(['technology']);
                record.supervisor = val(['supervisor']);
                record.pptLink = val(['pptLink', 'ppt_link']);
                record.githubLink = val(['githubLink', 'github_link']);
            } else if (activeTab === 'gate') {
                record.gateScore = val(['gateScore', 'gate_score']);
                record.rank = val(['rank', 'all_india_rank']);
                record.year = val(['year']);
                record.registrationNo = val(['registrationNo', 'registration_no']);
                record.scoreCard = val(['scoreCard', 'score_card']);
            } else if (activeTab === 'mooc') {
                record.courseName = val(['courseName', 'course_name']);
                record.platform = val(['platform', 'course_platform']);
                record.courseDescription = val(['courseDescription', 'course_description']);
                record.courseDuration = val(['courseDuration', 'course_duration']);
                record.courseCertificate = val(['courseCertificate', 'course_certificate']);
            } else if (activeTab === 'achievement') {
                record.title = val(['title', 'achievement_title', 'achievementTitle']);
                record.description = val(['description', 'achievement_description', 'achievementDescription']);
                record.date = val(['date', 'achievement_date', 'achievementDate']);
            }

            // Put anything else in metadata
            Object.keys(rest).forEach(k => {
                const standardKeys = ['studentName', 'student_name', 'Name', 'enrollmentNo', 'roll_number', 'roll_no', 'batch', 'student_batch', 'branch', 'student_branch', 'status', 'remarks', 'photo', 'profile_picture', 'company', 'company_name', 'package', 'student_salary', 'salary', 'designation', 'position_offered', 'offer_letter', 'projectName', 'topic', 'project_name', 'technology', 'supervisor', 'pptLink', 'ppt_link', 'githubLink', 'github_link', 'gateScore', 'gate_score', 'rank', 'all_india_rank', 'year', 'registrationNo', 'registration_no', 'scoreCard', 'score_card', 'courseName', 'course_name', 'platform', 'course_platform', 'courseDescription', 'course_description', 'courseDuration', 'course_duration', 'courseCertificate', 'course_certificate', 'title', 'achievement_title', 'description', 'achievement_description', 'date', 'achievement_date', 'department'];
                if (!standardKeys.includes(k) && !standardKeys.includes(k.toLowerCase().replace(/ /g, '_'))) {
                    record.metadata[k] = rest[k];
                }
            });

            return record;
        });

        if (validRecords.length === 0) {
            toast.error("No valid records to upload.");
            return;
        }

        console.log(`[confirmUpload] Sending ${validRecords.length} records for category: ${activeTab}`, validRecords);
        setUploading(true);
        try {
            const resp = await axiosInstance.post('/student-records/bulk-json', {
                records: validRecords,
                category: activeTab
            });
            console.log("[confirmUpload] Success:", resp.data);
            toast.success(`Successfully uploaded ${validRecords.length} records!`);
            setIsPreviewOpen(false);
            setPreviewData([]);
            fetchRecords();
        } catch (error) {
            console.error("Upload failed", error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Upload failed";
            toast.error(errorMsg);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axiosInstance.delete(`/student-records/${id}`);
            setRecords(records.filter(r => r._id !== id));
            toast.success("Record deleted successfully");
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Delete failed";
            toast.error(errorMsg);
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) return;
        try {
            await axiosInstance.post('/student-records/delete-many', { ids: selectedIds });
            fetchRecords();
            setSelectedIds([]);
            toast.success("Bulk delete successful");
        } catch (error) {
            console.error("Bulk delete failed", error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Bulk delete failed";
            toast.error(errorMsg);
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
                status: formData.status || 'Pending',
                remarks: formData.remarks,
                studentPhoto: formData.studentPhoto,
                department: role === 'department_admin' ? (userDept?._id || userDept) : (formData.department || null),

                // Placement
                company: formData.company,
                package: formData.package,
                designation: formData.designation,
                offerLetter: formData.offerLetter,

                // Project
                projectName: formData.projectName,
                technology: formData.technology,
                supervisor: formData.supervisor,
                pptLink: formData.pptLink,
                githubLink: formData.githubLink,

                // GATE
                gateScore: formData.gateScore,
                rank: formData.rank,
                year: formData.year,
                registrationNo: formData.registrationNo,
                scoreCard: formData.scoreCard,

                // MOOC
                courseName: formData.courseName,
                platform: formData.platform,
                courseDescription: formData.courseDescription,
                courseDuration: formData.courseDuration,
                courseCertificate: formData.courseCertificate,

                // Achievement
                title: formData.title,
                description: formData.description,
                date: formData.date,

                metadata: { ...formData.metadata }
            };

            const standardKeys = ['studentName', 'enrollmentNo', 'batch', 'branch', 'department', 'status', 'remarks', 'studentPhoto', 'company', 'package', 'designation', 'offerLetter', 'projectName', 'technology', 'supervisor', 'pptLink', 'githubLink', 'gateScore', 'rank', 'year', 'registrationNo', 'scoreCard', 'courseName', 'platform', 'courseDescription', 'courseDuration', 'courseCertificate', 'title', 'description', 'date', 'metadata'];
            Object.keys(formData).forEach(key => {
                if (!standardKeys.includes(key)) {
                    payload.metadata[key] = formData[key];
                }
            });

            if (editRecord) {
                await axiosInstance.put(`/student-records/${editRecord._id}`, payload);
                toast.success("Record updated successfully");
            } else {
                await axiosInstance.post('/student-records', payload);
                toast.success("Record created successfully");
            }
            setIsModalOpen(false);
            setEditRecord(null);
            setFormData({});
            fetchRecords();
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Save failed";
            toast.error(errorMsg);
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
                department: record.department?._id || record.department || null,
                status: record.status || 'Pending',
                remarks: record.remarks || '',
                studentPhoto: record.studentPhoto || '',
                // Placement
                company: record.company || '',
                package: record.package || '',
                designation: record.designation || '',
                offerLetter: record.offerLetter || '',
                // Project
                projectName: record.projectName || '',
                technology: record.technology || '',
                supervisor: record.supervisor || '',
                pptLink: record.pptLink || '',
                githubLink: record.githubLink || '',
                // GATE
                gateScore: record.gateScore || '',
                rank: record.rank || '',
                year: record.year || '',
                registrationNo: record.registrationNo || '',
                scoreCard: record.scoreCard || '',
                // MOOC
                courseName: record.courseName || '',
                platform: record.platform || '',
                courseDescription: record.courseDescription || '',
                courseDuration: record.courseDuration || '',
                courseCertificate: record.courseCertificate || '',
                // Achievement
                title: record.title || '',
                description: record.description || '',
                date: record.date || '',
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
                        <label className="block text-sm font-medium text-gray-700">Student Name (student_name) *</label>
                        <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.studentName || ''}
                            onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Batch (student_batch)</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.batch || ''}
                            onChange={e => setFormData({ ...formData, batch: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Branch (student_branch)</label>
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
                        <label className="block text-sm font-medium text-gray-700">Enrollment No (roll_number)</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.enrollmentNo || ''}
                            onChange={e => setFormData({ ...formData, enrollmentNo: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.status || 'Pending'}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.remarks || ''}
                            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (profile_picture)</label>
                        <div className="flex items-center gap-4">
                            {formData.studentPhoto ? (
                                <img src={formData.studentPhoto} alt="Profile" className="w-16 h-16 object-cover rounded-full border border-gray-200" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200 text-xs">No Photo</div>
                            )}
                            <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Upload Photo
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                            {formData.studentPhoto && (
                                <button type="button" onClick={() => setFormData({ ...formData, studentPhoto: '' })} className="text-red-500 text-sm hover:underline">Remove</button>
                            )}
                        </div>
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
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Project Name (topic) *</label>
                                    <input placeholder="e.g. Smart Attendance System" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.projectName || ''} onChange={e => setFormData({ ...formData, projectName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Technology Stack (technology)</label>
                                    <input placeholder="e.g. React, Node.js, MongoDB" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.technology || ''} onChange={e => setFormData({ ...formData, technology: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Supervisor / Lab (supervisor)</label>
                                    <input placeholder="e.g. Dr. A.K. Sharma" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.supervisor || ''} onChange={e => setFormData({ ...formData, supervisor: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">GitHub Link (github_link)</label>
                                    <input placeholder="https://github.com/..." className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.githubLink || ''} onChange={e => setFormData({ ...formData, githubLink: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">PPT / Document Link (ppt_link)</label>
                                    <input placeholder="https://drive.google.com/..." className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.pptLink || ''} onChange={e => setFormData({ ...formData, pptLink: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'gate' && (
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gate Score (gate_score) *</label>
                                <input placeholder="e.g. 750" type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.gateScore || ''} onChange={e => setFormData({ ...formData, gateScore: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">All India Rank (rank) *</label>
                                <input placeholder="e.g. 452" type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.rank || ''} onChange={e => setFormData({ ...formData, rank: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year *</label>
                                <input placeholder="e.g. 2024" type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registration No (registration_no)</label>
                                <input placeholder="e.g. CS21S5001..." className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.registrationNo || ''} onChange={e => setFormData({ ...formData, registrationNo: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Score Card Link (score_card)</label>
                                <input placeholder="https://..." className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.scoreCard || ''} onChange={e => setFormData({ ...formData, scoreCard: e.target.value })} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'placement' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name (company_name) *</label>
                                    <input placeholder="e.g. Google, TCS" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Package / Student Salary (LPA) *</label>
                                    <input placeholder="e.g. 12" type="number" step="0.1" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.package || ''} onChange={e => setFormData({ ...formData, package: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Designation (position_offered)</label>
                                    <input placeholder="e.g. Software Engineer" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.designation || ''} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Offer Letter Link (offer_letter)</label>
                                    <input placeholder="https://..." className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.offerLetter || ''} onChange={e => setFormData({ ...formData, offerLetter: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'achievement' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Achievement Title *</label>
                                <input placeholder="e.g. Won Smart India Hackathon" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea placeholder="Briefly describe the achievement..." className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-24"
                                    value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date (Optional)</label>
                                <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'mooc' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Course Name (course_name) *</label>
                                    <input placeholder="e.g. Introduction to Machine Learning" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.courseName || ''} onChange={e => setFormData({ ...formData, courseName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Platform (course_platform) *</label>
                                    <input placeholder="e.g. NPTEL, Coursera" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.platform || ''} onChange={e => setFormData({ ...formData, platform: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Score / Grade</label>
                                    <input placeholder="e.g. 85% / Elite" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.score || ''} onChange={e => setFormData({ ...formData, score: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Course Duration (course_duration)</label>
                                    <input placeholder="e.g. 8 Weeks" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.courseDuration || ''} onChange={e => setFormData({ ...formData, courseDuration: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Course Certificate Link (course_certificate)</label>
                                    <input placeholder="https://..." className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.courseCertificate || ''} onChange={e => setFormData({ ...formData, courseCertificate: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Description (course_description)</label>
                                    <textarea placeholder="Briefly describe the course..." className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-20"
                                        value={formData.courseDescription || ''} onChange={e => setFormData({ ...formData, courseDescription: e.target.value })} />
                                </div>
                            </div>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {record.studentPhoto ? (
                                                        <img src={record.studentPhoto} alt={record.studentName} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs border border-gray-200">N/A</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.batch}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.branch}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(() => {
                                                            const details = [];
                                                            if (activeTab === 'placement') {
                                                                if (record.company) details.push({ k: 'Company', v: record.company });
                                                                if (record.package) details.push({ k: 'Package', v: record.package + ' LPA' });
                                                                if (record.designation) details.push({ k: 'Role', v: record.designation });
                                                            } else if (activeTab === 'gate') {
                                                                if (record.gateScore) details.push({ k: 'Score', v: record.gateScore });
                                                                if (record.rank) details.push({ k: 'Rank', v: record.rank });
                                                                if (record.year) details.push({ k: 'Year', v: record.year });
                                                            } else if (activeTab === 'project') {
                                                                if (record.projectName) details.push({ k: 'Project', v: record.projectName });
                                                                if (record.technology) details.push({ k: 'Tech', v: record.technology });
                                                            } else if (activeTab === 'mooc') {
                                                                if (record.courseName) details.push({ k: 'Course', v: record.courseName });
                                                                if (record.platform) details.push({ k: 'Platform', v: record.platform });
                                                            } else if (activeTab === 'achievement') {
                                                                if (record.title) details.push({ k: 'Title', v: record.title });
                                                                if (record.date) details.push({ k: 'Date', v: record.date });
                                                            }
                                                            if (record.metadata) {
                                                                Object.entries(record.metadata).slice(0, 2).forEach(([k, v]) => {
                                                                    if (typeof v === 'string' || typeof v === 'number') details.push({ k, v: String(v).slice(0, 30) });
                                                                });
                                                            }
                                                            return details.map((d, i) => (
                                                                <span key={i} className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs truncate max-w-full">
                                                                    <span className="font-medium text-gray-700">{d.k}:</span> {d.v}
                                                                </span>
                                                            ));
                                                        })()}
                                                    </div>
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
                                            {previewData.map((row, idx) => {
                                                const getVal = (keys) => {
                                                    for (const k of keys) {
                                                        if (row[k] !== undefined) return row[k];
                                                        const normK = k.toLowerCase().replace(/ /g, '_');
                                                        for (const rowK of Object.keys(row)) {
                                                            if (rowK.toLowerCase().replace(/ /g, '_') === normK) return row[rowK];
                                                        }
                                                    }
                                                    return undefined;
                                                };

                                                const studentName = getVal(['studentName', 'student_name', 'Name']);
                                                const batch = getVal(['batch', 'student_batch']);
                                                const branch = getVal(['branch', 'student_branch']);

                                                return (
                                                    <tr key={idx} className={row._isValid ? "bg-green-50" : row._isSample ? "bg-gray-50" : "bg-red-50"}>
                                                        <td className="px-3 py-2 text-xs font-bold">
                                                            {row._isValid ? (
                                                                <span className="text-green-600">Ready</span>
                                                            ) : row._isSample ? (
                                                                <span className="text-gray-500">Sample Row (Ignored)</span>
                                                            ) : (
                                                                <span className="text-red-600">Missing Name</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm">{studentName || '-'}</td>
                                                        <td className="px-3 py-2 text-sm">{batch || '-'}</td>
                                                        <td className="px-3 py-2 text-sm">{branch || '-'}</td>
                                                        <td className="px-3 py-2 text-xs text-gray-500 truncate max-w-xs">
                                                            {JSON.stringify(row).slice(0, 70)}...
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
