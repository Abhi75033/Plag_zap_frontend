import React, { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../../services/jobsAPI';
import { Briefcase, Plus, Edit2, Trash2, Eye, EyeOff, Building2, MapPin, Clock, Users as UsersIcon, CheckCircle, XCircle, Calendar, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const JobsManager = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs');
    const [showJobForm, setShowJobForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [filters, setFilters] = useState({ status: '', jobId: '', search: '' });

    useEffect(() => {
        loadData();
    }, [activeTab, filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'jobs') {
                const { data } = await jobsAPI.getAllAdmin();
                setJobs(data.jobs);
            } else {
                const [appsRes, statsRes] = await Promise.all([
                    applicationsAPI.getAll(filters),
                    applicationsAPI.getStats()
                ]);
                setApplications(appsRes.data.applications);
                setStats(statsRes.data);
            }
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;
        
        try {
            await jobsAPI.delete(id);
            toast.success('Job deleted successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    const handleUpdateStatus = async (appId, status) => {
        try {
            await applicationsAPI.updateStatus(appId, { status });
            toast.success('Status updated successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDownloadResume = async (appId, applicantName) => {
        try {
            const response = await applicationsAPI.downloadResume(appId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${applicantName}_resume.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download resume');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: 'bg-blue-500/10 text-blue-400',
            reviewed: 'bg-yellow-500/10 text-yellow-400',
            interviewed: 'bg-purple-500/10 text-purple-400',
            approved: 'bg-green-500/10 text-green-400',
            rejected: 'bg-red-500/10 text-red-400'
        };
        return colors[status] || colors.applied;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-cyan-400" />
                    Careers Management
                </h2>
                {activeTab === 'jobs' && (
                    <button
                        onClick={() => { setSelectedJob(null); setShowJobForm(true); }}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-medium flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Post New Job
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'jobs' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Job Postings
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'applications' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                    <UsersIcon className="w-4 h-4 inline mr-2" />
                    Applications
                </button>
            </div>

            {/* Stats Cards (Applications tab) */}
            {activeTab === 'applications' && stats && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-white' },
                        { label: 'Applied', value: stats.applied, color: 'text-blue-400' },
                        { label: 'Reviewed', value: stats.reviewed, color: 'text-yellow-400' },
                        { label: 'Interviewed', value: stats.interviewed, color: 'text-purple-400' },
                        { label: 'Approved', value: stats.approved, color: 'text-green-400' },
                        { label: 'Rejected', value: stats.rejected, color: 'text-red-400' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Jobs List */}
            {activeTab === 'jobs' && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500 border-t-transparent"></div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-xl text-gray-400">No job postings yet</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{job.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                job.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                                            }`}>
                                                {job.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {job.jobType}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm line-clamp-2">{job.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setSelectedJob(job); setShowJobForm(true); }}
                                            className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Applications List */}
            {activeTab === 'applications' && (
                <div>
                    {/* Filters */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="" className="bg-gray-900">All Statuses</option>
                                <option value="applied" className="bg-gray-900">Applied</option>
                                <option value="reviewed" className="bg-gray-900">Reviewed</option>
                                <option value="interviewed" className="bg-gray-900">Interviewed</option>
                                <option value="approved" className="bg-gray-900">Approved</option>
                                <option value="rejected" className="bg-gray-900">Rejected</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Search applicants..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </div>

                    {/* Applications Table */}
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Applicant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Job</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Applied</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-white">{app.applicantName}</div>
                                                    <div className="text-sm text-gray-400">{app.applicantEmail}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{app.jobId?.title}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)} bg-transparent border border-current`}
                                                >
                                                    <option value="applied" className="bg-gray-900">Applied</option>
                                                    <option value="reviewed" className="bg-gray-900">Reviewed</option>
                                                    <option value="interviewed" className="bg-gray-900">Interviewed</option>
                                                    <option value="approved" className="bg-gray-900">Approved</option>
                                                    <option value="rejected" className="bg-gray-900">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedApplication(app)}
                                                        className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadResume(app._id, app.applicantName)}
                                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="Download Resume"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Form Modal - Placeholder */}
            {showJobForm && (
                <JobFormModal
                    job={selectedJob}
                    onClose={() => { setShowJobForm(false); setSelectedJob(null); }}
                    onSuccess={() => { setShowJobForm(false); setSelectedJob(null); loadData(); }}
                />
            )}

            {/* Application Details Modal - Placeholder */}
            {selectedApplication && (
                <ApplicationDetailsModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onUpdate={loadData}
                />
            )}
        </div>
    );
};

// Placeholder modals - will implement fully after multer is installed
const JobFormModal = ({ job, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(job || {
        title: '',
        department: '',
        location: 'Remote',
        jobType: 'Full-time',
        description: '',
        requirements: '',
        responsibilities: '',
        salaryRange: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                requirements: formData.requirements.split('\n').filter(r => r.trim()),
                responsibilities: formData.responsibilities.split('\n').filter(r => r.trim())
            };
            
            if (job) {
                await jobsAPI.update(job._id, data);
                toast.success('Job updated successfully');
            } else {
                await jobsAPI.create(data);
                toast.success('Job created successfully');
            }
            onSuccess();
        } catch (error) {
            toast.error('Failed to save job');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">{job ? 'Edit Job' : 'Post New Job'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Job Title *"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Department *"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                            required
                        />
                        <select
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        >
                            <option value="Remote" className="bg-gray-900">Remote</option>
                            <option value="Hybrid" className="bg-gray-900">Hybrid</option>
                            <option value="On-site" className="bg-gray-900">On-site</option>
                        </select>
                    </div>

                    <select
                        value={formData.jobType}
                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                        <option value="Full-time" className="bg-gray-900">Full-time</option>
                        <option value="Part-time" className="bg-gray-900">Part-time</option>
                        <option value="Contract" className="bg-gray-900">Contract</option>
                        <option value="Internship" className="bg-gray-900">Internship</option>
                    </select>

                    <textarea
                        placeholder="Job Description *"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                        required
                    />

                    <textarea
                        placeholder="Requirements (one per line)"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                    />

                    <textarea
                        placeholder="Responsibilities (one per line)"
                        value={formData.responsibilities}
                        onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                    />

                    <input
                        type="text"
                        placeholder="Salary Range (optional)"
                        value={formData.salaryRange}
                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium"
                        >
                            {job ? 'Update' : 'Create'} Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ApplicationDetailsModal = ({ application, onClose, onUpdate }) => {
    const [interviewData, setInterviewData] = useState({
        interviewDate: '',
        interviewLink: ''
    });

    const handleScheduleInterview = async () => {
        try {
            await applicationsAPI.scheduleInterview(application._id, interviewData);
            toast.success('Interview scheduled successfully');
            onUpdate();
            onClose();
        } catch (error) {
            toast.error('Failed to schedule interview');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Application Details</h2>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-400">Applicant</p>
                        <p className="text-lg font-semibold text-white">{application.applicantName}</p>
                        <p className="text-sm text-gray-400">{application.applicantEmail}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">Job</p>
                        <p className="text-lg text-white">{application.jobId?.title}</p>
                    </div>

                    {application.coverLetter && (
                        <div>
                            <p className="text-sm text-gray-400 mb-2">Cover Letter</p>
                            <p className="text-white bg-white/5 p-4 rounded-lg">{application.coverLetter}</p>
                        </div>
                    )}

                    {/* Interview Section */}
                    {application.status !== 'approved' && application.status !== 'rejected' && (
                        <div className="border-t border-white/10 pt-4">
                            <h3 className="text-lg font-bold text-white mb-3">Schedule Interview</h3>
                            <div className="space-y-3">
                                <input
                                    type="datetime-local"
                                    value={interviewData.interviewDate}
                                   onChange={(e) => setInterviewData({ ...interviewData, interviewDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                />
                                <input
                                    type="url"
                                    placeholder="Virtual Interview Link (e.g., Zoom, Google Meet)"
                                    value={interviewData.interviewLink}
                                    onChange={(e) => setInterviewData({ ...interviewData, interviewLink: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                />
                                <button
                                    onClick={handleScheduleInterview}
                                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Schedule Interview
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsManager;
