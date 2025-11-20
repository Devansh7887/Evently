import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const TicketCard = ({ ticket, event }) => {
  return (
    <div id="ticket-to-print" className="bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden mb-6">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">EVENT TICKET</h2>
            <p className="text-sm text-gray-200">ID: {ticket.ticketId}</p>
          </div>
          <div className="text-4xl">🎟️</div>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{event.title}</h3>
        <div className="flex items-center text-gray-700 mb-2">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-base sm:text-lg font-semibold">{event.venue}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between text-base sm:text-lg mt-4 gap-2">
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{event.time}</span>
          </div>
        </div>
      </div>
      
      <hr className="border-dashed border-2 border-purple-200" />
      
      {/* Attendee Info */}
      <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-500 mb-2">ATTENDEE NAME</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">{ticket.attendeeName}</p>
          <p className="text-sm text-gray-600 mt-1">{ticket.attendeeEmail}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500 mb-2">TICKET COUNT</p>
          <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">1</p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-purple-200">
          <img src={ticket.qrCodeUrl} alt="Booking QR Code" className="w-40 h-40 sm:w-48 sm:h-48" />
        </div>
      </div>
    </div>
  );
};

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
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {booking ? (
          <>
            {/* Success Message */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Booking Confirmed!
              </h1>
              <p className="text-gray-700 text-sm sm:text-base max-w-xl mx-auto">
                Your ticket has been confirmed and sent to <span className="font-semibold text-purple-600">{booking.attendeeEmail}</span>
              </p>
            </div>
            
            {/* Tickets */}
            {booking.tickets.map((ticket) => (
              <TicketCard key={ticket.ticketId} ticket={ticket} event={booking.event} />
            ))}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                to="/" 
                className="btn-primary text-center py-3 px-6"
              >
                ← Back to Events
              </Link>
              <button
                onClick={handlePrint} 
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                🖨️ Download / Print
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Please arrive 30 minutes before the event starts</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Show this QR code at the entry gate for verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Carry a valid ID proof for verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Your ticket is non-transferable and non-refundable</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-red-600">Ticket Not Found</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              Back to Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}