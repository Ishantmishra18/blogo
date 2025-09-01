import React, { useState, useEffect } from 'react';
import { usePost } from '../Context/postContext';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaRegBookmark, FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa6";
import Loader from '../Components/loader';

const RoomDetails = ({ userBookmarks = [] }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { postID } = useParams();
  const { posts } = usePost();
  const post = posts.find(val => val._id === postID);

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const response = await api.get(`/listing/${postID}/comments`);
      setComments(response.data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Function to check if the user has liked the post
 

  // Initial data fetching
  useEffect(() => {
    const fetchData = async () => {
      if (userBookmarks.includes(postID)) {
        setBookmarked(true);
      }
      await fetchComments();
      setIsLoading(false);
    };

    fetchData();
  }, [userBookmarks, postID]);

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/user/like/${postID}`);
      } else {
        await api.post(`/user/like/${postID}`);
      }
      setLiked(!liked);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        await api.delete(`/user/bookmark/${postID}`);
      } else {
        await api.post(`/user/bookmark/${postID}`);
      }
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    try {
      const response = await api.post(`/listing/${postID}/comment`, { text: newComment });
      setComments([...comments, response.data.newComment]);
      setNewComment('');
    } catch (err) {
      console.error('Comment submission error:', err);
    }
  };

  if (isLoading || !post) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen w-full relative bg-gray-50 pb-20">

      {/* Sticky Top Bar (Responsive) */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm p-4 md:p-6 flex flex-col md:flex-row justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <img
            src={post.owner.cover}
            alt={post.owner.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">{post.owner.username}</span>
            <span className="text-sm text-gray-500">Post Owner</span>
          </div>
          <Link
            to={`/profile/${post.owner._id}`}
            className="ml-4 px-4 py-2 text-sm bg-black text-white rounded-full transition-all duration-200 hover:bg-gray-800"
          >
            View Profile
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <button onClick={handleLike} className="text-2xl transition-transform transform hover:scale-110">
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500 hover:text-red-500" />}
          </button>
          <button onClick={handleBookmark} className="text-2xl transition-transform transform hover:scale-110">
            {bookmarked ? <FaBookmark className="text-black" /> : <FaRegBookmark className="text-gray-500 hover:text-black" />}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 mt-8">

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10">

          {/* Cover Image */}
          <div className="mb-6">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-[25vh] object-cover rounded-2xl shadow-md"
            />
          </div>

          <h1 className='text-3xl md:text-4xl font-extrabold text-gray-800 mb-4'>{post.title}</h1>
          <p className='text-gray-700 text-base md:text-lg leading-relaxed min-h-[20vh]'>{post.description}</p>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-xl mt-8 p-6 md:p-10">
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Comments ({comments.length})</h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full h-24 p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-black text-white rounded-full font-medium transition-colors hover:bg-gray-800"
            >
              Post Comment
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <img
                    src={comment.owner.cover}
                    alt={comment.owner?.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">{comment.owner?.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;