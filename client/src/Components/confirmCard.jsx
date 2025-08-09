import React, { useState } from 'react';
import { useTheme } from '../Context/themeContext';
import { IoClose } from 'react-icons/io5';

const ConfirmCard = ({ text, onClick, close, name, type = "delete" }) => {
  const { isDark } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (type === "delete" && inputValue !== name) {
      setError(`Please type "${name}" to confirm`);
      return;
    }
    onClick();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`relative rounded-xl p-6 pt-10 w-full max-w-md transition-all ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-xl`}
      >
        {/* Close button */}
        <button 
          onClick={close}
          className={`absolute cursor-pointer top-4 right-4 p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="Close"
        >
          <IoClose className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{text}</h2>
          
          {type === "delete" && (
            <>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                To confirm, please type <span className="font-bold">{name}</span> below:
              </p>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-2 rounded-lg border ${error ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-400'}`}
                placeholder={`Type "${name}"`}
                autoFocus
              />
              
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={close}
              className={`px-4 py-2 cursor-pointer rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={type === "delete" && inputValue !== name}
              className={`px-4 py-2 rounded-lg cursor-pointer text-white ${type === "delete" ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCard;