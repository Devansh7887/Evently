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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Portfolio</h1>
      <p className="text-lg text-center text-gray-600 mb-8">Dekhiye hamare kuch behtareen events ki jhalak.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryEvents.map((event) => (
          <Link 
            key={event._id} 
            to={`/gallery/${event.slug}`} // Naye detail page par jaayein
            className="bg-white rounded-lg shadow-lg overflow-hidden group"
          >
            <img 
              src={event.thumbnailImageUrl} // Thumbnail
              alt={event.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold truncate">{event.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}