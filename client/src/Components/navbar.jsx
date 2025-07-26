import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/userContext';
import { IoPerson } from "react-icons/io5";
import { GiPieChart } from "react-icons/gi";
import { IoSunny, IoMoon } from "react-icons/io5";

const Navbar = () => {
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference or system preference
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'));
  });

  useEffect(() => {
    // Apply dark mode class to root element
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className='sticky top-0 h-[12vh] z-40 bg-white/70 backdrop-blur-2xl shadow-sm px-4 pt-2 sm:px-6 lg:px-8'>
      <div className="flex items-center justify-between h-16">
        {/* Left side - Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-xl font-bold text-green-600 flex items-center gap-1">
            <GiPieChart className=''/> Exanaly
          </Link>
        </div>

        {/* Middle - Theme Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
          </button>
        </div>

        {/* Right side - Auth buttons */}
        {!user ? ( 
          <div className="flex items-center space-x-4">
            <Link 
              to="/register" 
              className="px-4 py-2 rounded-sm border bg-white border-green-700 text-green-700 hover:bg-green-50 transition-colors"
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-sm bg-green-700 text-white hover:bg-green-700 transition-colors"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link 
            to='/profile' 
            className="group h-full aspect-square rounded-full flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200 relative"
          >
            <IoPerson className='text-3xl text-gray-700' />
            {/* Profile text that appears on hover */}
            <div className="absolute top-full opacity-0 group-hover:opacity-100 -translate-y-3 rounded-xl group-hover:translate-y-0 bg-white/90 dark:bg-gray-700/90 font-semibold duration-200 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              Profile
            </div>
          </Link>        )}
      </div>
    </nav>
  );
};

export default Navbar;