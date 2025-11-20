import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const HeroSection = () => (
  <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-8 sm:p-12 md:p-20 mb-10 rounded-2xl overflow-hidden text-center shadow-2xl">
    <div className="relative z-10 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
        Find Your Next <span className="text-yellow-300">Experience</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
        Book tickets for live events, concerts, and shows near you. Unforgettable moments await! 🎉
      </p>
      <div className="flex justify-center space-x-3">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold">
          🎵 Concerts
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold">
          🎭 Shows
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold hidden sm:block">
          🎪 Festivals
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 z-0"></div>
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce-slow"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300 rounded-full animate-bounce-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-300 rounded-full animate-bounce-slow" style={{animationDelay: '2s'}}></div>
    </div>
  </div>
);

const EventCard = ({ event }) => {
  const isSoldOut = event.ticketsAvailable <= 0;
  const eventDate = new Date(event.date);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
      <Link to={`/event/${event.slug}`} className="block relative">
        {/* Image Section with Gradient Overlay */}
        <div className="h-48 sm:h-56 bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
          {event.bannerImageUrl ? (
            <img
              src={event.bannerImageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              🎉
            </div>
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        </div>

        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            SOLD OUT
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-br from-white to-gray-100 p-2 rounded-lg shadow-lg text-center border-2 border-purple-200">
          <span className="block text-xs font-bold text-purple-600">
            {eventDate.toLocaleString("default", { month: "short" }).toUpperCase()}
          </span>
          <span className="block text-2xl font-bold text-gray-800">{eventDate.getDate()}</span>
        </div>

        {/* Details Section */}
        <div className="p-4 sm:p-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors" title={event.title}>
            {event.title}
          </h2>
          <div className="flex items-center text-gray-600 mb-2 text-sm">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {event.category}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div>
              {event.originalPrice > event.price ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{event.price}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    ₹{event.originalPrice}
                  </span>
                </div>
              ) : (
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ₹{event.price}
                </span>
              )}
            </div>
            <span className={`text-xs sm:text-sm font-bold ${isSoldOut ? "text-red-500" : "text-blue-600"}`}>
              {isSoldOut ? "❌ Sold Out" : `✨ ${event.ticketsAvailable} left`}
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
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <HeroSection />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Upcoming Events
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Discover amazing experiences happening near you</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-xl text-gray-600 mb-2">No events found</p>
          <p className="text-gray-500">Check back soon for exciting new events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
