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
    <nav className={`fixed w-screen top-0 md:h-[12vh] h-[8vh] z-40 ${isDark ? 'bg-gray-900/80' : 'bg-white/70'} backdrop-blur-2xl shadow-sm px-4 pt-2 sm:px-6 lg:px-8`}>
      <div className="flex items-center justify-between md:h-16 h-8">
        {/* Left side - Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className={`text-xl font-bold flex items-center gap-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            <GiPieChart /> Exanaly 
          </Link>
        </div>

        <div className="flex gap-2">
         <button
            onClick={toggleTheme}
            className={`p-2 rounded-full cursor-pointer ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
            aria-label="Toggle theme"
          >
            {isDark ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
          </button>
        
        {/* Right side - Auth buttons */}
        {!user ? ( 
          <div className="flex items-center gap-4 mr-2">
              <div className="flex items-center ">
         
        </div>
            <Link 
              to="/register" 
              className={`md:px-4 px-2 py-2 rounded-sm border ${isDark ? 'bg-gray-700 border-green-400 text-green-400 hover:bg-gray-600' : 'bg-white border-green-700 text-green-700 hover:bg-green-50'} transition-colors`}
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className={`md:px-4 px-2 py-2 rounded-sm ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-800'} text-white transition-colors`}
            >
              Login
            </Link>
          </div>
        ) : (
       
          <Link
  to="/profile"
  className={`
    relative mr-4 flex items-center justify-center
    h-10 w-10 md:h-12 md:w-12 rounded-full
    ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2
    ${isDark ? 'focus:ring-gray-400' : 'focus:ring-gray-500'}
    overflow-hidden
  `}
  aria-label="User profile"
>
  {/* Profile image with better fallback */}

    <img 
      src={user?.cover} 
      alt="User profile" 
      className="h-full w-full object-cover"
      loading="lazy"
    />

  {/* Tooltip with better positioning and animation */}
  <div className={`
    absolute z-10 left-1/2 transform -translate-x-1/2
    top-full mt-2 px-3 py-2 rounded-lg shadow-md
    text-sm font-medium whitespace-nowrap
    ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
    opacity-0 invisible
    group-hover:opacity-100 group-hover:visible
    transition-all duration-200 ease-in-out
    pointer-events-none
  `}>
    Profile
    {/* Tooltip arrow */}
    <div className={`
      absolute -top-1 left-1/2 transform -translate-x-1/2
      w-3 h-3 rotate-45
      ${isDark ? 'bg-gray-800' : 'bg-white'}
    `} />
  </div>
</Link>
        
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;