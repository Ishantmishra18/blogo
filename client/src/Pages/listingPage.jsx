import React from 'react';
import { usePost } from '../Context/postContext'; // Assuming this context provides blog post data
import Nav from '../Components/nav';
import BlogPosts from '../Components/blogPost'; // A new component to display blog posts

const BlogPage = () => {
  // We'll use the 'posts' from the context, assuming they are now blog posts
  const { posts } = usePost();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Nav />
      
      <div className="container mx-auto px-4 py-10 flex-grow">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Our Blog</h1>
          <p className="text-lg text-gray-600 mt-2">Insights, stories, and updates from our team.</p>
        </header>

        {/* This is the main content area for the blog posts */}
         {posts?.map((val, key) => (

      <BlogPosts post={val} key={key}/>
  ))}
      </div>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 YourCompany. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;