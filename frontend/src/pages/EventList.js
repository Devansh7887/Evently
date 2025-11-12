import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const HeroSection = () => (
  <div className="relative bg-gray-800 text-white p-12 md:p-20 mb-10 rounded-lg overflow-hidden text-center">
    <div className="relative z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Find Your Next Experience
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8">
        Book tickets for live events, concerts, and shows near you.
      </p>
      {/* Aap yahan search bar bhi daal sakte hain */}
    </div>
    <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
    {/* Background image (optional) */}
    {/* <img src="hero-background.jpg" className="absolute inset-0 w-full h-full object-cover z-0 opacity-30" alt="Events" /> */}
  </div>
);

// Naya Event Card Component (isi file mein)
const EventCard = ({ event }) => {
  const isSoldOut = event.ticketsAvailable <= 0;
  const eventDate = new Date(event.date);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <Link to={`/event/${event.slug}`} className="block relative">
        {/* Image Section */}
        <div className="h-48 bg-gray-200">
          {event.bannerImageUrl ? (
            <img
              src={event.bannerImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            SOLD OUT
          </div>
        )}

        {/* Date Badge (Corner) */}
        <div className="absolute top-0 left-0 bg-white m-2 p-2 rounded-md shadow-md text-center">
          <span className="block text-sm font-bold text-red-600">
            {eventDate
              .toLocaleString("default", { month: "short" })
              .toUpperCase()}
          </span>
          <span className="block text-xl font-bold">{eventDate.getDate()}</span>
        </div>

        {/* Details Section */}
        <div className="p-4">
          <h2
            className="text-xl font-bold text-gray-900 truncate mb-1"
            title={event.title}
          >
            {event.title}
          </h2>
          <p className="text-sm text-gray-600 mb-2">{event.venue}</p>
          <p className="text-sm text-gray-500 mb-4">{event.category}</p>

          <div className="flex justify-between items-center">
            <div>
              {/* --- NAYA PRICE LOGIC --- */}
              {event.originalPrice > event.price ? (
                <>
                  <span className="text-lg font-bold text-green-600">
                    ₹{event.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{event.originalPrice}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-green-600">
                  ₹{event.price}
                </span>
              )}
            </div>
            <span
              className={`text-sm font-bold ${
                isSoldOut ? "text-red-500" : "text-gray-700"
              }`}
            >
              {isSoldOut
                ? "Sold Out"
                : `${event.ticketsAvailable} tickets left`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/events");
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <HeroSection />
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {/* YAHAN CORRECTION HUA HAI */}
      {events.length === 0 ? (
        <p>No events found. Admin can create new events!</p>
      ) : (
        // Responsive Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
