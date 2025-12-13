import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeChatMessage, debounce } from '../../utils/sanitization';
import toast from 'react-hot-toast';

/**
 * ChatPanel Component - Google Meet Style
 * Right sidebar for in-meeting chat
 */
const ChatPanel = ({ socket, currentUser, isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        // Listen for chat messages
        socket.on('chat-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off('chat-message');
        };
    }, [socket]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Debounced send to prevent spam (rate limiting)
    const debouncedSend = useCallback(
        debounce((message) => {
            if (socket) {
                socket.emit('chat-message', { message });
            }
        }, 300),
        [socket]
    );

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        // Sanitize input to prevent XSS
        const sanitizedMessage = sanitizeChatMessage(newMessage);
        
        if (!sanitizedMessage) {
            toast.error('Invalid message');
            return;
        }

        // Check length after sanitization
        if (sanitizedMessage.length > 500) {
            toast.error('Message too long (max 500 characters)');
            return;
        }

        debouncedSend(sanitizedMessage);
        setNewMessage('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
                transition={{ duration: 0.2 }}
                className="fixed right-0 top-0 bottom-0 w-80 bg-[#202124] border-l border-white/10 flex flex-col z-50"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-lg font-bold">In-call messages</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-sm">No messages yet</p>
                            <p className="text-gray-500 text-xs mt-1">Send a message to start the conversation</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isOwnMessage = msg.userId === currentUser?.id;
                            return (
                                <div
                                    key={idx}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                        {!isOwnMessage && (
                                            <span className="text-xs text-gray-400 px-2">
                                                {msg.userName}
                                            </span>
                                        )}
                                        <div
                                            className={`px-4 py-2 rounded-2xl ${
                                                isOwnMessage
                                                    ? 'bg-[#1a73e8] text-white rounded-br-sm'
                                                    : 'bg-[#3c4043] text-white rounded-bl-sm'
                                            }`}
                                        >
                                            <p className="text-sm break-words">{msg.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 px-2">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Send a message..."
                            className="flex-1 bg-[#3c4043] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-2 bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatPanel;
