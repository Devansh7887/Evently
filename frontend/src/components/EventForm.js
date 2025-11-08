import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState(100);
  const [price, setPrice] = useState(50);
  const [category, setCategory] = useState('General');
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [venueImage, setVenueImage] = useState(null);
  const [venuePreview, setVenuePreview] = useState('');


  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth(); // Admin token

  // File change handle karne ke liye
// Banner image handler
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Venue image handler
  const handleVenueChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVenueImage(file);
      setVenuePreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!token) {
      setError('You must be logged in as an admin.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('venue', venue);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('seatingCapacity', Number(seatingCapacity));
    formData.append('price', Number(price));
    formData.append('category', category);

    if (bannerImage) {
      formData.append('bannerImage', bannerImage);
    }
    if (venueImage) {
      formData.append('venueImage', venueImage);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };



      const { data } = await axios.post(
        '/api/events',
        formData,
        config
      );

      setSuccess(`Event "${data.title}" created successfully!`);
      // Form ko reset karein
      setTitle('');
      setDescription('');
      setVenue('');
      setDate('');
      setTime('');
      setSeatingCapacity(100);
      setPrice(50);
      setCategory('General');
      setBannerImage(null);
      setBannerPreview('');
      setVenueImage(null);
      setVenuePreview('');
      
      // Dashboard ko update karein (optional)
      if (onEventCreated) {
        onEventCreated(data); // Naya event dashboard list mein add karein
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., VIP, General, Student"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Seating Capacity</label>
            <input
              type="number"
              value={seatingCapacity}
              onChange={(e) => setSeatingCapacity(e.target.value)}
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ticket Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </div>
        {/* --- Image Inputs --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Banner Image Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {bannerPreview && (
              <div className="mt-4">
                <img src={bannerPreview} alt="Banner Preview" className="w-full h-32 object-cover rounded-md" />
              </div>
            )}
          </div>

          {/* Venue Image Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleVenueChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {venuePreview && (
              <div className="mt-4">
                <img src={venuePreview} alt="Venue Preview" className="w-full h-32 object-cover rounded-md" />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-green-600 hover:shadow-xl hover:-translate-y-1 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}