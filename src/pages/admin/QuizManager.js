import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import * as xlsx from 'xlsx';
import { getToken } from '../../services/LocalStorageService';
import { 
    PlusIcon, 
    ShareIcon, 
    PencilSquareIcon, 
    ChartBarIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon, 
    CalendarIcon,
    XMarkIcon,
    AcademicCapIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const QuizManager = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(10);
    const [rules, setRules] = useState('1. Please answer all questions. You can skip questions but cannot go back.\n2. The quiz is timed.\n3. Fullscreen mode is strictly enforced.\n4. Switching tabs, minimizing the window, right-clicking, or using Developer Tools is prohibited and will be recorded as a violation.');
    const [shuffleOptions, setShuffleOptions] = useState(false);
    const [scheduledStartTime, setScheduledStartTime] = useState('');
    const [scheduledEndTime, setScheduledEndTime] = useState('');
    const [metadataEntries, setMetadataEntries] = useState([{ key: 'Course Code', value: '' }, { key: 'Instructor', value: '' }]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('list'); // 'list', 'upload', 'scoreboard'
    const [scoreboardQuizId, setScoreboardQuizId] = useState(null);
    const [scoreboardData, setScoreboardData] = useState([]);
    const [totalScoreboardQuestions, setTotalScoreboardQuestions] = useState(0);

    // Edit Modal state
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDurationMinutes, setEditDurationMinutes] = useState(10);
    const [editRules, setEditRules] = useState('');
    const [editShuffleOptions, setEditShuffleOptions] = useState(false);
    const [editScheduledStartTime, setEditScheduledStartTime] = useState('');
    const [editScheduledEndTime, setEditScheduledEndTime] = useState('');
    const [editMetadataEntries, setEditMetadataEntries] = useState([]);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchScoreboard = async (quizId) => {
        try {
            const { access_token } = getToken();
            const res = await axios.get(`${API_URL}/quiz/${quizId}/scoreboard`, {
                headers: { Authorization: `Bearer ${access_token}` },
                withCredentials: true
            });
            if (res.data.success) {
                setScoreboardData(res.data.data);
                setTotalScoreboardQuestions(res.data.totalQuestions);
            }
        } catch (err) {
            console.error('Error fetching scoreboard', err);
            toast.error('Failed to load scoreboard');
        }
    };

    const formatDuration = (totalSeconds) => {
        if (!totalSeconds || totalSeconds <= 0) return '0s';
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0 || h > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);
        return parts.join(' ');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const exportToExcel = () => {
        if (!scoreboardData || scoreboardData.length === 0) return toast.error('No data to export');

        const formattedData = scoreboardData.map((p, index) => ({
            Rank: index + 1,
            Name: p.name,
            Email: p.email || 'N/A',
            'Roll No / ID': p.rollNo || 'N/A',
            Score: `${p.score} / ${totalScoreboardQuestions}`,
            'Time Taken': formatDuration(p.durationSeconds),
            'Warnings (Tab Switches)': p.tabSwitches,
            Status: p.completed ? 'Completed' : `In Progress (Q${p.currentQuestionIndex})`,
            'Joined At': formatDate(p.joinedAt)
        }));

        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Scoreboard');
        xlsx.writeFile(workbook, `Quiz_Results_${scoreboardQuizId || 'Export'}.xlsx`);
        toast.success('Exported results successfully!');
    };

    useEffect(() => {
        let interval;
        if (activeTab === 'scoreboard' && scoreboardQuizId) {
            fetchScoreboard(scoreboardQuizId);
            interval = setInterval(() => fetchScoreboard(scoreboardQuizId), 3000);
        }
        return () => clearInterval(interval);
    }, [activeTab, scoreboardQuizId]);

    const fetchQuizzes = async () => {
        try {
            const { access_token } = getToken();
            const res = await axios.get(`${API_URL}/quiz`, {
                headers: { Authorization: `Bearer ${access_token}` },
                withCredentials: true
            });
            setQuizzes(res.data.data);
        } catch (err) {
            console.error('Error fetching quizzes:', err);
            toast.error('Failed to load quizzes');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !file) {
            return toast.error('Please provide a title and an excel file');
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('durationMinutes', durationMinutes);
        formData.append('rules', rules);
        formData.append('shuffleOptions', shuffleOptions);
        if (scheduledStartTime) formData.append('scheduledStartTime', scheduledStartTime);
        if (scheduledEndTime) formData.append('scheduledEndTime', scheduledEndTime);

        const metadataObj = {};
        metadataEntries.forEach(item => {
            if (item.key.trim() && item.value.trim()) {
                metadataObj[item.key.trim()] = item.value.trim();
            }
        });
        formData.append('metadata', JSON.stringify(metadataObj));

        formData.append('file', file);

        setLoading(true);
        try {
            const { access_token } = getToken();
            const res = await axios.post(`${API_URL}/quiz/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${access_token}`
                },
                withCredentials: true
            });
            toast.success(res.data.message || 'Quiz uploaded successfully');
            setTitle('');
            setDescription('');
            setScheduledStartTime('');
            setScheduledEndTime('');
            setMetadataEntries([{ key: 'Course Code', value: '' }, { key: 'Instructor', value: '' }]);
            setFile(null);
            fetchQuizzes();
            setActiveTab('list');
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.response?.data?.error || 'Error uploading quiz');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const { access_token } = getToken();
            await axios.put(`${API_URL}/quiz/${id}/status`, { isActive: !currentStatus }, {
                headers: { Authorization: `Bearer ${access_token}` },
                withCredentials: true
            });
            toast.success(`Quiz ${!currentStatus ? 'activated' : 'deactivated'}`);
            fetchQuizzes();
        } catch (err) {
            console.error('Toggle error:', err);
            toast.error('Failed to update quiz status');
        }
    };

    const toLocalISOString = (dateInput) => {
        if (!dateInput) return '';
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return '';
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const handleOpenEdit = (quiz) => {
        setEditingQuiz(quiz);
        setEditTitle(quiz.title || '');
        setEditDescription(quiz.description || '');
        setEditDurationMinutes(quiz.durationMinutes || 10);
        setEditRules(quiz.rules || '');
        setEditShuffleOptions(!!quiz.shuffleOptions);
        setEditScheduledStartTime(toLocalISOString(quiz.scheduledStartTime));
        setEditScheduledEndTime(toLocalISOString(quiz.scheduledEndTime));
        const metaObj = quiz.metadata || {};
        const metaList = Object.entries(metaObj).map(([key, value]) => ({ key, value }));
        setEditMetadataEntries(metaList.length > 0 ? metaList : [{ key: 'Course Code', value: '' }]);
    };

    const handleUpdateQuiz = async (e) => {
        e.preventDefault();
        if (!editingQuiz) return;
        setLoading(true);
        try {
            const { access_token } = getToken();
            const metadataObj = {};
            editMetadataEntries.forEach(item => {
                if (item.key.trim() && item.value.trim()) {
                    metadataObj[item.key.trim()] = item.value.trim();
                }
            });

            await axios.put(`${API_URL}/quiz/${editingQuiz._id}`, {
                title: editTitle,
                description: editDescription,
                durationMinutes: editDurationMinutes,
                rules: editRules,
                shuffleOptions: editShuffleOptions,
                scheduledStartTime: editScheduledStartTime || null,
                scheduledEndTime: editScheduledEndTime || null,
                metadata: metadataObj
            }, {
                headers: { Authorization: `Bearer ${access_token}` },
                withCredentials: true
            });
            toast.success('Quiz updated successfully');
            setEditingQuiz(null);
            fetchQuizzes();
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Failed to update quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <AcademicCapIcon className="w-9 h-9 text-blue-600" />
                        Quiz Manager
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Create, manage, and monitor live examinations and scoreboards</p>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-5 py-2.5 font-bold rounded-lg transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer ${
                            activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Manage Quizzes
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-5 py-2.5 font-bold rounded-lg transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer ${
                            activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <PlusIcon className="w-4 h-4 stroke-[3]" /> Upload Quiz
                    </button>
                    {scoreboardQuizId && (
                        <button
                            onClick={() => setActiveTab('scoreboard')}
                            className={`px-5 py-2.5 font-bold rounded-lg transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer ${
                                activeTab === 'scoreboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <ChartBarIcon className="w-4 h-4 stroke-[3]" /> Live Scoreboard
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            {activeTab === 'list' && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz) => (
                            <div key={quiz._id} className="bg-white rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col overflow-hidden group">
                                {/* Top Bar with Status Badge */}
                                <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start gap-3">
                                    <div>
                                        <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-1 tracking-tight">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {quiz.description || 'No description provided'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleStatus(quiz._id, quiz.isActive)}
                                        title={quiz.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-2xs border ${
                                            quiz.isActive 
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200' 
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${quiz.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                        {quiz.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </div>

                                {/* Body Information */}
                                <div className="p-6 flex-1 space-y-3 bg-gray-50/50">
                                    <div className="flex items-center text-xs font-semibold text-gray-700">
                                        <ClockIcon className="w-4 h-4 mr-2.5 text-gray-500 flex-shrink-0" />
                                        <span>Duration: <strong className="text-gray-900">{quiz.durationMinutes} minutes</strong></span>
                                    </div>
                                    {quiz.scheduledStartTime && (
                                        <div className="flex items-center text-xs font-medium text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200 shadow-2xs">
                                            <CalendarIcon className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0" />
                                            <span>Starts: <strong className="font-bold">{formatDate(quiz.scheduledStartTime)}</strong></span>
                                        </div>
                                    )}
                                    {quiz.scheduledEndTime && (
                                        <div className="flex items-center text-xs font-medium text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-200 shadow-2xs">
                                            <CalendarIcon className="w-4 h-4 mr-2.5 text-purple-600 flex-shrink-0" />
                                            <span>Ends: <strong className="font-bold">{formatDate(quiz.scheduledEndTime)}</strong></span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-4 gap-2 text-center">
                                    <button
                                        onClick={() => toggleStatus(quiz._id, quiz.isActive)}
                                        className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                                            quiz.isActive 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                        }`}
                                        title={quiz.isActive ? 'Deactivate Quiz' : 'Activate Quiz'}
                                    >
                                        {quiz.isActive ? <XCircleIcon className="w-5 h-5 mb-1 text-red-500" /> : <CheckCircleIcon className="w-5 h-5 mb-1 text-green-500" />}
                                        <span className="truncate w-full">{quiz.isActive ? 'Deactivate' : 'Activate'}</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/live-quiz/${quiz._id}`;
                                            navigator.clipboard.writeText(url);
                                            toast.success('Quiz link copied to clipboard!');
                                        }}
                                        className="py-2.5 px-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 flex flex-col items-center justify-center transition-all cursor-pointer"
                                        title="Share Quiz Link"
                                    >
                                        <ShareIcon className="w-5 h-5 mb-1 text-blue-500" />
                                        <span className="truncate w-full">Share</span>
                                    </button>

                                    <button
                                        onClick={() => handleOpenEdit(quiz)}
                                        className="py-2.5 px-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 flex flex-col items-center justify-center transition-all cursor-pointer"
                                        title="Edit Quiz Details"
                                    >
                                        <PencilSquareIcon className="w-5 h-5 mb-1 text-amber-600" />
                                        <span className="truncate w-full">Edit</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setScoreboardQuizId(quiz._id);
                                            setActiveTab('scoreboard');
                                        }}
                                        className="py-2.5 px-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex flex-col items-center justify-center transition-all cursor-pointer"
                                        title="View Live Scoreboard"
                                    >
                                        <ChartBarIcon className="w-5 h-5 mb-1 text-indigo-600" />
                                        <span className="truncate w-full">Score</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {quizzes.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
                            <AcademicCapIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Quizzes Found</h3>
                            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Upload your first quiz using an Excel sheet to begin conducting live examinations.</p>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
                            >
                                <PlusIcon className="w-5 h-5 stroke-[3]" /> Upload New Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'upload' && (
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Quiz</h2>
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Quiz Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-900"
                                placeholder="Enter quiz title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-900"
                                placeholder="Brief overview or instructions summary"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Duration (Mins) *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={durationMinutes}
                                    onChange={(e) => setDurationMinutes(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-900 font-mono"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Scheduled Start</label>
                                <input
                                    type="datetime-local"
                                    value={scheduledStartTime}
                                    onChange={(e) => setScheduledStartTime(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-xs sm:text-sm font-medium text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Scheduled End</label>
                                <input
                                    type="datetime-local"
                                    value={scheduledEndTime}
                                    onChange={(e) => setScheduledEndTime(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-xs sm:text-sm font-medium text-gray-900"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Quiz Rules / Instructions</label>
                            <textarea
                                value={rules}
                                onChange={(e) => setRules(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-900 text-sm"
                                rows="4"
                            ></textarea>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Metadata Attributes (Optional)</label>
                                <button
                                    type="button"
                                    onClick={() => setMetadataEntries([...metadataEntries, { key: '', value: '' }])}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                    + Add Field
                                </button>
                            </div>
                            <div className="space-y-2.5">
                                {metadataEntries.map((entry, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <input
                                            type="text"
                                            placeholder="Key (e.g. Course Code)"
                                            value={entry.key}
                                            onChange={(e) => {
                                                const updated = [...metadataEntries];
                                                updated[idx].key = e.target.value;
                                                setMetadataEntries(updated);
                                            }}
                                            className="w-1/2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value (e.g. CS101)"
                                            value={entry.value}
                                            onChange={(e) => {
                                                const updated = [...metadataEntries];
                                                updated[idx].value = e.target.value;
                                                setMetadataEntries(updated);
                                            }}
                                            className="w-1/2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setMetadataEntries(metadataEntries.filter((_, i) => i !== idx))}
                                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer transition-colors flex-shrink-0"
                                            title="Remove field"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center shadow-2xs">
                            <input
                                id="shuffleOptions"
                                type="checkbox"
                                checked={shuffleOptions}
                                onChange={(e) => setShuffleOptions(e.target.checked)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="shuffleOptions" className="ml-3 block text-sm font-bold text-blue-900 cursor-pointer">
                                Shuffle answer options randomly for each participant
                            </label>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-8 rounded-2xl text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                required
                            />
                            <div className="pointer-events-none">
                                <PlusIcon className="w-10 h-10 mx-auto text-gray-400 mb-2 stroke-[2]" />
                                <span className="block font-bold text-gray-800 mb-1">{file ? file.name : 'Select Excel File (.xlsx)'}</span>
                                <span className="text-xs text-gray-500 block">Click or drag and drop</span>
                                <p className="text-[11px] text-gray-400 mt-3 max-w-sm mx-auto">
                                    Required Columns: Question, Option A, Option B, Option C, Option D, Correct Answer.
                                </p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all text-base cursor-pointer flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading & Parsing...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="w-6 h-6 stroke-[3]" /> Upload Quiz Examination
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'scoreboard' && (
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-5">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
                                <ChartBarIcon className="w-7 h-7 text-indigo-600" />
                                Live Scoreboard & Standings
                            </h2>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-mono">Real-time examination telemetry</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fetchScoreboard(scoreboardQuizId)}
                                className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                                title="Refresh Scoreboard Telemetry"
                            >
                                <ArrowPathIcon className="w-4 h-4 text-blue-600" />
                                Refresh
                            </button>
                            <button
                                onClick={() => setActiveTab('list')}
                                className="px-4 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                            >
                                ← Back to Quizzes
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm flex items-center transition-colors text-sm cursor-pointer"
                            >
                                <svg className="w-5 h-5 mr-2 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Export Excel
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Rank</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Participant</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Score</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Time Taken</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Warnings</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {scoreboardData.map((participant, index) => {
                                    let rankBadge = <span className="text-gray-600 font-bold font-mono">#{index + 1}</span>;
                                    if (index === 0) rankBadge = <span className="text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded font-mono">#1</span>;
                                    if (index === 1) rankBadge = <span className="text-xs font-bold bg-gray-200 text-gray-800 border border-gray-300 px-2.5 py-1 rounded font-mono">#2</span>;
                                    if (index === 2) rankBadge = <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded font-mono">#3</span>;

                                    return (
                                        <tr key={participant._id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">{rankBadge}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{participant.name}</div>
                                                <div className="text-xs text-gray-500 font-medium">{participant.email} {participant.rollNo ? `| Roll: ${participant.rollNo}` : ''}</div>
                                                {participant.completed && <span className="text-[11px] bg-green-100 text-green-800 border border-green-200 font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-1.5 inline-block">Completed</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 font-mono">
                                                    {participant.score} / {totalScoreboardQuestions}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-mono font-bold text-xs text-gray-700">
                                                {formatDuration(participant.durationSeconds)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {participant.tabSwitches > 0 ? (
                                                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 font-mono uppercase tracking-wider">
                                                        {participant.tabSwitches} Warning{participant.tabSwitches > 1 ? 's' : ''}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-wider">Clean</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold text-gray-700 font-mono">
                                                {participant.completed ? '100%' : `Q ${participant.currentQuestionIndex + 1}`}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {scoreboardData.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium text-sm">No participant telemetry recorded yet. Share the examination link!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal Overlay */}
            {editingQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-gray-100 max-h-[90vh] flex flex-col my-auto animate-scale-in">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 flex-shrink-0">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
                                <PencilSquareIcon className="w-7 h-7 text-amber-600" /> Edit Quiz Details
                            </h3>
                            <button
                                onClick={() => setEditingQuiz(null)}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <XMarkIcon className="w-7 h-7 stroke-[2.5]" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateQuiz} className="space-y-5 overflow-y-auto pr-1 flex-1">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Quiz Title *</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium text-gray-900"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Duration (Mins) *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editDurationMinutes}
                                        onChange={(e) => setEditDurationMinutes(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium text-gray-900 font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Scheduled Start</label>
                                    <input
                                        type="datetime-local"
                                        value={editScheduledStartTime}
                                        onChange={(e) => setEditScheduledStartTime(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-xs sm:text-sm font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Scheduled End</label>
                                    <input
                                        type="datetime-local"
                                        value={editScheduledEndTime}
                                        onChange={(e) => setEditScheduledEndTime(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-xs sm:text-sm font-medium text-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Quiz Rules / Instructions</label>
                                <textarea
                                    value={editRules}
                                    onChange={(e) => setEditRules(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium text-gray-900 text-sm"
                                    rows="4"
                                ></textarea>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Metadata Attributes</label>
                                    <button
                                        type="button"
                                        onClick={() => setEditMetadataEntries([...editMetadataEntries, { key: '', value: '' }])}
                                        className="text-xs text-amber-600 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                        + Add Field
                                    </button>
                                </div>
                                <div className="space-y-2.5">
                                    {editMetadataEntries.map((entry, idx) => (
                                        <div key={idx} className="flex gap-3 items-center">
                                            <input
                                                type="text"
                                                placeholder="Key (e.g. Course Code)"
                                                value={entry.key}
                                                onChange={(e) => {
                                                    const updated = [...editMetadataEntries];
                                                    updated[idx].key = e.target.value;
                                                    setEditMetadataEntries(updated);
                                                }}
                                                className="w-1/2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 font-medium text-gray-900"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value (e.g. CS101)"
                                                value={entry.value}
                                                onChange={(e) => {
                                                    const updated = [...editMetadataEntries];
                                                    updated[idx].value = e.target.value;
                                                    setEditMetadataEntries(updated);
                                                }}
                                                className="w-1/2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 font-medium text-gray-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setEditMetadataEntries(editMetadataEntries.filter((_, i) => i !== idx))}
                                                className="text-gray-400 hover:text-red-600 p-1 cursor-pointer transition-colors flex-shrink-0"
                                                title="Remove field"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-center shadow-2xs">
                                <input
                                    id="editShuffleOptions"
                                    type="checkbox"
                                    checked={editShuffleOptions}
                                    onChange={(e) => setEditShuffleOptions(e.target.checked)}
                                    className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="editShuffleOptions" className="ml-3 block text-sm font-bold text-amber-900 cursor-pointer">
                                    Shuffle answer options randomly for each participant
                                </label>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setEditingQuiz(null)}
                                    className="px-6 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition-all cursor-pointer text-sm flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizManager;

