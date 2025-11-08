import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function BookingViewer() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Humne is route ko pehle hi admin ke liye banaya tha
        const { data } = await axios.get('/api/bookings/my-bookings', config);
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">All Bookings</h3>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{booking.ticketId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.eventId ? booking.eventId.title : 'Event Deleted'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.attendeeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.ticketCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}