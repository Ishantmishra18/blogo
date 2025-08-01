import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import { useTheme } from '../Context/themeContext';

const Homepage = () => {
  const { isDark } = useTheme();

  const features = [
    { 
      main: 'Advanced Analytics', 
      sub: 'Get automatic statistical analysis, trend detection, and predictive insights from your spreadsheet data.' 
    },
    { 
      main: 'Beautiful Visualizations', 
      sub: 'Transform rows of data into interactive charts and graphs that make patterns instantly visible.' 
    },
    { 
      main: 'Secure Processing', 
      sub: 'Your data is encrypted during upload and processing. We never store your files longer than necessary.' 
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen pt-[8vh] ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Hero Section */}
        <section className={`py-12 px-4 sm:py-20 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 lg:pr-8">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Transform Your <span className="text-green-600">Excel Data</span> Into Insights
            </h1>
            <p className={`text-lg sm:text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Upload your spreadsheets and get powerful visualizations, trend analysis, and data summaries in seconds.
            </p>
            <Link 
              to="/upload" 
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Upload Your Files Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img 
              src="/assets/excel.png" 
              alt="Excel data visualization" 
              className="w-[80%] max-w-md lg:max-w-lg xl:max-w-xl animate-float" 
            />
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-12 px-4 sm:py-16 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Powerful Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 sm:p-8 rounded-lg border transition-all duration-200 hover:translate-y-1 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 hover:border-green-400' 
                      : 'bg-white border-gray-200 hover:border-green-300 shadow-sm'
                  }`}
                >
                  <h3 className={`text-lg sm:text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.main}
                  </h3>
                  <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-12 px-4 sm:py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to unlock insights from your data?
            </h2>
            <Link 
              to="/upload" 
              className={`inline-flex items-center px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Homepage;