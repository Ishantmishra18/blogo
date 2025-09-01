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

        <div className="flex flex-col md:w-[70vw] items-center w-screen gap-5 p-10">
        {posts?.map((val, key) => (
        <RoomPost post={val} key={key}/>
        ))}
      </div>
      <div className="map h-[65vh] md:block hidden w-[25vw] sticky top-[30vh] bg-neutral-600 rounded-2xl border-2 border-neutral-500 overflow-hidden">
        <div className="absolute bg-black/60 backdrop-blur-2xl px-4 py-2 rounded-2xl text-white bottom-2 right-2"> find your place on map</div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF1fhw8tIpzVbLuhI_ZPqWzoL1zNZ6oK4AQg&s" alt="" className='h-full w-full object-cover' />
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