import React from 'react';

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-2xl p-8 sm:p-12 mb-12 text-center shadow-2xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">About EventApp</h1>
        <p className="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto">
          Creating unforgettable experiences, one event at a time 🎉
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 mb-8">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">🎯</div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Welcome to EventApp, your premier partner in creating unforgettable experiences. We are a passionate team of event planners, designers, and technical experts dedicated to bringing your vision to life. Our mission is to connect people with amazing events and make booking seamless and enjoyable.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 sm:p-10 mb-8">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">✨</div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What We Do
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
            From intimate gatherings to large-scale corporate conferences, we handle every detail with precision and care. Our platform connects event organizers with attendees, making it easy to discover, book, and attend amazing events.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Concerts & Music</h3>
              <p className="text-sm text-gray-600">Live performances and music festivals</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Theater & Shows</h3>
              <p className="text-sm text-gray-600">Drama, comedy, and entertainment</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🎪</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Festivals & Fairs</h3>
              <p className="text-sm text-gray-600">Cultural celebrations and events</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">💎</div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🌟</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">We deliver flawless events that exceed expectations</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🤝</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Trust</h3>
                <p className="text-gray-600 text-sm">Building lasting relationships with our community</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🚀</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">Using technology to enhance event experiences</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">❤️</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Passion</h3>
                <p className="text-gray-600 text-sm">Love for creating memorable moments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}