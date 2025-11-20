import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate("/admin-login");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-bold flex items-center space-x-2 hover:scale-105 transform transition-all duration-300">
            <span className="text-4xl">🎟️</span>
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">EventApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-300 transition-colors duration-200 font-medium">
              Events
            </Link>
            <Link to="/about" className="hover:text-yellow-300 transition-colors duration-200 font-medium">
              About Us
            </Link>
            <Link to="/team" className="hover:text-yellow-300 transition-colors duration-200 font-medium">
              Our Team
            </Link>
            <Link to="/gallery" className="hover:text-yellow-300 transition-colors duration-200 font-medium">
              Gallery
            </Link>
            <Link to="/careers" className="hover:text-yellow-300 transition-colors duration-200 font-medium">
              Careers
            </Link>

            {isAuthenticated ? (
              <>
                <span className="text-gray-300">|</span>
                <Link
                  to="/admin"
                  className="font-semibold text-yellow-300 hover:text-yellow-200 transition-colors duration-200"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={logoutHandler}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Logout
                </button>
              </>
            ) : null}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white focus:outline-none hover:text-yellow-300 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-3 animate-fade-in">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 font-medium"
            >
              Events
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 font-medium"
            >
              About Us
            </Link>
            <Link
              to="/team"
              onClick={closeMobileMenu}
              className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 font-medium"
            >
              Our Team
            </Link>
            <Link
              to="/gallery"
              onClick={closeMobileMenu}
              className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 font-medium"
            >
              Gallery
            </Link>
            <Link
              to="/careers"
              onClick={closeMobileMenu}
              className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 font-medium"
            >
              Careers
            </Link>

            {isAuthenticated ? (
              <>
                <hr className="border-gray-400 opacity-30" />
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="block py-2 px-4 bg-yellow-400 bg-opacity-20 text-yellow-300 rounded-lg font-semibold"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={logoutHandler}
                  className="w-full text-left py-2 px-4 bg-red-500 bg-opacity-90 rounded-lg font-semibold hover:bg-opacity-100 transition-all"
                >
                  Logout
                </button>
              </>
            ) : null}
          </nav>
        )}
      </div>
    </header>
  );
}