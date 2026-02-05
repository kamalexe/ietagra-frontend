import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import UploadService from '../../services/UploadService';
import { getToken } from '../../services/LocalStorageService';

const AddExamSchedule = () => {
    const [formData, setFormData] = useState({
        title: '',
        examType: 'Mid-Term',
        academicYear: '2024-2025',
        department: '', // Optional in schema, but usually selected
        program: '',
        semester: '', // Comma separated string for UI
        publishDate: new Date().toISOString().split('T')[0]
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { access_token } = getToken();
                const url = `${process.env.REACT_APP_API_BASE_URL}/admin/departments`;
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${access_token}` }
                });
                if (res.data.success || res.data.status === 'success') {
                    setDepartments(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch departments", err);
                toast.error("Could not load departments");
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a PDF file");
            return;
        }

        setLoading(true);
        try {
            // 1. Upload File
            const uploadRes = await UploadService.uploadFile(file);
            const fileUrl = uploadRes.url;
            const fileId = uploadRes.public_id;

            // 2. Parse Semesters
            const semesterArray = formData.semester.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

            // 3. Create Exam Schedule
            const { access_token } = getToken();
            const examData = {
                ...formData,
                semester: semesterArray,
                // If department is empty string, send null or omit (backend handles omit fine if not required)
                // But schema says required: false. If empty string is sent, mongoose might complain cast to ObjectId failed
                department: formData.department || null,
                fileUrl,
                fileId
            };

            // Clean up null department if needed
            if (!examData.department) delete examData.department;

            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/exam-schedule`, examData, {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            if (res.data.success) {
                toast.success("Exam Schedule added successfully!");
                setFormData({
                    title: '',
                    examType: 'Mid-Term',
                    academicYear: '2024-2025',
                    department: '',
                    program: '',
                    semester: '',
                    publishDate: new Date().toISOString().split('T')[0]
                });
                setFile(null);
                document.getElementById('fileInput').value = '';
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Failed to add exam schedule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Exam Schedule</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g. B.Tech Odd Semester End-Term Schedule"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Exam Type
                        </label>
                        <select
                            required
                            name="examType"
                            value={formData.examType}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            {['Mid-Term', 'End-Term', 'Practical', 'Supplementary'].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Academic Year
                        </label>
                        <input
                            required
                            type="text"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Department
                        </label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">All Departments (Common)</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Leave empty for common exams (e.g. 1st Year)</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Program
                        </label>
                        <input
                            required
                            type="text"
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g. B.Tech"
                        />
                    </div>

                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Semesters (Multiple Allowed)
                        </label>
                        <div className="grid grid-cols-4 gap-4 p-4 border rounded bg-gray-50">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                                // Check if semester is included
                                const semesterArray = formData.semester ?
                                    String(formData.semester).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
                                    : [];
                                const isChecked = semesterArray.includes(sem);

                                return (
                                    <div key={sem} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`sem-${sem}`}
                                            checked={isChecked}
                                            onChange={(e) => {
                                                let newSemesters = [...semesterArray];
                                                if (e.target.checked) {
                                                    if (!newSemesters.includes(sem)) newSemesters.push(sem);
                                                } else {
                                                    newSemesters = newSemesters.filter(s => s !== sem);
                                                }
                                                // Keep them sorted
                                                newSemesters.sort((a, b) => a - b);
                                                setFormData({ ...formData, semester: newSemesters.join(', ') });
                                            }}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`sem-${sem}`} className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                            Semester {sem}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Publish Date
                        </label>
                        <input
                            type="date"
                            name="publishDate"
                            value={formData.publishDate}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Upload Schedule PDF
                        </label>
                        <input
                            required
                            id="fileInput"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Uploading...' : 'Add Exam Schedule'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddExamSchedule;
