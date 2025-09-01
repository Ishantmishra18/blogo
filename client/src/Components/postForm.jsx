// components/PostForm.jsx
import React, { useRef, useEffect, useState } from 'react';
import { CiCirclePlus } from "react-icons/ci";

const PostForm = ({
  initialData = {},
  onSubmit,
  loading,
  successMsg,
  errorMsg,
  submitLabel = "Create Your Blog"
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ...initialData
  });

  const [coverPreview, setCoverPreview] = useState(initialData.coverUrl || '');
  const [coverFile, setCoverFile] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState(initialData.galleryUrls || []);

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview('');
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 8 - galleryFiles.length);
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveGalleryImage = (index) => {
    const updatedFiles = galleryFiles.filter((_, i) => i !== index);
    const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryFiles(updatedFiles);
    setGalleryPreviews(updatedPreviews);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, coverFile, galleryFiles);
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row w-screen">
      {/* Form Section */}
      <form onSubmit={handleFormSubmit} className="w-full lg:w-[65%] p-6 sm:p-10 flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{submitLabel}</h2>
        {successMsg && <p className="text-green-600">{successMsg}</p>}
        {errorMsg && <p className="text-red-600">{errorMsg}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-1 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 rounded-xl" />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">your content</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 rounded-xl h-64" />
          </div>

          <div className="col-span-1 sm:col-span-2 flex justify-end">
            <button type="submit"
              className={`bg-black text-white px-6 py-3 rounded-xl hover:translate-y-1 cursor-pointer transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}>
              {loading ? 'Processing...' : submitLabel}
            </button>
          </div>
        </div>
      </form>

      {/* Preview Section */}
      <div className="w-full lg:w-[35%] bg-neutral-800 flex flex-col items-center justify-start p-6 gap-4">
        {/* Cover Upload */}
        <div
          className="w-full aspect-video rounded-2xl overflow-hidden border-2 relative cursor-pointer group"
          onClick={() => !coverFile && coverInputRef.current.click()}
        >
          {coverPreview ? (
            <>
              <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              <button
                className="absolute top-2 right-2 text-white bg-red-600/70 rounded-sm px-2 py-1 text-xs hover:bg-red-700/80"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCover();
                }}
              >
                ✕
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-white/35">
              <div className="flex flex-col items-center">
                <CiCirclePlus className="text-5xl" />
                <h2>Cover Image</h2>
              </div>
            </div>
          )}
          <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverUpload} className="hidden" />
        </div>

        {/* Gallery Upload */}
        <h2 className="text-white text-sm sm:text-base">Add More Images (at least 2)</h2>
        <div className="grid grid-cols-3 gap-2">
          {galleryPreviews.map((src, i) => (
            <div key={i} className="relative h-20 md:h-24 rounded-md overflow-hidden shadow border">
              <img src={src} alt='ima' className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemoveGalleryImage(i)}
                className="absolute top-1 right-1 bg-red-600/70 text-white text-xs px-1 rounded-sm hover:bg-red-700/80"
              >
                ✕
              </button>
            </div>
          ))}
          {galleryFiles.length < 8 && (
            <>
              <div
                className="h-20 md:h-24 aspect-video rounded-md overflow-hidden shadow border bg-white/35 cursor-pointer grid place-content-center"
                onClick={() => galleryInputRef.current.click()}
              >
                <CiCirclePlus className='text-3xl text-white' />
              </div>
              <input type="file" accept="image/*" multiple ref={galleryInputRef} onChange={handleGalleryUpload} className="hidden" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;