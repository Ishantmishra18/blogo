import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/userContext';

const Landing = () => {

  const { user } = useUser();

  return (
    <div className='relative min-h-[88vh] flex flex-col md:flex-row items-center justify-center p-4 md:px-20 lg:px-[15%] overflow-hidden'>
      {/* Background Shapes */}
      <div className="hidden lg:block absolute left-[-10rem] top-[5vh] h-[30vh] w-[30vh] aspect-square rounded-full bg-slate-200 opacity-50 blur-3xl z-0"></div>
      <div className="hidden lg:block absolute right-[-5rem] bottom-[5vh] h-[20vh] w-[20vh] aspect-square rounded-full bg-orange-200 opacity-50 blur-3xl z-0"></div>

      {/* Content Section */}
      <div className="w-full md:w-[60%] flex flex-col items-center md:items-start text-center md:text-left z-10 p-4">
        <h2 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter mb-4 text-gray-900'>
          Post your daily thoughts at one place
          <span className='flex flex-col sm:flex-row items-center justify-center md:justify-start mt-2 sm:mt-0'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 hover:text-gray-900 transition-colors duration-300 drop-shadow-md'>
              BloGO
            </span>
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-lg">
          Your personal space to share ideas, stories, and insights. Join a community of thinkers and creators.
        </p>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/blog"
            className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-full shadow-lg hover:bg-gray-700 transition-transform hover:translate-x-1 duration-200 text-center"
          >
            Check Other Blogs
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-gray-900 border-2 border-gray-900 rounded-full transition-transform hover:translate-x-1 duration-200 text-center"
            >
              Login to create your blog
            </Link>
          ) : (
            <Link
              to="/profile/addpost"
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-gray-900 border-2 border-gray-900 rounded-full transition-transform hover:translate-x-1 duration-200 text-center"
            >
              Create Your Own Blog
            </Link>
          )}
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-full md:w-[40%] h-full p-4 lg:p-8 flex items-center justify-center z-10">
        <img
          src="https://imgs.search.brave.com/JBeyTjNdOwOqjf7cYJsq3hT400hx2aABQKSAsRPmLEc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE1LzE2LzY5LzAz/LzM2MF9GXzE1MTY2/OTAzOTVfQUtBbGty/bFltWmhNNmFvaXo1/c1ozaUF2R1VpeFZW/ZGcuanBn"
          alt="Blogging illustration"
          className='w-full h-auto object-contain rounded-3xl shadow-2xl'
        />
      </div>
    </div>
  );
};

export default Landing;