import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useUser } from '../Context/userContext';
import api from '../utils/api';

const BlogCard = ({ post }) => {
  const [bookmarked, setBookmarked] = React.useState(false);
  const { user, setUser } = useUser();

  const userBookmarks = user?.bookmarks;

  React.useEffect(() => {
    if (userBookmarks?.includes(post._id)) {
      setBookmarked(true);
    }
  }, [post._id, userBookmarks]);

  const handleBookmark = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking bookmark
    if (!user) return;
    try {
      if (bookmarked) {
        await api.delete(`/user/bookmark/${post._id}`);
        setUser(prev => ({
          ...prev,
          bookmarks: prev.bookmarks.filter(id => id !== post._id),
        }));
      } else {
        await api.post(`/user/bookmark/${post._id}`);
        setUser(prev => ({
          ...prev,
          bookmarks: [...prev.bookmarks, post._id],
        }));
      }
      setBookmarked(!bookmarked);
    } catch (error) {
      console.log('Error updating bookmark:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Bookmark Icon */}
      {user && (
        <div
          className="absolute top-4 right-4 text-xl cursor-pointer z-10 bg-white p-2 rounded-full shadow-md"
          onClick={handleBookmark}
        >
          {bookmarked ? (
            <FaBookmark className="text-blue-600" />
          ) : (
            <FaRegBookmark className="text-gray-500 hover:text-blue-600" />
          )}
        </div>
      )}
      
      {/* Clickable Card Content */}
      <Link to={`/blog/${post._id}`} className="block">
        {/* Cover Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.description}
          </p>
          
          {/* Author Info */}
          <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
            <img
              src={post.owner?.cover}
              alt={post.owner?.username || "User"}
              className="h-8 w-8 rounded-full object-cover mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">{post.owner?.username || "User"}</p>
              <p className="text-xs text-gray-500">Posted recently</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;