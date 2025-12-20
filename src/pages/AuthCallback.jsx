import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../services/api';
import { useAppContext } from '../context/AppContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAppContext();

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
          // Save token to localStorage
          localStorage.setItem('token', token);
          console.log('Token saved to localStorage');
          
          // Fetch user data to verify token and update context
          console.log('Fetching user data...');
          const userData = await getCurrentUser();
          console.log('User data received:', userData);
          
          // Update app context with user data
          if (setUser) {
            setUser(userData);
            console.log('User context updated');
          }
          
          toast.success('Welcome! 👋');
          
          // Navigate to analyzer (context is already updated)
          navigate('/analyzer');
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
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full mx-auto mb-4"></div>
        <p className="text-white font-medium text-lg">Completing authentication...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we log you in</p>
      </div>
    </div>
  );
};

export default AuthCallback;
