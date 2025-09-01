import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../Context/userContext';

const YourPost = () => {
  const { user } = useUser();
  const [yourPosts, setYourPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (user) {
        try {
          const response = await api.get(`/listing/mypost/${user._id}`);
          setYourPosts(response.data);
        } catch (error) {
          console.error('Error fetching your posts:', error);
        }
      }
    };
    fetchMyPosts();
  }, [user]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')){
      try {
        await api.delete(`/listing/${postId}`);
        setYourPosts(prev => prev.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="w-screen min-h-screen p-4 bg-gray-50">
      <h3 className="text-3xl text-black mb-6">Your Posts</h3>

      {yourPosts.length === 0 ? (
        <p className="text-gray-500 text-lg">You have no posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {yourPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={post.cover || '/default-post.jpg'}
                alt="Cover"
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
                </div>
                <div className="mt-4 flex gap-1 justify-start">
                    <Link to={`/blog/${post._id}`} className='px-4 py-2 rounded-md rounded-l-xl bg-gray-200'>view post</Link>
                  <Link
                    to={`/profile/editpost/${post._id}`}
                     state={{ post }}
                    className="text-center px-4 py-2 rounded-md bg-gray-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="px-4 py-2 text-red-400 font-medium rounded-md bg-gray-200  rounded-r-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourPost;