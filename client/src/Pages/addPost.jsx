import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PostForm from '../Components/postForm';

const AddPost = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData, coverFile, galleryFiles) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      form.append('cover', coverFile);
      galleryFiles.forEach(file => form.append('images', file));
      await api.post('/listing/add', form);
      setSuccessMsg("Listing created successfully!");
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
      submitLabel="Create Listing"
    />
  );
};

export default AddPost;