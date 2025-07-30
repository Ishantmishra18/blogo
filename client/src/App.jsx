import React, { useState } from 'react';
import Upload from './Components/upload';
import HomePage from './Components/homepage';
import { UserProvider } from './Context/userContext';
import { RouterProvider, Route , Router , createBrowserRouter } from 'react-router-dom';
import Login from './Components/login';
import Register from './Components/register';
import Navbar from './Components/navbar';
import Profile from './Components/profile';
import { ThemeProvider } from './Context/themeContext';
import Admin from './Components/adminPanel';


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
  },{
    path:'/admin',
    element:<><Admin/></>
  }
])

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
      <RouterProvider router={router} />
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;