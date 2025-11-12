import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';

// Yeh component ab "View Bookings" ki jagah "Select Event" ka kaam karega
export default function AdminViewBookings() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Hum saare events fetch karenge
        const { data } = await axios.get('/api/events');
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch events', error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">View Bookings by Event</h1>
      <p className="text-lg text-gray-600 mb-6">Select an event to see all its bookings.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const ticketsSold = event.seatingCapacity - event.ticketsAvailable;
          return (
            <Link 
              key={event._id}
              to={`/admin/bookings/${event.slug}`} // Naye details page par bhejega
              className="bg-white rounded-lg shadow-lg overflow-hidden group transition-all hover:shadow-xl"
            >
              <img 
                src={event.bannerImageUrl || 'https://via.placeholder.com/400x200'} 
                alt={event.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold truncate mb-2">{event.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{event.venue}</p>
                <div className="flex justify-between text-sm">
                  <span>Price:</span>
                  <span className="font-semibold">₹{event.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sold:</span>
                  <span className="font-semibold">{ticketsSold}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-semibold">{event.ticketsAvailable}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}