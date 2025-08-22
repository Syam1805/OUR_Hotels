import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserBookings } from '../api/api';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaHotel, FaCalendarAlt, FaCheckCircle, FaMoneyBillWave, FaArrowLeft, FaCog, FaSignOutAlt, FaInfoCircle, FaHistory, FaEdit, FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Divider, Avatar, Card, CardContent, Grid, IconButton, Chip, Badge } from '@mui/material';
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
      return { bg: 'bg-green-100', text: 'text-green-800', chip: 'success' };
    case 'PENDING':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', chip: 'warning' };
    case 'CANCELLED':
      return { bg: 'bg-red-100', text: 'text-red-800', chip: 'error' };
    case 'COMPLETED':
      return { bg: 'bg-blue-100', text: 'text-blue-800', chip: 'info' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', chip: 'default' };
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
const profileCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 300,
      damping: 20
    } 
  },
  hover: {
    y: -10,
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 }
  }
};
const bookingCardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 200,
      damping: 20,
      duration: 0.5
    } 
  },
  hover: {
    scale: 1.03,
    y: -10,
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 }
  }
};
const iconVariants = {
  hover: { 
    scale: 1.2, 
    rotate: 15,
    transition: { duration: 0.3 }
  }
};
function Profile() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    if (user?.userId) {
      setLoading(true);
      getUserBookings(user.userId)
        .then((data) => setBookings(data || []))
        .finally(() => setLoading(false));
    }
  }, [user]);
  const handleBackClick = () => {
    navigate('/');
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleViewAllBookings = () => {
    navigate('/order-history');
  };
  const handleViewHotel = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length > 1) {
        return names[0].charAt(0) + names[names.length - 1].charAt(0);
      }
      return user.name.charAt(0);
    }
    return user?.email ? user.email.charAt(0) : 'U';
  };
  // Calculate member since date
  const getMemberSince = () => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    return 'Unknown';
  };
  // Get booking statistics
  const getBookingStats = () => {
    if (bookings.length === 0) return { total: 0, completed: 0, upcoming: 0, cancelled: 0 };
    
    return {
      total: bookings.length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      upcoming: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length
    };
  };
  const bookingStats = getBookingStats();
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
          <h2 className="text-3xl font-bold text-red-900 drop-shadow-lg">My Profile</h2>
        </motion.div>
        
        {user && (
          <motion.div
            variants={profileCardVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <Card 
              className="overflow-hidden shadow-xl"
              sx={{ 
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                border: '1px solid rgba(229, 57, 53, 0.1)'
              }}
            >
              <Box 
                className="p-6 text-white"
                sx={{ 
                  background: 'linear-gradient(135deg, #22309aff 0%, #fafafaff 100%)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative elements */}
                <Box 
                  className="absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-20"
                  sx={{ backgroundColor: 'white' }}
                />
                <Box 
                  className="absolute -right-8 -top-8 w-16 h-16 rounded-full opacity-30"
                  sx={{ backgroundColor: 'white' }}
                />
                
                <div className="flex items-center relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="mr-4"
                  >
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold">Welcome</h3>
                    <p className="text-red-100">Thank you for being a member of OUR Hotels</p>
                  </div>
                </div>
              </Box>
              
              <CardContent className="p-6">
                {/* Booking Stats */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Booking Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-white p-4 rounded-lg shadow text-center"
                    >
                      <p className="text-2xl font-bold text-red-700">{bookingStats.total}</p>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-white p-4 rounded-lg shadow text-center"
                    >
                      <p className="text-2xl font-bold text-green-600">{bookingStats.completed}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-white p-4 rounded-lg shadow text-center"
                    >
                      <p className="text-2xl font-bold text-blue-600">{bookingStats.upcoming}</p>
                      <p className="text-sm text-gray-600">Upcoming</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-white p-4 rounded-lg shadow text-center"
                    >
                      <p className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</p>
                      <p className="text-sm text-gray-600">Cancelled</p>
                    </motion.div>
                  </div>
                </div>
                
                <Divider className="my-6" />
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <motion.div 
                      className="flex items-center p-4 rounded-lg mb-4"
                      variants={cardHover}
                      whileHover="hover"
                      style={{ 
                        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                        border: '1px solid rgba(229, 57, 53, 0.1)'
                      }}
                    >
                      {/* <motion.div variants={iconVariants} whileHover="hover">
                        <div className="bg-red-100 p-3 rounded-full mr-4">
                          <FaUser className="text-red-700" size={24} />
                        </div>
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold text-gray-800">{user.name || user.username || 'UserName'}</p>
                      </div> */}
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center p-4 rounded-lg"
                      variants={cardHover}
                      whileHover="hover"
                      style={{ 
                        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                        border: '1px solid rgba(229, 57, 53, 0.1)'
                      }}
                    >
                      <motion.div variants={iconVariants} whileHover="hover">
                        <div className="bg-red-100 p-3 rounded-full mr-4">
                          <FaEnvelope className="text-red-700" size={24} />
                        </div>
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-gray-800">{user.email}</p>
                      </div>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <motion.div 
                      className="flex items-center p-4 rounded-lg mb-4"
                      variants={cardHover}
                      whileHover="hover"
                      style={{ 
                        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                        border: '1px solid rgba(229, 57, 53, 0.1)'
                      }}
                    >
                      {/* <motion.div variants={iconVariants} whileHover="hover">
                        <div className="bg-red-100 p-3 rounded-full mr-4">
                          <FaPhone className="text-red-700" size={24} />
                        </div>
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-semibold text-gray-800">{user.phone || 'N/A'}</p>
                      </div> */}
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center p-4 rounded-lg"
                      variants={cardHover}
                      whileHover="hover"
                      style={{ 
                        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                        border: '1px solid rgba(229, 57, 53, 0.1)'
                      }}
                    >
                      <motion.div variants={iconVariants} whileHover="hover">
                        <div className="bg-red-100 p-3 rounded-full mr-4">
                          <FaIdCard className="text-red-700" size={24} />
                        </div>
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-semibold text-gray-800">{user.role}</p>
                      </div>
                    </motion.div>
                  </Grid>
                </Grid>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      startIcon={<FaSignOutAlt />}
                      onClick={handleLogout}
                      className="flex items-center px-6 py-3 rounded-lg shadow-md transition"
                      style={{ 
                        background: 'linear-gradient(135deg, #6a35e5ff 0%, #b71c1c 100%)',
                        color: 'white'
                      }}
                    >
                      Logout
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-red-900 flex items-center">
              <FaHistory className="mr-2" />
              Recent Bookings
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewAllBookings}
              className="text-red-700 font-medium hover:text-red-800 px-4 py-2 rounded-lg"
              style={{ 
                background: 'rgba(229, 57, 53, 0.1)',
                border: '1px solid rgba(229, 57, 53, 0.2)'
              }}
            >
              View All
            </motion.button>
          </div>
          
          {bookings.length === 0 ? (
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                border: '1px solid rgba(229, 57, 53, 0.1)'
              }}
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
                className="px-6 py-3 rounded-lg font-medium shadow-md transition"
                style={{ 
                  background: 'linear-gradient(135deg, #e53935 0%, #b71c1c 100%)',
                  color: 'white'
                }}
              >
                Browse Hotels
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {bookings.slice(0, 3).map((booking) => (
                  <motion.div
                    key={booking.bookingId}
                    variants={bookingCardVariants}
                    whileHover="hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                    style={{ 
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                      border: '1px solid rgba(229, 57, 53, 0.1)'
                    }}
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
                                {booking.hotelName || booking.room?.hotel?.name || 'N/A'}
                              </h3>
                            </motion.button>
                            <p className="text-sm text-gray-600">Booking ID: #{booking.bookingId}</p>
                          </div>
                        </div>
                        <Chip 
                          label={booking.status} 
                          color={statusBadge(booking.status).chip}
                          size="small"
                          className="font-semibold"
                        />
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <FaHotel className="text-gray-500 mr-3" />
                          <span className="text-gray-700">{booking.roomType || booking.room?.roomType || 'N/A'}</span>
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
                        
                        {booking.location && (
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-gray-500 mr-3" />
                            <span className="text-gray-700">{booking.location}</span>
                          </div>
                        )}
                        
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
                        {/*  */}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
export default Profile;