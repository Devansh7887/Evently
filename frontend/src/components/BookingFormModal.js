import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => { resolve(true); };
    script.onerror = () => { resolve(false); };
    document.body.appendChild(script);
  });
}

export default function BookingFormModal({ event, onClose }) {
  const [ticketCount, setTicketCount] = useState('1'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([{ name: '', email: '', phone: '', dob: '' }]);

  useEffect(() => {
    setAttendees(currentAttendees => {
      const newCount = parseInt(ticketCount, 10);
      if (isNaN(newCount) || newCount < 1) {
        return [];
      }
      const currentCount = currentAttendees.length;
      if (newCount > currentCount) {
        return [...currentAttendees, ...Array(newCount - currentCount).fill({ name: '', email: '', phone: '', dob: '' })];
      } else if (newCount < currentCount) {
        return currentAttendees.slice(0, newCount);
      }
      return currentAttendees;
    });
  }, [ticketCount]);

  const handleAttendeeChange = (index, field, value) => {
    setAttendees(current => current.map((attendee, i) => i === index ? { ...attendee, [field]: value } : attendee));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const numTickets = parseInt(ticketCount, 10);
    if (isNaN(numTickets) || numTickets < 1) {
      setError('Please enter a valid number of tickets.');
      setLoading(false);
      return;
    }

    for (let i = 0; i < attendees.length; i++) {
      const att = attendees[i];
      if (i === 0) {
        if (!att.name || !att.email || !att.phone || !att.dob) {
          setError('Please fill all details for the Main Attendee (Ticket 1).');
          setLoading(false);
          return;
        }
      } else {
        if (!att.name || !att.email || !att.phone) {
          setError(`Please fill in the Name, Email, and Phone for Ticket ${i + 1}.`);
          setLoading(false);
          return;
        }
      }
    }

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      setError('Razorpay SDK failed to load.');
      setLoading(false);
      return;
    }

    try {
      // --- YEH HAI ASLI FIX ---
      // Frontend state ({ name, email }) ko Backend state ({ attendeeName, attendeeEmail }) mein badlein
      const payloadAttendees = attendees.map(att => ({
        attendeeName: att.name,
        attendeeEmail: att.email,
        attendeePhone: att.phone,
        attendeeDOB: att.dob,
      }));
      // --- END FIX ---

      const { data } = await axios.post('/api/bookings/create-order', {
        eventId: event._id,
        ticketCount: numTickets,
        attendees: payloadAttendees, // Naya, sahi data bhejein
      });

      const { order, booking_id } = data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post('/api/bookings/verify-payment', { ...response, booking_id: booking_id });
            navigate(`/ticket/${data.booking._id}`);
          } catch (err) {
            setError(err.response?.data?.message || 'Payment Verification Failed');
            setLoading(false); 
          }
        },
        prefill: {
          name: attendees[0].name,
          email: attendees[0].email,
          contact: attendees[0].phone,
        },
        theme: { color: '#3399cc' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', (response) => { setError(`Payment Failed: ${response.error.description}`); setLoading(false); });
      paymentObject.on('modal.ondismiss', () => { setLoading(false); });
      paymentObject.open();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment order.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Book Tickets</h2>
              <p className="text-sm text-gray-100">{event.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-4 sm:space-y-6">
            {/* Ticket Count */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Tickets
              </label>
              <input 
                type="number" 
                value={ticketCount} 
                onChange={(e) => setTicketCount(e.target.value)} 
                min="1" 
                max={event.ticketsAvailable} 
                className="input-field text-lg font-semibold"
                required 
              />
              <p className="text-xs text-gray-600 mt-2">Max {event.ticketsAvailable} tickets available</p>
            </div>
            
            {/* Attendee Forms */}
            <div className="space-y-4">
              {attendees.map((attendee, index) => (
                <div key={index} className="bg-white border-2 border-purple-200 p-4 sm:p-5 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800">
                      🎟️ Ticket {index + 1}
                    </h3>
                    {index === 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Main Attendee
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter full name" 
                      value={attendee.name} 
                      onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)} 
                      className="input-field text-sm sm:text-base"
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="email@example.com" 
                      value={attendee.email} 
                      onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)} 
                      className="input-field text-sm sm:text-base"
                      required 
                    />
                  </div>
                  
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        placeholder="+91 1234567890"
                        value={attendee.phone} 
                        onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)} 
                        className="input-field text-sm sm:text-base"
                        required 
                      />
                    </div>                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Date of Birth {index === 0 ? <span className="text-red-500">*</span> : <span className="text-gray-500">(Optional)</span>}
                      </label>
                      <input 
                        type="date" 
                        value={attendee.dob} 
                        onChange={(e) => handleAttendeeChange(index, 'dob', e.target.value)} 
                        className="input-field text-sm sm:text-base"
                        required={index === 0} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-5 rounded-xl border-2 border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Price per ticket:</span>
                <span className="text-base font-semibold">₹{event.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Number of tickets:</span>
                <span className="text-base font-semibold">×{Number(ticketCount) || 0}</span>
              </div>
              <hr className="my-3 border-green-200" />
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-bold text-gray-800">Total Amount:</span>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ₹{event.price * (Number(ticketCount) || 0)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || attendees.length === 0}
              className="w-full btn-success py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `🔒 Proceed to Payment`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}