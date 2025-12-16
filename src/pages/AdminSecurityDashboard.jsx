import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Users, Activity, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminSecurityDashboard = () => {
    const [stats, setStats] = useState({
        suspiciousDevices: 0,
        blockedAttempts: 0,
        captchaChallenges: 0,
        activeUsers: 0,
        last24h: {
            suspiciousActivity: 0,
            blockedRequests: 0,
            captchasPassed: 0,
            captchasFailed: 0
        }
    });
    
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            setRefreshing(true);
            const [statsRes, devicesRes] = await Promise.all([
                api.get('/admin/security/stats'),
                api.get('/admin/security/devices?limit=20')
            ]);
            
            if (statsRes.data.success) {
                setStats(statsRes.data.stats);
            }
            
            if (devicesRes.data.success) {
                setDevices(devicesRes.data.devices);
            }
        } catch (error) {
            console.error('Failed to fetch security data:', error);
            toast.error('Failed to load security data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    
    const handleFlagDevice = async (deviceId) => {
        try {
            await api.post(`/admin/security/device/${deviceId}/flag`, {
                reason: 'Flagged by admin'
            });
            toast.success('Device flagged as suspicious');
            fetchData();
        } catch (error) {
            toast.error('Failed to flag device');
        }
    };
    
    const handleUnflagDevice = async (deviceId) => {
        try {
            await api.post(`/admin/security/device/${deviceId}/unflag`);
            toast.success('Device unflagged');
            fetchData();
        } catch (error) {
            toast.error('Failed to unflag device');
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading security dashboard...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-purple-500" />
                            Security Dashboard
                        </h1>
                        <p className="text-gray-400 mt-1">Monitor and manage security threats</p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={AlertTriangle}
                        title="Suspicious Devices"
                        value={stats.suspiciousDevices}
                        color="red"
                        subtitle={`${stats.last24h.suspiciousActivity} in last 24h`}
                    />
                    <StatCard
                        icon={Shield}
                        title="Blocked Attempts"
                        value={stats.blockedAttempts}
                        color="yellow"
                        subtitle={`${stats.last24h.blockedRequests} in last 24h`}
                    />
                    <StatCard
                        icon={Activity}
                        title="CAPTCHA Challenges"
                        value={stats.captchaChallenges}
                        color="blue"
                        subtitle={`${stats.last24h.captchasPassed} passed / ${stats.last24h.captchasFailed} failed`}
                    />
                    <StatCard
                        icon={Users}
                        title="Active Users"
                        value={stats.activeUsers}
                        color="green"
                        subtitle="Last 24 hours"
                    />
                </div>
                
                {/* Suspicious Devices Table */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Suspicious Devices
                    </h2>
                    
                    {devices.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No suspicious devices detected</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">User</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Trust Score</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">IPs</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Reasons</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Last Seen</th>
                                        <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devices.map(device => (
                                        <tr key={device._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-white">
                                                {device.userId?.name || 'Unknown'}
                                                <div className="text-xs text-gray-500">{device.userId?.email}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                    device.trustScore >= 70 ? 'bg-green-500/20 text-green-400' :
                                                    device.trustScore >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {device.trustScore}/100
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 text-sm">
                                                {device.ipAddresses?.length || 0}
                                            </td>
                                            <td className="py-3 px-4">
                                                {device.suspicionReasons?.length > 0 ? (
                                                    <div className="text-xs text-red-400">
                                                        {device.suspicionReasons.join(', ')}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-xs">None</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-gray-400 text-sm">
                                                {new Date(device.lastSeen).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {device.isSuspicious ? (
                                                        <button
                                                            onClick={() => handleUnflagDevice(device._id)}
                                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs flex items-center gap-1"
                                                        >
                                                            <CheckCircle className="w-3 h-3" />
                                                            Unflag
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleFlagDevice(device._id)}
                                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs flex items-center gap-1"
                                                        >
                                                            <XCircle className="w-3 h-3" />
                                                            Flag
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                {/* Info Banner */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400">
                        💡 <strong>Tip:</strong> Devices are automatically flagged based on risk scoring. Manual flagging is available for additional control.
                    </p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, color, subtitle }) => {
    const colorClasses = {
        red: 'from-red-600 to-pink-600',
        yellow: 'from-yellow-600 to-orange-600',
        blue: 'from-blue-600 to-purple-600',
        green: 'from-green-600 to-emerald-600'
    };
    
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</p>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default AdminSecurityDashboard;
