import React, { useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

/**
 * HCaptcha Component
 * Displays CAPTCHA challenge when needed for security
 */
const CaptchaChallenge = ({ onVerify, onError, onExpire, theme = 'dark' }) => {
    const captchaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
    
    if (!siteKey) {
        console.warn('[CAPTCHA] hCaptcha site key not configured in environment');
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <p className="text-red-400 text-sm">
                    ⚠️ CAPTCHA not configured. Please contact support.
                </p>
            </div>
        );
    }
    
   const handleVerify = (token) => {
        setIsLoading(false);
        if (onVerify) {
            onVerify(token);
        }
    };
    
    const handleError = (err) => {
        setIsLoading(false);
        console.error('[CAPTCHA] Error:', err);
        if (onError) {
            onError(err);
        }
    };
    
    const handleExpire = () => {
        setIsLoading(false);
        console.warn('[CAPTCHA] Token expired');
        if (onExpire) {
            onExpire();
        }
    };
    
    const handleLoad = () => {
        setIsLoading(false);
    };
    
    return (
        <div className="flex flex-col items-center justify-center my-4">
            {isLoading && (
                <div className="mb-2 text-sm text-gray-400">
                    Loading CAPTCHA...
                </div>
            )}
            <HCaptcha
                ref={captchaRef}
                sitekey={siteKey}
                onVerify={handleVerify}
                onError={handleError}
                onExpire={handleExpire}
                onLoad={handleLoad}
                theme={theme}
                size="normal"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
                Protected by hCaptcha for security
            </p>
        </div>
    );
};

export default CaptchaChallenge;
