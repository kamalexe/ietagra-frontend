import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';
import UploadService from '../../services/UploadService';

const AddSyllabus = () => {
    const [formData, setFormData] = useState({
        title: '',
        academicYear: '2024-2025',
        department: '',
        program: '',
        semester: 1
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Fetch departments
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get('/admin/departments');
                if (res.data.success || res.data.status === 'success') {
                    setDepartments(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch departments", err);
                toast.error(err.message || "Could not load departments");
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
        if (!formData.department) {
            toast.error("Please select a department");
            return;
        }

        setLoading(true);
        try {
            // 1. Upload File
            const uploadRes = await UploadService.uploadFile(file);
            const fileUrl = uploadRes.url;
            const fileId = uploadRes.public_id;

            // 2. Create Syllabus
            const syllabusData = {
                ...formData,
                fileUrl,
                fileId
            };

            const res = await axiosInstance.post('/syllabus', syllabusData);

            if (res.data.success) {
                toast.success("Syllabus added successfully!");
                setFormData({
                    title: '',
                    academicYear: '2024-2025',
                    department: '',
                    program: '',
                    semester: 1
                });
                setFile(null);
                // Reset file input manually if needed
                document.getElementById('fileInput').value = '';
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to add syllabus");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Syllabus</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
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
                            placeholder="e.g. CSE B.Tech 3rd Sem Syllabus"
                        />
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
                            placeholder="e.g. 2024-2025"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Department
                        </label>
                        <select
                            required
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Semester
                        </label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="8"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Upload PDF
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
                        {loading ? 'Uploading...' : 'Add Syllabus'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddSyllabus;
