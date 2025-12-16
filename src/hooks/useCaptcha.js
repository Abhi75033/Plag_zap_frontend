import { useState } from 'react';
import CaptchaChallenge from '../components/CaptchaChallenge';

/**
 * Custom hook to handle CAPTCHA challenges
 * Automatically shows CAPTCHA when API returns 428 status
 */
export const useCaptcha = () => {
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);

    /**
     * Wrap API calls to handle CAPTCHA challenges
     */
    const withCaptcha = async (apiCall, ...args) => {
        try {
            // Try the request normally
            const result = await apiCall(...args);
            return { success: true, data: result };
        } catch (error) {
            // Check if CAPTCHA is required (428 status)
            if (error.response?.status === 428 && error.response?.data?.requiresCaptcha) {
                // Store the pending request
                setPendingRequest({
                    apiCall,
                    args,
                    reasons: error.response.data.reasons || [],
                    riskScore: error.response.data.riskScore
                });
                setShowCaptcha(true);

                return {
                    success: false,
                    requiresCaptcha: true,
                    reasons: error.response.data.reasons,
                    riskScore: error.response.data.riskScore
                };
            }

            // Handle blocked requests (403)
            if (error.response?.status === 403 && error.response?.data?.blocked) {
                return {
                    success: false,
                    blocked: true,
                    reasons: error.response.data.reasons,
                    message: error.response.data.message || 'Request blocked due to suspicious activity'
                };
            }

            // Other errors
            throw error;
        }
    };

    /**
     * Handle CAPTCHA verification
     */
    const handleCaptchaVerify = async (token) => {
        setCaptchaToken(token);

        if (pendingRequest) {
            try {
                // Retry the original request with CAPTCHA token
                const { apiCall, args } = pendingRequest;

                // Add captcha token to the request body
                const modifiedArgs = [...args];
                if (modifiedArgs[0] && typeof modifiedArgs[0] === 'object') {
                    modifiedArgs[0] = { ...modifiedArgs[0], captchaToken: token };
                } else {
                    modifiedArgs[0] = { captchaToken: token };
                }

                const result = await apiCall(...modifiedArgs);

                // Success - clear CAPTCHA state
                setShowCaptcha(false);
                setCaptchaToken(null);
                setPendingRequest(null);

                return { success: true, data: result };
            } catch (retryError) {
                // CAPTCHA verification failed or other error
                return {
                    success: false,
                    error: retryError.response?.data?.error || 'Request failed after CAPTCHA'
                };
            }
        }
    };

    /**
     * Cancel CAPTCHA challenge
     */
    const cancelCaptcha = () => {
        setShowCaptcha(false);
        setCaptchaToken(null);
        setPendingRequest(null);
    };

    /**
     * Render CAPTCHA modal
     */
    const CaptchaModal = () => {
        if (!showCaptcha) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                        Security Verification Required
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Please complete the CAPTCHA to continue
                    </p>

                    {pendingRequest?.reasons && pendingRequest.reasons.length > 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                            <p className="text-xs text-yellow-400 font-medium mb-1">
                                Security Check Triggered:
                            </p>
                            <ul className="text-xs text-gray-400 space-y-1">
                                {pendingRequest.reasons.map((reason, idx) => (
                                    <li key={idx}>• {reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <CaptchaChallenge
                        onVerify={handleCaptchaVerify}
                        onError={() => {
                            console.error('CAPTCHA error');
                        }}
                    />

                    <button
                        onClick={cancelCaptcha}
                        className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    return {
        withCaptcha,
        showCaptcha,
        CaptchaModal,
        cancelCaptcha
    };
};

export default useCaptcha;
