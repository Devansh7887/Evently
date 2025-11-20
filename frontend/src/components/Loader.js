import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center py-16 sm:py-24">
      {/* Animated Spinner */}
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-purple-600"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-pink-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      {/* Loading Text */}
      <p className="mt-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
        Loading...
      </p>
      
      {/* Decorative Dots */}
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}