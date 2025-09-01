import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './Components/nav';
import Login from './Pages/login';
import Register from './Pages/register';
import HomePost from './Pages/postPage';
import ProfilePage from './Pages/profilePage';
import { UserProvider } from './Context/userContext';
import { PostProvider } from './Context/postContext';
import AddPost from './Pages/addPost';
import ListingPage from './Pages/listingPage';
import Bookmark from './Pages/bookmark';
import EditProfile from './Pages/editUser';
import EditPost from './Pages/editPost';
import YourPost from './Pages/yourPost';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ListingPage />
       
      </>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/blog/:postID',
    element: (
      <>
        <Navbar />
        <HomePost />
      </>
    ),
  },
  {
    path:'/profile',
    element:<ProfilePage/>
  },{
    path:'/profile/addpost',
    element:<AddPost/>
  },{
    path:'/profile/editpost/:postId',
    element:<EditPost/>
  },{
    path:'/profile/bookmark',
    element:<Bookmark/>
  },{
    path:'/profile/edit',
    element:<EditProfile/>
  },{
    path:'/profile/yourpost',
    element:<YourPost/>
  }
]);

const App = () => {
  return (
    <UserProvider>
      <PostProvider>
      <RouterProvider router={router} />
      </PostProvider>
    </UserProvider>
  );
};

export default App;