import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingAPI } from '../services/meetingAPI';
import { Video, Copy, Check, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Meeting Lobby Component
 * Create or join video meetings from Team Dashboard
 */
const MeetingLobby = ({ teamId, teamName }) => {
    const navigate = useNavigate();
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [recentMeetings, setRecentMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Load recent meetings
    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            setLoading(true);
            const response = await meetingAPI.getMyMeetings();
            setRecentMeetings(response.data.meetings || []);
        } catch (error) {
            console.error('Error loading meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        try {
            const { clearMeetingHistory } = await import('../services/api');
            const response = await clearMeetingHistory();
            if (response.data.success) {
                setRecentMeetings([]);
                toast.success('Meeting history cleared successfully');
            }
        } catch (error) {
            console.error('Error clearing history:', error);
            toast.error('Failed to clear meeting history');
        }
    };

    // Create instant meeting
    const handleCreateMeeting = async () => {
        setCreating(true);
        try {
            const response = await meetingAPI.createMeeting(
                `${teamName} - Team Meeting`,
                50
            );
            const meetingCode = response.data.meeting.code;
            toast.success('Meeting created!');
            
            // Navigate to meeting
            navigate(`/meet/${meetingCode}`);
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast.error(error.response?.data?.error || 'Failed to create meeting');
        } finally {
            setCreating(false);
        }
    };

    // Join existing meeting
    const handleJoinMeeting = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setJoining(true);
        try {
            // Format code if needed
            const formattedCode = joinCode.toUpperCase().replace(/\s/g, '');
            
            // Validate meeting exists
            await meetingAPI.getMeeting(formattedCode);
            
            // Navigate to meeting
            navigate(`/meet/${formattedCode}`);
        } catch (error) {
            console.error('Error joining meeting:', error);
            toast.error(error.response?.data?.error || 'Meeting not found');
        } finally {
            setJoining(false);
        }
    };

    // Copy meeting code
    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Meeting code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Development Notice Banner */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-yellow-400 font-semibold text-sm mb-1">
                            🚧 Meeting Feature in Development
                        </h4>
                        <p className="text-gray-300 text-sm">
                            This feature is currently under development. If you encounter any bugs or issues, please report them to help us improve!
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Create Meeting Card */}
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center shrink-0">
                            <Video className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">Start Instant Meeting</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Create a meeting room instantly for your team
                            </p>
                            <button
                                onClick={handleCreateMeeting}
                                disabled={creating}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-5 h-5" />
                                        New Meeting
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Join Meeting Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">Join Meeting</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Enter a meeting code to join
                            </p>
                            <form onSubmit={handleJoinMeeting} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="ABC-DEFG-HIJ"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 font-mono text-center tracking-wider focus:outline-none focus:border-blue-500 transition-colors uppercase"
                                    maxLength={13}
                                />
                                <button
                                    type="submit"
                                    disabled={joining || !joinCode.trim()}
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {joining ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Joining...
                                        </>
                                    ) : (
                                        'Join'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Your Meetings Section */}
            <div className="bg-[#202124] border border-[#5f6368] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-[#8ab4f8]" />
                        <h3 className="text-lg font-medium text-white">Your Meetings</h3>
                    </div>
                    {recentMeetings.length > 0 && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear all meeting history? This cannot be undone.')) {
                                    handleClearHistory();
                                }
                            }}
                            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                            Clear History
                        </button>
                    )}
                </div>
                {loading ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Loading meetings...</p>
                    </div>
                ) : recentMeetings.length === 0 ? (
                    <div className="text-center py-12">
                        <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No meetings yet</p>
                        <p className="text-gray-500 text-sm mt-1">Create your first meeting to get started</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentMeetings.map((meeting) => (
                            <div
                                key={meeting.code}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-black/30 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all group gap-3"
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm mb-1 truncate">{meeting.title}</h4>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                                        <span className="font-mono bg-white/5 px-2 py-0.5 rounded">{meeting.code}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {meeting.participantCount}
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                            meeting.status === 'active' 
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <button
                                        onClick={() => copyCode(meeting.code)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Copy code"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/meet/${meeting.code}`)}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingLobby;
