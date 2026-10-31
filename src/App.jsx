import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import NewsPage from './pages/NewsPage';
import PostDetails from './pages/PostDetails';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Security
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="relative flex flex-col min-h-screen bg-background-primary text-content-primary selection:bg-accent-red selection:text-white film-grain">
      {/* Show Public Navbar except on Admin/Login routes */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<PostDetails />} />
            <Route path="/posts/:slug" element={<PostDetails />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />

            {/* Admin CMS (Protected Routes) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/portfolio"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      {/* Show Public Footer except on Admin/Login routes */}
      {!isAdminRoute && <Footer />}

      {/* Floating PWA Install Banner */}
      <PWAInstallPrompt />
    </div>
  );
}
