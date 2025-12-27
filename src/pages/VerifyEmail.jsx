import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAppContext } from '../context/AppContext';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUser } = useAppContext();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        console.log('[VerifyEmail] Component mounted');
        const token = searchParams.get('token');
        console.log('[VerifyEmail] Token from URL:', token);
        
        if (!token) {
            console.error('[VerifyEmail] No token found in URL');
            setStatus('error');
            setMessage('Invalid verification link. Please check the URL.');
            return;
        }
        
        // Verify the token
        console.log('[VerifyEmail] Calling API to verify token');
        api.post('/auth/verify-email', { token })
            .then((response) => {
                console.log('[VerifyEmail] Verification successful:', response.data);
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
                toast.success('Email verified! You can now access all features.');
                
                // Update user context with verified user data
                if (response.data.user) {
                    console.log('[VerifyEmail] Updating user context with verified data:', response.data.user);
                    updateUser(response.data.user);
                }
                
                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            })
            .catch(error => {
                console.error('[VerifyEmail] Verification failed:', error);
                setStatus('error');
                const errorMsg = error.response?.data?.error || 'Verification failed. Please try again.';
                setMessage(errorMsg);
                toast.error(errorMsg);
            });
    }, [searchParams, navigate, updateUser]);
    
    console.log('[VerifyEmail] Rendering with status:', status);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 max-w-md w-full text-center">
                {status === 'verifying' && (
                    <div>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-purple-400">
                            Verifying Email...
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Please wait while we verify your email address
                        </p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-green-400">
                            Email Verified! 🎉
                        </h2>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                            <p className="text-sm text-green-400 font-medium">
                                ✨ All features unlocked!
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                You can now earn coins, claim rewards, and refer friends
                            </p>
                        </div>
                        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                    </div>
                )}
                
                {status === 'error' && (
                    <div>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-red-400">
                            Verification Failed
                        </h2>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-400">
                                The verification link may have expired or is invalid.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all font-medium"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
