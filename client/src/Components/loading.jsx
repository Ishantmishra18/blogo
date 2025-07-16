import React from 'react';

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black/15 backdrop-blur-sm fixed top-0 left-0 z-40">
      <img 
        src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif" 
        alt="Loading..."
        className="w-12 h-12"
      />
    </div>
  );
};

export default Loading;