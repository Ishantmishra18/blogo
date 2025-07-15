import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/userContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {user} = useUser()

  return (
    <nav className='sticky top-0 z-40 bg-white shadow-sm px-4 py-3 sm:px-6 lg:px-8'>
      <div className="flex items-center justify-between h-16">
        {/* Left side - Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-xl font-bold text-green-600">YourBrand</Link>
        </div>

        {/* Right side - Auth buttons */}
        {!user ? ( 
        <div className="flex items-center space-x-4">
          <Link 
            to="/register" 
            className="px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 transition-colors"
          >
            Register
          </Link>
          <Link 
            to="/login" 
            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
        </div>):(
            <Link to='/profile' className="h-full aspect-square rounded-full flex items-center justify-center bg-gray-200">
                  
                </Link>
        )}
       
      </div>
    </nav>
  );
};

export default Navbar;