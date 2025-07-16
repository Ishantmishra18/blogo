import React, { useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Sidelog from './sidelog';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Loading from './loading';


const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [eye , setEye] = useState(false);
  const [isLoading , setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert("Registered successfully! Now login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    finally{
      setIsLoading(false)
    }
  };



  return (
      <div className='h-screen w-screen flex'>
        {isLoading&&<Loading/>}
     <Sidelog></Sidelog>
        <div className="login grid place-content-center h-auto w-[45vw] py-6 shadow-lg bg-white rounded-md">
           
            <form action="" onSubmit={handleSubmit} className='flex flex-col gap-4 items-center w-[27vw]'>
                 <h1 className='text-6xl font-semibold text-sec'>Welcome to <span className='text-green-700'>ExAnaly</span></h1>
                <input type="text" placeholder='username' value={form.username} onChange={e=>setForm({ ...form, username: e.target.value })} className=' border-b-2 border-neutral-200 outline-none h-16 w-full' />

                <div className="border-b-2 border-neutral-200 h-16 w-full overflow-hidden relative">
                     <input type={!eye?"password":'text'} placeholder='password'  value={form.password} onChange={e=>setForm({ ...form, password: e.target.value })} className='h-full w-full absolute top-0 outline-none'/>
                     <div className='absolute cursor-pointer h-6 w-6  top-1/2 -translate-y-1/2 right-2' onClick={()=>setEye(!eye)}>
                        {eye?<FaEye className='h-full w-full text-neutral-700'/>:<FaEyeSlash className='h-full w-full text-neutral-700'/>}

                     </div>
                     
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <input type="submit" className='h-16 w-full mt-24 bg-green-600 text-white font-bold rounded-md cursor-pointer'/>
                <h4>Already have an account? <Link to='/login' className='underline text-blue-600'>login to account</Link></h4>
            </form>
        </div>
    </div>
  );
};

export default Register;