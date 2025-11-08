import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ adminOnly = false, children }) => {
  console.log('%c--- A. PrivateRoute check kar raha hai... ---', 'color: orange; font-weight: bold;');
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Ya Loader component
  }

  // 1. Check if user is authenticated
  if (!isAuthenticated) {
    console.log('%c--- B. PrivateRoute: REJECTED (Logged Out) ---', 'color: red;');
    return <Navigate to="/admin-login" replace />; // Fix: Point to admin-login
  }

  // 2. Check if route is for admins only AND user is not an admin
  if (adminOnly && !isAdmin) {
    console.log('%c--- C. PrivateRoute: REJECTED (Not Admin) ---', 'color: red;');
    return <Navigate to="/" replace />; // Not authorized, bhej do homepage par
  }

  // 3. Agar sab sahi hai, toh page dikhao
  console.log('%c--- D. PrivateRoute: ALLOWED -> Rendering children or <Outlet /> ---', 'color: green; font-weight: bold;');
  // If a child (like <AdminLayout />) was passed into this component, render it
  // so that it can render its own <Outlet /> for nested admin routes.
  // Otherwise fall back to rendering the Router <Outlet />.
  return children ? children : <Outlet />;
};

export default PrivateRoute;