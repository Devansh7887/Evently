import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import EventList from './pages/EventList';
import EventBookingPage from './pages/EventBookingPage';
import AdminLogin from './pages/AdminLogin';
import AboutUs from './pages/AboutUs';
import OurTeam from './pages/OurTeam';
import Gallery from './pages/Gallery';
import Careers from './pages/Careers';
import ApplyPage from './pages/ApplyPage';
import TicketPage from './pages/TicketPage';
import VerifyTicket from './pages/VerifyTicket';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminStats from './pages/admin/AdminStats';
import AdminManageEvents from './pages/admin/AdminManageEvents';
import AdminManageTeam from './pages/admin/AdminManageTeam';
import AdminManageGallery from './pages/admin/AdminManageGallery';
import AdminManageCareers from './pages/admin/AdminManageCareers';
import AdminViewBookings from './pages/admin/AdminViewBookings';
import AdminViewApplications from './pages/admin/AdminViewApplications';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        
        {/* --- 1. ADMIN ROUTES (MOST SPECIFIC) --- */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminStats />} />
          <Route path="events" element={<AdminManageEvents />} />
          <Route path="team" element={<AdminManageTeam />} />
          <Route path="gallery" element={<AdminManageGallery />} />
          <Route path="careers" element={<AdminManageCareers />} />
          <Route path="bookings" element={<AdminViewBookings />} />
          <Route path="applications" element={<AdminViewApplications />} />
        </Route>

        {/* --- 2. PUBLIC ROUTES (CATCH-ALL) --- */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<EventList />} />
                  <Route path="/event/:slug" element={<EventBookingPage />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/team" element={<OurTeam />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/apply/:jobSlug" element={<ApplyPage />} />
                  <Route path="/ticket/:bookingId" element={<TicketPage />} />
                  <Route path="/verify/:bookingId" element={<VerifyTicket />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

      </Routes>
    </div>
  );
}

export default App;
