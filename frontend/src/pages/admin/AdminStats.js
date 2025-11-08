import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

// Stat Card Component
const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-lg ${color}`}>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-4xl font-bold text-white">{value}</p>
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
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={stats.bookings} color="bg-blue-500" />
        <StatCard title="Job Applications" value={stats.applications} color="bg-green-500" />
        <StatCard title="Total Events" value={stats.events} color="bg-yellow-500" />
        <StatCard title="Team Members" value={stats.team} color="bg-purple-500" />
      </div>
      {/* Yahan aap charts bhi add kar sakte hain */}
    </div>
  );
}