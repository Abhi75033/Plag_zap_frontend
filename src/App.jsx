import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
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
import TeamDashboard from './pages/TeamDashboard';
import VideoMeeting from './pages/VideoMeeting'; // Video meeting import
import AdminRoute from './components/AdminRoute';
import ApiDocs from './pages/ApiDocs';
import ErrorBoundary from './components/ErrorBoundary';

// Static pages
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Security from './pages/Security';
import GDPR from './pages/GDPR';
import Changelog from './pages/Changelog';
import Integrations from './pages/Integrations';
import Features from './pages/Features';
import Shipping from './pages/Shipping';
import Refunds from './pages/Refunds';
import AuthCallback from './pages/AuthCallback';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            
            {/* Static pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/security" element={<Security />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/changelog" element={<Changelog />} />
            {/* Original /integrations route removed as it's now protected */}
            <Route path="/features" element={<Features />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            
            {/* Protected routes */}
            <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><TeamDashboard /></ProtectedRoute>} />
            <Route path="/meet/:code" element={<ProtectedRoute><VideoMeeting /></ProtectedRoute>} />
            <Route
              path="/analyzer"
              element={
                <ProtectedRoute>
                  <Analyzer />
                </ProtectedRoute>
              }
            />
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

