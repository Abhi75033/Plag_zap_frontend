import React, { useState, useEffect } from 'react';
import { applicationsAPI } from '../services/jobsAPI';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2, Clock, Video, AlertCircle, CheckCircle, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const { data } = await applicationsAPI.getMyApplications();
            setApplications(data.applications);
        } catch (error) {
            console.error('Load applications error:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            reviewed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            interviewed: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
            approved: 'bg-green-500/10 text-green-400 border-green-500/30',
            rejected: 'bg-red-500/10 text-red-400 border-red-500/30'
        };
        return colors[status] || colors.applied;
    };

    const getStatusIcon = (status) => {
        const icons = {
            applied: <AlertCircle className="w-4 h-4" />,
            reviewed: <Eye className="w-4 h-4" />,
            interviewed: <Video className="w-4 h-4" />,
            approved: <CheckCircle className="w-4 h-4" />,
            rejected: <XCircle className="w-4 h-4" />
        };
        return icons[status] || icons.applied;
    };

    const getStatusText = (status) => {
        const texts = {
            applied: 'Application Submitted',
            reviewed: 'Under Review',
            interviewed: 'Interview Scheduled',
            approved: 'Approved',
            rejected: 'Not Selected'
        };
        return texts[status] || status;
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        My Applications
                    </h1>
                    <p className="text-gray-400">Track the status of your job applications</p>
                </motion.div>

                {/* Applications List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500 border-t-transparent"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-xl text-gray-400">No applications yet</p>
                        <p className="text-gray-500 mt-2">Start applying for open positions!</p>
                        <a href="/careers" className="mt-6 inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors">
                            View Open Positions
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{app.jobId?.title}</h3>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-4 h-4" />
                                                        {app.jobId?.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {app.jobId?.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {app.jobId?.jobType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {getStatusText(app.status)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>

                                        {/* Interview Details */}
                                        {app.status === 'interviewed' && app.interviewDate && (
                                            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                                <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Interview Scheduled
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-gray-300">
                                                        <span className="text-gray-400">Date & Time:</span>{' '}
                                                        {new Date(app.interviewDate).toLocaleString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                    {app.interviewLink && (
                                                        <a
                                                            href={app.interviewLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                        >
                                                            <Video className="w-4 h-4" />
                                                            Join Interview
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Status Message */}
                                        {app.status === 'approved' && (
                                            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                                <p className="text-sm text-green-400">
                                                    🎉 Congratulations! Our HR team will contact you with the next steps.
                                                </p>
                                            </div>
                                        )}
                                        {app.status === 'rejected' && (
                                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                <p className="text-sm text-red-400">
                                                    Thank you for your interest. We've decided to move forward with other candidates.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Application Timeline */}
                                {app.statusHistory && app.statusHistory.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Application Timeline</h4>
                                        <div className="space-y-2">
                                            {app.statusHistory.slice().reverse().map((history, idx) => (
                                                <div key={idx} className="flex items-start gap-3 text-sm">
                                                    <div className={`mt-1 p-1 rounded-full ${getStatusColor(history.status)} border`}>
                                                        {getStatusIcon(history.status)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">{getStatusText(history.status)}</p>
                                                        <p className="text-gray-500 text-xs">
                                                            {new Date(history.changedAt).toLocaleString()}
                                                        </p>
                                                        {history.notes && (
                                                            <p className="text-gray-400 text-xs mt-1">{history.notes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
