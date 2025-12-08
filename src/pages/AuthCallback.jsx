import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useAppContext();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      let message = 'Authentication failed';
      if (error === 'google_auth_failed') message = 'Google authentication failed';
      if (error === 'server_error') message = 'Server error occurred';
      
      toast.error(message);
      navigate('/login');
      return;
    }

    if (token) {
      // Save token
      localStorage.setItem('token', token);
      setToken(token);

      // Fetch user data
      fetchUserData(token);
    } else {
      toast.error('No authentication token received');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://plagzap-backend-2.onrender.com/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        toast.success('Welcome! 👋');
        navigate('/analyzer');
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to complete authentication');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
