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

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Refresh event data to get updated ticket count
    fetchEvent();
  };

  if (loading) return <Loader />;
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h1>
        <p className="text-gray-600">The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Banner Image */}
        {event.bannerImageUrl && (
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl shadow-2xl overflow-hidden mb-6 sm:mb-8">
            <img
              src={event.bannerImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {event.title}
          </h1>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">{event.description}</p>
          
          {/* Event Info Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-red-50 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {event.time}
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              {event.category}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Side: Venue Details & Image */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Venue
                </h2>
                <p className="text-lg font-semibold text-gray-800 mb-4">{event.venue}</p>
                {event.venueImageUrl && (
                  <div className="w-full h-48 sm:h-64 rounded-xl shadow-lg overflow-hidden">
                    <img
                      src={event.venueImageUrl}
                      alt={event.venue}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Booking Box */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-2xl shadow-xl sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm mb-2">Price per ticket</p>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                    ₹{event.price}
                  </div>
                  {event.ticketsAvailable > 0 ? (
                    <div className="flex items-center justify-center text-blue-600 font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                      </svg>
                      {event.ticketsAvailable} tickets available
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-full">
                      ❌ Sold Out
                    </div>
                  )}
                </div>

                {event.ticketsAvailable > 0 && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full btn-success py-4 text-lg"
                  >
                    🎟️ Book Now
                  </button>
                )}
                
                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Instant Confirmation
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    E-Ticket via Email
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure Payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <BookingFormModal 
          event={event} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}