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
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center">
              <div className="flex-grow mb-4 md:mb-0 md:pr-6">
                <h2 className="text-2xl font-bold mb-2">{booking.eventId.title}</h2>
                <p className="text-gray-600"><strong>Venue:</strong> {booking.eventId.venue}</p>
                <p className="text-gray-600"><strong>Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
                <p className="text-gray-600"><strong>Tickets:</strong> {booking.ticketCount}</p>
                <p className="text-gray-600"><strong>Total:</strong> ₹{booking.totalAmount}</p>
                <p className="text-gray-600"><strong>Status:</strong> <span className="font-semibold text-green-600">{booking.paymentStatus}</span></p>
              </div>
              <div className="flex-shrink-0">
                <p className="text-center font-semibold mb-2">Your QR Code</p>
                <img src={booking.qrCodeUrl} alt="Booking QR Code" className="w-40 h-40 border p-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}