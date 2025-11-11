import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Components
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import EventList from './pages/EventList';
import EventBookingPage from './pages/EventBookingPage';
import AdminLogin from './pages/AdminLogin';
import AboutUs from './pages/AboutUs';
import OurTeam from './pages/OurTeam';
import Gallery from './pages/Gallery';
import GalleryDetailPage from './pages/GalleryDetailPage'; // Yeh import missing tha
import Careers from './pages/Careers';
import ApplyPage from './pages/ApplyPage';
import TicketPage from './pages/TicketPage';
import VerifyTicket from './pages/VerifyTicket';

// Admin Components
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout'; // <-- Sidebar layout

// Admin Pages
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
        {/* Yeh block pehle aana zaroori hai */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Yeh pages AdminLayout ke <Outlet> mein jayenge */}
          <Route index element={<AdminStats />} /> {/* /admin */}
          <Route path="events" element={<AdminManageEvents />} /> {/* /admin/events */}
          <Route path="team" element={<AdminManageTeam />} /> {/* /admin/team */}
          <Route path="gallery" element={<AdminManageGallery />} /> {/* /admin/gallery */}
          <Route path="careers" element={<AdminManageCareers />} /> {/* /admin/careers */}
          <Route path="bookings" element={<AdminViewBookings />} /> {/* /admin/bookings */}
          <Route path="applications" element={<AdminViewApplications />} /> {/* /admin/applications */}
        </Route>

        {/* --- 2. PUBLIC ROUTES (CATCH-ALL) --- */}
        {/* Yeh block aakhri mein aana zaroori hai */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  {/* --- YAHAN SABHI ROUTES KO FIX KIYA GAYA HAI --- */}
                  <Route index element={<EventList />} /> {/* '/' ki jagah 'index' */}
                  <Route path="event/:slug" element={<EventBookingPage />} /> {/* '/' hata diya */}
                  <Route path="about" element={<AboutUs />} /> {/* '/' hata diya */}
                  <Route path="team" element={<OurTeam />} /> {/* '/' hata diya */}
                  <Route path="gallery" element={<Gallery />} /> {/* '/' hata diya */}
                  <Route path="gallery/:slug" element={<GalleryDetailPage />} /> {/* '/' hata diya */}
                  <Route path="careers" element={<Careers />} /> {/* '/' hata diya */}
                  <Route path="apply/:jobSlug" element={<ApplyPage />} /> {/* '/' hata diya */}
                  <Route path="ticket/:bookingId" element={<TicketPage />} /> {/* '/' hata diya */}
                  <Route path="verify/:bookingId" element={<VerifyTicket />} /> {/* '/' hata diya */}
                  <Route path="admin-login" element={<AdminLogin />} /> {/* '/' hata diya */}
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