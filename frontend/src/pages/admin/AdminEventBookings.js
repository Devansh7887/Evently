import React from 'react';
import { useParams } from 'react-router-dom';

export default function AdminEventBookings() {
  const { eventId } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bookings for Event</h1>
      <p className="text-lg">Event ID: {eventId}</p>
      <p className="mt-4 text-gray-600">(Yahan par is event ke saare users ki list aayegi)</p>
    </div>
  );
}