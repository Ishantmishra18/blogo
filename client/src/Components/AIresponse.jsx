import React, { useState } from 'react';
import Loading from './loading';
import { useTheme } from '../Context/themeContext';

const AIresponse = ({ data }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const { isDark } = useTheme();

    const formatSummaryText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>')
            .replace(/^-\s+(.*$)/gm, '<li>$1</li>')
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
                    "temperature": 0.3
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.choices && result.choices[0]?.message?.content) {
                setSummary(result.choices[0].message.content);
                setIsPanelOpen(true);
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

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Floating action button */}
            <button
                onClick={togglePanel}
                className={`px-6 py-3 md:text-xl text-lg fixed left-2 bottom-2 z-30 rounded-lg shadow-lg transition-all duration-300 ${
                    isPanelOpen 
                        ? isDark 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        : isDark 
                            ? 'bg-blue-700 text-white hover:bg-blue-800' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {isPanelOpen ? (
                    <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Hide Summary
                    </span>
                ) : (
                    <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Summarize by AI
                    </span>
                )}
            </button>
            
            {/* Slide-up panel */}
            <div className={`fixed left-0 w-screen  bottom-0 shadow-xl rounded-t-2xl transition-all duration-300 transform ${
                isPanelOpen ? 'translate-y-0' : 'translate-y-full'
            } ${isDark ? 'bg-gray-700/90 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'}`} 
            style={{ height: '65vh' }}>
                <div className="h-full flex flex-col">
                    {/* Panel header */}
                    <div className={`p-4 border-b flex justify-between items-center ${
                        isDark ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                        <h3 className={`text-lg font-semibold ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>AI Data Summary</h3>
                        <button 
                            onClick={togglePanel}
                            className={`p-1 rounded-full ${
                                isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Content area with fixed height and scroll */}
                    <div className="flex-1 overflow-y-auto p-4 pb-20">
                        {!summary && !isLoading && !error && (
                            <div className={`h-full flex flex-col items-center justify-center text-center ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                <h3 className="text-lg font-medium">AI Data Summary</h3>
                                <p className="mt-2 text-sm">Click the button below to generate insights from your data</p>
                                <button
                                    className={`mt-4 px-6 py-2 cursor-pointer rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 ${
                                        isDark ? 'bg-green-700 text-white' : 'bg-green-600 text-white'
                                    }`}
                                    onClick={generateSummary}
                                    disabled={!data || Object.keys(data).length === 0}
                                >
                                    Generate Summary
                                </button>
                            </div>
                        )}

                        {isLoading && (
                            <div className="h-full flex items-center justify-center">
                                <div className={`flex items-center ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    <Loading />
                                    <span className="ml-2">Generating summary...</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className={`p-4 rounded-lg ${
                                isDark ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-600'
                            }`}>
                                <p>{error}</p>
                                <button
                                    className={`mt-2 px-4 py-1 rounded ${
                                        isDark ? 'bg-red-800/50 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'
                                    }`}
                                    onClick={generateSummary}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {summary && (
                            <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className={`text-xl font-bold ${
                                        isDark ? 'text-white' : 'text-gray-800'
                                    }`}>Analysis Results</h2>
                                    <button
                                        onClick={generateSummary}
                                        className={`px-3 py-1 rounded hover:bg-opacity-80 text-sm ${
                                            isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        Regenerate
                                    </button>
                                </div>
                                <div 
                                    className={`prose max-w-none flex-1 overflow-y-auto ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: formatSummaryText(summary) }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIresponse;