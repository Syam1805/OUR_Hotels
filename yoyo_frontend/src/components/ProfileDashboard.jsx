import React, { useEffect, useState } from 'react';
import LoyaltyDashboard from '../components/LoyaltyDashboard';
import { useAuth } from '../hooks/useAuth';
import { getUserBookings } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaHotel, FaCalendarAlt, FaCheckCircle, FaMoneyBillWave, FaArrowLeft, FaHistory, FaCog, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

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

function ProfileDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackClick}
            className="flex items-center text-red-700 mr-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </motion.button>
          <h2 className="text-3xl font-bold text-red-900 drop-shadow-lg">Profile Dashboard</h2>
        </div>

        {user && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-700 to-red-900 p-6 text-white">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full mr-4">
                  <FaUser className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Profile Information</h3>
                  <p className="text-red-100">Manage your account details and preferences</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <FaUser className="text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold">{user.name || user.username || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <FaEnvelope className="text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <FaPhone className="text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold">{user.phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <FaIdCard className="text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-semibold">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center px-6 py-3 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 transition"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
        
        <LoyaltyDashboard />
        
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
              className="text-red-700 font-medium hover:text-red-800"
            >
              View All
            </motion.button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : bookings.length === 0 ? (
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
                {bookings.slice(0, 3).map((booking) => (
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
                            <h3 className="text-lg font-bold text-gray-800">{booking.hotelName || booking.room?.hotel?.name || 'N/A'}</h3>
                            <p className="text-sm text-gray-600">Booking ID: #{booking.bookingId}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
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
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/booking-details/${booking.bookingId}`)}
                          className="text-red-700 font-medium hover:text-red-800"
                        >
                          View Details
                        </motion.button>
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

export default ProfileDashboard;