// components/PostForm.jsx
import React, { useState, useRef } from 'react';
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
    title: initialData.title || '',
    description: initialData.description || '',
    ...initialData
  });

  const [selectedCoverOption, setSelectedCoverOption] = useState('');
  const textareaRef = useRef(null);

  // Predefined cover options
  const coverOptions = [
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1463171379579-3fdfb86d6285?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCoverOption = (optionUrl) => {
    setSelectedCoverOption(optionUrl);
  };

  const handleRemoveCover = () => {
    setSelectedCoverOption(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCoverOption) {
      alert('Please select a cover image');
      return;
    }
    
    // Send data to backend: title, description, and cover URL
    onSubmit({
      title: formData.title,
      description: formData.description,
      cover: selectedCoverOption
    });
  };

  // Simple text formatting functions
  const formatText = (format) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);
    const before = formData.description.substring(0, start);
    const after = formData.description.substring(end);
    
    let formattedText = selectedText;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        break;
    }
    
    const newDescription = before + formattedText + after;
    setFormData(prev => ({ ...prev, description: newDescription }));
    
    // Set cursor position after the formatted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row w-full bg-gray-50 overflow-x-hidden">
      {/* Form Section */}
      <form onSubmit={handleFormSubmit} className="w-full lg:w-[65%] p-4 sm:p-6 md:p-8 flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{submitLabel}</h2>
        
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200">
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
              placeholder="Enter your blog title"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description *</label>
            
            {/* Simple formatting toolbar */}
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-100 rounded-lg">
              <button type="button" onClick={() => formatText('bold')} className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50">
                <strong>B</strong>
              </button>
              <button type="button" onClick={() => formatText('italic')} className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50">
                <em>I</em>
              </button>
              <button type="button" onClick={() => formatText('underline')} className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50">
                <u>U</u>
              </button>
              <button type="button" onClick={() => formatText('code')} className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50">
                Code
              </button>
              <button type="button" onClick={() => formatText('link')} className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50">
                Link
              </button>
            </div>
            
            <textarea 
              ref={textareaRef}
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="12"
              required
              placeholder="Write your blog description here..."
            />
            
            <div className="mt-2 text-sm text-gray-500">
              <p>Formatting tips:</p>
              <ul className="list-disc list-inside ml-4">
                <li>**bold** for <strong>bold text</strong></li>
                <li>_italic_ for <em>italic text</em></li>
                <li>`code` for <code>inline code</code></li>
                <li>[link text](url) for hyperlinks</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className={`bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Publishing...' : submitLabel}
            </button>
          </div>
        </div>
      </form>

      {/* Preview Section */}
      <div className="w-full lg:w-[35%] bg-gradient-to-b from-neutral-900 to-gray-800 flex flex-col items-start p-4 sm:p-6 gap-4 sm:gap-6">
        <div className="w-full">
          <h2 className="text-white text-xl font-semibold mb-3 sm:mb-4">Cover Image</h2>
          <p className="text-gray-400 text-sm mb-3 sm:mb-4">Select a cover image for your blog</p>
          
          {/* Selected Cover Preview */}
          {selectedCoverOption ? (
            <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden relative mb-4 sm:mb-6 border-2 border-blue-500">
              <img 
                src={selectedCoverOption} 
                alt="Selected cover" 
                className="w-full h-full object-cover" 
              />
              <button
                type="button"
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white bg-red-600 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm hover:bg-red-700 transition shadow-lg"
                onClick={handleRemoveCover}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center mb-4 sm:mb-6">
              <div className="text-center text-gray-400">
                <CiCirclePlus className="text-3xl sm:text-4xl mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm">No cover selected</p>
              </div>
            </div>
          )}

          {/* Cover Options */}
          <div>
            <h3 className="text-white text-sm font-medium mb-2 sm:mb-3">Choose a cover image:</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {coverOptions.map((option, index) => (
                <div
                  key={index}
                  className={`relative aspect-video rounded-md sm:rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedCoverOption === option 
                      ? 'border-blue-500 ring-2 ring-blue-300 ring-opacity-50' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  onClick={() => handleSelectCoverOption(option)}
                >
                  <img 
                    src={option} 
                    alt={`Cover option ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  {selectedCoverOption === option && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Preview */}
        {(formData.title || formData.description) && (
          <div className="w-full mt-4 sm:mt-6">
            <h3 className="text-white text-base sm:text-lg font-medium mb-2 sm:mb-3">Preview:</h3>
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-lg">
              {selectedCoverOption && (
                <img 
                  src={selectedCoverOption} 
                  alt="Cover preview" 
                  className="w-full h-32 sm:h-40 object-cover rounded-md mb-2 sm:mb-3"
                />
              )}
              {formData.title && (
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">{formData.title}</h4>
              )}
              {formData.description && (
                <div className="text-gray-600 text-xs sm:text-sm">
                  {formData.description.length > 120 
                    ? formData.description.substring(0, 120) + '...' 
                    : formData.description
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostForm;