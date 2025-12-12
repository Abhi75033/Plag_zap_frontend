import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Download, 
  CheckCircle,
  Shield,
  Zap,
  Bell,
  ExternalLink
} from 'lucide-react';

const DownloadApp = () => {
  const [platform, setPlatform] = useState('unknown');
  const [showQR, setShowQR] = useState(false);

  // Expo development build URLs - Update these after building
  const EXPO_PROJECT_URL = 'exp://u.expo.dev/update/your-project-id'; // For Expo Go testing
  const APK_DOWNLOAD_URL = '/plagzap-app.apk'; // Place APK in public folder for testing
  const IOS_TESTFLIGHT_URL = '#'; // TestFlight URL after upload
  
  // Store URLs for production
  const APP_STORE_URL = '#';
  const PLAY_STORE_URL = '#';

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setPlatform('ios');
    } else {
      // Desktop - show both options
      setPlatform('desktop');
    }
  }, []);

  const features = [
    { icon: Zap, text: 'Instant plagiarism detection' },
    { icon: Shield, text: 'Secure & private analysis' },
    { icon: Bell, text: 'Push notifications' },
    { icon: Smartphone, text: 'Works offline' },
  ];

  const getDownloadButton = () => {
    if (platform === 'ios') {
      return (
        <motion.a 
          href={IOS_TESTFLIGHT_URL !== '#' ? IOS_TESTFLIGHT_URL : APP_STORE_URL}
          className="download-btn primary-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div className="btn-text">
            <span className="btn-subtitle">Download for</span>
            <span className="btn-title">iPhone / iPad</span>
          </div>
        </motion.a>
      );
    } else if (platform === 'android') {
      return (
        <motion.a 
          href={APK_DOWNLOAD_URL}
          className="download-btn primary-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          download="PlagZap.apk"
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 15.34l1.617-2.8a.344.344 0 00-.125-.473.331.331 0 00-.467.127l-1.636 2.835a10.14 10.14 0 00-4.018-.823 10.14 10.14 0 00-4.018.823L7.24 12.194a.331.331 0 00-.467-.127.344.344 0 00-.125.473l1.617 2.8C5.895 16.63 4.296 19.047 4 22h16c-.296-2.953-1.895-5.37-4.477-6.66zM9.167 19.333a.833.833 0 110-1.666.833.833 0 010 1.666zm5.666 0a.833.833 0 110-1.666.833.833 0 010 1.666zM7.332 9.193L5.87 6.66a.344.344 0 01.125-.474.331.331 0 01.466.127l1.48 2.564a7.66 7.66 0 014.03-1.05 7.66 7.66 0 014.03 1.05l1.48-2.564a.331.331 0 01.466-.127.344.344 0 01.125.474L16.618 9.19A6.673 6.673 0 0119.667 15H4.296a6.673 6.673 0 013.036-5.807z"/>
          </svg>
          <div className="btn-text">
            <span className="btn-subtitle">Download for</span>
            <span className="btn-title">Android</span>
          </div>
        </motion.a>
      );
    } else {
      // Desktop - show both
      return (
        <div className="desktop-buttons">
          <motion.a 
            href={APK_DOWNLOAD_URL}
            className="download-btn secondary-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            download="PlagZap.apk"
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.34l1.617-2.8a.344.344 0 00-.125-.473.331.331 0 00-.467.127l-1.636 2.835a10.14 10.14 0 00-4.018-.823 10.14 10.14 0 00-4.018.823L7.24 12.194a.331.331 0 00-.467-.127.344.344 0 00-.125.473l1.617 2.8C5.895 16.63 4.296 19.047 4 22h16c-.296-2.953-1.895-5.37-4.477-6.66zM9.167 19.333a.833.833 0 110-1.666.833.833 0 010 1.666zm5.666 0a.833.833 0 110-1.666.833.833 0 010 1.666z"/>
            </svg>
            <div className="btn-text">
              <span className="btn-subtitle">Download for</span>
              <span className="btn-title">Android</span>
            </div>
          </motion.a>
          
          <motion.a 
            href={APP_STORE_URL}
            className="download-btn secondary-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="btn-text">
              <span className="btn-subtitle">Download for</span>
              <span className="btn-title">iOS</span>
            </div>
          </motion.a>
        </div>
      );
    }
  };

  return (
    <section className="download-app-section">
      <div className="download-container">
        {/* Background decoration */}
        <div className="download-bg-decoration">
          <div className="gradient-orb orb-1" />
          <div className="gradient-orb orb-2" />
        </div>

        <div className="download-content">
          {/* Left side - Text content */}
          <motion.div 
            className="download-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="download-badge">
              <Smartphone size={16} />
              Mobile App Available
            </span>
            
            <h2 className="download-title">
              Get PlagZap on Your
              <span className="gradient-text"> {platform === 'ios' ? 'iPhone' : platform === 'android' ? 'Android' : 'Mobile Device'}</span>
            </h2>
            
            <p className="download-description">
              Check for plagiarism anytime, anywhere. Download our mobile app 
              and enjoy all features on your {platform === 'ios' ? 'iPhone or iPad' : platform === 'android' ? 'Android device' : 'smartphone'}.
            </p>

            {/* Features list */}
            <div className="download-features">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="download-feature"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <CheckCircle className="feature-check" size={18} />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Download button - Platform specific */}
            <div className="download-buttons">
              {getDownloadButton()}
            </div>

            {/* Testing hint */}
            <div className="testing-hint">
              <ExternalLink size={14} />
              <span>
                {platform === 'android' 
                  ? 'APK will download directly. Enable "Install from unknown sources" in settings.'
                  : platform === 'ios'
                  ? 'Coming soon on the App Store'
                  : 'Scan QR code with your phone to download'
                }
              </span>
            </div>
          </motion.div>

          {/* Right side - Phone mockup */}
          <motion.div 
            className="download-mockup"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="phone-frame">
              <div className="phone-screen">
                {/* App screenshot placeholder */}
                <div className="app-preview">
                  <div className="app-header">
                    <div className="app-logo">P</div>
                    <span>PlagZap</span>
                  </div>
                  <div className="app-content">
                    <div className="mock-gauge">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1F2937" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="40" fill="none" 
                          stroke="url(#gaugeGradient)" strokeWidth="8"
                          strokeDasharray="200" strokeDashoffset="60"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        <defs>
                          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#A855F7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="gauge-text">
                        <span className="gauge-value">94%</span>
                        <span className="gauge-label">Original</span>
                      </div>
                    </div>
                    <div className="mock-stats">
                      <div className="mock-stat">
                        <span className="stat-value">6%</span>
                        <span className="stat-label">Plagiarized</span>
                      </div>
                      <div className="mock-stat">
                        <span className="stat-value">2%</span>
                        <span className="stat-label">AI Score</span>
                      </div>
                    </div>
                  </div>
                  <div className="app-nav">
                    <div className="nav-item active">🏠</div>
                    <div className="nav-item">📝</div>
                    <div className="nav-item">👥</div>
                    <div className="nav-item">📜</div>
                    <div className="nav-item">👤</div>
                  </div>
                </div>
              </div>
              <div className="phone-notch" />
            </div>

            {/* Platform badge */}
            <motion.div 
              className="floating-badge badge-platform"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {platform === 'ios' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>iOS</span>
                </>
              ) : platform === 'android' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#3DDC84">
                    <path d="M17.523 15.34l1.617-2.8a.344.344 0 00-.125-.473.331.331 0 00-.467.127l-1.636 2.835a10.14 10.14 0 00-4.018-.823 10.14 10.14 0 00-4.018.823L7.24 12.194a.331.331 0 00-.467-.127.344.344 0 00-.125.473l1.617 2.8C5.895 16.63 4.296 19.047 4 22h16c-.296-2.953-1.895-5.37-4.477-6.66z"/>
                  </svg>
                  <span>Android</span>
                </>
              ) : (
                <>
                  <Smartphone size={16} />
                  <span>Mobile</span>
                </>
              )}
            </motion.div>

            <motion.div 
              className="floating-badge badge-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <Zap size={16} />
              <span>Fast</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .download-app-section {
          padding: 100px 0;
          background: linear-gradient(180deg, #0F0F0F 0%, #1A1A2E 100%);
          position: relative;
          overflow: hidden;
        }

        .download-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }

        .download-bg-decoration {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
          top: -100px;
          right: -100px;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%);
          bottom: -50px;
          left: -50px;
        }

        .download-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .download-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.3);
          color: #A855F7;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .download-title {
          font-size: 48px;
          font-weight: 700;
          color: #F9FAFB;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .download-description {
          font-size: 18px;
          color: #9CA3AF;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .download-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }

        .download-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #D1D5DB;
          font-size: 15px;
        }

        .feature-check {
          color: #10B981;
          flex-shrink: 0;
        }

        .download-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .desktop-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 28px;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .primary-btn {
          background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%);
          border: 1px solid transparent;
          color: #FFFFFF;
          box-shadow: 0 10px 40px rgba(124, 58, 237, 0.3);
        }

        .primary-btn:hover {
          box-shadow: 0 15px 50px rgba(124, 58, 237, 0.5);
          transform: translateY(-2px);
        }

        .secondary-btn {
          background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
          border: 1px solid #374151;
          color: #F9FAFB;
        }

        .secondary-btn:hover {
          border-color: #6B7280;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .btn-icon {
          width: 28px;
          height: 28px;
        }

        .btn-text {
          display: flex;
          flex-direction: column;
        }

        .btn-subtitle {
          font-size: 11px;
          opacity: 0.8;
        }

        .btn-title {
          font-size: 18px;
          font-weight: 600;
        }

        .testing-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6B7280;
          font-size: 13px;
          margin-top: 20px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Phone Mockup */
        .download-mockup {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .phone-frame {
          width: 280px;
          height: 580px;
          background: linear-gradient(145deg, #1F2937 0%, #111827 100%);
          border-radius: 40px;
          padding: 12px;
          box-shadow: 
            0 50px 100px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #0F0F0F;
          border-radius: 32px;
          overflow: hidden;
        }

        .phone-notch {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 28px;
          background: #000;
          border-radius: 20px;
        }

        .app-preview {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 50px 16px 16px;
        }

        .app-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .app-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 18px;
        }

        .app-header span {
          color: #F9FAFB;
          font-weight: 600;
          font-size: 18px;
        }

        .app-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .mock-gauge {
          width: 150px;
          height: 150px;
          position: relative;
        }

        .mock-gauge svg {
          width: 100%;
          height: 100%;
        }

        .gauge-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .gauge-value {
          font-size: 32px;
          font-weight: 700;
          color: #F9FAFB;
        }

        .gauge-label {
          font-size: 12px;
          color: #9CA3AF;
        }

        .mock-stats {
          display: flex;
          gap: 30px;
          margin-top: 24px;
        }

        .mock-stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 600;
          color: #F9FAFB;
        }

        .stat-label {
          font-size: 11px;
          color: #6B7280;
        }

        .app-nav {
          display: flex;
          justify-content: space-around;
          padding: 16px 0;
          border-top: 1px solid #1F2937;
          margin-top: auto;
        }

        .nav-item {
          font-size: 20px;
          opacity: 0.5;
        }

        .nav-item.active {
          opacity: 1;
        }

        .floating-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(31, 41, 55, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid #374151;
          padding: 8px 14px;
          border-radius: 100px;
          color: #F9FAFB;
          font-size: 13px;
          font-weight: 500;
        }

        .badge-platform {
          top: 80px;
          left: -20px;
        }

        .badge-2 {
          bottom: 120px;
          right: -10px;
        }

        .badge-2 svg {
          color: #F59E0B;
        }

        @media (max-width: 900px) {
          .download-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .download-title {
            font-size: 36px;
          }

          .download-features {
            justify-items: center;
          }

          .download-buttons {
            justify-content: center;
          }

          .desktop-buttons {
            flex-direction: column;
            align-items: center;
          }

          .download-mockup {
            order: -1;
          }

          .phone-frame {
            width: 240px;
            height: 500px;
          }

          .floating-badge {
            display: none;
          }

          .testing-hint {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .download-buttons {
            flex-direction: column;
            width: 100%;
          }

          .download-btn {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default DownloadApp;
