import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, FileText, ArrowLeft } from 'lucide-react';
import UploadService from '../../services/UploadService';
import { getToken } from '../../services/LocalStorageService';


const ExamScheduleManager = () => {
    const [view, setView] = useState('list'); // 'list' or 'add'
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Add Form State
    const [formData, setFormData] = useState({
        title: '',
        examType: 'Mid-Term',
        academicYear: '2024-2025',
        department: '', // Optional
        program: '',
        semester: '', // Comma separated string for UI logic, parsed on submit
        publishDate: new Date().toISOString().split('T')[0]
    });
    const [file, setFile] = useState(null);
    const [departments, setDepartments] = useState([]);

    // Initial Fetch
    useEffect(() => {
        fetchSchedules();
        fetchDepartments();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/exam-schedule`; 
            const res = await axios.get(url);
            if (res.data.success) {
                setSchedules(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch schedules", err);
            toast.error("Failed to load exam schedules");
        } finally {
            setLoading(false);
        }
    };

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
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this schedule?")) return;

        try {
            const { access_token } = getToken();
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/exam-schedule/${id}`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            toast.success("Schedule deleted successfully");
            fetchSchedules(); // Refresh list
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete schedule");
        }
    };

    // --- Form Handlers ---
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
            const semesterArray = String(formData.semester).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

            // 3. Create Schedule
            const { access_token } = getToken();
            const examData = {
                ...formData,
                semester: semesterArray,
                department: formData.department || null,
                fileUrl,
                fileId
            };
            if (!examData.department) delete examData.department;

            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/exam-schedule`, examData, {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            if (res.data.success) {
                toast.success("Schedule added successfully!");
                // Reset Form
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
                // Switch back
                setView('list');
                fetchSchedules();
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Failed to add schedule");
        } finally {
            setLoading(false);
        }
    };

    // --- Renders ---

    const renderList = () => (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Exam Schedule List</h2>
                <button 
                    onClick={() => setView('add')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="px-6 py-3 font-semibold border-b">Title</th>
                            <th className="px-6 py-3 font-semibold border-b">Type</th>
                            <th className="px-6 py-3 font-semibold border-b">Year</th>
                            <th className="px-6 py-3 font-semibold border-b">Program</th>
                            <th className="px-6 py-3 font-semibold border-b">Dept</th>
                            <th className="px-6 py-3 font-semibold border-b">Semesters</th>
                            <th className="px-6 py-3 font-semibold border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {schedules.length === 0 && !loading && (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No schedules found. Click "Add New" to create one.
                                </td>
                            </tr>
                        )}
                        {schedules.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-gray-800 font-medium">{item.title}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        item.examType === 'Mid-Term' ? 'bg-yellow-100 text-yellow-800' :
                                        item.examType === 'End-Term' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {item.examType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{item.academicYear}</td>
                                <td className="px-6 py-4 text-gray-600">{item.program}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {item.department ? item.department.name : 'Common'}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {item.semester && item.semester.length > 0 ? item.semester.join(', ') : 'All'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button 
                                            onClick={() => window.open(item.fileUrl, '_blank')}
                                            className="p-1 text-blue-600 hover:text-blue-800"
                                            title="View PDF"
                                        >
                                            <FileText className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => setView('list')}
                    className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-800">Add New Exam Schedule</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input 
                            required type="text" name="title"
                            value={formData.title} onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g. B.Tech Odd Semester End-Term Schedule"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Exam Type</label>
                        <select
                            required name="examType"
                            value={formData.examType} onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            {['Mid-Term', 'End-Term', 'Practical', 'Supplementary'].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Academic Year</label>
                        <input 
                            required type="text" name="academicYear"
                            value={formData.academicYear} onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                        <select
                            name="department"
                            value={formData.department} onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">All Departments (Common)</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Leave empty for common exams</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Program</label>
                        <input
                            required type="text" name="program"
                            value={formData.program} onChange={handleChange}
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
                                                newSemesters.sort((a,b) => a-b);
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Upload PDF</label>
                        <input
                            required type="file" accept=".pdf"
                            onChange={handleFileChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end mt-8">
                    <button 
                        type="button" 
                        onClick={() => setView('list')}
                        className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Uploading...' : 'Save Schedule'}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            {view === 'list' ? renderList() : renderForm()}
        </div>
    );
};

export default ExamScheduleManager;
