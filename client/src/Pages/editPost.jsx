// pages/EditPost.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom'; // or useSearchParams in Next.js
import api from '../utils/api';
import PostForm from '../Components/postForm';

const EditPost = () => {
  const location = useLocation();
  const { postId } = useParams();
  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/listing/${postId}`);
        setPost(data);
      } catch (error) {
        setErrorMsg('Failed to load post.');
      }
    };

    if (!post) fetchPost();
  }, [postId, post]);

  const handleEditPost = async (formData, coverFile, galleryFiles) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('price', formData.price);
      if (coverFile) data.append('cover', coverFile);
      galleryFiles.forEach(file => data.append('images', file));

      await api.put(`/listing/${postId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Post updated successfully!');
    } catch (error) {
      setErrorMsg('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <PostForm
      initialData={{
        title: post.title,
        description: post.description,
        location: post.location,
        price: post.price,
        coverUrl: post.cover,
        galleryUrls: post.images,
      }}
      onSubmit={handleEditPost}
      loading={loading}
      successMsg={successMsg}
      errorMsg={errorMsg}
      submitLabel="Update your Blog"
    />
  );
};

export default EditPost;