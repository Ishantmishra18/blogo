import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../Context/userContext';
import Sidelog from './sidelog';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Loading from './loading';


const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [eye , setEye] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      
      const response = await api.post('/auth/login', form);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className='h-screen w-screen flex'>
       {isLoading&&<Loading/>}
     <Sidelog></Sidelog>
        <div className="login grid place-content-center h-auto w-[45vw] py-6 shadow-lg bg-white rounded-md">
           
            <form action="" onSubmit={handleSubmit} className='flex flex-col gap-4 items-center w-[27vw]'>
                 <h1 className='text-6xl font-semibold text-sec'>Login User</h1>
                <input type="text" placeholder='username' value={form.username} onChange={e=>setForm({ ...form, username: e.target.value })} className=' border-b-2 border-neutral-200 outline-none h-16 w-full' />

                <div className="border-b-2 border-neutral-200 h-16 w-full overflow-hidden relative">
                     <input type={!eye?"password":'text'} placeholder='password'  value={form.password} onChange={e=>setForm({ ...form, password: e.target.value })} className='h-full w-full absolute top-0 outline-none'/>
                     <div className='absolute cursor-pointer h-6 w-6  top-1/2 -translate-y-1/2 right-2' onClick={()=>setEye(!eye)}>
                        {eye?<FaEye className='h-full w-full text-neutral-700'/>:<FaEyeSlash className='h-full w-full text-neutral-700'/>}

                     </div>
                     
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <input type="submit" className='h-16 w-full mt-24 bg-green-600 text-white font-bold rounded-md cursor-pointer hover:translate-y-1 duration-300 hover:bg-green-800'/>
                <h4>Don't have an account? <Link to='/register' className='underline text-blue-600'>create account </Link></h4>
            </form>
        </div>
    </div>
  );
};

export default Login;