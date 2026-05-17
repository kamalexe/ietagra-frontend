import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ClockIcon, UserIcon, CheckCircleIcon, DocumentTextIcon, TrophyIcon, AcademicCapIcon, ChevronRightIcon, ExclamationTriangleIcon, ArrowPathIcon, CalendarIcon } from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LiveQuiz = () => {
    const { id } = useParams();
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(true);
    const [viewMode, setViewMode] = useState('landing'); // 'landing', 'join', 'scoreboard', 'quiz'
    
    // Join state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [participant, setParticipant] = useState(null);
    const [violations, setViolations] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionIds, setQuestionIds] = useState([]);
    
    // Question state
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Heatmap & Timer state
    const [answersHistory, setAnswersHistory] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    
    // Result state
    const [isCompleted, setIsCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [scoreboardData, setScoreboardData] = useState([]);
    const [countdownText, setCountdownText] = useState('');

    const fetchActiveQuiz = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/quiz/${id}`);
            if (res.data.success) {
                setActiveQuiz(res.data.data);
            }
        } catch (err) {
            console.log('Quiz not found');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchCurrentQuestion = useCallback(async (targetIdx) => {
        if (!participant || !activeQuiz) return;
        
        try {
            const url = targetIdx !== undefined 
                ? `${API_URL}/quiz/${activeQuiz._id}/participant/${participant._id}/question?targetIndex=${targetIdx}`
                : `${API_URL}/quiz/${activeQuiz._id}/participant/${participant._id}/question`;
                
            const res = await axios.get(url);
            
            if (res.data.completed) {
                setIsCompleted(true);
                setFinalScore(res.data.score);
                setAnswersHistory(res.data.answers || []);
                if (res.data.tabSwitches !== undefined) setViolations(res.data.tabSwitches);
            } else {
                setCurrentQuestion(res.data.data);
                if (res.data.currentIndex !== undefined) setCurrentIndex(res.data.currentIndex);
                if (res.data.questionIds) setQuestionIds(res.data.questionIds);
                setAnswersHistory(res.data.answers || []);
                setTotalQuestions(res.data.totalQuestions);
                if (res.data.tabSwitches !== undefined) setViolations(res.data.tabSwitches);
                setSelectedOption(null);
                
                if (res.data.joinedAt && activeQuiz.durationMinutes) {
                    const joinTime = new Date(res.data.joinedAt).getTime();
                    const now = new Date().getTime();
                    const elapsedSeconds = Math.floor((now - joinTime) / 1000);
                    const totalSeconds = activeQuiz.durationMinutes * 60;
                    const remaining = totalSeconds - elapsedSeconds;
                    
                    if (remaining <= 0) {
                        setIsCompleted(true);
                    } else {
                        setTimeLeft(remaining);
                    }
                }
            }
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.error === 'Time limit exceeded') {
                setIsCompleted(true);
            }
            console.error('Error fetching question:', err);
        }
    }, [participant, activeQuiz]);

    useEffect(() => {
        if (!activeQuiz || !activeQuiz.scheduledStartTime) return;
        const startTime = new Date(activeQuiz.scheduledStartTime).getTime();

        if (Date.now() >= startTime) {
            setCountdownText('');
            return;
        }

        let interval;
        let isFinished = false;

        const updateCountdown = () => {
            if (isFinished) return;
            const now = Date.now();
            const diff = startTime - now;
            if (diff <= 0) {
                isFinished = true;
                if (interval) clearInterval(interval);
                setCountdownText('');
                toast.success('Examination scheduled start time reached! Refreshing status...', { duration: 5000, icon: '🚀' });
                fetchActiveQuiz();
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            
            const pad = (n) => n.toString().padStart(2, '0');
            setCountdownText(`${pad(h)}h : ${pad(m)}m : ${pad(s)}s`);
        };

        updateCountdown();
        interval = setInterval(updateCountdown, 1000);
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeQuiz, fetchActiveQuiz]);

    useEffect(() => {
        fetchActiveQuiz();
        const savedParticipant = localStorage.getItem('quizParticipant');
        if (savedParticipant) {
            try {
                const p = JSON.parse(savedParticipant);
                if (p.quizId === id) {
                    setParticipant(p);
                    setViewMode('quiz');
                }
            } catch (e) {
                localStorage.removeItem('quizParticipant');
            }
        }
    }, [id, fetchActiveQuiz]);

    useEffect(() => {
        if (participant && activeQuiz && !isCompleted) {
            fetchCurrentQuestion();
        }
    }, [participant, activeQuiz, isCompleted, fetchCurrentQuestion]);

    // Timer effect
    useEffect(() => {
        if (timeLeft === null || isCompleted) return;

        if (timeLeft <= 0) {
            toast.error('Time is up!');
            setIsCompleted(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isCompleted]);

    // Proctoring effect (Anti-cheat)
    useEffect(() => {
        if (!participant || isCompleted) return;

        const handleVisibilityChange = async () => {
            if (document.hidden) {
                recordViolation();
            }
        };

        const handleBlur = () => {
            recordViolation();
        };

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = 'You are currently in a live quiz. If you leave, your attempt may be invalidated.';
        };

        const recordViolation = async () => {
            try {
                toast.error('Rule violation detected! This action has been logged.', { duration: 5000 });
                const res = await axios.post(`${API_URL}/quiz/${activeQuiz._id}/participant/${participant._id}/violation`);
                setViolations(res.data.tabSwitches);
            } catch (err) {
                console.error('Failed to record violation', err);
            }
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            recordViolation();
            toast.error('Right-click is disabled during the quiz.');
        };

        const handleKeyDown = (e) => {
            // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
                (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
            ) {
                e.preventDefault();
                recordViolation();
                toast.error('Developer tools are disabled during the quiz.');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        const fullscreenInterval = setInterval(() => {
            if (!document.fullscreenElement) {
                toast.error('Please return to fullscreen to continue the quiz.');
            }
        }, 10000);

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            clearInterval(fullscreenInterval);
        };
    }, [participant, isCompleted, activeQuiz]);

    // Scoreboard effect
    useEffect(() => {
        let interval;
        if ((isCompleted || viewMode === 'landing' || viewMode === 'scoreboard') && activeQuiz) {
            const fetchScoreboard = async () => {
                try {
                    const res = await axios.get(`${API_URL}/quiz/${activeQuiz._id}/scoreboard`);
                    setScoreboardData(res.data.data);
                } catch (err) {
                    console.error('Error fetching scoreboard:', err);
                }
            };
            fetchScoreboard();
            interval = setInterval(fetchScoreboard, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCompleted, viewMode, activeQuiz]);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return toast.error('Please enter your name and email');
        
        try {
            const res = await axios.post(`${API_URL}/quiz/${activeQuiz._id}/join`, { name, email, rollNo });
            const newParticipant = res.data.data;
            setParticipant(newParticipant);
            setViewMode('quiz');
            localStorage.setItem('quizParticipant', JSON.stringify(newParticipant));
            toast.success('Joined successfully! Good luck!');
            
            // Enter Fullscreen
            try {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    await elem.msRequestFullscreen();
                }
            } catch (err) {
                console.error('Fullscreen request failed', err);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to join quiz');
        }
    };

    const handleSubmitAnswer = async (isSkip = false) => {
        if (!isSkip && !selectedOption) return toast.error('Please select an option');
        
        setIsSubmitting(true);
        try {
            const res = await axios.post(`${API_URL}/quiz/${id}/participant/${participant._id}/submit`, {
                answer: isSkip ? 'SKIPPED' : selectedOption,
                questionId: currentQuestion._id
            });
            
            if (isSkip) {
                toast('Question skipped', { icon: '⏭️' });
            } else if (res.data.correct) {
                toast.success('Correct answer!');
            } else {
                toast.error('Incorrect answer.');
            }
            
            setTimeout(() => {
                fetchCurrentQuestion();
                setIsSubmitting(false);
            }, 800);
            
        } catch (err) {
            if (err.response?.data?.error === 'Time limit exceeded') {
                toast.error('Time limit exceeded!');
                setIsCompleted(true);
            } else {
                toast.error('Failed to submit answer');
            }
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        if (seconds === null || seconds < 0) return '00:00';
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Top Bar Header
    const renderTopBar = () => (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        IETAGRA <span className="text-gray-400 font-normal text-sm ml-1">| Live Proctor</span>
                    </span>
                </div>

                {activeQuiz && (
                    <div className="text-center hidden md:block">
                        <h1 className="text-base font-bold text-gray-800 tracking-wide">{activeQuiz.title}</h1>
                    </div>
                )}

                <div className="flex items-center space-x-4">
                    {timeLeft !== null && !isCompleted && (
                        <div className="flex items-center bg-red-50 text-red-700 border border-red-200 px-3.5 py-1.5 rounded-full font-bold shadow-sm animate-pulse">
                            <ClockIcon className="w-5 h-5 mr-1.5 text-red-600" />
                            <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                    {participant && (
                        <div className="flex items-center bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full shadow-sm">
                            <UserIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                            <span className="text-xs font-bold text-gray-800 tracking-wide">{participant.name}</span>
                            {violations > 0 && (
                                <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold ml-2 uppercase tracking-wide">
                                    {violations} Warning{violations > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 shadow-lg"></div>
            </div>
        );
    }

    if (!activeQuiz) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="text-center p-12 bg-white border border-gray-200 shadow-xl rounded-3xl max-w-md w-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <ClockIcon className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No Active Quiz</h2>
                    <p className="text-gray-500 text-sm mb-8">Please wait for the administrator or instructor to start a live examination session.</p>
                    <button
                        onClick={() => {
                            fetchActiveQuiz();
                            toast.success('Status refreshed');
                        }}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ArrowPathIcon className="w-5 h-5" /> Refresh Status
                    </button>
                </div>
            </div>
        );
    }

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

    const now = new Date();
    const isFutureStart = activeQuiz && activeQuiz.scheduledStartTime && new Date(activeQuiz.scheduledStartTime) > now;
    const isPastEnd = activeQuiz && activeQuiz.scheduledEndTime && new Date(activeQuiz.scheduledEndTime) < now;

    // Step 1: Join & Landing Screen
    if (!participant) {
        if (viewMode === 'landing' || viewMode === 'scoreboard') {
            return (
                <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans text-gray-900">
                    <div className="max-w-4xl w-full bg-white border border-gray-200 p-8 sm:p-12 rounded-2xl shadow-sm transition-all">
                        
                        {/* Title Section */}
                        <div className="text-center mb-10 sm:mb-12">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 mb-4 border border-blue-200">
                                <AcademicCapIcon className="w-4 h-4 mr-2" /> Live Assessment Portal
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">{activeQuiz.title}</h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{activeQuiz.description}</p>
                        </div>

                        {/* Rules Box */}
                        <div className="bg-blue-50/50 border-l-4 border-blue-600 border border-blue-100 p-6 sm:p-8 rounded-xl mb-8 shadow-xs">
                            <h3 className="text-blue-900 font-bold text-lg mb-3 flex items-center">
                                <DocumentTextIcon className="w-6 h-6 mr-2 text-blue-600 flex-shrink-0" /> Important Instructions & Rules
                            </h3>
                            <p className="text-blue-800 text-sm sm:text-base leading-relaxed whitespace-pre-line pl-8 font-medium">{activeQuiz.rules}</p>
                            <div className="mt-6 pt-4 border-t border-blue-200/60 flex items-center text-blue-950 font-bold text-sm sm:text-base pl-8">
                                <ClockIcon className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                                Allotted Time: <span className="ml-1.5 bg-white px-3 py-1 rounded text-blue-700 border border-blue-200 shadow-2xs font-mono font-bold">{activeQuiz.durationMinutes} Minutes</span>
                            </div>
                        </div>

                        {/* Scheduling Status Banner */}
                        {(activeQuiz.scheduledStartTime || activeQuiz.scheduledEndTime) && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl mb-8 shadow-xs">
                                <h4 className="text-blue-950 font-bold text-lg mb-4 flex items-center">
                                    <CalendarIcon className="w-6 h-6 mr-2 text-blue-600 flex-shrink-0" />
                                    Examination Schedule
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-blue-900 mb-4 bg-white/80 p-4 rounded-xl border border-blue-100">
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Scheduled Start</span>
                                        <strong className="font-bold text-gray-900">{formatDate(activeQuiz.scheduledStartTime)}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Scheduled End</span>
                                        <strong className="font-bold text-gray-900">{formatDate(activeQuiz.scheduledEndTime)}</strong>
                                    </div>
                                </div>

                                {isFutureStart && (
                                    <div className="mt-4 pt-4 border-t border-blue-200 text-center animate-pulse">
                                        <div className="inline-flex items-center gap-2 text-amber-800 font-bold bg-amber-100 border border-amber-300 px-5 py-2.5 rounded-xl text-sm shadow-2xs">
                                            <ClockIcon className="w-5 h-5 text-amber-600" />
                                            <span>Starts In:</span>
                                            <span className="font-mono text-lg font-extrabold ml-1">{countdownText || 'Calculating...'}</span>
                                        </div>
                                    </div>
                                )}

                                {isPastEnd && (
                                    <div className="mt-4 pt-4 border-t border-blue-200 text-center">
                                        <div className="inline-flex items-center gap-2 text-red-800 font-bold bg-red-100 border border-red-200 px-4 py-2 rounded-xl text-sm">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                            <span>This examination session has concluded.</span>
                                        </div>
                                    </div>
                                )}

                                {!activeQuiz.isActive && (
                                    <div className="mt-4 pt-4 border-t border-blue-200 text-center">
                                        <div className="inline-flex items-center gap-2 text-red-800 font-bold bg-red-100 border border-red-200 px-4 py-2 rounded-xl text-sm">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                            <span>This examination is currently locked or deactivated by the administrator.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <button
                                onClick={() => {
                                    fetchActiveQuiz();
                                    toast.success('Live status refreshed');
                                }}
                                className="w-full sm:w-auto px-8 py-4 font-bold rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors text-base inline-flex items-center justify-center shadow-2xs cursor-pointer"
                                title="Refresh live telemetry and status"
                            >
                                <ArrowPathIcon className="w-5 h-5 mr-2 text-blue-600" /> Refresh Status
                            </button>
                            <button
                                onClick={() => setViewMode('join')}
                                disabled={!activeQuiz.isActive || isFutureStart || isPastEnd}
                                className={`
                                    w-full sm:w-auto px-10 py-4 font-bold rounded-xl shadow-md transition-all text-base inline-flex items-center justify-center tracking-wide
                                    ${(!activeQuiz.isActive || isFutureStart || isPastEnd) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'}
                                `}
                            >
                                <AcademicCapIcon className="w-6 h-6 mr-2 inline-block" /> Register & Start Examination
                            </button>
                        </div>

                        {/* Directly show Leaderboard */}
                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <TrophyIcon className="w-6 h-6 mr-2.5 text-blue-600" /> Live Standings & Leaderboard
                                </h3>
                                <div className="flex items-center gap-2.5">
                                    <button
                                        onClick={() => {
                                            fetchActiveQuiz();
                                            toast.success('Live standings & status refreshed');
                                        }}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                                        title="Manually refresh standings and quiz status"
                                    >
                                        <ArrowPathIcon className="w-3.5 h-3.5 mr-1 text-blue-600" /> Refresh Standings
                                    </button>
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded uppercase tracking-wider font-mono">Auto updating</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
                                <table className="min-w-full divide-y divide-gray-200 text-left">
                                    <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Participant</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Time Taken</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {scoreboardData.map((p, index) => {
                                            let rankBadge = <span className="text-gray-600 font-bold font-mono">#{index + 1}</span>;
                                            if (index === 0) rankBadge = <span className="text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded font-mono">#1</span>;
                                            if (index === 1) rankBadge = <span className="text-xs font-bold bg-gray-200 text-gray-800 border border-gray-300 px-2.5 py-1 rounded font-mono">#2</span>;
                                            if (index === 2) rankBadge = <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded font-mono">#3</span>;

                                            return (
                                                <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                                                    <td className="px-6 py-4 whitespace-nowrap">{rankBadge}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 font-mono">
                                                            {p.score}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center font-mono font-bold text-xs text-gray-700">
                                                        {formatDuration(p.durationSeconds)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {scoreboardData.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm font-medium">No participants have submitted scores yet. Start your attempt!</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-sans text-gray-900">
                <div className="max-w-xl w-full bg-white border border-gray-200 p-8 sm:p-12 rounded-2xl shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Student Details</h2>
                        <button
                            onClick={() => setViewMode('landing')}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                        >
                            ← Back to Info
                        </button>
                    </div>

                    <form onSubmit={handleJoin} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-xs font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                placeholder="Enter your full name"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                placeholder="student@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="rollNo" className="block text-xs font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">
                                Roll Number / ID (Optional)
                            </label>
                            <input
                                id="rollNo"
                                type="text"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g. 21CS01"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full mt-4 py-3.5 px-6 rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold text-base transition-all cursor-pointer tracking-wide flex items-center justify-center"
                        >
                            <AcademicCapIcon className="w-5 h-5 mr-2 inline-block" /> Enter Fullscreen & Start Quiz
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Fullscreen Overlay
    if (!isFullscreen && participant && !isCompleted) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-white/30 backdrop-blur-xl transition-all duration-300">
                <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg border border-red-200">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Paused (Fullscreen Required)</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        You have exited fullscreen mode. Your actions are being recorded. Please return to fullscreen to resume your quiz.
                        {violations > 0 && (
                            <>
                                <br /><br />
                                <strong className="text-red-600 bg-red-100 px-4 py-2 rounded-xl inline-block shadow-sm">
                                    Total Warnings: {violations}
                                </strong>
                            </>
                        )}
                    </p>
                    <button
                        onClick={async () => {
                            try {
                                const elem = document.documentElement;
                                if (elem.requestFullscreen) {
                                    await elem.requestFullscreen();
                                } else if (elem.webkitRequestFullscreen) {
                                    await elem.webkitRequestFullscreen();
                                } else if (elem.msRequestFullscreen) {
                                    await elem.msRequestFullscreen();
                                }
                            } catch (err) {
                                toast.error('Failed to enter fullscreen');
                            }
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors text-lg"
                    >
                        Return to Fullscreen
                    </button>
                </div>
            </div>
        );
    }

    // Step 3: Completed Screen
    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans text-gray-900">
                <div className="max-w-4xl w-full bg-white border border-gray-200 p-8 sm:p-12 rounded-2xl shadow-sm text-center">
                    <div className="mb-6 inline-flex p-4 bg-green-50 border border-green-200 rounded-full text-green-600 shadow-2xs">
                        <CheckCircleIcon className="w-16 h-16" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">Examination Completed</h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-8 font-medium">Excellent effort, <span className="font-bold text-gray-900">{participant.name}</span>.</p>
                    
                    <div className="bg-blue-50 border border-blue-200 p-8 rounded-xl mb-12 shadow-2xs inline-block min-w-[280px]">
                        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Your Final Score</p>
                        <p className="text-5xl font-extrabold text-blue-950 font-mono tracking-tight">
                            {finalScore} <span className="text-2xl text-blue-600 font-bold font-sans">/ {totalQuestions || activeQuiz.questionCount}</span>
                        </p>
                    </div>

                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <TrophyIcon className="w-6 h-6 mr-2.5 text-blue-600" /> Live Standings & Scoreboard
                        </h3>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded uppercase tracking-wider font-mono">Final Standings</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Participant</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Time Taken</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {scoreboardData.map((p, index) => {
                                    const isMe = p._id === participant._id;
                                    let rankBadge = <span className="text-gray-600 font-bold font-mono">#{index + 1}</span>;
                                    if (index === 0) rankBadge = <span className="text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded font-mono">#1</span>;
                                    if (index === 1) rankBadge = <span className="text-xs font-bold bg-gray-200 text-gray-800 border border-gray-300 px-2.5 py-1 rounded font-mono">#2</span>;
                                    if (index === 2) rankBadge = <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded font-mono">#3</span>;

                                    return (
                                        <tr 
                                            key={p._id} 
                                            className={`
                                                transition-colors duration-150 group
                                                ${isMe ? 'bg-blue-50/80 font-bold' : 'hover:bg-gray-50'}
                                            `}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">{rankBadge}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${isMe ? 'text-blue-700 font-bold' : 'text-gray-900 font-medium'}`}>
                                                    {p.name} {isMe && <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-600 text-white font-bold uppercase tracking-wider">You</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border font-mono ${isMe ? 'bg-blue-600 text-white border-blue-700 shadow-2xs' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                                                    {p.score}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-mono font-bold text-xs text-gray-700">
                                                {formatDuration(p.durationSeconds)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {scoreboardData.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm font-medium">Waiting for class standing results...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Question Screen
    if (!currentQuestion) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col font-sans">
            {renderTopBar()}

            {/* Main Content Area */}
            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Left: Heatmap Palette */}
                <div className="lg:w-1/4 flex-shrink-0">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 lg:sticky top-24 shadow-sm">
                        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Question Map</h3>
                            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200/60 font-mono">
                                {currentIndex + 1} / {totalQuestions}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-2.5 max-h-40 lg:max-h-none overflow-y-auto overflow-x-hidden p-1">
                            {Array.from({ length: totalQuestions }).map((_, idx) => {
                                let statusClass = "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"; 
                                const qId = questionIds[idx];
                                const answer = answersHistory.find(a => a.questionId === qId);

                                if (idx === currentIndex) {
                                    statusClass = "bg-blue-600 border-blue-600 text-white font-black shadow-lg shadow-blue-500/30 scale-105 transform ring-4 ring-blue-100";
                                } else if (answer?.isSkipped) {
                                    statusClass = "bg-amber-100 border-amber-300 text-amber-800 font-bold shadow-2xs";
                                } else if (answer?.isCorrect) {
                                    statusClass = "bg-green-100 border-green-300 text-green-800 font-bold shadow-2xs";
                                } else if (answer && !answer.isCorrect) {
                                    statusClass = "bg-red-100 border-red-300 text-red-800 font-bold shadow-2xs";
                                }

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => !isSubmitting && fetchCurrentQuestion(idx)}
                                        className={`flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all ${statusClass}`}
                                    >
                                        {idx + 1}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2.5 flex justify-between lg:flex-col lg:justify-start lg:space-y-3 font-medium">
                            <div className="flex items-center text-xs text-gray-700">
                                <div className="w-3.5 h-3.5 rounded-lg bg-green-100 border border-green-300 mr-2.5 flex-shrink-0 shadow-2xs"></div> Solved (Correct)
                            </div>
                            <div className="flex items-center text-xs text-gray-700">
                                <div className="w-3.5 h-3.5 rounded-lg bg-red-100 border border-red-300 mr-2.5 flex-shrink-0 shadow-2xs"></div> Solved (Incorrect)
                            </div>
                            <div className="flex items-center text-xs text-gray-700">
                                <div className="w-3.5 h-3.5 rounded-lg bg-amber-100 border border-amber-300 mr-2.5 flex-shrink-0 shadow-2xs"></div> Skipped
                            </div>
                            <div className="flex items-center text-xs text-gray-700">
                                <div className="w-3.5 h-3.5 rounded-lg bg-blue-600 border border-blue-600 mr-2.5 flex-shrink-0 shadow-2xs"></div> Active Question
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Question Area */}
                <div className="lg:w-3/4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
                        
                        <div className="mb-6 inline-flex items-center px-4 py-1.5 bg-blue-50 border border-blue-200/60 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs">
                            Question {currentIndex + 1} of {totalQuestions}
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-8 sm:mb-10 leading-relaxed font-sans tracking-tight">
                            {currentQuestion.text}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedOption === option;
                                return (
                                    <div 
                                        key={index}
                                        onClick={() => !isSubmitting && setSelectedOption(option)}
                                        className={`
                                            p-4 border rounded-xl cursor-pointer transition-colors flex items-center
                                            ${isSelected 
                                                ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-600' 
                                                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50/50'
                                            }
                                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className={`
                                            w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center mr-4 sm:mr-5 flex-shrink-0 transition-colors shadow-2xs
                                            ${isSelected ? 'border-blue-600 bg-white' : 'border-gray-300 bg-gray-50'}
                                        `}>
                                            {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full animate-scale-in"></div>}
                                        </div>
                                        
                                        <span className={`text-base sm:text-lg font-bold ${isSelected ? 'text-blue-950' : 'text-gray-800'} break-words w-full tracking-tight`}>
                                            {option}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 sm:mt-12 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                            <button
                                onClick={() => handleSubmitAnswer(true)}
                                disabled={isSubmitting}
                                className={`
                                    w-full sm:w-auto px-6 py-3.5 rounded-lg border border-gray-300 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer
                                    ${isSubmitting ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}
                                `}
                            >
                                Skip Question <ChevronRightIcon className="w-4 h-4 ml-1.5" />
                            </button>

                            <button
                                onClick={() => handleSubmitAnswer(false)}
                                disabled={!selectedOption || isSubmitting}
                                className={`
                                    w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold shadow transition-all flex justify-center items-center tracking-wide cursor-pointer
                                    ${!selectedOption || isSubmitting
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }
                                `}
                            >
                                <span className="flex items-center">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : 'Save & Next'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveQuiz;
