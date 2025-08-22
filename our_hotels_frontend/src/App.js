import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { WishlistProvider } from './context/WishlistContext';
import { motion } from 'framer-motion';
import Loader from './components/Loader';
import LoginPopup from './components/LoginPopup';

// Wrapper for Booking Route with LoginPopup
function BookingWrapper() {
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowLoginPopup(true);
    }
  }, [user]);

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    navigate(-1);
  };

  if (!user) {
    return showLoginPopup ? <LoginPopup onClose={handleClosePopup} /> : null;
  }

  return <Booking />;
}

// Wrapper for Wishlist Route with LoginPopup
function WishlistWrapper() {
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowLoginPopup(true);
    }
  }, [user]);

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    navigate(-1);
  };

  if (!user) {
    return showLoginPopup ? <LoginPopup onClose={handleClosePopup} /> : null;
  }

  return <Wishlist />;
}

// Component to handle initial redirect to login
function InitialRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const publicRoutes = ['/', '/hotels', '/login', '/register'];
      const popupRoutes = ['/booking', '/wishlist'];

      const isPublicRoute =
        publicRoutes.includes(location.pathname) || location.pathname.startsWith('/hotels/');
      const isPopupRoute = popupRoutes.some(route => location.pathname.startsWith(route));

      if (!isPublicRoute && !isPopupRoute) {
        navigate('/login');
      }
    }
  }, [user, loading, navigate, location]);

  return null;
}

// Component to redirect to login on initial app load
function RedirectToLoginOnStart() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (hasRedirected) return;

    if (
      !loading &&
      !user &&
      location.pathname !== '/login' &&
      location.pathname !== '/register' &&
      !location.pathname.startsWith('/booking') &&
      !location.pathname.startsWith('/wishlist') &&
      !hasRedirected
    ) {
      navigate('/login');
      setHasRedirected(true);
    }
  }, [user, loading, navigate, location, hasRedirected]);

  return null;
}

// Separated content inside Router
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  const handleSidebarStateChange = (isOpen) => {
    setIsMainSidebarOpen(isOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) return <Loader />;

  const isHomePage = location.pathname === '/';

  return (
    <>
      <RedirectToLoginOnStart />
      <InitialRedirect />
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
        <Navbar onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-grow relative">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSidebarStateChange={handleSidebarStateChange}
          />
          <motion.main
            className={`flex-grow ${isMainSidebarOpen ? 'ml-64' : ''}`}
            style={{ backgroundColor: '#F5F5F5' }}
            initial={false}
            animate={{
              marginLeft: isMainSidebarOpen ? '16rem' : '0',
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels isMainSidebarOpen={isMainSidebarOpen} />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/booking/:roomId" element={<BookingWrapper />} />
              <Route path="/payment/:bookingId" element={<ProtectedRoute element={<Payment />} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/order-history" element={<ProtectedRoute element={<OrderHistory />} />} />
              <Route path="/wishlist" element={<WishlistWrapper />} />
              <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} role="ADMIN" />} />
              <Route
                path="*"
                element={
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-3xl font-bold mb-4" style={{ color: '#8B0000' }}>
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.history.back()}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      Go Back
                    </motion.button>
                  </motion.div>
                }
              />
            </Routes>
          </motion.main>
        </div>
        {isHomePage && (
          <Footer showOnlyOnHome={true} currentPage="home" sidebarOpen={isMainSidebarOpen} />
        )}
      </div>
    </>
  );
}

// Final App component
const theme = createTheme({
  palette: {
    primary: { main: '#8B0000', dark: '#7f1d1d' },
    secondary: { main: '#10b981' },
    accent: { main: '#FF5722' },
    background: { default: '#F5F5F5', paper: '#FFF5F5' },
    text: { primary: '#8B0000', secondary: '#757575' },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    MuiTextField: {
      styleOverrides: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <WishlistProvider>
          <Router>
            <AppContent />
          </Router>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
