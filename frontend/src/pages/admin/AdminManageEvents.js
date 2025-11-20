import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EventForm from '../../components/EventForm'; // The form we already built

export default function AdminManageEvents() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { token } = useAuth();

  const fetchEvents = async () => {
    const { data } = await axios.get('/api/events');
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((e) => e._id !== id));
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents([newEvent, ...events]);
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
    setEvents(events.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)));
    closeEditModal();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Manage Events</h1>
      <EventForm onEventCreated={handleEventCreated} />

      <h2 className="text-2xl font-bold my-6">Existing Events</h2>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold / Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(event.date).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.seatingCapacity - event.ticketsAvailable} / {event.seatingCapacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(event)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandler(event._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={closeEditModal}
          onEventUpdated={handleEventUpdated}
          token={token}
        />
      )}
    </div>
  );
}

// Edit Event Modal Component
function EditEventModal({ event, onClose, onEventUpdated, token }) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [venue, setVenue] = useState(event.venue);
  const [date, setDate] = useState(event.date.split('T')[0]);
  const [time, setTime] = useState(event.time);
  const [seatingCapacity, setSeatingCapacity] = useState(event.seatingCapacity);
  const [price, setPrice] = useState(event.price);
  const [originalPrice, setOriginalPrice] = useState(event.originalPrice || '');
  const [category, setCategory] = useState(event.category);
  const [bannerImage, setBannerImage] = useState(null);
  const [venueImage, setVenueImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('venue', venue);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('seatingCapacity', Number(seatingCapacity));
    formData.append('price', Number(price));
    formData.append('originalPrice', Number(originalPrice));
    formData.append('category', category);

    if (bannerImage) formData.append('bannerImage', bannerImage);
    if (venueImage) formData.append('venueImage', venueImage);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`/api/events/${event._id}`, formData, config);
      onEventUpdated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Venue</label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Seating Capacity</label>
              <input type="number" value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)} min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ticket Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Original Price (₹) (Optional)</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Banner Image (Optional - leave empty to keep current)</label>
              <input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files[0])} className="mt-1 block w-full text-sm" />
              {event.bannerImageUrl && <img src={event.bannerImageUrl} alt="Current Banner" className="mt-2 w-full h-24 object-cover rounded" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Venue Image (Optional - leave empty to keep current)</label>
              <input type="file" accept="image/*" onChange={(e) => setVenueImage(e.target.files[0])} className="mt-1 block w-full text-sm" />
              {event.venueImageUrl && <img src={event.venueImageUrl} alt="Current Venue" className="mt-2 w-full h-24 object-cover rounded" />}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Updating...' : 'Update Event'}
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