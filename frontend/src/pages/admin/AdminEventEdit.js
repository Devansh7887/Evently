import React from 'react';
import { useParams } from 'react-router-dom';

export default function AdminEventEdit() {
  const { eventId } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <p className="text-lg">Event ID: {eventId}</p>
      <p className="mt-4 text-gray-600">(Yahan par event ko edit karne ka form aayega)</p>
    </div>
  );
}