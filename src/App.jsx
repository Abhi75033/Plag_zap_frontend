import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import ContentWriter from './pages/ContentWriter';
import RewriteResults from './pages/RewriteResults';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import DownloadExtension from './pages/DownloadExtension';
import AdminDashboard from './pages/AdminDashboard';
import AdminSecurityDashboard from './pages/AdminSecurityDashboard'; // Phase 4
import TeamDashboard from './pages/TeamDashboard';
import VideoMeeting from './pages/VideoMeeting'; // Video meeting import
import AdminRoute from './components/AdminRoute';
import ApiDocs from './pages/ApiDocs';
import Webhooks from './pages/Webhooks';
import Rewards from './pages/Rewards'; // Phase 1: Rewards system
import Achievements from './pages/Achievements'; // Phase 5: Achievements
import Leaderboard from './pages/Leaderboard'; // Phase 5: Leaderboard
import ErrorBoundary from './components/ErrorBoundary';

// Static pages
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import News from './pages/News';
import Careers from './pages/Careers';
import Security from './pages/Security';
import GDPR from './pages/GDPR';
import Changelog from './pages/Changelog';
import Integrations from './pages/Integrations';
import Features from './pages/Features';
import Shipping from './pages/Shipping';
import Refunds from './pages/Refunds';
import AuthCallback from './pages/AuthCallback';
import VerifyEmail from './pages/VerifyEmail'; // Phase 3: Email verification
import ForgotPassword from './pages/ForgotPassword'; // Forgot Password
import ResetPassword from './pages/ResetPassword'; // Reset Password
import MyApplications from './pages/MyApplications'; // Job applications tracking
import LandingPage from './pages/LandingPage'; // Programmatic SEO Landing Page template
import RepublicDayBanner from './components/ui/RepublicDayBanner'; // Special theme banner

// SEO-Optimized Landing Pages
import PlagiarismCheckerOnline from './pages/PlagiarismCheckerOnline';
import FreePlagiarismChecker from './pages/FreePlagiarismChecker';
import TurnitinAlternative from './pages/TurnitinAlternative';
import AIPlagiarismChecker from './pages/AIPlagiarismChecker';
import PlagiarismCheckerAPI from './pages/PlagiarismCheckerAPI';
import HowToAvoidPlagiarism from './pages/HowToAvoidPlagiarism';
import HowToReadPlagiarismReport from './pages/HowToReadPlagiarismReport';
import CaseStudies from './pages/CaseStudies';
import GrammarlyAlternative from './pages/GrammarlyAlternative';


function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              duration: 5000,
            },
          }}
        />
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <RepublicDayBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/verify-email" element={<VerifyEmail />} /> {/* Phase 3: Email verification */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />

            {/* Programmatic SEO Components Logic */}
            <Route path="/plagzap-for-youtubers" element={
              <LandingPage 
                title="PlagZap for YouTubers - Protect Your Scripts"
                description="The best AI plagiarism checker for YouTubers. Ensure your video scripts are original and avoid copyright strikes."
                heroTitle="Protect Your YouTube Channel from Copyright Strikes"
                heroSubtitle="Ensure your video scripts are 100% original with PlagZap's AI-powered plagiarism detection."
                targetAudience="YouTubers"
                features={[
                  { title: 'Script Analysis', description: 'Scan your video scripts against billions of web pages.' },
                  { title: 'Copyright Safe', description: 'Avoid inadvertent copyright issues before filming.' },
                  { title: 'AI Detection', description: 'Detect if your script writer used AI tools heavily.' }
                ]}
                faq={[
                  { question: 'Does PlagZap check YouTube subtitles?', answer: 'Yes, you can paste your subtitles or script to verify originality.' },
                  { question: 'Is it free for small channels?', answer: 'We offer a generous free tier for creators starting out.' }
                ]}
              />
            } />

            <Route path="/plagzap-for-bloggers" element={
              <LandingPage 
                title="PlagZap for Bloggers - Rank Higher on Google"
                description="Ensure your blog posts are unique and SEO-friendly. PlagZap helps bloggers avoid duplicate content penalties."
                heroTitle="Rank #1 with Original, SEO-Optimized Content"
                heroSubtitle="Google penalizes duplicate content. Use PlagZap to ensure every blog post is unique and ready to rank."
                targetAudience="Bloggers"
                features={[
                  { title: 'SEO Protection', description: 'Avoid duplicate content penalties from search engines.' },
                  { title: 'Guest Post Check', description: 'Verify originality of guest contributions instantly.' },
                  { title: 'Bulk Scanning', description: 'Check multiple articles at once for efficiency.' }
                ]}
                faq={[
                  { question: 'Why does originality matter for SEO?', answer: 'Search engines de-rank duplicate content. Originality is key to ranking.' },
                  { question: 'Can I check WordPress drafts?', answer: 'Yes, simply copy-paste your draft into PlagZap.' }
                ]}
              />
            } />

             <Route path="/plagzap-for-students" element={
              <LandingPage 
                title="PlagZap for Students - Cite with Confidence"
                description="The most accurate plagiarism checker for students. Verify your essays and research papers before submission."
                heroTitle="Submit Your Assignments with Total Confidence"
                heroSubtitle="Avoid accidental plagiarism in your essays and research papers. accurate fast, and student-friendly."
                targetAudience="Students"
                features={[
                  { title: 'Academic Dabatase', description: 'Checks against academic papers and journals.' },
                  { title: 'Citation Helper', description: 'Helps identify missing citations in your work.' },
                  { title: 'Private & Secure', description: 'Your work remains yours. We never sell your data.' }
                ]}
                faq={[
                  { question: 'Is my paper stored in a database?', answer: 'No, PlagZap respects your privacy and ownership.' },
                  { question: 'Does it work for multiple languages?', answer: 'Yes, PlagZap supports over 30 languages.' }
                ]}
              />
            } />

             <Route path="/plagzap-for-agencies" element={
              <LandingPage 
                title="PlagZap for Agencies - Scale Content Production"
                description="Manage content quality at scale. PlagZap helps agencies verify freelance work and maintain high standards."
                heroTitle="Scale Your Content Operations Without Risk"
                heroSubtitle="Verify thousands of words daily. Ensure every piece of content you deliver to clients is 100% original."
                targetAudience="Agencies"
                features={[
                  { title: 'Team Management', description: 'Add your writers and editors to a single dashboard.' },
                  { title: 'White Label Reports', description: 'Generate branded PDF reports for your clients.' },
                  { title: 'API Access', description: 'Integrate plagiarism checking into your CMS.' }
                ]}
                faq={[
                  { question: 'Do you offer volume discounts?', answer: 'Yes, our agency plans are built for high volume.' },
                  { question: 'Can I add team members?', answer: 'Absolutely. Team management is a core feature.' }
                ]}
              />
            } />

            <Route path="/plagzap-ai-plagiarism-checker" element={
              <LandingPage 
                title="Best AI Plagiarism Checker - accurate & Free"
                description="PlagZap combines advanced AI detection with deep web search to provide the most accurate plagiarism checking available."
                heroTitle="The Next Generation of Plagiarism Detection"
                heroSubtitle="Powered by advanced AI to detect not just copy-paste, but paraphrased and AI-generated content."
                targetAudience="Consicious Creators"
                features={[
                  { title: 'Deep Search', description: 'Scans billions of web pages and academic sources.' },
                  { title: 'AI Writing Detection', description: 'Identifies content written by ChatGPT and other LLMs.' },
                  { title: 'Smart Paraphrasing', description: 'Detects spun content that other checkers miss.' }
                ]}
                faq={[
                   { question: 'How is this different from Turnitin?', answer: 'PlagZap is designed for speed and accessibility while maintaining high accuracy.' },
                   { question: 'Is it really free?', answer: 'We offer a free version with daily limits. Premium unlocks unlimited power.' }
                ]}
              />
            } />
            
            {/* New SEO-Optimized Landing Pages */}
            <Route path="/plagiarism-checker-online" element={<PlagiarismCheckerOnline />} />
            <Route path="/free-plagiarism-checker" element={<FreePlagiarismChecker />} />
            <Route path="/turnitin-alternative" element={<TurnitinAlternative />} />
            <Route path="/ai-plagiarism-checker" element={<AIPlagiarismChecker />} />
            <Route path="/plagiarism-checker-api" element={<PlagiarismCheckerAPI />} />
            <Route path="/how-to-avoid-plagiarism" element={<HowToAvoidPlagiarism />} />
            <Route path="/how-to-read-plagiarism-report" element={<HowToReadPlagiarismReport />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/grammarly-alternative" element={<GrammarlyAlternative />} />
            
            {/* Static pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/news" element={<News />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/writer" element={<ContentWriter />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/security" element={<Security />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/changelog" element={<Changelog />} />
            {/* Original /integrations route removed as it's now protected */}
            <Route path="/features" element={<Features />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/webhooks" element={<ProtectedRoute><Webhooks /></ProtectedRoute>} />
            
            {/* Protected routes */}
            <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><TeamDashboard /></ProtectedRoute>} />
            <Route path="/meet/:code" element={<ProtectedRoute><VideoMeeting /></ProtectedRoute>} />
            <Route
              path="/rewrite-results"
              element={
                <ProtectedRoute>
                  <RewriteResults />
                </ProtectedRoute>
              }
            />
            {/* Video Meeting */}
            <Route 
              path="/meet/:code" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <VideoMeeting />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            {/* My Job Applications */}
            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/rewrite"
              element={
                <ProtectedRoute>
                  <RewriteResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/security"
              element={
                <AdminRoute>
                  <AdminSecurityDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                duration: 5000,
              },
            }}
          />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

