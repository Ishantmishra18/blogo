import React from 'react';
import { useUser } from '../Context/userContext';
import { usePost } from '../Context/postContext';
import RoomPost from '../Components/blogPost';
import Loader from '../Components/loader';

const Bookmark = () => {
  const { user } = useUser();
  const { posts } = usePost();

if (!user || !user.bookmarks || !Array.isArray(user.bookmarks)) return <div><Loader></Loader></div>;

const bookmarkedPosts = posts.filter(post =>
  user.bookmarks.some(bookmarkId => bookmarkId.toString() === post._id.toString())
);
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Bookmarked Blog</h1>
      
      {bookmarkedPosts.length === 0 ? (
        <p className="text-gray-500">You haven't bookmarked any Blog yet.</p>
      ) : (
        <div className="space-y-6">
          {bookmarkedPosts.map(post => (
            <RoomPost key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmark;