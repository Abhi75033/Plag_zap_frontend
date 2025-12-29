import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Sparkles, Trophy, AlertCircle, Star, Wrench } from 'lucide-react';
import { notificationsAPI } from '../services/notificationsAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const { data } = await notificationsAPI.getAll({ limit: 10 });
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleMarkAsRead = async (id, link) => {
        try {
            await notificationsAPI.markAsRead(id);
            loadNotifications();
            if (link) {
                setIsOpen(false);
                navigate(link);
            }
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationsAPI.delete(id);
            toast.success('Notification deleted');
            loadNotifications();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            toast.success('All marked as read');
            loadNotifications();
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const getIcon = (iconName) => {
        const icons = {
            bell: Bell,
            sparkles: Sparkles,
            trophy: Trophy,
            'alert-circle': AlertCircle,
            star: Star,
            wrench: Wrench
        };
        const Icon = icons[iconName] || Bell;
        return <Icon className="w-5 h-5" />;
    };

    const getTypeColor = (type) => {
        const colors = {
            system: 'from-blue-500 to-cyan-500',
            custom: 'from-purple-500 to-pink-500',
            achievement: 'from-yellow-500 to-orange-500',
            subscription: 'from-green-500 to-emerald-500',
            alert: 'from-red-500 to-orange-500'
        };
        return colors[type] || colors.system;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-1.5 sm:p-2 rounded-lg bg-background/50 border border-white/10 hover:bg-background transition-colors flex-shrink-0"
                aria-label="Notifications"
            >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-cyan-400" />
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent mx-auto"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                <div>
                                    {notifications.map((notif) => (
                                        <motion.div
                                            key={notif._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                                                !notif.read ? 'bg-cyan-500/5' : ''
                                            }`}
                                            onClick={() => handleMarkAsRead(notif._id, notif.link)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(notif.type)}`}>
                                                    {getIcon(notif.icon)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-semibold text-white text-sm leading-snug">
                                                            {notif.title}
                                                        </h4>
                                                        <button
                                                            onClick={(e) => handleDelete(notif._id, e)}
                                                            className="p-1 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        {new Date(notif.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Unread indicator */}
                                                {!notif.read && (
                                                    <div className="h-2 w-2 bg-cyan-500 rounded-full mt-1 flex-shrink-0"></div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - doesn't show if no notifications */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-white/10 text-center">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
