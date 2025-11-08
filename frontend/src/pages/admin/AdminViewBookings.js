import React from 'react';
import BookingViewer from '../../components/admin/BookingViewer';

export default function AdminViewBookings() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">View All Bookings</h1>
      <BookingViewer />
    </div>
  );
}