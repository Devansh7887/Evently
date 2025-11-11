import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminManageGallery() {
  const [galleryEvents, setGalleryEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchGalleryEvents = async () => {
    const { data } = await axios.get('/api/gallery');
    setGalleryEvents(data);
  };

  useEffect(() => {
    fetchGalleryEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailImage) {
      alert('Thumbnail image is required');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('thumbnailImage', thumbnailImage);
    
    for (let i = 0; i < galleryImages.length; i++) {
      formData.append('galleryImages', galleryImages[i]);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
      await axios.post('/api/gallery', formData, config);
      fetchGalleryEvents(); // List refresh karein
      // Form reset
      setTitle(''); setDescription(''); setThumbnailImage(null); setGalleryImages([]);
      e.target.reset();
    } catch (error) {
      console.error('Failed to create gallery event', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/gallery/${id}`, config);
        fetchGalleryEvents(); // List refresh karein
      } catch (error) {
        console.error('Failed to delete gallery event', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Manage Gallery Portfolio</h1>
      
      {/* Naya Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8 space-y-4">
        <h3 className="text-2xl font-bold">Add New Gallery Event</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Title</label>
          <input type="text" placeholder="e.g., Summer Gala 2024" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea placeholder="Event description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" required></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail Image (1 image) <span className="text-red-500">*</span></label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnailImage(e.target.files[0])} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gallery Images (Multiple)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(e.target.files)} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Uploading...' : 'Add to Gallery'}
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Existing Gallery Events</h3>
        {galleryEvents.map((event) => (
          <div key={event._id} className="flex justify-between items-center p-4 bg-white rounded shadow">
            <div className="flex items-center">
              <img src={event.thumbnailImageUrl} alt={event.title} className="w-16 h-16 object-cover rounded mr-4" />
              <p className="font-semibold">{event.title}</p>
            </div>
            <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}