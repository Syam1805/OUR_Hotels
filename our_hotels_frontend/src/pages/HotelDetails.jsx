import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotel, getRooms } from '../api/api';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { FaBed, FaMoneyBillWave, FaCheckCircle, FaHeart, FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaDumbbell, FaSpa, FaCar, FaCoffee, FaConciergeBell } from 'react-icons/fa';
import WeatherWidget from '../components/WeatherWidget';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import WishlistContext from '../context/WishlistContext';
import { IconButton, Button, Typography, Box, Chip, Tooltip } from '@mui/material';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
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

function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    setLoading(true);
    Promise.all([getHotel(id), getRooms(id)])
      .then(([hotelData, roomsData]) => {
        // Process hotel images
        let processedHotel = { ...hotelData };
        
        if (hotelData.hotelImages && Array.isArray(hotelData.hotelImages) && hotelData.hotelImages.length > 0) {
          processedHotel.hotelImages = hotelData.hotelImages.map(img => {
            if (typeof img === 'string' && img.startsWith('data:')) {
              return img;
            }
            if (typeof img === 'string' && img.startsWith('http')) {
              return img;
            }
            if (typeof img === 'object' && img.url) {
              return img.url;
            }
            if (typeof img === 'string') {
              return `/api/images/${img}`;
            }
            return `https://source.unsplash.com/400x300/?hotel,${hotelData.name}`;
          });
        } else if (hotelData.hotelImage) {
          if (typeof hotelData.hotelImage === 'string' && hotelData.hotelImage.startsWith('data:')) {
            processedHotel.hotelImages = [hotelData.hotelImage];
          } else if (typeof hotelData.hotelImage === 'string' && hotelData.hotelImage.startsWith('http')) {
            processedHotel.hotelImages = [hotelData.hotelImage];
          } else if (typeof hotelData.hotelImage === 'object' && hotelData.hotelImage.url) {
            processedHotel.hotelImages = [hotelData.hotelImage.url];
          } else if (typeof hotelData.hotelImage === 'string') {
            processedHotel.hotelImages = [`/api/images/${hotelData.hotelImage}`];
          } else {
            processedHotel.hotelImages = [`https://source.unsplash.com/400x300/?hotel,${hotelData.name}`];
          }
        } else {
          processedHotel.hotelImages = [`https://source.unsplash.com/400x300/?hotel,${hotelData.name}`];
        }
        
        setHotel(processedHotel);
        setRooms(roomsData);
      })
      .catch(error => {
        console.error('Error fetching hotel details:', error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const nextImage = () => {
    if (hotel && hotel.hotelImages && hotel.hotelImages.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % hotel.hotelImages.length);
    }
  };

  const prevImage = () => {
    if (hotel && hotel.hotelImages && hotel.hotelImages.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + hotel.hotelImages.length) % hotel.hotelImages.length);
    }
  };

  const handleImageError = () => {
    if (hotel) {
      const fallbackImage = `https://source.unsplash.com/400x300/?hotel,${hotel.name}`;
      if (!hotel.hotelImages.includes(fallbackImage)) {
        setHotel(prev => ({
          ...prev,
          hotelImages: [...prev.hotelImages, fallbackImage]
        }));
      }
    }
  };

  if (loading) return <Loader />;
  if (!hotel) return <div className="text-center mt-12" style={{ color: theme.palette.text.primary }}>Hotel not found.</div>;

  const isInWishlist = wishlist.some((item) => item.id === hotel.hotelId);
  const toggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(hotel.hotelId);
    } else {
      addToWishlist({ 
        id: hotel.hotelId, 
        name: hotel.name, 
        location: hotel.location,
        image: hotel.hotelImages.length > 0 ? hotel.hotelImages[0] : null
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto mt-8 px-4"
      style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}
    >
      <div className="mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <FaChevronLeft className="mr-2" /> Back to Hotels
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hotel Images */}
        <motion.div 
          className="relative rounded-xl overflow-hidden shadow-lg h-96"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {hotel.hotelImages && hotel.hotelImages.length > 0 ? (
            <>
              <motion.img
                key={currentImageIndex}
                src={hotel.hotelImages[currentImageIndex]}
                alt={hotel.name}
                className="w-full h-full object-cover"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onError={handleImageError}
              />
              
              {hotel.hotelImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                  >
                    <FaChevronLeft className="text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                  >
                    <FaChevronRight className="text-gray-700" />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
                    {hotel.hotelImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentImageIndex === index 
                            ? 'bg-white scale-125 shadow-md' 
                            : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="text-gray-400 mb-2">No images available</div>
                <div className="text-gray-500 text-sm">for {hotel.name}</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Hotel Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <motion.h2
                className="text-3xl font-extrabold mb-2"
                style={{ color: theme.palette.primary.main }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              >
                {hotel.name}
              </motion.h2>
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                <span className="text-gray-700">{hotel.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <FaStar className="mr-2 text-yellow-500" />
                <span className="text-gray-700">{hotel.rating} Rating</span>
              </div>
            </div>
            <IconButton
              onClick={toggleWishlist}
              aria-label={isInWishlist ? `Remove ${hotel.name} from wishlist` : `Add ${hotel.name} to wishlist`}
              style={{ color: isInWishlist ? theme.palette.error.main : theme.palette.text.secondary }}
              className="bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition-all"
            >
              <FaHeart size={24} />
            </IconButton>
          </div>

          <p className="text-gray-600 mb-6">{hotel.description}</p>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.palette.primary.dark }}>Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {hotel.amenities.map((amenity, index) => (
                  <Tooltip key={index} title={amenity.charAt(0).toUpperCase() + amenity.slice(1)}>
                    <div className="flex flex-col items-center p-3 bg-gray-100 rounded-lg min-w-[80px]">
                      <div className="mb-1">
                        {amenityIcons[amenity] || <FaWifi className="text-gray-500" />}
                      </div>
                      <span className="text-xs text-gray-700">{amenity}</span>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          <WeatherWidget location={hotel.location} />
        </motion.div>
      </div>

      {/* Rooms Section */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold mb-6" style={{ color: theme.palette.primary.dark }}>Available Rooms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <motion.div
              key={room.roomId}
              whileHover={{ scale: 1.03, boxShadow: `0 8px 32px ${theme.palette.primary.main}33` }}
              className="border rounded-xl shadow-lg overflow-hidden"
              style={{ background: theme.palette.background.paper }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <FaBed className="mr-2" style={{ color: theme.palette.primary.main }} />
                      <span className="font-semibold text-lg" style={{ color: theme.palette.primary.dark }}>{room.roomType}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <FaMoneyBillWave className="mr-2" style={{ color: theme.palette.secondary.main }} />
                      <span className="text-gray-700 font-medium">${room.pricePerNight} <span className="text-sm text-gray-500">per night</span></span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className={room.availabilityStatus ? "text-green-600 mr-2" : "text-gray-400 mr-2"} style={{ color: room.availabilityStatus ? theme.palette.secondary.main : theme.palette.text.disabled }} />
                    <span className={room.availabilityStatus ? "text-green-700 font-medium" : "text-gray-500"}>
                      {room.availabilityStatus ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
                
                {room.amenities && (
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.split(',').map((amenity, index) => (
                        <Chip 
                          key={index} 
                          label={amenity.trim()} 
                          size="small" 
                          variant="outlined"
                          className="text-xs"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {room.availabilityStatus && (
                  <Link
                    to={`/booking/${room.roomId}`}
                    className="block"
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      className="py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ 
                        backgroundColor: theme.palette.primary.main, 
                        color: 'white',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      }}
                    >
                      Book Now
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HotelDetails;