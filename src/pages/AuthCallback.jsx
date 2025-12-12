import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../services/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      console.log('AuthCallback - Token:', token);
      console.log('AuthCallback - Error:', error);

      if (error) {
        let message = 'Authentication failed';
        if (error === 'google_auth_failed') message = 'Google authentication failed';
        if (error === 'server_error') message = 'Server error occurred';
        
        toast.error(message);
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Save token
          localStorage.setItem('token', token);
          
          // Fetch user data using the existing API method
          console.log('Fetching user data...');
          await getCurrentUser();
          
          toast.success('Welcome! 👋');
          // Force page reload to update context
          window.location.href = '/analyzer';
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error('Failed to complete authentication');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        console.error('No token found in URL');
        toast.error('No authentication token received');
        navigate('/login');
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Completing authentication...</p>
        <p className="text-xs text-gray-500 mt-2">Please wait while we log you in</p>
      </div>
    </div>
  );
};

export default AuthCallback;
