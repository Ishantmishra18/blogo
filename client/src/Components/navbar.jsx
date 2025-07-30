// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/userContext';
import { IoPerson } from "react-icons/io5";
import { GiPieChart } from "react-icons/gi";
import { IoSunny, IoMoon } from "react-icons/io5";
import { useTheme } from '../Context/themeContext';

const Navbar = () => {
  const { user } = useUser();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`fixed w-screen top-0 h-[12vh] z-40 ${isDark ? 'bg-gray-900/80' : 'bg-white/70'} backdrop-blur-2xl shadow-sm px-4 pt-2 sm:px-6 lg:px-8`}>
      <div className="flex items-center justify-between h-16">
        {/* Left side - Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className={`text-xl font-bold flex items-center gap-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            <GiPieChart /> Exanaly
          </Link>
        </div>

        {/* Middle - Theme Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
            aria-label="Toggle theme"
          >
            {isDark ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
          </button>
        </div>

        {/* Right side - Auth buttons */}
        {!user ? ( 
          <div className="flex items-center space-x-4">
            <Link 
              to="/register" 
              className={`px-4 py-2 rounded-sm border ${isDark ? 'bg-gray-700 border-green-400 text-green-400 hover:bg-gray-600' : 'bg-white border-green-700 text-green-700 hover:bg-green-50'} transition-colors`}
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className={`px-4 py-2 rounded-sm ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-800'} text-white transition-colors`}
            >
              Login
            </Link>
          </div>
        ) : (
          <Link 
            to='/profile' 
            className={`group h-full aspect-square rounded-full flex flex-col items-center justify-center ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200 relative`}
          >
            <IoPerson className={`text-3xl ${isDark ? 'text-gray-200' : 'text-gray-700'}`} />
            {/* Profile text that appears on hover */}
            <div className={`absolute top-full opacity-0 group-hover:opacity-100 -translate-y-3 rounded-xl group-hover:translate-y-0 ${isDark ? 'bg-gray-700/90 text-gray-200' : 'bg-white/90 text-gray-700'} font-semibold duration-200 px-4 py-2 text-sm`}>
              Profile
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;