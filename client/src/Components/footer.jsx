import React from 'react'

const footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-12">
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
  )
}

export default footer