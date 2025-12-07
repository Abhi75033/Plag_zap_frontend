import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Trash2, Pin, PinOff, Hash, AtSign, Smile, 
    MessageSquare, Megaphone, Clock, ChevronDown, Check, CheckCheck,
    Settings, Shield, UserMinus, Users, Trash, Search, Reply, X, CornerDownRight
} from 'lucide-react';
import { 
    getTeamMessages, sendTeamMessage, deleteTeamMessage, 
    reactToMessage, togglePinMessage, getTeamMembersList,
    markMessagesAsRead, clearAllMessages, getTeamSettings, updateTeamSettings,
    searchTeamMessages 
} from '../services/api';
import toast from 'react-hot-toast';

// Common emoji reactions
const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '👀', '💯', '🚀'];

const TeamChat = ({ teamId, currentUserId, isAdmin }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [messageType, setMessageType] = useState('message');
    const [members, setMembers] = useState([]);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showEmoji, setShowEmoji] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [teamSettings, setTeamSettings] = useState({ adminOnlyMessages: false });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // Message being replied to
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        loadMessages();
        loadMembers();
        if (isAdmin) loadSettings();
    }, [teamId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadMessages = async () => {
        try {
            const { data } = await getTeamMessages();
            const msgs = data.messages || [];
            setMessages(msgs);
            
            // Mark other users' messages as read
            const unreadIds = msgs
                .filter(m => m.sender?._id !== currentUserId && m.status !== 'read')
                .map(m => m._id);
            if (unreadIds.length > 0) {
                try {
                    await markMessagesAsRead(unreadIds);
                } catch (e) {
                    console.error('Failed to mark as read', e);
                }
            }
        } catch (error) {
            console.error('Failed to load messages', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async () => {
        try {
            const { data } = await getTeamMembersList();
            setMembers(data.members || []);
        } catch (error) {
            console.error('Failed to load members', error);
        }
    };

    const loadSettings = async () => {
        try {
            const { data } = await getTeamSettings();
            setTeamSettings(data);
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const handleClearChat = async () => {
        if (!confirm('Are you sure you want to clear ALL messages? This cannot be undone.')) return;
        try {
            await clearAllMessages();
            setMessages([]);
            toast.success('All messages cleared');
            setShowSettings(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to clear messages');
        }
    };

    const handleToggleAdminOnly = async () => {
        try {
            const newValue = !teamSettings.adminOnlyMessages;
            await updateTeamSettings({ adminOnlyMessages: newValue });
            setTeamSettings(prev => ({ ...prev, adminOnlyMessages: newValue }));
            toast.success(newValue ? 'Only admins can send messages now' : 'All members can send messages now');
        } catch (error) {
            toast.error('Failed to update setting');
        }
    };

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!searchQuery.trim() || searchQuery.length < 2) return;
        
        setIsSearching(true);
        try {
            const { data } = await searchTeamMessages(searchQuery.trim());
            setSearchResults(data.messages || []);
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || sending) return;

        setSending(true);
        try {
            const { data } = await sendTeamMessage(input.trim(), messageType, replyingTo?._id);
            setMessages(prev => [...prev, data.message]);
            setInput('');
            setMessageType('message');
            setReplyingTo(null); // Clear reply after sending
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (messageId) => {
        if (!confirm('Delete this message?')) return;
        try {
            await deleteTeamMessage(messageId);
            setMessages(prev => prev.filter(m => m._id !== messageId));
            toast.success('Message deleted');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete');
        }
    };

    const handleReaction = async (messageId, emoji) => {
        try {
            const { data } = await reactToMessage(messageId, emoji);
            setMessages(prev => prev.map(m => m._id === messageId ? data.message : m));
            setShowEmoji(null);
        } catch (error) {
            toast.error('Failed to react');
        }
    };

    const handlePin = async (messageId) => {
        try {
            const { data } = await togglePinMessage(messageId);
            setMessages(prev => prev.map(m => m._id === messageId ? data.message : m));
            toast.success(data.message.pinned ? 'Message pinned!' : 'Message unpinned');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to pin');
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        // Check for @mention trigger
        const lastAt = value.lastIndexOf('@');
        if (lastAt !== -1 && lastAt === value.length - 1) {
            setShowMentions(true);
            setMentionQuery('');
        } else if (lastAt !== -1) {
            const afterAt = value.substring(lastAt + 1);
            if (!afterAt.includes(' ')) {
                setShowMentions(true);
                setMentionQuery(afterAt.toLowerCase());
            } else {
                setShowMentions(false);
            }
        } else {
            setShowMentions(false);
        }
    };

    const handleMentionSelect = (member) => {
        const lastAt = input.lastIndexOf('@');
        const newInput = input.substring(0, lastAt) + `@${member.name} `;
        setInput(newInput);
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(mentionQuery)
    );

    const renderHighlightedContent = (content) => {
        // Split by tags and mentions
        const parts = content.split(/(@\w+|#\w+)/g);
        return parts.map((part, i) => {
            if (part.startsWith('@')) {
                return <span key={i} className="text-blue-400 font-medium">{part}</span>;
            } else if (part.startsWith('#')) {
                return <span key={i} className="text-purple-400 font-medium">{part}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-white/10">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <span className="font-bold text-sm sm:text-base truncate">Team Chat</span>
                        <span className="text-xs text-gray-500 hidden sm:inline">({messages.length})</span>
                    </div>
                    <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
                        <button
                            onClick={() => setMessageType('message')}
                            className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                                messageType === 'message' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                            title="Message"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Message</span>
                        </button>
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setMessageType('announcement')}
                                className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                                    messageType === 'announcement' 
                                        ? 'bg-yellow-600 text-white' 
                                        : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                                title="Announcement"
                            >
                                <Megaphone className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Announce</span>
                            </button>
                            
                            {/* Admin Settings Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    title="Group Settings"
                                >
                                    <Settings className="w-4 h-4 text-gray-400" />
                                </button>
                                
                                {/* Settings Dropdown */}
                                <AnimatePresence>
                                    {showSettings && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 top-12 z-50 bg-gray-900 border border-white/10 rounded-xl shadow-2xl min-w-[220px] overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-white/10">
                                                <h4 className="font-bold text-sm flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-purple-400" />
                                                    Admin Settings
                                                </h4>
                                            </div>
                                            
                                            <div className="p-2">
                                                {/* Admin-only messages toggle */}
                                                <button
                                                    onClick={handleToggleAdminOnly}
                                                    className="w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between text-left"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-blue-400" />
                                                        <span className="text-sm">Admin-only</span>
                                                    </div>
                                                    <div className={`w-8 h-4 rounded-full transition-colors ${
                                                        teamSettings.adminOnlyMessages ? 'bg-green-500' : 'bg-gray-600'
                                                    }`}>
                                                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                                            teamSettings.adminOnlyMessages ? 'translate-x-4' : 'translate-x-0'
                                                        }`} />
                                                    </div>
                                                </button>
                                                
                                                <div className="h-px bg-white/10 my-2" />
                                                
                                                {/* Clear all messages */}
                                                <button
                                                    onClick={handleClearChat}
                                                    className="w-full px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-2 text-red-400"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                    <span className="text-sm">Clear all</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    )}
                    </div>
                </div>
            </div>

            {/* Encryption Banner */}
            <div className="px-4 py-2 bg-green-500/10 border-b border-green-500/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-green-400">
                        🔒 End-to-end encrypted
                    </span>
                </div>
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`p-1.5 rounded-lg transition-colors ${showSearch ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    title="Search messages"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>

            {/* Search Bar */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-white/10 overflow-hidden"
                    >
                        <form onSubmit={handleSearch} className="p-3 flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search messages..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                            />
                            <button
                                type="submit"
                                disabled={isSearching || searchQuery.length < 2}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {isSearching ? '...' : 'Search'}
                            </button>
                        </form>
                        {searchResults.length > 0 && (
                            <div className="max-h-48 overflow-y-auto px-3 pb-3 space-y-2">
                                <p className="text-xs text-gray-400">{searchResults.length} results</p>
                                {searchResults.map(msg => (
                                    <div key={msg._id} className="bg-white/5 p-2 rounded-lg text-sm">
                                        <span className="text-purple-400 font-medium">{msg.sender?.name}: </span>
                                        <span className="text-gray-300">{msg.content?.slice(0, 50)}...</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reply Indicator */}
            <AnimatePresence>
                {replyingTo && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2 text-sm">
                            <CornerDownRight className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-400">Replying to</span>
                            <span className="text-purple-400 font-medium">{replyingTo.sender?.name}</span>
                            <span className="text-gray-500 truncate max-w-[200px]">{replyingTo.content?.slice(0, 30)}...</span>
                        </div>
                        <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Be the first to say something!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isOwnMessage = msg.sender?._id === currentUserId;
                        const showDate = idx === 0 || 
                            formatDate(msg.createdAt) !== formatDate(messages[idx - 1]?.createdAt);

                        return (
                            <React.Fragment key={msg._id}>
                                {showDate && (
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-white/10"></div>
                                        <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
                                        <div className="flex-1 h-px bg-white/10"></div>
                                    </div>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`group relative ${
                                        msg.type === 'announcement' 
                                            ? 'bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4' 
                                            : ''
                                    } ${msg.pinned ? 'bg-purple-500/10 border border-purple-500/30 rounded-xl p-4' : ''}`}
                                >
                                    {/* Pinned indicator */}
                                    {msg.pinned && (
                                        <div className="flex items-center gap-1 text-xs text-purple-400 mb-2">
                                            <Pin className="w-3 h-3" />
                                            <span>Pinned</span>
                                        </div>
                                    )}
                                    
                                    {/* Announcement indicator */}
                                    {msg.type === 'announcement' && (
                                        <div className="flex items-center gap-1 text-xs text-yellow-400 mb-2">
                                            <Megaphone className="w-3 h-3" />
                                            <span>Announcement</span>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
                                            {msg.sender?.name?.charAt(0) || '?'}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            {/* Header */}
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-bold text-sm">{msg.sender?.name || 'Unknown'}</span>
                                                {/* Badges */}
                                                {msg.sender?.badges?.slice(0, 2).map((badge, i) => (
                                                    <span key={i} className="text-xs" title={badge.name}>
                                                        {badge.icon}
                                                    </span>
                                                ))}
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                                {/* Read Receipt Ticks - only for own messages */}
                                                {isOwnMessage && (
                                                    <span 
                                                        className="flex items-center" 
                                                        title={(msg.status === 'read' || msg.readBy?.length > 0) ? 'Read by team' : 'Sent'}
                                                    >
                                                        {(msg.status === 'read' || msg.readBy?.length > 0) ? (
                                                            <CheckCheck className="w-4 h-4 text-blue-400" />
                                                        ) : (
                                                            <Check className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Content */}
                                            <p className="text-sm text-gray-200 break-words">
                                                {renderHighlightedContent(msg.content)}
                                            </p>

                                            {/* Tags */}
                                            {msg.tags?.length > 0 && (
                                                <div className="flex gap-1 mt-2 flex-wrap">
                                                    {msg.tags.map((tag, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-300">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Reactions */}
                                            {msg.reactions?.length > 0 && (
                                                <div className="flex gap-1 mt-2 flex-wrap">
                                                    {msg.reactions.map((reaction, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleReaction(msg._id, reaction.emoji)}
                                                            className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors ${
                                                                reaction.users?.some(u => u.toString() === currentUserId)
                                                                    ? 'bg-purple-500/30 border border-purple-500'
                                                                    : 'bg-white/5 hover:bg-white/10'
                                                            }`}
                                                        >
                                                            <span>{reaction.emoji}</span>
                                                            <span className="text-gray-400">{reaction.users?.length || 0}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1">
                                            {/* Reply Button */}
                                            <button
                                                onClick={() => setReplyingTo(msg)}
                                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Reply"
                                            >
                                                <Reply className="w-4 h-4 text-gray-400" />
                                            </button>
                                            
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowEmoji(showEmoji === msg._id ? null : msg._id)}
                                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="React"
                                                >
                                                    <Smile className="w-4 h-4 text-gray-400" />
                                                </button>
                                                
                                                {/* Emoji Picker */}
                                                <AnimatePresence>
                                                    {showEmoji === msg._id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="absolute right-0 top-8 z-10 bg-gray-900 border border-white/10 rounded-xl p-2 flex gap-1 shadow-xl"
                                                        >
                                                            {EMOJI_OPTIONS.map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={() => handleReaction(msg._id, emoji)}
                                                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-lg"
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {isAdmin && (
                                                <button
                                                    onClick={() => handlePin(msg._id)}
                                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                                    title={msg.pinned ? 'Unpin' : 'Pin'}
                                                >
                                                    {msg.pinned ? (
                                                        <PinOff className="w-4 h-4 text-purple-400" />
                                                    ) : (
                                                        <Pin className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                            )}

                                            {(isOwnMessage || isAdmin) && (
                                                <button
                                                    onClick={() => handleDelete(msg._id)}
                                                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        );
                    })
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 relative">
                {/* Mention Autocomplete */}
                <AnimatePresence>
                    {showMentions && filteredMembers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-4 right-4 mb-2 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto"
                        >
                            {filteredMembers.map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => handleMentionSelect(member)}
                                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSend} className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type a message... Use @ to mention, # for tags"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                            disabled={sending}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setInput(prev => prev + '@');
                                    setShowMentions(true);
                                    inputRef.current?.focus();
                                }}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                title="Mention someone"
                            >
                                <AtSign className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setInput(prev => prev + '#');
                                    inputRef.current?.focus();
                                }}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                title="Add tag"
                            >
                                <Hash className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeamChat;
