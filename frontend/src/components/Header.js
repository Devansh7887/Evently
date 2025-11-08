import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  // This console.log is fine for debugging, you can remove it later
  // console.log("USER OBJECT IN HEADER:", user);
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/admin-login"); // FIX: Changed from '/login' to '/admin-login'
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🎟️ EventApp
        </Link>
        <nav className="flex items-center space-x-4">
          {/* --- NEW PUBLIC LINKS --- */}
          <Link to="/about" className="hover:text-gray-300">
            About Us
          </Link>
          <Link to="/team" className="hover:text-gray-300">
            Our Team
          </Link>
          <Link to="/gallery" className="hover:text-gray-300">
            Gallery
          </Link>
          <Link to="/careers" className="hover:text-gray-300">
            Careers
          </Link>
          <Link to="/" className="hover:text-gray-300">
            Events
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-gray-400">|</span>
              {/* Admin link still works */}
              <Link
                to="/admin"
                className="font-semibold text-yellow-400 hover:text-yellow-300"
              >
                Admin Dashboard
              </Link>
              <button
                onClick={logoutHandler}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md
                   transform transition-all duration-300 ease-in-out
                   hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* FIX: Removed the Admin Login button for better security.
                Admin must now log in by navigating to /admin-login manually.
              */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}