import React from 'react';

// --- YAHAN BADLAAV HAI ---
// Ab hum 'booking' aur 'event' dono le rahe hain
export default function BookingDetailModal({ booking, event, onClose }) {
  if (!booking || !event) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Booking Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>

        <div className="mb-4">
          {/* --- YAHAN BADLAAV HAI --- */}
          <p><strong>Event:</strong> {event.title}</p>
          <p><strong>Total Tickets:</strong> {booking.tickets.length}</p>
          <p><strong>Main Attendee:</strong> {booking.tickets[0]?.attendeeName} ({booking.tickets[0]?.attendeePhone || 'No Phone'})</p>
        </div>

        <h3 className="text-xl font-semibold mb-2">All Tickets in this Booking</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attendee Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attendee Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {booking.tickets.map((ticket, index) => (
                <tr key={ticket.ticketId || index}>
                  <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap font-mono text-sm">{ticket.ticketId}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{ticket.attendeeName}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{ticket.attendeeEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button 
          onClick={onClose} 
          className="mt-6 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}