import React, { useState } from 'react';
import { Mail, AlertCircle, Loader2 } from 'lucide-react';
import { resendVerification } from '../services/api';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const EmailVerificationBanner = () => {
    const { user } = useAppContext(); // Get user from AppContext
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    
    // Debug: Log user data when it changes
    console.log('[EmailVerificationBanner] User data:', {
        userExists: !!user,
        email: user?.email,
        emailVerified: user?.emailVerified
    });
    
    const handleResend = async () => {
        setResending(true);
        try {
            await resendVerification();
            toast.success('Verification email sent! Check your inbox.');
            setCooldown(60); // 60 second cooldown
            const timer = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Resend error:', error);
            toast.error(error.response?.data?.error || 'Failed to send verification email');
        } finally {
            setResending(false);
        }
    };
    
    // Don't show banner if email is verified or user is not loaded
    console.log('[EmailVerificationBanner] Should show?', !user || user.emailVerified ? 'NO' : 'YES');
    if (!user || user.emailVerified) return null;
    
    return (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="font-semibold text-yellow-400 mb-1 text-sm md:text-base">
                        📧 Verify Your Email Address
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300 mb-3">
                        Please verify your email to unlock rewards, referrals, and all premium features.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleResend}
                            disabled={resending || cooldown > 0}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            {resending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </>
                            ) : cooldown > 0 ? (
                                `Resend in ${cooldown}s`
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    Resend Verification Email
                                </>
                            )}
                        </button>
                        <p className="text-xs text-gray-500 flex items-center">
                            Check your spam folder if you don't see the email
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationBanner;
