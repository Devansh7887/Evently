import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

export default function VerifyTicket() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        // This is the public API route we created
        const { data } = await axios.get(`/api/bookings/verify/${bookingId}`);
        setBooking(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid Ticket');
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4 max-w-md">
      {booking ? (
        // --- VALID TICKET ---
        <div className="p-6 bg-green-100 text-green-800 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">✅ Ticket Verified</h1>
          <div className="text-left space-y-2">
            <p><strong>Status:</strong> <span className="font-semibold uppercase">{booking.status}</span></p>
            <p><strong>Event:</strong> <span className="font-semibold">{booking.event.title}</span></p>
            <p><strong>Attendee:</strong> <span className="font-semibold">{booking.attendeeName}</span></p>
            <p><strong>Tickets:</strong> <span className="font-semibold">{booking.ticketCount}</span></p>
            <p><strong>Date:</strong> <span className="font-semibold">{new Date(booking.event.date).toLocaleDateString()}</span></p>
          </div>
        </div>
      ) : (
        // --- INVALID TICKET ---
        <div className="p-6 bg-red-100 text-red-800 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">❌ Invalid Ticket</h1>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}