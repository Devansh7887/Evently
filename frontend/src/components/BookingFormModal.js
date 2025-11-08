import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Helper function to load Razorpay script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function BookingFormModal({ event, onClose }) {
  const [ticketCount, setTicketCount] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (ticketCount > event.ticketsAvailable) {
      setError("Not enough tickets available!");
      setLoading(false);
      return;
    }

    // 1. Load Razorpay script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 2. Create Order from our backend
      const { data } = await axios.post("/api/bookings/create-order", {
        eventId: event._id,
        ticketCount,
        attendeeName: name,
        attendeeEmail: email,
        attendeePhone: phone,
        attendeeDOB: dob,
      });

      const { order, booking_id } = data;

      // 3. Setup Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        description: "Event Ticket Booking",
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post("/api/bookings/verify-payment", {
              ...response,
              booking_id: booking_id,
            });

            // Naya redirect: Seedhe ticket page par Booking ID ke saath
            navigate(`/ticket/${data.booking._id}`);
          } catch (err) {
            // Agar payment fail ho, toh alert dikha do
            alert(err.response?.data?.message || "Payment Failed");
            setLoading(false); // Modal ko band mat karo, error dikhao
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // 5. Open Razorpay modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create payment order."
      );
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">
          Book Tickets for {event.title}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          {/* ... (All your form fields: Name, Email, Phone, DOB, TicketCount) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Tickets
            </label>
            <input
              type="number"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              min="1"
              max={event.ticketsAvailable}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg
                         transform transition-all duration-300
                         hover:bg-green-600 hover:shadow-xl hover:-translate-y-1
                         disabled:bg-gray-400"
            >
              {loading
                ? "Processing..."
                : `Pay Now (Total: ₹${event.price * ticketCount})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
