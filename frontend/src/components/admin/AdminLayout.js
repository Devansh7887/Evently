import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Helper component for sidebar links
const AdminNavLink = ({ to, children, icon }) => {
  return (
    <NavLink
      to={to}
      end 
      className={({ isActive }) =>
        `flex items-center w-full px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
          isActive
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
        }`
      }
    >
      {icon && <span className="mr-2 text-lg">{icon}</span>}
      <span className="hidden lg:inline">{children}</span>
    </NavLink>
  );
};

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const logoutHandler = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white shadow-2xl transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 lg:w-20 xl:w-64`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="mb-8 mt-12 lg:mt-0">
            <h2 className="text-xl xl:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden lg:block">
              Admin
            </h2>
          </div>
          <nav className="space-y-2 flex-1 overflow-y-auto">
            <AdminNavLink to="/admin" icon="📊">Dashboard</AdminNavLink>
            <AdminNavLink to="/admin/events" icon="🎉">Events</AdminNavLink>
            <AdminNavLink to="/admin/bookings" icon="🎟️">Bookings</AdminNavLink>
            <AdminNavLink to="/admin/team" icon="👥">Team</AdminNavLink>
            <AdminNavLink to="/admin/gallery" icon="🖼️">Gallery</AdminNavLink>
            <AdminNavLink to="/admin/careers" icon="💼">Careers</AdminNavLink>
            <AdminNavLink to="/admin/applications" icon="📝">Applications</AdminNavLink>
          </nav>
          <button
            onClick={logoutHandler}
            className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-lg text-sm xl:text-base"
          >
            <span className="hidden lg:inline">Logout</span>
            <span className="lg:hidden">🚪</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}