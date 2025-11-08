import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [image, setImage] = useState(null);
  
  const { token } = useAuth();
  
  const fetchImages = async () => {
    const { data } = await axios.get('/api/gallery');
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('eventDate', eventDate);
    formData.append('image', image);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('/api/gallery', formData, config);
      setImages([data, ...images]);
      // Form reset
      setTitle(''); setEventDate(''); setImage(null); e.target.reset();
    } catch (error) {
      console.error('Failed to add gallery image', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/gallery/${id}`, config);
        setImages(images.filter((img) => img._id !== id));
      } catch (error) {
        console.error('Failed to delete gallery image', error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Manage Gallery</h3>
      {/* Add Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 pb-6 border-b">
        <input type="text" placeholder="Image Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="date" placeholder="Event Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full p-2 border rounded" />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Image</button>
      </form>
      
      {/* List Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative">
            <img src={img.imageUrl} alt={img.title} className="w-full h-32 object-cover rounded" />
            <button onClick={() => handleDelete(img._id)} className="absolute top-1 right-1 bg-red-600 text-white text-xs py-1 px-2 rounded-full hover:bg-red-700">&times;</button>
          </div>
        ))}
      </div>
    </div>
  );
}