import React from 'react'
import { useTheme } from '../Context/themeContext';

const confirmCard = ({text , onClick , close , name}) => {
  const { isDark } = useTheme();
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
    <div className={`shadow-2xs shadow-gray-800 rounded-2xl p-8 ${isDark?'bg-gray-800 text-white':'bg-white '}`} >
        <h2>{text} </h2>
        <h2 className='text-xl'>{name}</h2>
        
        <div className="btncont mt-12 flex gap-5">
            <button className='bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer' onClick={onClick}>Confirm</button>
            <button className='bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer' onClick={close}>Cancel</button>
        </div>
    </div>
    </div>
  )
}

export default confirmCard