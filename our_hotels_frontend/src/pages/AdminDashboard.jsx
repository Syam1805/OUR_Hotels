import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  addHotel,
  deleteHotel,
  addRoom,
  updateRoom,
  deleteRoom as apiDeleteRoom,
  getRooms,
  getUsers,
  updateUser,
  deleteUser as apiDeleteUser,
  searchHotels,
  getAllBookings,
} from '../api/api.js';
import Loader from '../components/Loader';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHotel, FaBed, FaUsers, FaCalendarAlt, FaChartBar, FaPlus, FaEdit, 
  FaTrash, FaEye, FaEyeSlash, FaTimes, FaChevronLeft, FaChevronRight, 
  FaCog, FaSearch, FaFilter, FaDownload, FaUserCircle, FaMoneyBillWave, 
  FaPercentage, FaLink, FaStar, FaMapMarkerAlt, FaImage, FaSave, FaTimesCircle
} from 'react-icons/fa';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
// Classic color palette
const COLORS = {
  primary: '#8B0000', // Burgundy
  secondary: '#D4AF37', // Gold
  tertiary: '#F5F5DC', // Beige
  dark: '#2C2C2C', // Dark gray
  light: '#FAFAFA', // Off-white
  accent: '#CD5C5C', // Indian red
  success: '#228B22', // Forest green
  warning: '#FF8C00', // Dark orange
  danger: '#B22222', // Fire brick
};
// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
};
const cardHover = {
  hover: { 
    scale: 1.03, 
    y: -10,
    boxShadow: `0 15px 30px rgba(139, 0, 0, 0.2)`,
    transition: { duration: 0.3 }
  }
};
const navbarItem = {
  rest: { scale: 1, color: COLORS.dark },
  hover: { scale: 1.05, color: COLORS.primary },
  tap: { scale: 0.95 }
};
const imageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};
const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse"
  }
};
const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse"
  }
};
// Form Components with memoization to prevent re-renders
const HotelForm = React.memo(({ 
  handleAddHotel, 
  busy 
}) => {
  // Local state for form fields
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    description: '',
    rating: '',
    hotelImages: [],
  });
  const [hotelImageUrls, setHotelImageUrls] = useState('');
  const [hotelImagePreviews, setHotelImagePreviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [processingUrls, setProcessingUrls] = useState(false);
  // Image handlers
  const handleHotelImagesChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const newImagePreviews = [];
    const readers = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      readers.push(new Promise((resolve) => {
        reader.onloadend = () => {
          newImagePreviews.push(reader.result);
          resolve();
        };
        reader.readAsDataURL(file);
      }));
    });
    
    Promise.all(readers).then(() => {
      setHotelForm(prev => ({
        ...prev,
        hotelImages: [...prev.hotelImages, ...newImagePreviews]
      }));
      setHotelImagePreviews(prev => [...prev, ...newImagePreviews]);
    });
  }, []);
  
  const handleAddImageUrls = useCallback(async () => {
    const urls = hotelImageUrls.split('\n').filter(url => url.trim() !== '');
    if (urls.length === 0) return;
    
    setProcessingUrls(true);
    const newImages = [];
    const newPreviews = [];
    
    for (const url of urls) {
      try {
        if (!url.match(/\.(jpeg|jpg|gif|png)$/i)) {
          toast.error(`Invalid image URL: ${url}`);
          continue;
        }
        
        newImages.push(url);
        newPreviews.push(url);
      } catch (error) {
        console.error(`Failed to process image URL ${url}:`, error);
        toast.error(`Failed to process image URL: ${url}`);
      }
    }
    
    setHotelForm(prev => ({
      ...prev,
      hotelImages: [...prev.hotelImages, ...newImages]
    }));
    setHotelImagePreviews(prev => [...prev, ...newPreviews]);
    setHotelImageUrls('');
    setProcessingUrls(false);
  }, [hotelImageUrls]);
  
  const removeHotelImage = useCallback((index) => {
    setHotelForm(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.filter((_, i) => i !== index)
    }));
    setHotelImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      if (currentImageIndex >= newPreviews.length) {
        setCurrentImageIndex(newPreviews.length > 0 ? newPreviews.length - 1 : 0);
      }
      return newPreviews;
    });
  }, [currentImageIndex]);
  
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % hotelImagePreviews.length);
  }, [hotelImagePreviews.length]);
  
  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + hotelImagePreviews.length) % hotelImagePreviews.length);
  }, [hotelImagePreviews.length]);
  // Submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!hotelForm.name || !hotelForm.location) {
      toast.warn('Name and Location are required');
      return;
    }
    
    const payload = {
      name: hotelForm.name.trim(),
      location: hotelForm.location.trim(),
      description: hotelForm.description?.trim() || '',
      rating:
        hotelForm.rating === '' || hotelForm.rating === null
          ? null
          : Number(hotelForm.rating),
      hotelImages: hotelForm.hotelImages || [],
    };
    
    await handleAddHotel(payload);
    
    // Reset form
    setHotelForm({ name: '', location: '', description: '', rating: '', hotelImages: [] });
    setHotelImagePreviews([]);
    setCurrentImageIndex(0);
  }, [hotelForm, handleAddHotel]);
  return (
    <motion.div 
      variants={fadeIn} 
      className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-red-700"
      style={{ backgroundColor: COLORS.tertiary }}
    >
      <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: COLORS.primary }}>
        <FaPlus className="mr-2" /> Add New Hotel
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FaHotel className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Hotel Name"
            value={hotelForm.name}
            onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            required
          />
        </div>
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={hotelForm.location}
            onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            required
          />
        </div>
        <textarea
          placeholder="Description"
          value={hotelForm.description}
          onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent md:col-span-2"
          style={{ backgroundColor: COLORS.light }}
          rows={2}
        />
        <div className="relative">
          <FaStar className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="Rating (0-5)"
            value={hotelForm.rating}
            onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold flex items-center" style={{ color: COLORS.primary }}>
            <FaImage className="mr-2" /> Upload Hotel Images
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleHotelImagesChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              style={{ backgroundColor: COLORS.light }}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold flex items-center" style={{ color: COLORS.primary }}>
            <FaLink className="mr-2" /> Or Add Image URLs (one per line)
          </label>
          <textarea
            value={hotelImageUrls}
            onChange={(e) => setHotelImageUrls(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            rows={3}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleAddImageUrls}
            disabled={processingUrls}
            className="mt-2 px-4 py-2 rounded-lg font-medium shadow-md transition flex items-center"
            style={{ 
              backgroundColor: processingUrls ? '#cccccc' : COLORS.secondary, 
              color: COLORS.dark 
            }}
          >
            {processingUrls ? 'Processing URLs...' : <><FaLink className="mr-2" /> Add URLs</>}
          </motion.button>
        </div>
        
        {hotelImagePreviews.length > 0 && (
          <div className="md:col-span-2 mt-4">
            <label className="block mb-2 font-semibold" style={{ color: COLORS.primary }}>Image Previews</label>
            <div className="relative h-48 overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={hotelImagePreviews[currentImageIndex]}
                  alt={`Hotel Preview ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              </AnimatePresence>
              
              {hotelImagePreviews.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md"
                    onClick={prevImage}
                  >
                    <FaChevronLeft className="text-gray-700" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md"
                    onClick={nextImage}
                  >
                    <FaChevronRight className="text-gray-700" />
                  </motion.button>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                    {hotelImagePreviews.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          currentImageIndex === index ? 'bg-red-700' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {hotelImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border border-gray-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
                    onClick={() => removeHotelImage(index)}
                  >
                    <FaTimes size={12} />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={busy}
          type="submit"
          className="px-6 py-3 rounded-lg font-medium shadow-md transition flex items-center justify-center md:col-span-2"
          style={{ 
            backgroundColor: busy ? '#cccccc' : COLORS.primary, 
            color: COLORS.light 
          }}
        >
          {busy ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving…
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Add Hotel
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
});
const RoomForm = React.memo(({ 
  handleAddOrUpdateRoom, 
  busy, 
  hotels 
}) => {
  // Local state for form fields
  const [roomForm, setRoomForm] = useState({
    hotelId: '',
    roomType: '',
    pricePerNight: '',
    amenities: '',
    availabilityStatus: true,
    roomId: '',
    roomImage: '',
  });
  const [roomImagePreview, setRoomImagePreview] = useState('');
  // Image handler
  const handleRoomImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setRoomForm((prev) => ({ ...prev, roomImage: reader.result }));
      setRoomImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);
  // Submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!roomForm.hotelId || !roomForm.roomType) {
      toast.warn('Hotel ID and Room Type are required');
      return;
    }
    
    const payload = {
      hotelId: Number(roomForm.hotelId),
      roomType: roomForm.roomType.trim(),
      pricePerNight:
        roomForm.pricePerNight === '' || roomForm.pricePerNight === null
          ? null
          : Number(roomForm.pricePerNight),
      amenities: roomForm.amenities?.trim() || '',
      availabilityStatus:
        typeof roomForm.availabilityStatus === 'boolean'
          ? roomForm.availabilityStatus
          : String(roomForm.availabilityStatus) === 'true',
      roomImage: roomForm.roomImage || '',
    };
    
    await handleAddOrUpdateRoom(payload, roomForm.roomId);
    
    // Reset form
    setRoomForm({
      hotelId: '',
      roomType: '',
      pricePerNight: '',
      amenities: '',
      availabilityStatus: true,
      roomId: '',
      roomImage: '',
    });
    setRoomImagePreview('');
  }, [roomForm, handleAddOrUpdateRoom]);
  return (
    <motion.div 
      variants={fadeIn} 
      className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-blue-700"
      style={{ backgroundColor: COLORS.tertiary }}
    >
      <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: COLORS.primary }}>
        <FaPlus className="mr-2" /> Add / Update Room
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Hotel</label>
          <select
            value={roomForm.hotelId}
            onChange={(e) => setRoomForm({ ...roomForm, hotelId: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            required
          >
            <option value="">Select a Hotel</option>
            {hotels.map(hotel => (
              <option key={hotel.hotelId} value={hotel.hotelId}>{hotel.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Room Type</label>
          <input
            type="text"
            placeholder="e.g., Single, Double, Suite"
            value={roomForm.roomType}
            onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Price Per Night ($)</label>
          <input
            type="number"
            placeholder="Price"
            value={roomForm.pricePerNight}
            onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Amenities</label>
          <input
            type="text"
            placeholder="e.g., WiFi, TV, Mini-bar"
            value={roomForm.amenities}
            onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Availability</label>
          <select
            value={String(roomForm.availabilityStatus)}
            onChange={(e) =>
              setRoomForm({ ...roomForm, availabilityStatus: e.target.value === 'true' })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium flex items-center" style={{ color: COLORS.dark }}>
            <FaImage className="mr-2" /> Room Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleRoomImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
          />
          {roomImagePreview && (
            <img src={roomImagePreview} alt="Room Preview" className="mt-2 rounded-lg shadow w-32 h-24 object-cover border border-gray-300" />
          )}
        </div>
        {roomForm.roomId && (
          <div className="text-sm font-medium md:col-span-2 p-2 bg-yellow-100 rounded-lg" style={{ color: COLORS.warning }}>
            Editing Room ID: {roomForm.roomId}
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={busy}
          type="submit"
          className="px-6 py-3 rounded-lg font-medium shadow-md transition flex items-center justify-center md:col-span-2"
          style={{ 
            backgroundColor: busy ? '#cccccc' : COLORS.primary, 
            color: COLORS.light 
          }}
        >
          {busy ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving…
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              {roomForm.roomId ? 'Update Room' : 'Add Room'}
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
});
const UserForm = React.memo(({ 
  handleUpdateUser, 
  busy,
  prePopulatedUser
}) => {
  // Local state for form fields
  const [userForm, setUserForm] = useState({
    userId: '',
    name: '',
    email: '',
    phone: '',
    role: 'USER',
  });
  // Populate form when prePopulatedUser changes
  useEffect(() => {
    if (prePopulatedUser) {
      setUserForm({
        userId: prePopulatedUser.userId || '',
        name: prePopulatedUser.name || '',
        email: prePopulatedUser.email || '',
        phone: prePopulatedUser.phone || '',
        role: prePopulatedUser.role || 'USER',
      });
    }
  }, [prePopulatedUser]);
  
  // Submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!userForm.userId) {
      toast.warn('Pick a user to edit (click Edit on a user card)');
      return;
    }
    
    const payload = {
      name: userForm.name?.trim(),
      email: userForm.email?.trim(),
      phone: userForm.phone?.trim(),
      role: userForm.role,
      password: '',
    };
    
    await handleUpdateUser(Number(userForm.userId), payload);
    
    // Reset form
    setUserForm({ userId: '', name: '', email: '', phone: '', role: 'USER' });
  }, [userForm, handleUpdateUser]);
  return (
    <motion.div 
      variants={fadeIn} 
      className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-green-700"
      style={{ backgroundColor: COLORS.tertiary }}
    >
      <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: COLORS.primary }}>
        <FaEdit className="mr-2" /> Update User
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>User ID</label>
          <input
            type="number"
            placeholder="User ID"
            value={userForm.userId}
            onChange={(e) => setUserForm({ ...userForm, userId: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Name</label>
          <input
            type="text"
            placeholder="Name"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Phone</label>
          <input
            type="text"
            placeholder="Phone"
            value={userForm.phone}
            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" style={{ color: COLORS.dark }}>Role</label>
          <select
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            style={{ backgroundColor: COLORS.light }}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={busy}
          type="submit"
          className="px-6 py-3 rounded-lg font-medium shadow-md transition flex items-center justify-center"
          style={{ 
            backgroundColor: busy ? '#cccccc' : COLORS.primary, 
            color: COLORS.light 
          }}
        >
          {busy ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving…
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Update User
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
});
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState({});
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
  
  // ---------- helpers ----------
  const loadHotelsUsersBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hotelData, userData, bookingData] = await Promise.all([
        searchHotels(''),
        getUsers(),
        getAllBookings(),
      ]);
      setHotels(hotelData || []);
      setUsers(userData || []);
      setBookings(bookingData || []);
      
      const roomsData = await Promise.all(
        (hotelData || []).map((h) => getRooms(h.hotelId))
      );
      const roomsByHotel = (hotelData || []).reduce((acc, h, i) => {
        acc[h.hotelId] = roomsData[i] || [];
        return acc;
      }, {});
      setRooms(roomsByHotel);
    } catch (e) {
      console.error(e);
      setError('Failed to load data');
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const refreshRoomsForHotel = useCallback(async (hotelId) => {
    try {
      const list = await getRooms(hotelId);
      setRooms((prev) => ({ ...prev, [hotelId]: list || [] }));
    } catch (e) {
      console.error(e);
      toast.error('Failed to refresh rooms');
    }
  }, []);
  
  useEffect(() => {
    loadHotelsUsersBookings();
  }, [loadHotelsUsersBookings]);
  
  // ---------- handlers: HOTELS ----------
  const handleAddHotel = useCallback(async (payload) => {
    setBusy(true);
    try {
      console.log('Adding hotel with payload:', payload);
      const created = await addHotel(payload);
      toast.success(`Hotel "${created.name}" added`);
      await loadHotelsUsersBookings();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || 'Failed to add hotel');
    } finally {
      setBusy(false);
    }
  }, [loadHotelsUsersBookings]);
  
  const handleDeleteHotel = useCallback(async (hotelId) => {
    if (!window.confirm('Delete this hotel?')) return;
    setBusy(true);
    try {
      await deleteHotel(hotelId);
      toast.success('Hotel deleted');
      setHotels((prev) => prev.filter((h) => h.hotelId !== hotelId));
      setRooms((prev) => {
        const { [hotelId]: _omit, ...rest } = prev;
        return rest;
      });
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || 'Failed to delete hotel');
    } finally {
      setBusy(false);
    }
  }, []);
  
  // ---------- handlers: ROOMS ----------
  const handleAddOrUpdateRoom = useCallback(async (payload, roomId) => {
    setBusy(true);
    try {
      if (roomId) {
        await updateRoom(Number(roomId), payload);
        toast.success('Room updated');
      } else {
        await addRoom(payload);
        toast.success('Room added');
      }
      const hid = Number(payload.hotelId);
      await refreshRoomsForHotel(hid);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || 'Failed to save room');
    } finally {
      setBusy(false);
    }
  }, [refreshRoomsForHotel]);
  
  const handleDeleteRoom = useCallback(async (roomId, hotelId) => {
    if (!window.confirm('Delete this room?')) return;
    setBusy(true);
    try {
      await apiDeleteRoom(roomId);
      toast.success('Room deleted');
      setRooms((prev) => ({
        ...prev,
        [hotelId]: (prev[hotelId] || []).filter((r) => r.roomId !== roomId),
      }));
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || 'Failed to delete room');
    } finally {
      setBusy(false);
    }
  }, []);
  
  // ---------- handlers: USERS ----------
  const handleUpdateUser = useCallback(async (userId, payload) => {
    setBusy(true);
    try {
      const updated = await updateUser(userId, payload);
      toast.success(`User "${updated.name}" updated`);
      setUsers((prev) =>
        prev.map((u) => (u.userId === updated.userId ? updated : u))
      );
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || 'Failed to update user');
    } finally {
      setBusy(false);
    }
  }, []);
  
  const handleDeleteUser = useCallback(async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    setBusy(true);
    try {
      await apiDeleteUser(userId);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || 'Failed to delete user');
    } finally {
      setBusy(false);
    }
  }, []);
  
  const handlePopulateUser = useCallback((user) => {
    // This will be handled by the UserForm component
    // We'll use a key to force re-render the form with new data
    setUserFormKey(prev => prev + 1);
    setPrePopulatedUser(user);
  }, []);
  
  // State for pre-populating user form
  const [userFormKey, setUserFormKey] = useState(0);
  const [prePopulatedUser, setPrePopulatedUser] = useState(null);
  
  // ---------- UI Components ----------
  const Navbar = () => (
    <motion.nav 
      className="shadow-lg transition-all duration-300"
      style={{ backgroundColor: COLORS.primary, color: COLORS.light }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        left: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="text-xl font-bold flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaHotel className="mr-2" style={{ color: COLORS.secondary }} />
            Hotel Admin
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-1 md:space-x-4">
              {[
                { id: 'dashboard', icon: <FaChartBar className="mr-1" />, label: 'Dashboard' },
                { id: 'hotels', icon: <FaHotel className="mr-1" />, label: 'Hotels' },
                { id: 'rooms', icon: <FaBed className="mr-1" />, label: 'Rooms' },
                { id: 'users', icon: <FaUsers className="mr-1" />, label: 'Users' },
                { id: 'bookings', icon: <FaCalendarAlt className="mr-1" />, label: 'Bookings' },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  variants={navbarItem}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className={`px-3 py-2 rounded-lg flex items-center text-sm md:text-base ${
                    activeSection === item.id 
                      ? 'bg-white bg-opacity-20' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}
            </div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs opacity-80">admin@hotel.com</div>
              </div>
              <div className="rounded-full p-1" style={{ backgroundColor: COLORS.secondary }}>
                <FaUserCircle size={24} style={{ color: COLORS.primary }} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
  
  const DashboardSection = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold flex items-center" style={{ color: COLORS.primary }}>
          <FaChartBar className="mr-3" />
          Dashboard Overview
        </h2>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          { 
            title: 'Total Hotels', 
            value: hotels.length, 
            icon: <FaHotel className="text-red-600" />, 
            color: 'bg-gradient-to-r from-red-600 to-red-700',
            change: '+12%',
            changeColor: 'text-green-600'
          },
          { 
            title: 'Total Rooms', 
            value: Object.values(rooms).reduce((acc, hotelRooms) => acc + hotelRooms.length, 0), 
            icon: <FaBed className="text-blue-600" />, 
            color: 'bg-gradient-to-r from-blue-600 to-blue-700',
            change: '+8%',
            changeColor: 'text-green-600'
          },
          { 
            title: 'Total Users', 
            value: users.length, 
            icon: <FaUsers className="text-green-600" />, 
            color: 'bg-gradient-to-r from-green-600 to-green-700',
            change: '+15%',
            changeColor: 'text-green-600'
          },
          { 
            title: 'Total Bookings', 
            value: bookings.length, 
            icon: <FaCalendarAlt className="text-purple-600" />, 
            color: 'bg-gradient-to-r from-purple-600 to-purple-700',
            change: '+22%',
            changeColor: 'text-green-600'
          },
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className={`${stat.color} rounded-xl shadow-xl p-6 text-white overflow-hidden`}
            variants={cardHover}
            whileHover="hover"
            animate={floatingAnimation}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white text-opacity-90">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.changeColor}`}>{stat.change} from last month</p>
              </div>
              <div className="text-4xl opacity-60">{stat.icon}</div>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-8 -mb-8"></div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        variants={fadeIn}
        className="rounded-xl shadow-lg p-6 border border-red-200 mb-8"
        style={{ backgroundColor: COLORS.tertiary }}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: COLORS.primary }}>
          <FaCalendarAlt className="mr-2" />
          Recent Bookings
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.bookingId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.bookingId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.room?.hotel?.name || booking.hotelName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user?.name || booking.userName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.checkInDate} to {booking.checkOutDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.totalPrice || booking.price || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
  
  const HotelsSection = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold flex items-center" style={{ color: COLORS.primary }}>
          <FaHotel className="mr-3" />
          Hotel Management
        </h2>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 rounded-lg shadow-md transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.light }}
          >
            <FaPlus className="mr-2" />
            Add Hotel
          </motion.button>
        </div>
      </div>
      
      <HotelForm 
        handleAddHotel={handleAddHotel}
        busy={busy}
      />
      
      <motion.div variants={fadeIn} className="mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Hotel List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <motion.div
              key={hotel.hotelId}
              className="rounded-xl shadow-lg overflow-hidden"
              style={{ backgroundColor: COLORS.tertiary, borderLeft: `4px solid ${COLORS.primary}` }}
              whileHover="hover"
              variants={cardHover}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold flex items-center" style={{ color: COLORS.primary }}>
                      <FaHotel className="mr-2" />
                      {hotel.name}
                    </h4>
                    <p className="mt-1 flex items-center" style={{ color: COLORS.dark }}>
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      {hotel.location}
                    </p>
                    <div className="flex items-center mt-1" style={{ color: COLORS.dark }}>
                      <FaStar className="mr-1 text-yellow-500" />
                      <span>{hotel.rating ?? 'N/A'}</span>
                    </div>
                    
                    {hotel.hotelImages && hotel.hotelImages.length > 0 && (
                      <div className="mt-3 relative h-40 overflow-hidden rounded-lg">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={0}
                            src={hotel.hotelImages[0]}
                            alt={`Hotel ${hotel.name}`}
                            className="w-full h-full object-cover"
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          />
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteHotel(hotel.hotelId)}
                    className="p-2 rounded-lg shadow-md transition"
                    style={{ backgroundColor: COLORS.danger, color: COLORS.light }}
                  >
                    <FaTrash />
                  </motion.button>
                </div>
                
                <div className="mt-4">
                  <h5 className="text-md font-semibold flex items-center" style={{ color: COLORS.primary }}>
                    <FaBed className="mr-2" />
                    Rooms ({(rooms[hotel.hotelId] || []).length})
                  </h5>
                  <div className="mt-2 space-y-3">
                    {(rooms[hotel.hotelId] || []).map((room) => (
                      <div key={room.roomId} className="border-t border-gray-200 pt-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium" style={{ color: COLORS.dark }}>Type: {room.roomType}</p>
                          <p className="text-gray-600">Price: ${room.pricePerNight}/night</p>
                          <p className="text-gray-600">Available: {room.availabilityStatus ? 'Yes' : 'No'}</p>
                          {room.roomImage && (
                            <img src={room.roomImage} alt="Room" className="mt-2 rounded-lg shadow w-32 h-24 object-cover border border-gray-300" />
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              // This will be handled by the RoomForm component
                              setRoomFormKey(prev => prev + 1);
                              setPrePopulatedRoom({ ...room, hotelId: hotel.hotelId });
                            }}
                            className="p-2 rounded-lg shadow-md transition"
                            style={{ backgroundColor: COLORS.warning, color: COLORS.light }}
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteRoom(room.roomId, hotel.hotelId)}
                            className="p-2 rounded-lg shadow-md transition"
                            style={{ backgroundColor: COLORS.danger, color: COLORS.light }}
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
  
  const RoomsSection = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold flex items-center" style={{ color: COLORS.primary }}>
          <FaBed className="mr-3" />
          Room Management
        </h2>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 rounded-lg shadow-md transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.light }}
          >
            <FaPlus className="mr-2" />
            Add Room
          </motion.button>
        </div>
      </div>
      
      <RoomForm 
        handleAddOrUpdateRoom={handleAddOrUpdateRoom}
        busy={busy}
        hotels={hotels}
      />
      
      <motion.div variants={fadeIn} className="mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>All Rooms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(rooms).flatMap(([hotelId, hotelRooms]) => 
            hotelRooms.map(room => {
              const hotel = hotels.find(h => h.hotelId === parseInt(hotelId));
              return (
                <motion.div
                  key={room.roomId}
                  className="rounded-xl shadow-lg overflow-hidden"
                  style={{ backgroundColor: COLORS.tertiary, borderLeft: `4px solid ${COLORS.primary}` }}
                  whileHover="hover"
                  variants={cardHover}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold flex items-center" style={{ color: COLORS.primary }}>
                          <FaBed className="mr-2" />
                          {room.roomType}
                        </h4>
                        <p className="mt-1" style={{ color: COLORS.dark }}>Hotel: {hotel?.name || 'Unknown'}</p>
                        <p className="text-gray-700">Price: ${room.pricePerNight}/night</p>
                        <p className="text-gray-700">Available: {room.availabilityStatus ? 'Yes' : 'No'}</p>
                        {room.roomImage && (
                          <img src={room.roomImage} alt="Room" className="mt-3 rounded-lg shadow w-full h-40 object-cover border border-gray-300" />
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            // This will be handled by the RoomForm component
                            setRoomFormKey(prev => prev + 1);
                            setPrePopulatedRoom({ ...room, hotelId: hotelId });
                          }}
                          className="p-2 rounded-lg shadow-md transition"
                          style={{ backgroundColor: COLORS.warning, color: COLORS.light }}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteRoom(room.roomId, hotelId)}
                          className="p-2 rounded-lg shadow-md transition"
                          style={{ backgroundColor: COLORS.danger, color: COLORS.light }}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
  
  const UsersSection = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold flex items-center" style={{ color: COLORS.primary }}>
          <FaUsers className="mr-3" />
          User Management
        </h2>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 rounded-lg shadow-md transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.light }}
          >
            <FaPlus className="mr-2" />
            Add User
          </motion.button>
        </div>
      </div>
      
      <UserForm 
        key={userFormKey}
        handleUpdateUser={handleUpdateUser}
        busy={busy}
        prePopulatedUser={prePopulatedUser}
      />
      
      <motion.div variants={fadeIn} className="mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>User List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <motion.div
              key={user.userId}
              className="rounded-xl shadow-lg overflow-hidden"
              style={{ backgroundColor: COLORS.tertiary, borderLeft: `4px solid ${COLORS.primary}` }}
              whileHover="hover"
              variants={cardHover}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold flex items-center" style={{ color: COLORS.primary }}>
                      <FaUsers className="mr-2" />
                      {user.name}
                    </h4>
                    <p className="mt-1" style={{ color: COLORS.dark }}>Email: {user.email}</p>
                    <p className="text-gray-700">Role: {user.role}</p>
                    {user.phone && <p className="text-gray-700">Phone: {user.phone}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePopulateUser(user)}
                      className="p-2 rounded-lg shadow-md transition"
                      style={{ backgroundColor: COLORS.warning, color: COLORS.light }}
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteUser(user.userId)}
                      className="p-2 rounded-lg shadow-md transition"
                      style={{ backgroundColor: COLORS.danger, color: COLORS.light }}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
  
  const BookingsSection = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold flex items-center" style={{ color: COLORS.primary }}>
          <FaCalendarAlt className="mr-3" />
          Booking Management
        </h2>
      </div>
      
      <motion.div variants={fadeIn} className="mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>All Bookings</h3>
        {bookings.length === 0 ? (
          <motion.div 
            className="rounded-xl shadow-lg p-8 text-center"
            style={{ backgroundColor: COLORS.tertiary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={floatingAnimation}
              className="flex justify-center mb-4"
            >
              <FaCalendarAlt className="text-gray-400 text-5xl" />
            </motion.div>
            <p className="text-gray-600 text-lg">No bookings found.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <motion.div
                key={booking.bookingId}
                className="rounded-xl shadow-lg overflow-hidden"
                style={{ backgroundColor: COLORS.tertiary, borderLeft: `4px solid ${COLORS.primary}` }}
                whileHover="hover"
                variants={cardHover}
              >
                <div className="p-5">
                  <h4 className="text-lg font-bold flex items-center" style={{ color: COLORS.primary }}>
                    <FaCalendarAlt className="mr-2" />
                    Booking #{booking.bookingId}
                  </h4>
                  <p className="mt-2" style={{ color: COLORS.dark }}>Hotel: {booking.room?.hotel?.name || booking.hotelName || 'N/A'}</p>
                  <p className="text-gray-700">Room: {booking.room?.roomType || booking.roomType || 'N/A'}</p>
                  <p className="text-gray-700">
                    User: {booking.user?.name || booking.userName || 'N/A'} ({booking.user?.email || booking.userEmail || 'N/A'})
                  </p>
                  <p className="text-gray-700">Check-in: {booking.checkInDate}</p>
                  <p className="text-gray-700">Check-out: {booking.checkOutDate}</p>
                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
  
  // State for pre-populating room form
  const [roomFormKey, setRoomFormKey] = useState(0);
  const [prePopulatedRoom, setPrePopulatedRoom] = useState(null);
  
  // ---------- Main Render ----------
  if (loading) return <Loader />;
  return (
    <div 
      className="min-h-screen transition-all duration-300" 
      style={{ 
        backgroundColor: COLORS.light,
        marginLeft: sidebarOpen ? '16rem' : '0', 
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%' 
      }}
    >
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <motion.div 
            className="p-4 mb-6 rounded-lg"
            style={{ backgroundColor: '#FFF2F0', borderLeft: `4px solid ${COLORS.danger}`, color: COLORS.danger }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{error}</p>
          </motion.div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'hotels' && <HotelsSection />}
            {activeSection === 'rooms' && <RoomsSection />}
            {activeSection === 'users' && <UsersSection />}
            {activeSection === 'bookings' && <BookingsSection />}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {busy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="p-6 rounded-lg shadow-xl flex items-center"
            style={{ backgroundColor: COLORS.light }}
            animate={pulseAnimation}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mr-3" style={{ borderColor: COLORS.primary }}></div>
            <span className="text-lg font-medium" style={{ color: COLORS.dark }}>Processing...</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;