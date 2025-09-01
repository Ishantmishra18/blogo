import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/userContext';


const Home = () => {

    const { user } = useUser();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Container for content */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-4">
          Welcome to Our Blog
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Discover a world of stories, insights, and ideas. Start exploring or share your own!
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link 
            to="/blog"
            className="w-full md:w-auto px-10 py-4 text-lg font-semibold text-white bg-gray-900 rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
          >
            Check Other Blogs
          </Link>

           {!user? (
                     <Link
            to="/login"
            className="w-full md:w-auto px-10 py-4 text-lg font-semibold text-gray-900 border-2 border-gray-900 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-gray-900 hover:text-white"
          >
            login to create your blog
          </Link>
                         
                        ) : (
                       <Link
            to="/profile/addpost"
            className="w-full md:w-auto px-10 py-4 text-lg font-semibold text-gray-900 border-2 border-gray-900 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-gray-900 hover:text-white"
          >
            Create Your Own Blog
          </Link>
                        )}
          
        </div>
      </div>
    </div>
  );
};

export default Home;
