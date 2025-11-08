import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const dummyImages = [
  { _id: 'g1', title: 'Summer Gala 2024', imageUrl: 'https://via.placeholder.com/600x400' },
  { _id: 'g2', title: 'Tech Conference 2024', imageUrl: 'https://via.placeholder.com/600x400' },
  { _id: 'g3', title: 'Music Festival', imageUrl: 'https://via.placeholder.com/600x400' },
  { _id: 'g4', title: 'Product Launch', imageUrl: 'https://via.placeholder.com/600x400' },
];

export default function Gallery() {
  const [images, setImages] = useState([]); // Dummy data hata diya
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/gallery');
        setImages(data);
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
      <h1 className="text-4xl font-bold mb-8 text-center">Event Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img) => (
          <div key={img._id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <img 
              src={img.imageUrl} 
              alt={img.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{img.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}