// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, FaUser, FaHotel, FaBars, FaUserCircle, FaHeart, FaHome, FaTimes, 
  FaSearch, FaMapMarkerAlt, FaStar, FaRegStar, FaRegHeart, FaRegBell, FaGlobe,
  FaMoon, FaSun, FaShoppingCart, FaBookmark, FaChevronDown, FaTimesCircle
} from 'react-icons/fa';
import LoginPopup from './LoginPopup';
import Sidebar from './Sidebar';
import { useTheme } from '@mui/material/styles';
import { 
  Button, Avatar, Typography, TextField, InputAdornment, 
  Menu, MenuItem, Badge, IconButton, useMediaQuery, 
  Popover, List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

const linkVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { 
    scale: 1.05, 
    color: '#991b1b',
    transition: { duration: 0.3 } 
  },
  tap: { scale: 0.95 }
};

const logoVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      duration: 0.7, 
      type: 'spring', 
      bounce: 0.4 
    } 
  },
  hover: { 
    scale: 1.05, 
    rotate: 2, 
    transition: { duration: 0.3 } 
  },
  float: {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const bellVariants = {
  idle: { rotate: 0 },
  ring: {
    rotate: [0, 15, -15, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 3
    }
  }
};

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
    fontSize: '0.85rem',
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 12px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.85)',
  },
}));

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleBookingClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLogin(true);
    }
  };
  
  const handleNotificationClick = (event) => {
    if (notificationAnchorEl) {
      setNotificationAnchorEl(null);
    } else {
      setNotificationAnchorEl(event.currentTarget);
    }
    
    if (hasNewNotification) {
      setHasNewNotification(false);
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleWishlistClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLogin(true);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hotels?location=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
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
  
  const notifications = [
    { id: 1, title: 'Price Alert', message: 'Hotel X dropped by 20%!', time: '2 hours ago', read: false },
    { id: 2, title: 'New Offer', message: 'Special weekend deals available', time: '1 day ago', read: false },
    { id: 3, title: 'Booking Confirmed', message: 'Your booking at Grand Resort is confirmed', time: '2 days ago', read: true },
  ];
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <>
      <motion.nav
        className={`bg-gradient-to-r from-blue-100 to-blue-500 text-red-900 py-2 px-4 shadow-lg sticky top-0 z-40 transition-all duration-300 ${darkMode ? 'dark' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ 
          left: sidebarOpen ? '16rem' : '0',
          width: sidebarOpen ? 'calc(100% - 16rem)' : '100%'
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <motion.button
              className="mr-4 text-red-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <FaBars size={20} />
            </motion.button>
            
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate={["animate", "float"]}
              whileHover="hover"
              whileTap="tap"
              aria-label="Home"
              className="flex items-center"
            >
              <FaHotel className="mr-2 text-red-800" size={20} />
              <Link
                to="/"
                className="text-2xl font-extrabold tracking-wide text-red-800 drop-shadow-lg"
              >
                YoYo Hotels
              </Link>
            </motion.div>
          </div>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-grow max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative">
              <SearchBar
                placeholder="Search by hotel name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch className="text-red-700" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                      >
                        <FaTimesCircle className="text-red-700" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex space-x-2 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
              <Link
                to="/hotels"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center text-red-900 hover:bg-cyan-200"
                aria-label="Hotels"
              >
                <FaHotel className="mr-2 text-red-800" />
                Hotels
              </Link>
            </motion.div>           
            
            {/* Notification Bell - Only show when user is logged in */}
            {user && (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNotificationClick}
                aria-label="Notifications"
              >
                <motion.div
                  variants={bellVariants}
                  animate={unreadNotifications > 0 ? "ring" : "idle"}
                  className="p-1.5 rounded-full hover:bg-cyan-200 transition-colors duration-300"
                >
                  <Badge badgeContent={unreadNotifications} color="error">
                    <FaBell size={16} className="text-red-800" />
                  </Badge>
                </motion.div>
                
                <Popover
                  open={Boolean(notificationAnchorEl)}
                  anchorEl={notificationAnchorEl}
                  onClose={handleNotificationClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      width: 320,
                      maxHeight: 400,
                      overflow: 'auto',
                      borderRadius: '12px',
                      border: '1px solid #a5f3fc',
                    },
                  }}
                >
                  <div className="p-4 border-b border-gray-200 bg-cyan-50">
                    <Typography variant="h6" className="font-bold text-red-900">Notifications</Typography>
                  </div>
                  <List>
                    {notifications.map((notification) => (
                      <React.Fragment key={notification.id}>
                        <ListItem button>
                          <ListItemIcon>
                            {notification.title === 'Price Alert' && <FaStar className="text-yellow-500" />}
                            {notification.title === 'New Offer' && <FaRegHeart className="text-red-500" />}
                            {notification.title === 'Booking Confirmed' && <FaHotel className="text-red-700" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={notification.title}
                            secondary={
                              <div>
                                <Typography variant="body2">{notification.message}</Typography>
                                <Typography variant="caption" className="text-gray-500">{notification.time}</Typography>
                              </div>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                  <div className="p-2 text-center bg-cyan-50">
                    <Button size="small" color="primary">View All</Button>
                  </div>
                </Popover>
              </motion.div>
            )}
            
            {/* Wishlist Icon - Only show when user is logged in */}
            {user && (
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/wishlist"
                  className="p-1.5 rounded-full hover:bg-cyan-200 transition-colors duration-300"
                  aria-label="Wishlist"
                >
                  <FaHeart size={16} className="text-red-700" />
                </Link>
              </motion.div>
            )}
            
            {!user ? (
              <>
                <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/login"
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center text-red-900 hover:bg-cyan-200"
                    aria-label="Login"
                  >
                    <FaUser className="mr-2 text-red-800" />
                    Login
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/register"
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center text-red-900 hover:bg-cyan-200"
                    aria-label="Register"
                  >
                    <FaUser className="mr-2 text-red-800" />
                    Register
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleProfileMenuOpen}
                    startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: 'red.800' }}>
                      {getUserInitials()}
                    </Avatar>}
                    endIcon={<FaChevronDown size={12} className="text-red-800" />}
                    sx={{
                      color: 'red.900',
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(6, 182, 212, 0.2)',
                      },
                    }}
                  >
                    <span className="hidden md:inline text-red-900">{getUserDisplayName()}</span>
                  </Button>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        width: 200,
                        borderRadius: '12px',
                        mt: 1,
                        border: '1px solid #a5f3fc',
                      },
                    }}
                  >
                    <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
                      <ListItemIcon>
                        <FaUserCircle className="text-red-800" />
                      </ListItemIcon>
                      <ListItemText>Profile</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/order-history'); handleProfileMenuClose(); }}>
                      <ListItemIcon>
                        <FaBookmark className="text-red-800" />
                      </ListItemIcon>
                      <ListItemText>My Bookings</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/wishlist'); handleProfileMenuClose(); }}>
                      <ListItemIcon>
                        <FaHeart className="text-red-700" />
                      </ListItemIcon>
                      <ListItemText>Wishlist</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { handleLogout(); handleProfileMenuClose(); }}>
                      <ListItemIcon>
                        <FaTimes className="text-red-700" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSearch}
              aria-label="Search"
            >
              <FaSearch size={18} className="text-red-800" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} className="text-red-800" /> : <FaBars size={20} className="text-red-800" />}
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <AnimatePresence>
          {showSearch && isMobile && (
            <motion.div
              className="md:hidden px-4 pb-3"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <SearchBar
                  placeholder="Search by hotel name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch className="text-red-700" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery('')}
                          aria-label="Clear search"
                        >
                          <FaTimesCircle className="text-red-700" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden bg-cyan-50 text-red-900 mt-2 rounded-lg shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <Link
                  to="/hotels"
                  className="flex items-center text-lg font-medium py-2 px-3 rounded-lg hover:bg-cyan-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaHotel className="mr-2 text-red-800" />
                  Hotels
                </Link>
                
                {user && (
                  <>
                    <Link
                      to="/wishlist"
                      className="flex items-center text-lg font-medium py-2 px-3 rounded-lg hover:bg-cyan-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaHeart className="mr-2 text-red-700" />
                      Wishlist
                    </Link>
                    <Link
                      to="/order-history"
                      className="flex items-center text-lg font-medium py-2 px-3 rounded-lg hover:bg-cyan-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaBookmark className="mr-2 text-red-800" />
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center text-lg font-medium py-2 px-3 rounded-lg hover:bg-cyan-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUserCircle className="mr-2 text-red-800" />
                      Profile
                    </Link>
                  </>
                )}
                
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-cyan-200">
                  <div className="flex items-center">
                    <FaMoon className="mr-2 text-red-800" />
                    <span>Dark Mode</span>
                  </div>
                  <div className="relative inline-block w-10 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={darkMode}
                      onChange={toggleDarkMode}
                    />
                    <span className={`absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition ${darkMode ? 'bg-red-700' : ''}`}></span>
                    <span className={`absolute h-4 w-4 bg-white rounded-full transition left-1 top-1 ${darkMode ? 'transform translate-x-4' : ''}`}></span>
                  </div>
                </div>
                
                {!user && (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center text-lg font-medium py-2 px-3 rounded-lg hover:bg-cyan-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUser className="mr-2 text-red-800" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center text-lg font-medium py-2 px-3 rounded-lg hover:bg-cyan-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUser className="mr-2 text-red-800" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginPopup onClose={() => setShowLogin(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;