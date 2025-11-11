import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Helper function to load Razorpay script
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
  // --- FIX 1: Ticket count ab string lega taaki empty ho sake ---
  const [ticketCount, setTicketCount] = useState('1'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([{ name: '', email: '', phone: '', dob: '' }]);

  // Yeh useEffect ab empty string ko bhi handle karega
  useEffect(() => {
    setAttendees(currentAttendees => {
      const newCount = parseInt(ticketCount, 10); // String ko number mein badlo
      
      // Agar user ne box khali kar diya (NaN) ya 0 daal diya
      if (isNaN(newCount) || newCount < 1) {
        return []; // Attendee forms ko khali kar do
      }
      
      const currentCount = currentAttendees.length;
      if (newCount > currentCount) {
        return [
          ...currentAttendees,
          ...Array(newCount - currentCount).fill({ name: '', email: '', phone: '', dob: '' })
        ];
      } else if (newCount < currentCount) {
        return currentAttendees.slice(0, newCount);
      }
      return currentAttendees;
    });
  }, [ticketCount]);

  const handleAttendeeChange = (index, field, value) => {
    setAttendees(current => current.map((attendee, i) => i === index ? { ...attendee, [field]: value } : attendee));
  };

  // Payment function
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

    // --- FIX 2: Naya Validation Logic ---
    for (let i = 0; i < attendees.length; i++) {
      const att = attendees[i];
      if (i === 0) {
        // Ticket 1 (Main User) ke liye sab kuch compulsory hai
        if (!att.name || !att.email || !att.phone || !att.dob) {
          setError('Please fill all details for the Main Attendee (Ticket 1).');
          setLoading(false);
          return;
        }
      } else {
        // Baaki tickets ke liye sirf Name aur Email
        if (!att.name || !att.email) {
          setError(`Please fill in the Name and Email for Ticket ${i + 1}.`);
          setLoading(false);
          return;
        }
      }
    }
    // --- END VALIDATION ---

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      setError('Razorpay SDK failed to load.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('/api/bookings/create-order', {
        eventId: event._id,
        ticketCount: numTickets, // Sahi number bhejein
        attendees: attendees, // Poora array (jismein optional fields null/empty honge)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Book Tickets: {event.title}</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handlePayment} className="space-y-4">
          {/* --- FIX 3: Ticket count input --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Tickets</label>
            <input 
              type="number" 
              value={ticketCount} 
              // Ab yeh 'e.target.value' (string) ko set karega, jisse empty "" allowed hai
              onChange={(e) => setTicketCount(e.target.value)} 
              min="1" 
              max={event.ticketsAvailable} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" 
              required 
            />
          </div>
          
          <hr />

          {/* --- Naya Dynamic Attendee Forms --- */}
          {attendees.map((attendee, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">
                Ticket {index + 1} 
                {index === 0 && <span className="text-sm text-blue-600"> (Main Attendee)</span>}
              </h3>
              
              {/* --- Name (Hamesha required) --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Attendee Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Full Name" value={attendee.name} onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              
              {/* --- Email (Hamesha required) --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Attendee Email <span className="text-red-500">*</span></label>
                <input type="email" placeholder="Email for e-ticket" value={attendee.email} onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              
              {/* --- Phone (Sirf Ticket 1 ke liye required) --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone 
                  {index === 0 ? <span className="text-red-500"> *</span> : <span className="text-gray-500"> (Optional)</span>}
                </label>
                <input type="tel" value={attendee.phone} onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required={index === 0} />
              </div>
              
              {/* --- DOB (Sirf Ticket 1 ke liye required) --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth 
                  {index === 0 ? <span className="text-red-500"> *</span> : <span className="text-gray-500"> (Optional)</span>}
                </label>
                <input type="date" value={attendee.dob} onChange={(e) => handleAttendeeChange(index, 'dob', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required={index === 0} />
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || attendees.length === 0} // Agar tickets 0 hain toh disable karein
              className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-green-600 hover:shadow-xl hover:-translate-y-1 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : `Pay Now (Total: ₹${event.price * (Number(ticketCount) || 0)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}