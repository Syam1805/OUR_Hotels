import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserBookings, cancelBooking } from '../api/api';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHotel, FaBed, FaCalendarAlt, FaCheckCircle, FaMoneyBillWave, FaUser, FaArrowLeft, FaInfoCircle, FaTimes, FaHotel as FaViewHotel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, AlertTitle, Snackbar, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const cardHover = {
  hover: { 
    scale: 1.03, 
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.3 }
  }
};

const statusBadge = (status) => {
  switch(status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const statusIcon = (status) => {
  switch(status) {
    case 'CONFIRMED':
      return <FaCheckCircle className="text-green-600" />;
    case 'PENDING':
      return <FaInfoCircle className="text-yellow-600" />;
    case 'CANCELLED':
      return <FaCheckCircle className="text-red-600" />;
    case 'COMPLETED':
      return <FaCheckCircle className="text-blue-600" />;
    default:
      return <FaInfoCircle className="text-gray-600" />;
  }
};

function OrderHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if sidebar is open by listening to body class
  useEffect(() => {
    const checkSidebar = () => {
      setSidebarOpen(document.body.classList.contains('sidebar-open'));
    };
    
    // Initial check
    checkSidebar();
    
    // Set up a MutationObserver to watch for changes to the body class
    const observer = new MutationObserver(checkSidebar);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserBookings(user.userId)
        .then((data) => setBookings(data || []))
        .catch((error) => {
          console.error('Error fetching bookings:', error);
          setNotification({
            open: true,
            message: 'Failed to load bookings. Please try again.',
            severity: 'error'
          });
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleBackClick = () => {
    navigate('/profile');
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    
    setCancelling(true);
    try {
      // Call the actual API to cancel the booking
      await cancelBooking(selectedBooking.bookingId);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Booking cancelled successfully!',
        severity: 'success'
      });
      
      // Refresh the bookings list
      const updatedBookings = await getUserBookings(user.userId);
      setBookings(updatedBookings || []);
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setNotification({
        open: true,
        message: 'Failed to cancel booking. Please try again.',
        severity: 'error'
      });
    } finally {
      setCancelling(false);
      setShowCancelDialog(false);
      setSelectedBooking(null);
    }
  };

  const handleViewHotel = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const handleBookingDetails = (bookingId) => {
    navigate(`/booking-details/${bookingId}`);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 transition-all duration-300"
      style={{
        marginLeft: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Back button positioned in top-left corner */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBackClick}
          className="absolute top-4 left-4 text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </motion.button>
        
        {/* Centered heading */}
        <motion.div 
          className="flex justify-center mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-red-900 drop-shadow-lg">Order History</h2>
        </motion.div>
        
        {bookings.length === 0 ? (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <FaCalendarAlt className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any hotel reservations yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/hotels')}
              className="bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-red-800 transition"
            >
              Browse Hotels
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {bookings.map((booking) => (
                <motion.div
                  key={booking.bookingId}
                  variants={cardHover}
                  whileHover="hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-full mr-3">
                          <FaHotel className="text-red-700 text-xl" />
                        </div>
                        <div>
                          {/* Clickable hotel name */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleViewHotel(booking.hotelId || booking.room?.hotel?.hotelId)}
                            className="text-left"
                          >
                            <h3 className="text-lg font-bold text-gray-800 hover:text-red-700 transition-colors">
                              {booking.hotelName}
                            </h3>
                          </motion.button>
                          <p className="text-sm text-gray-600">Booking ID: #{booking.bookingId}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <FaBed className="text-gray-500 mr-3" />
                        <span className="text-gray-700">{booking.roomType}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-gray-700 font-medium">Check-in</p>
                          <p className="text-gray-600">{booking.checkInDate}</p>
                        </div>
                        <div className="mx-4 text-gray-400">→</div>
                        <div>
                          <p className="text-gray-700 font-medium">Check-out</p>
                          <p className="text-gray-600">{booking.checkOutDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FaUser className="text-gray-500 mr-3" />
                        <span className="text-gray-700">{booking.guestName || user?.name || 'Guest'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="text-gray-500 mr-3" />
                          <span className="text-gray-700">Total Price</span>
                        </div>
                        <span className="text-lg font-bold text-red-700">${booking.totalPrice}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        {statusIcon(booking.status)}
                        <span className={`ml-2 font-medium ${
                          booking.status === 'CONFIRMED' ? 'text-green-700' :
                          booking.status === 'PENDING' ? 'text-yellow-700' :
                          booking.status === 'CANCELLED' ? 'text-red-700' :
                          'text-blue-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewHotel(booking.hotelId || booking.room?.hotel?.hotelId)}
                          className="flex items-center text-blue-600 font-medium hover:text-blue-800"
                        >
                          <FaViewHotel className="mr-1" />
                          Hotel
                        </motion.button>
                        
                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancelClick(booking)}
                            className="flex items-center text-red-600 font-medium hover:text-red-800"
                          >
                            <FaTimes className="mr-1" />
                            Cancel
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBookingDetails(booking.bookingId)}
                          className="text-red-700 font-medium hover:text-red-800"
                        >
                          Details
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Cancellation Confirmation Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        PaperProps={{
          component: motion.div,
          variants: {
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          },
          initial: "hidden",
          animate: "visible",
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        }}
      >
        <DialogTitle className="flex items-center" style={{ color: '#b91c1c' }}>
          <FaTimes className="mr-2" style={{ color: '#f44336' }} />
          Cancel Booking
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            <AlertTitle>Confirm Cancellation</AlertTitle>
            Are you sure you want to cancel your booking at {selectedBooking?.hotelName}?
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowCancelDialog(false)} 
            style={{ color: '#b91c1c' }}
            disabled={cancelling}
          >
            No
          </Button>
          <Button 
            onClick={handleConfirmCancel}
            disabled={cancelling}
            variant="contained"
            style={{ backgroundColor: '#b91c1c', color: 'white' }}
            startIcon={cancelling ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

export default OrderHistory;