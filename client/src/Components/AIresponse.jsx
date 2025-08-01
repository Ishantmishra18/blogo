import React, { useState } from 'react';
import api from '../utils/api';
import Loading from './loading';

const AIresponse = ({ data }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateSummary = async () => {
        if (!data) {
            setError('No data provided for analysis');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            // Use POST instead of GET since you're sending data
            const res = await api.post('/files/summary', { data });
            
            if (res.data && res.data.summary) {
                setText(res.data.summary);
            } else {
                setError('Unexpected response format');
            }
        } catch (error) {
            console.error('Summary generation error:', error);
            setError(error.response?.data?.message || 'Failed to generate summary');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-[80vw] p-6'>
            {isLoading && <Loading />}
            
            <button 
                className='px-6 py-2 bg-green-600 text-white rounded-2xl mt-2 hover:bg-green-700 transition-colors disabled:bg-gray-400'
                onClick={generateSummary}
                disabled={isLoading || !data}
            >
                {isLoading ? 'Generating...' : 'Summarize with AI'}
            </button>
            
            {error && (
                <p className="mt-4 text-red-500">{error}</p>
            )}
            
            {text && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h2 className="font-bold mb-2">AI Summary:</h2>
                    <p className="whitespace-pre-line">{text}</p>
                </div>
            )}
        </div>
    );
};

export default AIresponse;