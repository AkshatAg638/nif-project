import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import WhatsAppButton from './components/common/WhatsAppButton.jsx';

// Import Public Pages
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Donate from './pages/Donate.jsx';
import DonationSuccess from './pages/DonationSuccess.jsx';
import Volunteer from './pages/Volunteer.jsx';
import Gallery from './pages/Gallery.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';

// Import Auth Pages
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';

// Import Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx';
import TermsConditions from './pages/legal/TermsConditions.jsx';
import RefundPolicy from './pages/legal/RefundPolicy.jsx';
import CookiePolicy from './pages/legal/CookiePolicy.jsx';
import DonationPolicy from './pages/legal/DonationPolicy.jsx';

// Import Admin Panel
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

export const App = () => {
  const location = useLocation();

  // Hide general Navbar & Footer on Admin Panel paths
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}

      <div className="grow">
        <Routes>
          {/* Public Routing */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donation-success" element={<DonationSuccess />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routing */}
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Legal Routing */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/donation-policy" element={<DonationPolicy />} />

          {/* Admin Routing */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="editor">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="text-center py-24 space-y-4">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">Page Not Found</h2>
                <p className="text-sm text-slate-500">The url path you requested does not exist.</p>
                <Link to="/" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs">
                  Back to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </div>

      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppButton />}
    </div>
  );
};

export default App;
