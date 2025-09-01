import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PostForm from '../Components/postForm';

const AddPost = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      // Send the blog post data to the backend
      await api.post('/listing/add', postData);
      
      setSuccessMsg("Blog post created successfully!");
      setTimeout(() => navigate('/profile'), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostForm
      onSubmit={handleSubmit}
      loading={loading}
      successMsg={successMsg}
      errorMsg={errorMsg}
      submitLabel="Create your Blog"
    />
  );
};

export default AddPost;