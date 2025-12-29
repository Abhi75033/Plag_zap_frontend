import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/contactAPI';
import { Mail, MessageSquare, Eye, Trash2, Check, Archive, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [filters, setFilters] = useState({ status: '', search: '' });
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [filters, page]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [contactsRes, statsRes] = await Promise.all([
                contactAPI.getAll({ ...filters, page }),
                contactAPI.getStats()
            ]);
            setContacts(contactsRes.data.contacts);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Load contacts error:', error);
            toast.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status, adminNotes = '') => {
        try {
            await contactAPI.updateStatus(id, { status, adminNotes });
            toast.success('Status updated successfully');
            loadData();
            setSelectedContact(null);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        
        try {
            await contactAPI.delete(id);
            toast.success('Contact deleted successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to delete contact');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            read: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            replied: 'bg-green-500/10 text-green-400 border-green-500/30',
            archived: 'bg-gray-500/10 text-gray-400 border-gray-500/30'
        };
        return colors[status] || colors.new;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Mail className="w-6 h-6 text-cyan-400" />
                    Contact Us Submissions
                </h2>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-white' },
                        { label: 'New', value: stats.new, color: 'text-blue-400' },
                        { label: 'Read', value: stats.read, color: 'text-yellow-400' },
                        { label: 'Replied', value: stats.replied, color: 'text-green-400' },
                        { label: 'Archived', value: stats.archived, color: 'text-gray-400' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="" className="bg-gray-900">All Statuses</option>
                        <option value="new" className="bg-gray-900">New</option>
                        <option value="read" className="bg-gray-900">Read</option>
                        <option value="replied" className="bg-gray-900">Replied</option>
                        <option value="archived" className="bg-gray-900">Archived</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search name, email, subject..."
                        value={filters.search}
                        onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500 border-t-transparent"></div>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-xl text-gray-400">No contact submissions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">From</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {contacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-white/5">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-white">{contact.name}</div>
                                                <div className="text-sm text-gray-400">{contact.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{contact.subject}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedContact(contact)}
                                                    className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact._id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Contact Details Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Contact Details</h2>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Name</p>
                                    <p className="text-lg font-semibold text-white">{selectedContact.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="text-white">{selectedContact.email}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Subject</p>
                                <p className="text-lg text-white">{selectedContact.subject}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-2">Message</p>
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Submitted</p>
                                    <p className="text-white">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedContact.status)}`}>
                                        {selectedContact.status}
                                    </span>
                                </div>
                            </div>

                            {/* Admin Actions */}
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="font-bold text-white mb-3">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedContact._id, 'read')}
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        <Clock className="w-4 h-4" />
                                        Mark as Read
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedContact._id, 'replied')}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Mark as Replied
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedContact._id, 'archived')}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        <Archive className="w-4 h-4" />
                                        Archive
                                    </button>
                                    <a
                                        href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Reply via Email
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ContactManager;
