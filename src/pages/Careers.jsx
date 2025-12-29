import React, { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../services/jobsAPI';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, Search, Filter, Building2, ChevronRight, Heart, Zap, Users, Coffee, X, Upload, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        location: '',
        jobType: ''
    });
    const [selectedJob, setSelectedJob] = useState(null);
    const { user } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        loadJobs();
    }, [filters]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const { data } = await jobsAPI.getAll(filters);
            setJobs(data.jobs);
        } catch (error) {
            console.error('Load jobs error:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = async (job) => {
        if (!user) {
            toast.error('Please log in to apply for jobs');
            navigate('/login');
            return;
        }

        // Check if user has already applied for this job
        try {
            const { data } = await applicationsAPI.getMyApplications();
            const alreadyApplied = data.applications.some(app => app.jobId?._id === job._id);
            
            if (alreadyApplied) {
                toast.error('You have already applied for this job. Check your applications page for status.');
                return;
            }
            
            // If not applied, open modal
            setSelectedJob(job);
        } catch (error) {
            console.error('Check application error:', error);
            // If check fails, still allow them to try (API will catch duplicate)
            setSelectedJob(job);
        }
    };

    const perks = [
        { icon: <Heart />, title: 'Health & Wellness', desc: 'Comprehensive health insurance for you and family' },
        { icon: <Zap />, title: 'Learning Budget', desc: '₹50,000/year for courses, books, and conferences' },
        { icon: <Users />, title: 'Remote Friendly', desc: 'Work from anywhere in India' },
        { icon: <Coffee />, title: 'Unlimited PTO', desc: 'Take time off when you need it' },
    ];

    const getLocationIcon = (location) => {
        switch (location) {
            case 'Remote': return '🌍';
            case 'Hybrid': return '🏢';
            case 'On-site': return '🏛️';
            default: return '📍';
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-16">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Join Our Team
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Help us build the future of content authenticity. We're looking for passionate people to join our mission.
                    </p>
                </motion.div>

                {/* Perks */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {perks.map((perk, idx) => (
                        <div key={idx} className="bg-background/50 border border-white/10 rounded-xl p-6 text-center">
                            <div className="inline-flex p-3 rounded-xl bg-cyan-500/20 text-cyan-400 mb-4">
                                {perk.icon}
                            </div>
                            <h3 className="font-bold text-white mb-1">{perk.title}</h3>
                            <p className="text-sm text-gray-400">{perk.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="" className="bg-gray-900">All Departments</option>
                            <option value="Engineering" className="bg-gray-900">Engineering</option>
                            <option value="Product" className="bg-gray-900">Product</option>
                            <option value="Marketing" className="bg-gray-900">Marketing</option>
                            <option value="Sales" className="bg-gray-900">Sales</option>
                            <option value="Support" className="bg-gray-900">Support</option>
                        </select>

                        <select
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="" className="bg-gray-900">All Locations</option>
                            <option value="Remote" className="bg-gray-900">Remote</option>
                            <option value="Hybrid" className="bg-gray-900">Hybrid</option>
                            <option value="On-site" className="bg-gray-900">On-site</option>
                        </select>

                        <select
                            value={filters.jobType}
                            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="" className="bg-gray-900">All Types</option>
                            <option value="Full-time" className="bg-gray-900">Full-time</option>
                            <option value="Part-time" className="bg-gray-900">Part-time</option>
                            <option value="Contract" className="bg-gray-900">Contract</option>
                            <option value="Internship" className="bg-gray-900">Internship</option>
                        </select>
                    </div>
                </div>

                {/* Open Positions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500 border-t-transparent"></div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-xl text-gray-400">No job openings found</p>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="bg-background/50 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all cursor-pointer group"
                                    onClick={() => handleApplyClick(job)}
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">{job.department}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                job.jobType === 'Full-time' ? 'bg-green-500/20 text-green-400' :
                                                job.jobType === 'Part-time' ? 'bg-blue-500/20 text-blue-400' :
                                                job.jobType === 'Contract' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-orange-500/20 text-orange-400'
                                            }`}>
                                                {job.jobType}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{job.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {getLocationIcon(job.location)} {job.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.jobType}</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-all group-hover:gap-3">
                                        Apply Now <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Don't see a role that fits?</h2>
                    <p className="text-gray-400 mb-6">We're always looking for talented people. Send us your resume!</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText('careers@plagzap.com');
                                toast.success('Email copied! Send your resume to careers@plagzap.com');
                            }}
                            className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            📧 Copy Email Address
                        </button>
                        <a
                            href="mailto:careers@plagzap.com?subject=Job Application - General&body=Hi, I'm interested in opportunities at PlagZap."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors"
                        >
                            ✉️ Open Email App
                        </a>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">careers@plagzap.com</p>
                </motion.div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <ApplicationModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                        onSuccess={() => {
                            setSelectedJob(null);
                            toast.success('Application submitted successfully!');
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Application Modal Component
const ApplicationModal = ({ job, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        coverLetter: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload a PDF, DOC, or DOCX file');
                return;
            }
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size must be less than 2MB');
                return;
            }
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resumeFile) {
            toast.error('Please upload your resume');
            return;
        }

        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('resume', resumeFile);
            formDataToSend.append('coverLetter', formData.coverLetter);

            await applicationsAPI.apply(job._id, formDataToSend);
            onSuccess();
        } catch (error) {
            if (error.response?.data?.error?.includes('already applied')) {
                toast.error('You have already applied for this job');
            } else {
                toast.error(error.response?.data?.error || 'Failed to submit application');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Apply for {job.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Job Details */}
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{job.department}</span>
                        <span className="text-gray-600">•</span>
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{job.location}</span>
                        <span className="text-gray-600">•</span>
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{job.jobType}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{job.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Resume Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Resume/CV *
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                            />
                            <label
                                htmlFor="resume-upload"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-cyan-500/50 hover:bg-white/10 transition-all"
                            >
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-300">
                                    {resumeFile ? resumeFile.name : 'Upload Resume (PDF, DOC, DOCX, max 2MB)'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cover Letter (Optional)
                        </label>
                        <textarea
                            value={formData.coverLetter}
                            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                            rows={6}
                            placeholder="Tell us why you're a great fit for this role..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !resumeFile}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                        >
                            {submitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Careers;
