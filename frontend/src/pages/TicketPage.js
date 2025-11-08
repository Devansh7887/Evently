import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

export default function TicketPage() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const { bookingId } = useParams(); // URL se ID padhein

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        // Naye API endpoint ko call karein
        const { data } = await axios.get(`/api/bookings/ticket/${bookingId}`);
        setBooking(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Ticket not found');
        setLoading(false);
      }
    };
    fetchTicket();
  }, [bookingId]); // Jab bhi ID badle, fetch karein

  // Print/Download function
  const handlePrint = () => {
    window.print(); 
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4 text-center max-w-2xl">
      {booking ? (
        // --- SAFAL TICKET ---
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-green-600">Booking Confirmed!</h1>
          <p className="text-gray-700 mb-6">Aapka ticket confirm ho gaya hai. Ek copy aapke email ({booking.attendeeEmail}) par bhej di gayi hai.</p>
          
          {/* --- ASLI TICKET (YAHI PRINT HOGA) --- */}
          <div id="ticket-to-print" className="bg-white rounded-lg shadow-2xl border border-gray-200 text-left">
            {/* Ticket Header */}
            <div className="bg-gray-800 text-white p-4 rounded-t-lg">
              <h2 className="text-2xl font-bold">EVENT TICKET</h2>
              <p className="text-sm text-gray-300">Ticket ID: {booking.ticketId}</p>
            </div>
            
            {/* Event Details */}
            <div className="p-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{booking.event.title}</h3>
              <p className="text-lg text-gray-600 mb-4">{booking.event.venue}</p>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">{new Date(booking.event.date).toLocaleDateString()}</span>
                <span className="font-semibold">{booking.event.time}</span>
              </div>
            </div>
            
            <hr className="border-dashed" />
            
            {/* Attendee Info */}
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500">ATTENDEE</p>
                <p className="text-xl font-semibold">{booking.attendeeName}</p>
                <p className="text-sm text-gray-500">{booking.attendeeEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">TICKETS</p>
                <p className="text-4xl font-bold">{booking.ticketCount}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-6 bg-gray-50 rounded-b-lg">
              <img src={booking.qrCodeUrl} alt="Booking QR Code" className="w-48 h-48" />
            </div>
          </div>
          {/* --- TICKET END --- */}
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Link
              to="/" 
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:-translate-y-0.5"
            >
              Back to Events
            </Link>
            <button
              onClick={handlePrint} 
              className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:-translate-y-0.5"
            >
              Download / Print Ticket
            </button>
          </div>
        </div>
      ) : (
        // --- FAILED TICKET ---
        <div className="p-6 bg-red-100 text-red-800 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Ticket Not Found</h1>
          <p className="mb-6">{error}</p>
          <Link
            to="/"
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Back to Events
          </Link>
        </div>
      )}
    </div>
  );
}