import React, { useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Sidelog from './sidelog';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from './loading';
import { useTheme } from '../Context/themeContext';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [eye, setEye] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      alert("Registered successfully! Now login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {isLoading && <Loading />}
      
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <div className="">
        <Sidelog />
      </div>
      
      {/* Registration Form */}
      <div className={`flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <form 
          onSubmit={handleSubmit} 
          className={`w-full max-w-md ${isDark ? 'text-white' : 'text-gray-800'}`}
        >
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-center ${
            isDark ? 'text-white' : 'text-sec'
          }`}>
            Welcome to <span className={`${isDark ? 'text-green-400' : 'text-green-700'}`}>ExAnaly</span>
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
                <FaEye className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-neutral-700'}`} /> : 
                <FaEyeSlash className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-neutral-700'}`} />
              }
            </button>
          </div>
          
          {/* Error Message */}
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          
          {/* Submit Button */}
          <button
            type="submit" 
            className={`w-full p-4 mt-6 ${
              isDark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
            } text-white font-bold rounded-md transition-colors duration-300`}
          >
            Register
          </button>
          
          {/* Login Link */}
          <p className={`mt-6 text-center ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Already have an account?{' '}
            <Link 
              to='/login' 
              className={`underline ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              } transition-colors`}
            >
              Login to account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;