import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import BookingFormModal from '../components/BookingFormModal'; // <-- Import the modal

export default function EventBookingPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- State for modal
  const { slug } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/events/${slug}`);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) return <Loader />;
  if (!event) return <div>Event not found.</div>;

  return (
    <> {/* Use fragment to allow modal to sit alongside page */}
      <div className="container mx-auto p-4 max-w-4xl">
        {/* --- BANNER IMAGE --- */}
        {event.bannerImageUrl && (
          <div className="w-full h-64 md:h-96 rounded-lg shadow-lg overflow-hidden mb-6">
            <img
              src={event.bannerImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-700 mb-2">{event.description}</p>
        <p className="text-lg font-semibold mb-4">
          Date: {new Date(event.date).toLocaleDateString()} at {event.time}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Venue Details & Image */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Venue</h2>
            <p className="text-lg font-semibold mb-4">{event.venue}</p>
            {/* --- VENUE IMAGE --- */}
            {event.venueImageUrl && (
              <div className="w-full h-48 rounded-lg shadow-md overflow-hidden mb-6">
                <img
                  src={event.venueImageUrl}
                  alt={event.venue}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Right Side: Booking Box */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-green-600">₹{event.price}</span>
              {event.ticketsAvailable > 0 ? (
                <span className="text-lg text-gray-600">{event.ticketsAvailable} tickets left</span>
              ) : (
                <span className="text-lg font-bold text-red-500">Sold Out</span>
              )}
            </div>

            {event.ticketsAvailable > 0 && (
              <button
                onClick={() => setIsModalOpen(true)} // <-- FIX: This opens the modal
                className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-bold shadow-lg
                           transform transition-all duration-300 ease-in-out
                           hover:bg-green-600 hover:shadow-2xl hover:scale-105"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Render the modal component */}
      {isModalOpen && (
        <BookingFormModal 
          event={event} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}