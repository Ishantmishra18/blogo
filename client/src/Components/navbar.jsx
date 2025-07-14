import React from 'react'

const navbar = () => {
  return (
    <div className='top-0 sticky w-screen flex px-10 justify-end items-end'>
        <div className="user flex gap-3">
            <div className="px-4 py-2 rounded-2xl">Register</div>
            <div className="">Login</div>
        </div>
    </div>
  )
}

export default navbar