import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useUser } from '../Context/userContext';
import api from '../utils/api';

const RoomPost = ({ post }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, setUser } = useUser();

  const userBookmarks = user?.bookmarks;
  const images = [post.cover, ...(post.images || [])];

  useEffect(() => {
    if (userBookmarks?.includes(post._id)) {
      setBookmarked(true);
    }
  }, [post._id, userBookmarks]);

  const handleBookmark = async () => {
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

  const nextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-[90vw] max-w-5xl bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row relative h-auto md:h-[30vh]">

      {/* Bookmark Icon */}
      {user && (
        <div
          className="absolute top-4 right-4 text-xl cursor-pointer z-10"
          onClick={handleBookmark}
        >
          {bookmarked ? (
            <FaBookmark className="text-black" />
          ) : (
            <FaRegBookmark className="text-black" />
          )}
        </div>
      )}

      {/* Image Slider */}
            <div className="relative w-full md:w-[35%] h-60 md:h-full overflow-hidden">
        {/* Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-80 flex items-center justify-center z-10"
          >
            <FiChevronLeft size={20} />
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-80 flex items-center justify-center z-10"
          >
            <FiChevronRight size={20} />
          </button>
        )}

        {/* Slides container */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
          }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-full object-cover flex-shrink-0"
              style={{ width: `${100 / images.length}%` }}
            />
          ))}
        </div>
      </div>


      {/* Post Content */}
      <div className="w-full md:w-[65%] p-4 flex flex-col justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{post.title}</h2>
          <p className="text-sm text-gray-700">{post.location}</p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <h1 className="text-gray-400 text-sm">by {post.owner?.username || "User"}</h1>
            <img
              src={post.owner?.cover}
              alt=""
              className="h-7 w-7 border-2 border-gray-400 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-medium text-black">₹{post.price} / night</p>
          <Link
            to={`/listing/${post._id}`}
            className="bg-black text-white px-4 py-2 text-sm md:text-base rounded-xl hover:bg-gray-900 transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomPost;