import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Get token from context

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/bookings/my-bookings', config);
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    } else {
      setLoading(false);
      setError('Please log in to see your bookings.');
    }
  }, [token]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage your event tickets</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🎟️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't booked any events. Start exploring!</p>
            <a href="/" className="btn-primary inline-block">
              Browse Events
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Details */}
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                        {booking.eventId.title}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-gray-500 text-xs">Venue</p>
                            <p className="text-gray-800 font-semibold">{booking.eventId.venue}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-gray-500 text-xs">Date</p>
                            <p className="text-gray-800 font-semibold">{new Date(booking.eventId.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                          </svg>
                          <div>
                            <p className="text-gray-500 text-xs">Tickets</p>
                            <p className="text-gray-800 font-semibold">{booking.ticketCount} Ticket{booking.ticketCount > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-gray-500 text-xs">Total Paid</p>
                            <p className="text-gray-800 font-semibold">₹{booking.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 inline-block">
                        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                          ✅ {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex-shrink-0 text-center lg:border-l lg:pl-6">
                      <p className="text-sm font-semibold text-gray-600 mb-3">Entry QR Code</p>
                      <div className="inline-block bg-white p-3 rounded-xl shadow-lg border-2 border-purple-100">
                        <img src={booking.qrCodeUrl} alt="Booking QR Code" className="w-32 h-32 sm:w-40 sm:h-40" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Show this at entry</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}