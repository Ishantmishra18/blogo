import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';

const Homepage = () => {


  let features = [{main:'the good' , sub:'realy'},{main:'wow' , sub:'les go'},{main:'nice' , sub:'try it'}]
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-12 h-[88vh] flex">
          <div className=" cont w-[60vw]">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your <span className="text-green-600">Excel Data</span> Into Insights
            </h1>
            <p className="text-xl text-gray-600">
              Upload your spreadsheets and get powerful visualizations, trend analysis, and data summaries in seconds.
            </p>
            <Link 
              to="/upload" 
              className="inline-flex items-center mt-10 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Upload Your Files Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="">
            <img src="/assets/excel.png" alt="" className='animate-float' />
          </div>
        </section>


        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Powerful Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              {features.map((feature, index) => (
              <div key={index} className="bg-green-50 duration-200 hover:translate-y-2 p-8 rounded-xl border border-green-100 hover:border-green-300 transition-all">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.main}</h3>
                <p className="text-gray-600">
                  {feature.sub}
                </p>
                </div>
              ))}
              
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
};

export default Homepage;