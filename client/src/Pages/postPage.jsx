import React, { useState, useEffect } from 'react';
import { usePost } from '../Context/postContext';
import { useParams , Link} from 'react-router-dom';
import api from '../utils/api';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import Loader from '../Components/loader'


const RoomDetails = ({ userBookmarks = [] }) => {
 
  const [bookmarked, setBookmarked] = useState(false);
  const [liked , setLiked] = useState(false);

  const { postID } = useParams();
  const { posts } = usePost();
  const post = posts.find(val => val._id === postID);

  useEffect(() => {
    if (userBookmarks.includes(postID)) {
      setBookmarked(true);
    }
  }, [userBookmarks, postID]);

  const handleLike = async () => {
    try {
        if(liked){
            await api.post(`/listing/like/${postID}`);
        }
        else{
            await api.delete(`/listing/like/${postID}`);
        }
        setLiked(!liked);
    } catch (err) {
      console.error('Like error:', err);
    }
  }

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

  if (!post) {
    return <><Loader></Loader></>;
  }

  return (
  <div className="min-h-screen w-full relative">

    {/* Sticky Navbar */}
    <div className="sticky top-[10vh] w-full z-50 bg-white/90 backdrop-blur-2xl rounded-d-xl shadow-md mb-4 px-4 py-4 md:px-12 flex justify-between items-center">

      <div className="flex gap-3 ">
          <div className="mt-6">

      <div className="mt-4 flex items-end gap-4 p-4 bg-white shadow-md rounded-lg w-fit">
        {/* Avatar */}
        <img
          src={post.owner.cover}
          alt={post.owner.username}
          className="w-14 h-14 rounded-full object-cover border-2"
        />

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800">{post.owner.username}</span>
          <span className="text-sm text-gray-500">Post Owner</span>
        </div>

        {/* Button */}
        
        <Link
          to={`/profile/${post.owner._id}`}
          className=" px-2 md:px-4 py-1 md:py-2 text-sm bg-black text-white rounded-lg transition"
        >
          View Profile
        </Link>
      </div>
      </div>
      <div className="flex gap-4">
        <button onClick={handleBookmark} className="text-black text-xl">
          {bookmarked ? <FaBookmark className="text-black" /> : <FaRegBookmark className="text-black" />}
        </button>
        <button onClick={handleLike} className="text-black text-xl">
            press for like
        </button>
      </div>

        
      </div>
    </div>
<div className="maincont mx-4 md:mx-20">

    {/* Image Grid */} 

    <div className=""></div>
    

    <div className="imgcont w-full h-48">
    <img
      src={post.cover}
      alt=""
      className="w-full h-full object-cover rounded-2xl lg:rounded-l-3xl"
    />
</div>
<h1 className='mb-2 mt-4 md:text-2xl font-bold text-lg '>{post.title}</h1>
<p className='text-gray-700 text-sm md:text-base min-h-[20vh]'>{post.description}</p>


    {/* Comments section*/}
    <h2 className='text-2xl'>Comments</h2>
        <div className="w-full">

        </div>
    </div>
  </div>
);
};

export default RoomDetails;