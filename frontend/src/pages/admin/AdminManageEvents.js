import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EventForm from '../../components/EventForm'; // The form we already built

export default function AdminManageEvents() {
  const [events, setEvents] = useState([]);
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
                  {/* Note: These links don't go anywhere yet, we can build them later */}
                  <span className="text-gray-400 mr-4">View Bookings</span>
                  <span className="text-gray-400 mr-4">Edit</span>
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
    </div>
  );
}