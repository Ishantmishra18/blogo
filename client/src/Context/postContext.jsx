// src/context/PostContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/listing/get');
        setPosts(res.data); // assuming this is an array
      } catch (err) {
        console.error("Failed to fetch posts", err);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);