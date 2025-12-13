import React, { useState, useEffect } from 'react';
import { getTeam, createTeam, joinTeam, leaveTeam } from '../services/api';
import { Users, UserPlus, LogOut, Copy, Check, Shield, User, MessageSquare, BarChart3, FileText, CheckSquare, Trophy, BookOpen, Video as VideoIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import TeamChat from '../components/TeamChat';
import TeamAnalytics from '../components/TeamAnalytics';
import SharedHistory from '../components/SharedHistory';
import TeamTasks from '../components/TeamTasks';
import TeamLeaderboard from '../components/TeamLeaderboard';
import TeamDictionary from '../components/TeamDictionary';
import MeetingLobby from '../components/MeetingLobby';

import { useAppContext } from '../context/AppContext';

const TeamDashboard = () => {
    // ... (existing state) ...
    

    const { user } = useAppContext();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteCodeInput, setInviteCodeInput] = useState('');
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        try {
            const { data } = await getTeam();
            setTeam(data.team);
        } catch (error) {
            console.error('Failed to load team', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTeamName) return;
        setCreating(true);
        try {
            await createTeam(newTeamName);
            toast.success('Team created!');
            loadTeam();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create team');
        } finally {
            setCreating(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!inviteCodeInput) return;
        setJoining(true);
        try {
            await joinTeam(inviteCodeInput);
            toast.success('Joined team successfully!');
            loadTeam();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to join team');
        } finally {
            setJoining(false);
        }
    };

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this team?')) return;
        try {
            await leaveTeam();
            toast.success('Left team');
            setTeam(null);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to leave team');
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(team.inviteCode);
        toast.success('Invite code copied');
    };

    // Check if current user is admin
    // Note: user from context has 'id', team member objects have '_id'
    const userId = user?.id || user?._id;
    const ownerId = team?.owner?._id || team?.owner;
    const isAdmin = team?.members?.some(m => 
        (m.user?._id === userId || m.user === userId) && m.role === 'admin'
    ) || ownerId === userId;

    console.log('isAdmin check:', { isAdmin, ownerId, userId, members: team?.members });

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div></div>;

    return (
        <div className="min-h-screen pt-24 px-4 pb-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Users className="text-purple-400" />
                Team & Agency
            </h1>

            {!team ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create Team */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold mb-4">Create a New Team</h2>
                        <p className="text-gray-400 mb-6 text-sm">Start your own agency workspace. You will be the admin.</p>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Team Name (e.g. Acme Corp)"
                                value={newTeamName}
                                onChange={e => setNewTeamName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={creating || !newTeamName}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Create Team'}
                            </button>
                        </form>
                    </div>

                    {/* Join Team */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold mb-4">Join Existing Team</h2>
                        <p className="text-gray-400 mb-6 text-sm">Enter the invite code shared by your team admin.</p>
                        <form onSubmit={handleJoin} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Invite Code (e.g. A1B2C3)"
                                value={inviteCodeInput}
                                onChange={e => setInviteCodeInput(e.target.value.toUpperCase())}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono tracking-widest"
                                maxLength={6}
                            />
                            <button
                                type="submit"
                                disabled={joining || !inviteCodeInput}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {joining ? 'Joining...' : 'Join Team'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Team Header */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">{team.name}</h2>
                                <p className="text-gray-300 flex items-center gap-2 text-sm">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    {team.members.length} Members
                                </p>
                            </div>
                            <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Invite Code</span>
                                <button
                                    onClick={copyCode}
                                    className="flex items-center gap-2 text-xl font-mono font-bold text-white hover:text-purple-400 transition-colors"
                                >
                                    {team.inviteCode}
                                    <Copy className="w-4 h-4 opacity-50" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs - Horizontally Scrollable */}
                    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex gap-1 sm:gap-2 border-b border-white/10 pb-2 min-w-max">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'chat'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="hidden sm:inline">Chat</span>
                                <span className="sm:hidden">Chat</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'analytics'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Analytics</span>
                                <span className="sm:hidden">Stats</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'history'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <FileText className="w-4 h-4" />
                                <span>Shared</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'tasks'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <CheckSquare className="w-4 h-4" />
                                <span>Tasks</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'leaderboard'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Trophy className="w-4 h-4" />
                                <span className="hidden sm:inline">Leaderboard</span>
                                <span className="sm:hidden">Rank</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('members')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'members'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Users className="w-4 h-4" />
                                <span>Members</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('dictionary')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'dictionary'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden sm:inline">Dictionary</span>
                                <span className="sm:hidden">Dict</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('meet')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === 'meet'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <VideoIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Video Meet</span>
                                <span className="sm:hidden">Meet</span>
                            </button>

                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'chat' && (
                        <TeamChat 
                            teamId={team._id} 
                            currentUserId={userId} 
                            isAdmin={isAdmin} 
                        />
                    )}
                    {activeTab === 'analytics' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <TeamAnalytics />
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <SharedHistory />
                        </div>
                    )}
                    {activeTab === 'tasks' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <TeamTasks />
                        </div>
                    )}
                    {activeTab === 'leaderboard' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <TeamLeaderboard />
                        </div>
                    )}
                    {activeTab === 'members' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
                                <h3 className="text-lg sm:text-xl font-bold">Team Members</h3>
                                <button
                                    onClick={handleLeave}
                                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium px-3 sm:px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Leave Team</span>
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {team.members.map((member) => (
                                    <div 
                                        key={member._id} 
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-black/30 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                                                {member.user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5 sm:w-6 sm:h-6" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-sm sm:text-base truncate">
                                                    {member.user?.name || 'Unknown User'}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-400 truncate">
                                                    {member.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 self-end sm:self-auto">
                                            <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                                                member.role === 'admin' 
                                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'dictionary' && (
                        <div className="mt-6">
                            <TeamDictionary />
                        </div>
                    )}
                    {activeTab === 'meet' && (
                        <div className="mt-6">
                            <MeetingLobby teamId={team._id} teamName={team.name} />
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default TeamDashboard;
