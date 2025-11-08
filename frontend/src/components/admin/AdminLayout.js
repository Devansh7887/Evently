import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Helper component for sidebar links
const AdminNavLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      end 
      className={({ isActive }) =>
        `block w-full px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-200'
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    // --- YAHAN BADLAAV KIYA GAYA HAI ---
    // Humne 'flex-col md:flex-row' ko hamesha 'flex-row' kar diya hai
    <div className="flex flex-row min-h-screen bg-gray-100">
      
      {/* --- Sidebar (Ab hamesha dikhega) --- */}
      {/* Humne 'w-full md:w-64' ko 'w-64' kar diya hai */}
      <aside className="w-64 bg-white shadow-lg min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel</h2>
        <nav className="space-y-2">
          <AdminNavLink to="/admin">Dashboard (Stats)</AdminNavLink>
          <AdminNavLink to="/admin/events">Manage Events</AdminNavLink>
          <AdminNavLink to="/admin/bookings">View Bookings</AdminNavLink>
          <AdminNavLink to="/admin/team">Manage Team</AdminNavLink>
          <AdminNavLink to="/admin/gallery">Manage Gallery</AdminNavLink>
          <AdminNavLink to="/admin/careers">Manage Careers</AdminNavLink>
          <AdminNavLink to="/admin/applications">View Applications</AdminNavLink>
        </nav>
        <button
          onClick={logoutHandler}
          className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}