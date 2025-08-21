import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchHotels } from '../api/api.js';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaBed, FaMoneyBillWave, FaImage, FaFilter, FaArrowLeft, FaChevronLeft, FaChevronRight, FaHeart, FaTimes, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaDumbbell, FaSpa, FaCar, FaCoffee, FaConciergeBell } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, IconButton, Chip, Badge, Tooltip } from '@mui/material';
import { useWishlist } from '../context/WishlistContext';
import { FiSliders, FiArrowLeft } from 'react-icons/fi';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { 
    x: '0%', 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.1
    } 
  },
};

const cardVariants = {
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
};

const cardHover = {
  hover: {
    scale: 1.03,
    y: -10,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3, ease: "easeOut" }
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { 
      duration: 0.3, 
      ease: "easeIn" 
    } 
  },
};

const amenityIcons = {
  wifi: <FaWifi className="text-blue-500" />,
  pool: <FaSwimmingPool className="text-blue-400" />,
  parking: <FaParking className="text-gray-600" />,
  restaurant: <FaUtensils className="text-red-500" />,
  gym: <FaDumbbell className="text-purple-500" />,
  spa: <FaSpa className="text-pink-500" />,
  car: <FaCar className="text-gray-600" />,
  breakfast: <FaCoffee className="text-yellow-600" />,
  concierge: <FaConciergeBell className="text-blue-500" />
};

function Hotels({ isMainSidebarOpen }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialLocation = queryParams.get('location') || '';
  const sortBy = queryParams.get('sortBy') || '';
  const [searchLocation, setSearchLocation] = useState(initialLocation);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    roomType: '',
    sortBy: sortBy,
    amenities: []
  });
  
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
    fetchHotels();
  }, [searchLocation, filters]);
  
  const fetchHotels = () => {
    setLoading(true);
    searchHotels(searchLocation, filters.priceMin, filters.priceMax, filters.roomType, filters.sortBy)
      .then((data) => {
        const processedData = data.map(hotel => {
          // Process images - handle both base64 and URL images
          let hotelImages = [];
          
          // Check if hotelImages is an array and has items
          if (hotel.hotelImages && Array.isArray(hotel.hotelImages) && hotel.hotelImages.length > 0) {
            hotelImages = hotel.hotelImages.map(img => {
              // If it's a base64 data URI, use it as is
              if (typeof img === 'string' && img.startsWith('data:')) {
                return img;
              }
              // If it's a full URL, use it as is
              if (typeof img === 'string' && img.startsWith('http')) {
                return img;
              }
              // If it's an object with a URL property
              if (typeof img === 'object' && img.url) {
                return img.url;
              }
              // If it's a relative path, prepend the API base URL
              if (typeof img === 'string') {
                return `/api/images/${img}`;
              }
              // Fallback for any other case
              return `https://source.unsplash.com/400x300/?hotel,${hotel.name}`;
            });
          } 
          // Check if there's a single hotelImage
          else if (hotel.hotelImage) {
            // If it's a base64 data URI
            if (typeof hotel.hotelImage === 'string' && hotel.hotelImage.startsWith('data:')) {
              hotelImages = [hotel.hotelImage];
            } 
            // If it's a full URL
            else if (typeof hotel.hotelImage === 'string' && hotel.hotelImage.startsWith('http')) {
              hotelImages = [hotel.hotelImage];
            }
            // If it's an object with a URL property
            else if (typeof hotel.hotelImage === 'object' && hotel.hotelImage.url) {
              hotelImages = [hotel.hotelImage.url];
            }
            // If it's a relative path
            else if (typeof hotel.hotelImage === 'string') {
              hotelImages = [`/api/images/${hotel.hotelImage}`];
            }
            // Fallback for any other case
            else {
              hotelImages = [`https://source.unsplash.com/400x300/?hotel,${hotel.name}`];
            }
          } 
          // Fallback if no images are found
          else {
            hotelImages = [`https://source.unsplash.com/400x300/?hotel,${hotel.name}`];
          }
          
          return { 
            ...hotel, 
            hotelImages,
            amenities: hotel.amenities || []
          };
        });
        
        const sortedData = [...processedData].sort((a, b) => {
          if (filters.sortBy === 'rating') {
            return b.rating - a.rating;
          }
          if (filters.sortBy === 'priceLow') {
            return a.price - b.price;
          }
          if (filters.sortBy === 'priceHigh') {
            return b.price - a.price;
          }
          return 0;
        });
        
        setHotels(sortedData);
      })
      .catch((error) => {
        console.error('Error fetching hotels:', error);
        setHotels([]);
      })
      .finally(() => setLoading(false));
  };
  
  const handleSearch = () => {
    setShowFilters(false);
    fetchHotels();
  };
  
  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      roomType: '',
      sortBy: '',
      amenities: []
    });
    setSearchLocation('');
    setShowFilters(false);
  };
  
  const nextImage = (hotelId, imageCount) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % imageCount
    }));
  };
  
  const prevImage = (hotelId, imageCount) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + imageCount) % imageCount
    }));
  };
  
  const handleImageError = (hotelId) => {
    setHotels(prevHotels =>
      prevHotels.map(hotel => {
        if (hotel.hotelId === hotelId) {
          const fallbackImage = `https://source.unsplash.com/400x300/?hotel,${hotel.name}`;
          return { 
            ...hotel, 
            hotelImages: hotel.hotelImages.includes(fallbackImage) 
              ? hotel.hotelImages 
              : [...hotel.hotelImages, fallbackImage]
          };
        }
        return hotel;
      })
    );
  };
  
  const isInWishlist = (hotelId) => wishlist.some((item) => item.id === hotelId);
  
  const toggleWishlist = (hotel) => {
    if (isInWishlist(hotel.hotelId)) {
      removeFromWishlist(hotel.hotelId);
    } else {
      addToWishlist({ 
        id: hotel.hotelId, 
        name: hotel.name, 
        location: hotel.location, 
        price: hotel.price, 
        image: hotel.hotelImages.length > 0 ? hotel.hotelImages[0] : null 
      });
    }
  };
  
  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };
  
  const totalOffset = showFilters ? 'translate-x-64' : '';
  
  // Style for transparent form controls
  const transparentInputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-input': {
      color: 'white',
    },
    '& .MuiSelect-select': {
      color: 'white',
    },
    '& .MuiSvgIcon-root': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gradient-to-br from-white to-blue-300 relative overflow-hidden transition-all duration-300"
      style={{
        marginLeft: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <IconButton 
              onClick={() => navigate('/')} 
              className="hover:text-primary-dark transition-colors duration-300"
              style={{ color: theme.palette.primary.main }}
            >
              <FiArrowLeft size={24} />
            </IconButton>
          </motion.div>
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 10, duration: 0.5 }}
            className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700"
          >
            Hotels
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <IconButton 
              onClick={() => setShowFilters(true)} 
              className="hover:text-primary-dark transition-colors duration-300"
              style={{ color: theme.palette.primary.main }}
            >
              <FiSliders size={24} />
            </IconButton>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              className="fixed inset-y-0 left-0 w-64 md:w-80 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 bg-opacity-95 backdrop-blur-lg shadow-2xl p-6 z-50 overflow-y-auto border-r border-white/20"
            >
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h5" className="font-bold text-red-900">Filters</Typography>
                <IconButton 
                  onClick={() => setShowFilters(false)}
                  className="hover:bg-white/20 rounded-full transition-colors duration-300"
                >
                  <FaTimes style={{ color: 'red-900' }} />
                </IconButton>
              </div>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                >
                  <TextField
                    label="Location"
                    variant="outlined"
                    fullWidth
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    size="small"
                    sx={transparentInputStyle}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                  <TextField
                    label="Min Price"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    size="small"
                    sx={transparentInputStyle}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                >
                  <TextField
                    label="Max Price"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    size="small"
                    sx={transparentInputStyle}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                >
                  <FormControl fullWidth size="small" sx={transparentInputStyle}>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={filters.roomType}
                      label="Room Type"
                      onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                    >
                      <MenuItem value="">All Room Types</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Double">Double</MenuItem>
                      <MenuItem value="Suite">Suite</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                >
                  <FormControl fullWidth size="small" sx={transparentInputStyle}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy}
                      label="Sort By"
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                      <MenuItem value="">Default</MenuItem>
                      <MenuItem value="rating">Rating (High to Low)</MenuItem>
                      <MenuItem value="priceLow">Price (Low to High)</MenuItem>
                      <MenuItem value="priceHigh">Price (High to Low)</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
                >
                  <Typography variant="h6" className="font-medium red-700 mb-2">Amenities</Typography>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(amenityIcons).map(amenity => (
                      <Chip
                        key={amenity}
                        label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        icon={amenityIcons[amenity]}
                        clickable
                        color={filters.amenities.includes(amenity) ? "primary" : "default"}
                        onClick={() => handleAmenityToggle(amenity)}
                        size="small"
                        className="mb-2 bg-white/20 text-white hover:bg-white/30"
                        sx={{
                          backgroundColor: filters.amenities.includes(amenity) 
                            ? 'rgba(255, 255, 255, 0.3)' 
                            : 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col space-y-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    fullWidth
                    className="py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    fullWidth
                    className="py-3 rounded-lg font-medium transition-all duration-300"
                    style={{ 
                      color: 'white', 
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className={`transition-all duration-500 ease-in-out ${totalOffset}`}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {hotels.length === 0 ? (
                <Box className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-2xl mx-auto">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h6" className="mb-6 text-gray-700 text-lg">
                      No hotels found matching your criteria. 😔
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => { clearFilters(); setShowFilters(true); }}
                      className="py-3 px-8 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ 
                        backgroundColor: theme.palette.primary.main, 
                        color: 'white',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      }}
                    >
                      Adjust Filters
                    </Button>
                  </motion.div>
                </Box>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  {hotels.map((hotel) => {
                    const isWishlisted = isInWishlist(hotel.hotelId);
                    return (
                      <motion.div
                        key={hotel.hotelId}
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          {hotel.hotelImages && hotel.hotelImages.length > 0 ? (
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={currentImageIndex[hotel.hotelId] || 0}
                                src={hotel.hotelImages[currentImageIndex[hotel.hotelId] || 0]}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                                variants={imageVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onError={() => handleImageError(hotel.hotelId)}
                              />
                            </AnimatePresence>
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                              <FaImage className="text-gray-400" size={48} />
                            </div>
                          )}
                          {hotel.hotelImages && hotel.hotelImages.length > 1 && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/60 rounded-full p-2 shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  prevImage(hotel.hotelId, hotel.hotelImages.length);
                                }}
                              >
                                <FaChevronLeft className="text-gray-700" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/60 rounded-full p-2 shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextImage(hotel.hotelId, hotel.hotelImages.length);
                                }}
                              >
                                <FaChevronRight className="text-gray-700" />
                              </motion.button>
                              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
                                {hotel.hotelImages.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      (currentImageIndex[hotel.hotelId] || 0) === index 
                                        ? 'bg-white scale-125 shadow-md' 
                                        : 'bg-white/50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(hotel);
                            }}
                            aria-label={isWishlisted ? `Remove ${hotel.name} from wishlist` : `Add ${hotel.name} to wishlist`}
                            className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 shadow-md"
                            style={{ 
                              color: isWishlisted ? theme.palette.error.main : 'white', 
                              backgroundColor: isWishlisted ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.5)' 
                            }}
                          >
                            <FaHeart size={20} />
                          </motion.button>
                          
                          {/* Badge for rating */}
                          <div className="absolute top-4 left-4 bg-white/90 rounded-full px-3 py-1 flex items-center shadow-md">
                            <FaStar className="text-yellow-500 mr-1" />
                            <span className="font-bold text-gray-800">{hotel.rating}</span>
                          </div>
                        </div>
                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                              {hotel.name}
                            </h3>
                            <div className="space-y-3 mb-5 text-gray-600">
                              <div className="flex items-center">
                                <FaMapMarkerAlt className="mr-3 text-blue-500" />
                                <span className="text-sm">{hotel.location}</span>
                              </div>
                              <div className="flex items-center">
                                <FaBed className="mr-3 text-blue-500" />
                                <span className="text-sm">{hotel.roomType}</span>
                              </div>
                              <div className="flex items-center">
                                <FaMoneyBillWave className="mr-3 text-green-600" />
                                <span className="font-semibold text-lg">${hotel.price} <span className="text-sm text-gray-500">per night</span></span>
                              </div>
                            </div>
                            
                            {/* Amenities */}
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                    <Tooltip key={index} title={amenity.charAt(0).toUpperCase() + amenity.slice(1)}>
                                      <div className="p-1 bg-gray-100 rounded-full">
                                        {amenityIcons[amenity] || <FaWifi className="text-gray-500" />}
                                      </div>
                                    </Tooltip>
                                  ))}
                                  {hotel.amenities.length > 3 && (
                                    <Chip label={`+${hotel.amenities.length - 3} more`} size="small" />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <motion.div 
                            whileHover={{ scale: 1.03 }} 
                            whileTap={{ scale: 0.98 }}
                            className="mt-auto"
                          >
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
                              className="py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                              style={{ 
                                backgroundColor: theme.palette.primary.main, 
                                color: 'white',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                              }}
                            >
                              View Details
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Hotels;