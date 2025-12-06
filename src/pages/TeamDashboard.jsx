import React, { useState, useEffect } from 'react';
import { getTeam, createTeam, joinTeam, leaveTeam } from '../services/api';
import { Users, UserPlus, LogOut, Copy, Check, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

const TeamDashboard = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteCodeInput, setInviteCodeInput] = useState('');
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);

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

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div></div>;

    return (
        <div className="min-h-screen pt-24 px-4 pb-10 max-w-4xl mx-auto">
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
                <div className="space-y-8">
                    {/* Team Header */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{team.name}</h2>
                                <p className="text-gray-300 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    {team.members.length} Members
                                </p>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex flex-col items-center min-w-[200px]">
                                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Invite Code</span>
                                <button
                                    onClick={copyCode}
                                    className="flex items-center gap-2 text-2xl font-mono font-bold text-white hover:text-purple-400 transition-colors"
                                >
                                    {team.inviteCode}
                                    <Copy className="w-5 h-5 opacity-50" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Team Members</h3>
                            <button
                                onClick={handleLeave}
                                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Leave Team
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {team.members.map((member) => (
                                <div key={member._id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center font-bold text-lg">
                                            {member.user?.name?.charAt(0) || <User className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold">{member.user?.name || 'Unknown User'}</p>
                                            <p className="text-sm text-gray-500">{member.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            member.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {member.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamDashboard;
