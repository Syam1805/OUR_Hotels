import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaHotel, FaHistory, FaCog, FaSignOutAlt, FaHome, FaUser, FaHeart, FaTimes } from 'react-icons/fa';
import { Avatar, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const sidebarVariants = {
  open: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.1
    } 
  },
  closed: { 
    x: '-100%', 
    opacity: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1
    } 
  }
};

const itemVariants = {
  open: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24
    } 
  },
  closed: { 
    opacity: 0, 
    y: 20,
    transition: { 
      duration: 0.2 
    } 
  }
};

const avatarVariants = {
  open: { 
    scale: 1, 
    rotate: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 15,
      delay: 0.2
    } 
  },
  closed: { 
    scale: 0, 
    rotate: -10,
    transition: { 
      duration: 0.2 
    } 
  }
};

function Sidebar({ isOpen, onClose, onSidebarStateChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Define icons with dark blue color
  const homeIcon = <FaHome style={{ color: '#1a237e' }} />;
  const hotelIcon = <FaHotel style={{ color: '#1a237e' }} />;
  const historyIcon = <FaHistory style={{ color: '#1a237e' }} />;
  const userIcon = <FaUser style={{ color: '#1a237e' }} />;
  const heartIcon = <FaHeart style={{ color: '#1a237e' }} />;
  const cogIcon = <FaCog style={{ color: '#1a237e' }} />;
  const timesIcon = <FaTimes style={{ color: '#1a237e' }} />;
  const signOutIcon = <FaSignOutAlt style={{ color: '#d32f2f' }} />;
  
  // Notify parent component about sidebar state changes
  useEffect(() => {
    if (onSidebarStateChange) {
      onSidebarStateChange(isOpen);
    }
    
    // Add class to body when sidebar is open to push main content
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen, onSidebarStateChange]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
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
  
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };
  
  return (
    <motion.div
      className="fixed top-0 left-0 h-full w-64 z-50 shadow-2xl bg-gradient-to-b from-white to-blue-500"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="p-5 flex justify-between items-center border-b border-blue-100">
        <motion.div
          variants={itemVariants}
        >
          <Typography 
            variant="h6" 
            className="font-bold bg-gradient-to-r from-blue-600 to-white-800"
            style={{ color: '#1a237e' }}
          >
            OUR Hotels
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-300"
          >
            {timesIcon}
          </Button>
        </motion.div>
      </div>
      
      {user && (
        <motion.div 
          className="p-5 flex items-center space-x-4 border-b border-blue-100"
          variants={itemVariants}
        >
          <motion.div variants={avatarVariants}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56,
                bgcolor: '#1a237e',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {getUserInitials()}
            </Avatar>
          </motion.div>
          <div>
            <Typography 
              variant="body1" 
              className="font-semibold"
              style={{ color: '#1a237e' }}
            >
              {getUserDisplayName()}
            </Typography>
            <Typography 
              variant="body2" 
              className="text-sm"
              style={{ color: '#1a237e' }}
            >
              {user.email || 'No email provided'}
            </Typography>
          </div>
        </motion.div>
      )}
      
      <div className="py-4 px-3">
        <motion.div variants={itemVariants}>
          <Button
            fullWidth
            startIcon={homeIcon}
            onClick={() => handleNavigation('/')}
            className="justify-start p-3 mb-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
            style={{ 
              color: '#1a237e',
              justifyContent: 'flex-start',
              textAlign: 'left'
            }}
          >
            Home
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button
            fullWidth
            startIcon={hotelIcon}
            onClick={() => handleNavigation('/hotels')}
            className="justify-start p-3 mb-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
            style={{ 
              color: '#1a237e',
              justifyContent: 'flex-start',
              textAlign: 'left'
            }}
          >
            Hotels
          </Button>
        </motion.div>
        
        {user && user.role === 'USER' && (
          <>
            <motion.div variants={itemVariants}>
              <Button
                fullWidth
                startIcon={historyIcon}
                onClick={() => handleNavigation('/order-history')}
                className="justify-start p-3 mb-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                style={{ 
                  color: '#1a237e',
                  justifyContent: 'flex-start',
                  textAlign: 'left'
                }}
              >
                Order History
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button
                fullWidth
                startIcon={userIcon}
                onClick={() => handleNavigation('/profile')}
                className="justify-start p-3 mb-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                style={{ 
                  color: '#1a237e',
                  justifyContent: 'flex-start',
                  textAlign: 'left'
                }}
              >
                My Profile
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button
                fullWidth
                startIcon={heartIcon}
                onClick={() => handleNavigation('/wishlist')}
                className="justify-start p-3 mb-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                style={{ 
                  color: '#1a237e',
                  justifyContent: 'flex-start',
                  textAlign: 'left'
                }}
              >
                Wishlist
              </Button>
            </motion.div>
          </>
        )}
        
        {user && user.role === 'ADMIN' && (
          <motion.div variants={itemVariants}>
            <Button
              fullWidth
              startIcon={cogIcon}
              onClick={() => handleNavigation('/admin')}
              className="justify-start p-3 mb-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
              style={{ 
                color: '#1a237e',
                justifyContent: 'flex-start',
                textAlign: 'left'
              }}
            >
              Admin Dashboard
            </Button>
          </motion.div>
        )}
        
        {user && (
          <motion.div variants={itemVariants}>
            <Button
              fullWidth
              startIcon={signOutIcon}
              onClick={handleLogout}
              className="justify-start p-3 mt-4 rounded-lg hover:bg-red-50 transition-colors duration-300"
              style={{ 
                color: '#d32f2f',
                justifyContent: 'flex-start',
                textAlign: 'left'
              }}
            >
              Logout
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Sidebar;