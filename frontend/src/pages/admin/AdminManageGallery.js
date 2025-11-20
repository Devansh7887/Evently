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
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const openEditModal = (event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingEvent(null);
    setShowEditModal(false);
  };

  const handleEventUpdated = (updatedEvent) => {
    setGalleryEvents(galleryEvents.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)));
    closeEditModal();
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
            <div className="flex gap-2">
              <button onClick={() => openEditModal(event)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingEvent && (
        <EditGalleryModal
          event={editingEvent}
          onClose={closeEditModal}
          onEventUpdated={handleEventUpdated}
          token={token}
        />
      )}
    </div>
  );
}

// Edit Gallery Modal Component
function EditGalleryModal({ event, onClose, onEventUpdated, token }) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    if (thumbnailImage) formData.append('thumbnailImage', thumbnailImage);
    for (let i = 0; i < galleryImages.length; i++) {
      formData.append('galleryImages', galleryImages[i]);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`/api/gallery/${event._id}`, formData, config);
      onEventUpdated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update gallery event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Gallery Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" required></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail Image (Optional - leave empty to keep current)</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailImage(e.target.files[0])} className="w-full p-2 border rounded" />
            {event.thumbnailImageUrl && <img src={event.thumbnailImageUrl} alt="Current Thumbnail" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Add More Gallery Images (Optional)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(e.target.files)} className="w-full p-2 border rounded" />
            <p className="text-sm text-gray-500 mt-1">These will be added to existing gallery images</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Updating...' : 'Update Gallery Event'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}