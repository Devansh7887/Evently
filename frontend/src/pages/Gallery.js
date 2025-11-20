import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function Gallery() {
  const [galleryEvents, setGalleryEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/gallery');
        setGalleryEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch gallery", error);
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
          Our Event Gallery
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the highlights from our amazing events. Every picture tells a story! 📸✨
        </p>
      </div>

      {galleryEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-xl text-gray-600">No gallery items yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {galleryEvents.map((event) => (
            <Link 
              key={event._id} 
              to={`/gallery/${event.slug}`}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                <img 
                  src={event.thumbnailImageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                {/* View text on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-purple-600 font-bold px-6 py-2 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    View Gallery
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-lg font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                  {event.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}