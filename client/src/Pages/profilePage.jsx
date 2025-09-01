import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../Context/userContext';
import Loader from '../Components/loader';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setUser, user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return <><Loader></Loader></>;

return (
  <div className="min-h-screen flex flex-col md:flex-row items-stretch">
    {/* Left Panel */}
    <div className="w-full md:w-[35vw] bg-gray-100 flex flex-col items-center p-6 md:p-10 gap-5 relative">
      {/* Navigation */}
      <div className="w-full flex justify-between items-center">
        <Link
          to="/"
          className="px-5 py-2 text-sm md:text-base rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          Back to Home
        </Link>

        {/* Three Dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-xl md:text-2xl px-2 py-1 rounded-full hover:bg-gray-200 transition"
          >
            ⋯
          </button>

          {showMenu && (
            <div className="absolute right-0 w-44 bg-white shadow-lg rounded-md z-10">
              <Link to="edit" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                Edit Profile
              </Link>
              <Link to="bookmark" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                View Bookmarks
              </Link>
              <Link to='yourpost' className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>view your posts</Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <img
        src={user?.cover}
        alt=""
        className="w-28 h-28 md:w-[60%] md:h-auto md:aspect-square rounded-full object-cover"
      />
      <h2 className="text-xl md:text-2xl">{user.username}</h2>
    </div>

    {/* Right Panel */}
    <div className="w-full md:flex-1 flex items-center justify-center p-6 md:p-10">
      <Link
        to="addpost"
        className="bg-black px-6 py-3 text-sm md:text-base rounded-full text-white hover:bg-gray-900 transition"
      >
        Create your own post
      </Link>
    </div>
  </div>
);

};

export default ProfilePage;