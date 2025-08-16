import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../Context/userContext';
import Sidelog from './sidelog';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Loading from './loading';
import { useTheme } from '../Context/themeContext';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [eye, setEye] = useState(false);
  const { isDark } = useTheme();

  // Check for Google auth response in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      handleGoogleLogin(token);
    } else if (error) {
      setError(error === 'access_denied' ? 
        'Google login was cancelled' : 
        'Google login failed');
    }
  }, []);

  const handleGoogleLogin = async (token) => {
    try {
      // Store the token in cookies/localStorage
      document.cookie = `token=${token}; path=/; secure; samesite=none; max-age=${24 * 60 * 60}`; 
      
      // Decode token to get user info
      const decoded = jwtDecode(token);
      
      // Set user in context
      setUser(decoded);
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      setError('Failed to process Google login');
      console.error('Google login error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', form);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className={`min-h-screen w-full flex relative flex-col lg:flex-row ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {isLoading && <Loading/>}
      {/*home and admin btn*/}
      <div className="absolute top-0 p-6 left-0 flex gap-4 z-30" >
        <Link to='/' className="rounded-xl text-sm md:text-xl px-3 md:px-5 py-2 bg-gray-300">Home</Link>
         <Link to='/admin' className="rounded-xl text-sm md:text-xl px-3 md:px-5 py-2 bg-gray-300">Admin</Link>
      </div>
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <div className="">
        <Sidelog/>
      </div>
      
      {/* Login Form */}
      <div className={`flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <form 
          onSubmit={handleSubmit} 
          className={`w-full max-w-md ${isDark ? 'text-white' : 'text-gray-800'}`}
        >
          <h1 className={`text-4xl sm:text-5xl font-semibold mb-8 text-center ${
            isDark ? 'text-white' : 'text-sec'
          }`}>
            Login User
          </h1>
          
          {/* Username Input */}
          <div className="mb-6">
            <input 
              type="text" 
              placeholder='Username' 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })} 
              className={`w-full p-4 border-b-2 outline-none ${
                isDark 
                  ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                  : 'border-neutral-200'
              }`}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <input 
              type={!eye ? "password" : 'text'} 
              placeholder='Password'  
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
              className={`w-full p-4 pr-12 border-b-2 outline-none ${
                isDark 
                  ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                  : 'border-neutral-200'
              }`}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setEye(!eye)}
            >
              {eye ? 
                <FaEye className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-neutral-700'}`}/> : 
                <FaEyeSlash className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-neutral-700'}`}/>
              }
            </button>
          </div>
          
          {/* Error Message */}
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          
          {/* Submit Button */}
          <button
            type="submit" 
            className='w-full cursor-pointer p-4 mt-6 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-300'
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <span className={`px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>OR</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>

          {/* Google Sign-in Button */}
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
            
            className={`flex items-center cursor-pointer justify-center gap-3 w-full p-3 rounded-md transition-all duration-200 ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                : 'bg-white hover:bg-gray-50 border-gray-300'
            } border`}
          >
            <FcGoogle className="text-2xl" />
            <span className="font-medium">Continue with Google</span>
          </a>
          
          {/* Sign Up Link */}
          <p className={`mt-6 text-center ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Don't have an account?{' '}
            <Link 
              to='/register' 
              className={`underline ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              } hover:text-blue-500 transition-colors`}
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;