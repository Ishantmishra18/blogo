import React, { useState, useEffect } from 'react';
import { usePost } from '../Context/postContext';
import Nav from '../Components/nav';
import BlogPosts from '../Components/blogPost';
import { FiSearch } from 'react-icons/fi';

const BlogPage = () => {
  const { posts } = usePost();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (!posts) {
      setFilteredPosts([]);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = posts.filter(post => 
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      (post.description && post.description.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredPosts(results);
  }, [searchQuery, posts]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Nav />
        
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Improved Header Section */}
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover insights, stories, and updates from our team
          </p>
          
          {/* Enhanced Search Bar with Icon */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-4 pl-12 pr-10 text-base md:text-lg border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              </p>
            )}
          </div>
        </header>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <BlogPosts post={post} key={post._id} />
            ))
          ) : posts && posts.length > 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-500 text-xl font-semibold mb-2">No posts found</p>
                <p className="text-gray-400">Try different keywords or browse all posts</p>
              </div>
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <p className="text-gray-500 text-xl font-semibold mb-2">No blog posts yet</p>
                <p className="text-gray-400">Check back later for new content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm md:text-base">&copy; 2025 YourCompany. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;