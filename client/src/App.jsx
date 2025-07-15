import React, { useState } from 'react';
import Upload from './Components/upload';
import Dashboard from './Components/dashboard';
import HomePage from './Components/homepage';
import { UserProvider } from './Context/userContext';
import { RouterProvider, Route , Router , createBrowserRouter } from 'react-router-dom';
import Login from './Components/login';
import Register from './Components/register';
import Navbar from './Components/navbar';
import Profile from './Components/profile';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <HomePage></HomePage>   
      </>
    ),
  },{
    path:'/login',
    element: <Login/>
  },{
    path:'/register',
    element:<Register/>
  },{
    path:'/upload',
    element:<><Navbar/><Upload/></>
  },{
    path:'/profile',
    element:<><Profile/></>
  }
])

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;