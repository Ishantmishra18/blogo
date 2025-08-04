import React, { useState } from 'react';
import Loading from './loading';

const AIresponse = ({ data }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to convert markdown-like text to HTML with proper formatting
    const formatSummaryText = (text) => {
        return text
            // Convert **bold** to <strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert *italic* to <em>
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Convert numbered lists
            .replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>')
            // Convert bullet points
            .replace(/^-\s+(.*$)/gm, '<li>$1</li>')
            // Convert line breaks to paragraphs
            .split('\n\n')
            .map(paragraph => {
                if (paragraph.startsWith('<li>') || paragraph.includes('<li>')) {
                    return `<ul>${paragraph}</ul>`;
                }
                return `<p>${paragraph}</p>`;
            })
            .join('');
    };


    
    const generateSummary = async () => {
        if (!data || Object.keys(data).length === 0) {
            setError('No data provided for analysis');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSummary('');
        
        try {
            // Prepare a clean prompt with the JSON data
            const prompt = `Please analyze this JSON data and provide a concise summary in bullet points. 
                Focus on key patterns, important values, and notable observations. 
                The data is: ${JSON.stringify(data, null, 2)}`;

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API}`,
                    "HTTP-Referer": window.location.href,
                    "X-Title": document.title,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-r1:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful data analyst that summarizes JSON data in clear, concise points."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.3  // Lower temperature for more factual responses
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.choices && result.choices[0]?.message?.content) {
                setSummary(result.choices[0].message.content);
            } else {
                setError('Unexpected response format from API');
            }
        } catch (error) {
            console.error('Summary generation error:', error);
            setError(error.message || 'Failed to generate summary');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-[80vw] p-6'>
            <button 
                className='px-6 py-2 bg-green-600 text-white rounded-2xl mt-2 hover:bg-green-700 transition-colors disabled:bg-gray-400'
                onClick={generateSummary}
                disabled={isLoading || !data || Object.keys(data).length === 0}
            >
                {isLoading ? 'Generating Summary...' : 'Summarize Data'}
            </button>
            
            {error && (
                <p className="mt-4 text-red-500">{error}</p>
            )}
            
            {summary && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h2 className="font-bold mb-2 text-lg">Data Summary:</h2>
                    <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatSummaryText(summary) }}
                    />
                </div>
            )}
        </div>
    );
};

export default AIresponse;