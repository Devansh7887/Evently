import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

// Stat Card Component
const StatCard = ({ title, value, color, icon }) => (
  <div className={`p-6 sm:p-8 rounded-2xl shadow-xl ${color} transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <div className="text-3xl sm:text-4xl">{icon}</div>
    </div>
    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{value}</p>
  </div>
);

export default function AdminStats() {
  console.log('%c--- 2. AdminStats.js (Four Boxes) render ho raha hai ---', 'color: green; font-weight: bold;');
  const [stats, setStats] = useState({
    bookings: 0,
    applications: 0,
    events: 0,
    team: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Sabhi APIs se data fetch karein
        const [bookingsRes, applicationsRes, eventsRes, teamRes] = await Promise.all([
          axios.get('/api/bookings/my-bookings', config), // Humne iska naam my-bookings rakha tha
          axios.get('/api/careers/applications', config),
          axios.get('/api/events'),
          axios.get('/api/team'),
        ]);

        setStats({
          bookings: bookingsRes.data.length,
          applications: applicationsRes.data.length,
          events: eventsRes.data.length,
          team: teamRes.data.length,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats', error);
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Welcome back! Here's your overview</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Total Bookings" 
          value={stats.bookings} 
          color="bg-gradient-to-br from-blue-500 to-blue-600" 
          icon="🎟️"
        />
        <StatCard 
          title="Applications" 
          value={stats.applications} 
          color="bg-gradient-to-br from-green-500 to-green-600" 
          icon="📝"
        />
        <StatCard 
          title="Total Events" 
          value={stats.events} 
          color="bg-gradient-to-br from-yellow-500 to-orange-500" 
          icon="🎉"
        />
        <StatCard 
          title="Team Members" 
          value={stats.team} 
          color="bg-gradient-to-br from-purple-500 to-pink-500" 
          icon="👥"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/events/create" className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 rounded-xl text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">➕</div>
            <p className="font-semibold text-gray-800">Create Event</p>
          </a>
          <a href="/admin/bookings" className="bg-gradient-to-br from-blue-50 to-blue-50 border-2 border-blue-200 p-4 rounded-xl text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-gray-800">View Bookings</p>
          </a>
          <a href="/admin/team" className="bg-gradient-to-br from-green-50 to-green-50 border-2 border-green-200 p-4 rounded-xl text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">👥</div>
            <p className="font-semibold text-gray-800">Manage Team</p>
          </a>
          <a href="/admin/gallery" className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 p-4 rounded-xl text-center hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🖼️</div>
            <p className="font-semibold text-gray-800">Update Gallery</p>
          </a>
        </div>
      </div>
    </div>
  );
}