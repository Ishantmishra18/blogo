import React from 'react';
import { usePost } from '../Context/postContext';
import Nav from '../Components/nav';
import RoomPost from '../Components/roomPost';

const ListingPage = () => {
  const { posts } = usePost(); 

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="flex py-10">

        <div className="flex flex-col items-center w-screen gap-5 p-10">
        {posts?.map((val, key) => (
        <RoomPost post={val} key={key}/>
        ))}
      </div>
     
      </div>

      <footer className="bg-black text-white py-6 mt-10">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
    <p className="text-sm">&copy; 2025 YourCompany. All rights reserved.</p>
    <div className="flex space-x-4 mt-4 md:mt-0">
    </div>
  </div>
</footer>

  
    </div>
  );
};

export default ListingPage;