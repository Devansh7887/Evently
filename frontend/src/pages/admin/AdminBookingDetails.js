import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import BookingDetailModal from '../../components/admin/BookingDetailModal'; // Humara modal

export default function AdminBookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [event, setEvent] = useState(null); // Event ki info store karein
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { token } = useAuth();
  const { slug } = useParams();

  useEffect(() => {
    const fetchEventBookings = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // 1. Pehle event ki details slug se laayein
        const eventRes = await axios.get(`/api/events/${slug}`);
        setEvent(eventRes.data); // <-- Event ko state mein save karein
        const eventId = eventRes.data._id;
        
        // 2. Uss ID se saari bookings laayein
        const bookingsRes = await axios.get(`/api/bookings/event/${eventId}`, config);
        setBookings(bookingsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
        setLoading(false);
      }
    };
    fetchEventBookings();
  }, [slug, token]);

  if (loading) return <Loader />;

  return (
    <>
      <div>
        <Link to="/admin/bookings" className="text-blue-500 mb-4 inline-block">&larr; Back to All Events</Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Bookings for: {event?.title || '...'}</h1>
        
        {bookings.length === 0 ? (
          <p>No bookings found for this event yet.</p>
        ) : (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Main Attendee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone (Main)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tickets</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking, index) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.tickets[0]?.attendeeName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.tickets[0]?.attendeePhone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.tickets.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedBooking(booking)} // Modal kholega
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal (Reuse) */}
      {selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking} 
          // --- YEH NAYA FIX HAI ---
          // Hum event object ko alag se pass kar rahe hain
          event={event} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
    </>
  );
}