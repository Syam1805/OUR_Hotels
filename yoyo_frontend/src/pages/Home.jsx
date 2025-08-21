import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaHotel, FaSearch, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, 
  FaCalendarCheck, FaThumbsUp, FaGlobe, FaHeadset, FaEnvelope, 
  FaChevronRight, FaUmbrellaBeach, FaCity, FaMountain, FaPlane, 
  FaSwimmingPool, FaWifi, FaCar, FaUtensils, FaSpa, FaDumbbell,
  FaArrowUp, FaFire, FaMedal, FaCrown, FaGem, FaRegStar, FaRegHeart,
  FaShower, FaParking, FaConciergeBell, FaUtensilSpoon, FaSnowflake,
  FaHotTub, FaCocktail, FaDumbbell as FaGym, FaWifi as FaInternet
} from 'react-icons/fa';
import { TextField, Button, Box, Typography, Card, CardContent, CardMedia, Chip, Badge } from '@mui/material';
import WeatherWidget from '../components/WeatherWidget';
import RecommendationCarousel from '../components/RecommendationCarousel';
import { useTheme } from '@mui/material/styles';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 120,
      damping: 15
    } 
  },
  hover: { 
    scale: 1.08,
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const searchVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300,
      damping: 20
    } 
  },
  hover: { 
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    transition: { duration: 0.3 }
  }
};

const offerCardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 100,
      damping: 15
    } 
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    transition: { duration: 0.3 }
  }
};

const destinationCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100,
      damping: 15
    } 
  },
  hover: { 
    scale: 1.06,
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    transition: { duration: 0.3 }
  }
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse"
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    } 
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

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-200 opacity-20"
          style={{
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -Math.random() * 100 - 50, 0],
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Scroll progress bar component
const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollY / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 z-50"
      style={{ width: `${scrollProgress}%` }}
      initial={{ width: 0 }}
    />
  );
};

// Back to top button component
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <motion.button
      className={`fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg z-40 ${
        isVisible ? 'block' : 'hidden'
      }`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
      <FaArrowUp />
    </motion.button>
  );
};

// Hotel amenity component
const HotelAmenity = ({ icon, name }) => (
  <motion.div 
    className="flex items-center space-x-2 text-sm"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    <span className="text-blue-600">{icon}</span>
    <span className="text-gray-700">{name}</span>
  </motion.div>
);

// Rating component
const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < fullStars ? <FaStar /> : hasHalfStar && i === fullStars ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
        </span>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

// Price tag component
const PriceTag = ({ price, discount }) => (
  <div className="flex items-center space-x-2">
    <span className="text-lg font-bold text-blue-700">₹{price}</span>
    {discount > 0 && (
      <>
        <span className="text-sm text-gray-500 line-through">₹{Math.round(price / (1 - discount / 100))}</span>
        <Chip 
          label={`${discount}% OFF`} 
          size="small" 
          className="bg-red-100 text-red-700 font-bold"
        />
      </>
    )}
  </div>
);

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const searchFormRef = useRef(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [email, setEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hotels');
  
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
  
  const handleSearchHotels = () => {
    if (searchLocation.trim()) {
      navigate(`/hotels?location=${encodeURIComponent(searchLocation)}`);
    }
  };
  
  const handleTopHotelsClick = () => {
    navigate('/hotels?sortBy=rating');
  };
  
  const handleEasySearchClick = () => {
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleBestExperienceClick = () => {
    navigate('/hotels?sortBy=rating');
  };
  
  const handleExploreClick = () => {
    navigate('/hotels');
  };
  
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail('');
  };
  
  const whyChooseUs = [
    {
      icon: <FaCalendarCheck size={40} />,
      title: "Book Now, Pay Later",
      description: "FREE cancellation on most rooms"
    },
    {
      icon: <FaThumbsUp size={40} />,
      title: "Trusted Reviews",
      description: "300M+ reviews from fellow travellers"
    },
    {
      icon: <FaGlobe size={40} />,
      title: "Worldwide Properties",
      description: "2+ million properties worldwide"
    },
    {
      icon: <FaHeadset size={40} />,
      title: "24/7 Support",
      description: "Trusted customer service you can rely on"
    }
  ];
  
  const specialOffers = [
    {
      title: "Luxury Escapes",
      description: "Save up to 30% on premium stays",
      subDescription: "Exclusive deals on 5-star hotels and resorts",
      buttonText: "Book Luxury",
      imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      discount: 30
    },
    {
      title: "Weekend Getaways",
      description: "Short breaks, big savings",
      subDescription: "Perfect for spontaneous trips",
      buttonText: "Explore Deals",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      discount: 25
    }
  ];
  
  const trendingDestinations = [
    {
      name: "New Delhi",
      country: "India",
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: <FaCity size={24} />,
      popularity: 95,
      hotelCount: 1200,
      attractionCount: 85,
      description: "Experience the rich history and vibrant culture of India's capital.",
      price: 3500,
      rating: 4.5
    },
    {
      name: "Bengaluru",
      country: "India",
      imageUrl: "https://images.unsplash.com/photo-1596495578068-14e119d28933?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: <FaCity size={24} />,
      popularity: 92,
      hotelCount: 950,
      attractionCount: 65,
      description: "Explore the Silicon Valley of India with its pleasant climate and gardens.",
      price: 4200,
      rating: 4.3
    },
    {
      name: "Mumbai",
      country: "India",
      imageUrl: "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: <FaCity size={24} />,
      popularity: 98,
      hotelCount: 1500,
      attractionCount: 120,
      description: "Discover the city of dreams with Bollywood and bustling markets.",
      price: 5500,
      rating: 4.7
    },
    {
      name: "Chennai",
      country: "India",
      imageUrl: "https://images.unsplash.com/photo-1596422938231-0f89c7f8c5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: <FaUmbrellaBeach size={24} />,
      popularity: 85,
      hotelCount: 800,
      attractionCount: 70,
      description: "Enjoy the blend of tradition and modernity in this coastal city.",
      price: 3800,
      rating: 4.2
    },
    {
      name: "Varanasi",
      country: "India",
      imageUrl: "https://images.unsplash.com/photo-1596495577886-d3a2a9f0c16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: <FaMountain size={24} />,
      popularity: 88,
      hotelCount: 600,
      attractionCount: 95,
      description: "Immerse yourself in the spiritual heart of India on the banks of Ganges.",
      price: 2800,
      rating: 4.4
    }
  ];
  
  const luxuryFeatures = [
    { icon: <FaSwimmingPool size={24} />, name: "Infinity Pools" },
    { icon: <FaWifi size={24} />, name: "High-Speed WiFi" },
    { icon: <FaCar size={24} />, name: "Valet Parking" },
    { icon: <FaUtensils size={24} />, name: "Fine Dining" },
    { icon: <FaSpa size={24} />, name: "Luxury Spa" },
    { icon: <FaDumbbell size={24} />, name: "Fitness Center" }
  ];
  
  const hotelAmenities = [
    { icon: <FaSnowflake />, name: "AC" },
    { icon: <FaShower />, name: "Hot Water" },
    { icon: <FaParking />, name: "Parking" },
    { icon: <FaConciergeBell />, name: "Room Service" },
    { icon: <FaUtensilSpoon />, name: "Restaurant" },
    { icon: <FaHotTub />, name: "Bathtub" },
    { icon: <FaCocktail />, name: "Mini Bar" },
    { icon: <FaGym />, name: "Gym" },
    { icon: <FaInternet />, name: "WiFi" }
  ];
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen font-sans transition-all duration-300 relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #e0f7fa 100%)',
        marginLeft: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%',
        transition: 'margin-left 0.3s ease, width 0.3s ease' // Added transition for smooth sidebar toggle
      }}
    >
      <ScrollProgressBar />
      <BackToTopButton />
      <FloatingParticles />
      
      {/* Hero Section with Parallax */}
      <Box
        className="py-16 md:py-24 px-4 text-center relative overflow-hidden min-h-screen flex flex-col justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
        }}
      >
        {/* Animated overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(224,247,250,0.7) 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 text-blue-500 opacity-30"
          animate={floatingAnimation}
        >
          <FaPlane size={40} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-blue-500 opacity-30"
          animate={floatingAnimation}
          style={{ transitionDelay: '0.5s' }}
        >
          <FaHotel size={40} />
        </motion.div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            style={{
              background: 'linear-gradient(45deg, #0277bd, #01579b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            Welcome to YoYo Hotels
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
            style={{ color: '#01579b' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Discover and book the finest hotels for your dream vacation.
          </motion.p>
          
          {/* Tab navigation */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex bg-white bg-opacity-70 backdrop-blur-sm rounded-full p-1">
              {['hotels', 'flights', 'cars', 'experiences'].map((tab) => (
                <motion.button
                  key={tab}
                  className={`px-6 py-2 rounded-full capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-blue-800'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Transparent search form */}
          <motion.div
            ref={searchFormRef}
            className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 max-w-5xl mx-auto mb-16"
            style={{ boxShadow: '0 0 30px rgba(2, 119, 189, 0.3)' }}
            variants={searchVariants}
            whileHover="hover"
            animate={floatingAnimation}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-blue-500" />
                <TextField
                  label="Destination"
                  variant="outlined"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  InputProps={{
                    style: { color: '#01579b', paddingLeft: '2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.7)' },
                    className: 'rounded-lg',
                  }}
                  InputLabelProps={{ style: { color: '#0277bd' } }}
                  className="w-full"
                  size="small"
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3.5 text-blue-500" />
                <TextField
                  label="Check-in"
                  type="date"
                  variant="outlined"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  InputProps={{
                    style: { color: '#01579b', paddingLeft: '2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.7)' },
                    className: 'rounded-lg',
                  }}
                  InputLabelProps={{ style: { color: '#0277bd' } }}
                  className="w-full"
                  size="small"
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3.5 text-blue-500" />
                <TextField
                  label="Check-out"
                  type="date"
                  variant="outlined"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  InputProps={{
                    style: { color: '#01579b', paddingLeft: '2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.7)' },
                    className: 'rounded-lg',
                  }}
                  InputLabelProps={{ style: { color: '#0277bd' } }}
                  className="w-full"
                  size="small"
                />
              </div>
              <div className="relative">
                <FaUsers className="absolute left-3 top-3.5 text-blue-500" />
                <TextField
                  label="Guests"
                  type="number"
                  variant="outlined"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  InputProps={{
                    style: { color: '#01579b', paddingLeft: '2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.7)' },
                    className: 'rounded-lg',
                  }}
                  InputLabelProps={{ style: { color: '#0277bd' } }}
                  className="w-full"
                  size="small"
                />
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
              <Button
                variant="contained"
                startIcon={<FaSearch />}
                onClick={handleSearchHotels}
                style={{
                  background: 'linear-gradient(45deg, #0277bd, #01579b)',
                  padding: '12px 32px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(2, 119, 189, 0.4)',
                }}
                sx={{
                  '&:hover': {
                    background: 'linear-gradient(45deg, #01579b, #0277bd)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Search Hotels
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Luxury features badges */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {luxuryFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-white bg-opacity-70 backdrop-blur-sm rounded-full px-4 py-2"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <span className="text-blue-600 mr-2">{feature.icon}</span>
                <span className="text-blue-800 font-medium">{feature.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Box>
      
      {/* Why Choose Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 px-4 relative overflow-hidden"
        style={{ backgroundColor: 'rgba(224, 247, 250, 0.5)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-50 opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-100 opacity-30"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Typography
            variant="h3"
            component="h2"
            className="text-center font-bold mb-4"
            style={{
              background: 'linear-gradient(45deg, #0277bd, #01579b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}
          >
            Why Choose YoYo Hotels?
          </Typography>
          <Typography variant="h6" className="text-center mb-12" style={{ color: '#0277bd', fontSize: '1.2rem' }}>
            Experience the difference with our premium services
          </Typography>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                whileHover="hover"
                className="cursor-pointer"
              >
                <Card
                  className="h-full rounded-xl overflow-hidden border border-blue-100"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    boxShadow: '0 4px 20px rgba(2, 119, 189, 0.15)',
                  }}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.3 }}
                      transition={{ duration: 0.5 }}
                      className="mb-4 p-4 rounded-full bg-blue-50"
                    >
                      <div style={{ color: '#0277bd' }}>
                        {item.icon}
                      </div>
                    </motion.div>
                    <Typography variant="h6" component="h3" className="font-bold mb-2" style={{ color: '#01579b' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Special Offers Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 px-4 relative overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-yellow-50 opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Typography
                variant="h3"
                component="h2"
                className="font-bold mb-2"
                style={{
                  background: 'linear-gradient(45deg, #0277bd, #01579b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}
              >
                Special Offers
              </Typography>
              <Typography variant="h6" style={{ color: '#0277bd', fontSize: '1.2rem' }}>
                Exclusive deals just for you
              </Typography>
            </div>
            <motion.div
              animate={pulseAnimation}
              className="hidden md:flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full"
            >
              <FaFire className="mr-2" />
              <span className="font-bold">Limited Time</span>
            </motion.div>
          </div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {specialOffers.map((offer, index) => (
              <motion.div
                key={index}
                variants={offerCardVariants}
                whileHover="hover"
                className="cursor-pointer"
              >
                <Card
                  className="h-full rounded-xl overflow-hidden border border-blue-100"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    boxShadow: '0 4px 20px rgba(2, 119, 189, 0.15)',
                  }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5">
                      <CardMedia
                        component="div"
                        style={{
                          height: '250px',
                          backgroundImage: `url(${offer.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                    <div className="md:w-3/5 p-6 flex flex-col justify-center">
                      <div className="flex items-center mb-4">
                        <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full mr-2">
                          SAVE UP TO {offer.discount}%
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                          EXCLUSIVE
                        </div>
                      </div>
                      <Typography variant="h5" component="h3" className="font-bold mb-2" style={{ color: '#01579b' }}>
                        {offer.title}
                      </Typography>
                      <Typography variant="h6" className="mb-3" style={{ color: '#0277bd' }}>
                        {offer.description}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-6">
                        {offer.subDescription}
                      </Typography>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
                        <Button
                          variant="contained"
                          endIcon={<FaChevronRight />}
                          style={{
                            background: 'linear-gradient(45deg, #0277bd, #01579b)',
                            padding: '10px 24px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '8px',
                            boxShadow: '0 4px 14px rgba(2, 119, 189, 0.4)',
                          }}
                          sx={{
                            '&:hover': {
                              background: 'linear-gradient(45deg, #01579b, #0277bd)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          {offer.buttonText}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 px-4 relative overflow-hidden"
        style={{ backgroundColor: 'rgba(224, 247, 250, 0.5)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100 opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-200 opacity-20"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Typography
            variant="h3"
            component="h2"
            className="text-center font-bold mb-4"
            style={{
              background: 'linear-gradient(45deg, #0277bd, #01579b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}
          >
            Our Features
          </Typography>
          <Typography variant="h6" className="text-center mb-12" style={{ color: '#0277bd', fontSize: '1.2rem' }}>
            Everything you need for a perfect stay
          </Typography>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={featureCardVariants} whileHover="hover" onClick={handleTopHotelsClick} className="cursor-pointer">
              <Card
                className="h-full rounded-xl overflow-hidden border border-blue-100"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  boxShadow: '0 4px 20px rgba(2, 119, 189, 0.15)',
                }}
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.2 }} 
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mb-4 p-4 rounded-full bg-blue-50"
                  >
                    <FaHotel size={40} style={{ color: '#0277bd' }} />
                  </motion.div>
                  <Typography variant="h5" component="h3" className="font-bold mb-3" style={{ color: '#01579b' }}>
                    Top Hotels
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4">
                    Browse our curated list of top-rated hotels with exclusive amenities.
                  </Typography>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Explore</span>
                    <FaChevronRight className="ml-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={featureCardVariants} whileHover="hover" onClick={handleEasySearchClick} className="cursor-pointer">
              <Card
                className="h-full rounded-xl overflow-hidden border border-blue-100"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  boxShadow: '0 4px 20px rgba(2, 119, 189, 0.15)',
                }}
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.2 }} 
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mb-4 p-4 rounded-full bg-blue-50"
                  >
                    <FaSearch size={40} style={{ color: '#0277bd' }} />
                  </motion.div>
                  <Typography variant="h5" component="h3" className="font-bold mb-3" style={{ color: '#01579b' }}>
                    Easy Search
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4">
                    Find hotels by location, price, room type, and guest preferences.
                  </Typography>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Search</span>
                    <FaChevronRight className="ml-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={featureCardVariants} whileHover="hover" onClick={handleBestExperienceClick} className="cursor-pointer">
              <Card
                className="h-full rounded-xl overflow-hidden border border-blue-100"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  boxShadow: '0 4px 20px rgba(2, 119, 189, 0.15)',
                }}
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.2 }} 
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mb-4 p-4 rounded-full bg-blue-50"
                  >
                    <FaStar size={40} style={{ color: '#0277bd' }} />
                  </motion.div>
                  <Typography variant="h5" component="h3" className="font-bold mb-3" style={{ color: '#01579b' }}>
                    Best Experience
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4">
                    Enjoy a seamless booking experience and exceptional stays.
                  </Typography>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Experience</span>
                    <FaChevronRight className="ml-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Trending Destinations Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 px-4 relative overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-50 opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-100 opacity-30"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Typography
              variant="h3"
              component="h2"
              className="text-center font-bold mb-3"
              style={{
                background: 'linear-gradient(45deg, #0277bd, #01579b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.5rem'
              }}
            >
              Trending Destinations
            </Typography>
            <Typography variant="h6" className="text-center mb-6" style={{ color: '#0277bd', fontSize: '1.2rem' }}>
              Most popular choices for travellers from India
            </Typography>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </motion.div>
          
          {/* Destinations Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {trendingDestinations.map((destination, index) => (
              <motion.div
                key={index}
                variants={destinationCardVariants}
                whileHover="hover"
                className="cursor-pointer relative overflow-hidden rounded-2xl shadow-lg group"
                onClick={() => navigate(`/hotels?location=${encodeURIComponent(destination.name)}`)}
                style={{ height: '300px' }}
              >
                {/* Background Image with Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${destination.imageUrl})`,
                    filter: 'brightness(0.7)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                  {/* Top Content */}
                  <div className="flex justify-between items-start">
                    <div className="bg-black/30 backdrop-blur-sm rounded-full p-2">
                      {destination.icon}
                    </div>
                    <motion.div 
                      className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {destination.popularity}% Popular
                    </motion.div>
                  </div>
                  
                  {/* Bottom Content */}
                  <div className="space-y-2">
                    <Typography variant="h6" component="h3" className="font-bold text-xl drop-shadow-lg">
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" className="text-blue-100">
                      {destination.country}
                    </Typography>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm mt-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        {destination.hotelCount}+ Hotels
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {destination.attractionCount}+ Attractions
                      </div>
                    </div>
                    
                    {/* Price and Rating */}
                    <div className="flex justify-between items-center mt-2">
                      <PriceTag price={destination.price} discount={15} />
                      <Rating rating={destination.rating} />
                    </div>
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-700/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-5 text-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" className="font-bold text-xl mb-2">
                    Explore {destination.name}
                  </Typography>
                  <Typography variant="body2" className="mb-4 text-blue-100">
                    {destination.description}
                  </Typography>
                  <motion.button
                    className="bg-white text-blue-700 font-bold px-4 py-2 rounded-full text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Hotels
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* View All Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/destinations')}
            >
              View All Destinations
            </motion.button>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </motion.section>
      
      {/* Hotel Amenities Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 px-4 relative overflow-hidden"
        style={{ backgroundColor: 'rgba(224, 247, 250, 0.5)' }}
      >
        <div className="max-w-6xl mx-auto">
          <Typography
            variant="h3"
            component="h2"
            className="text-center font-bold mb-4"
            style={{
              background: 'linear-gradient(45deg, #0277bd, #01579b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}
          >
            Hotel Amenities
          </Typography>
          <Typography variant="h6" className="text-center mb-12" style={{ color: '#0277bd', fontSize: '1.2rem' }}>
            Premium facilities for a comfortable stay
          </Typography>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
          >
            {hotelAmenities.map((amenity, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                whileHover="hover"
                className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-md"
              >
                <div className="text-blue-600 mb-2">{amenity.icon}</div>
                <Typography variant="body2" className="text-gray-700 font-medium">
                  {amenity.name}
                </Typography>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Weather and Recommendations Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-8 px-4"
        style={{ backgroundColor: 'rgba(224, 247, 250, 0.5)' }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <WeatherWidget location="Sample City" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <RecommendationCarousel />
          </motion.div>
        </div>
      </motion.section>
      
      {/* Testimonials Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 px-4 relative overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-yellow-50 opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-yellow-100 opacity-20"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Typography
            variant="h3"
            component="h2"
            className="text-center font-bold mb-4"
            style={{
              background: 'linear-gradient(45deg, #0277bd, #01579b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}
          >
            What Our Guests Say
          </Typography>
          <Typography variant="h6" className="text-center mb-12" style={{ color: '#0277bd', fontSize: '1.2rem' }}>
            Real experiences from real travelers
          </Typography>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                rating: 5,
                comment: "The booking process was seamless and the hotel exceeded our expectations. Will definitely book again!",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Rajesh Kumar",
                location: "Delhi",
                rating: 4.5,
                comment: "Great deals and excellent customer service. The app made our vacation planning so much easier.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Anita Reddy",
                location: "Bangalore",
                rating: 5,
                comment: "Found the perfect resort for our anniversary. The special offers made it even more special!",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                whileHover="hover"
                className="cursor-pointer"
              >
                <Card
                  className="h-full rounded-xl overflow-hidden border border-blue-100"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    boxShadow: '0 4px 20px rgba(2, 119, 189, 0.15)',
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <Typography variant="h6" className="font-bold" style={{ color: '#01579b' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#0277bd' }}>
                          {testimonial.location}
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      <Rating rating={testimonial.rating} />
                    </div>
                    
                    <Typography variant="body2" className="text-gray-600 italic">
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Newsletter Subscription Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 px-4 relative overflow-hidden"
        style={{ backgroundColor: 'rgba(224, 247, 250, 0.5)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-blue-100 opacity-20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Typography
            variant="h3"
            component="h2"
            className="font-bold mb-4"
            style={{
              background: 'linear-gradient(45deg, #0277bd, #01579b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}
          >
            Stay Updated
          </Typography>
          <Typography variant="h6" className="mb-8" style={{ color: '#0277bd', fontSize: '1.2rem' }}>
            Subscribe to our newsletter for exclusive deals and travel tips!
          </Typography>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <TextField
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  style: { color: '#01579b', backgroundColor: 'rgba(255, 255, 255, 0.8)' },
                  className: 'rounded-lg',
                }}
                InputLabelProps={{ style: { color: '#0277bd' } }}
                className="w-full md:flex-grow"
                size="small"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<FaEnvelope />}
                  onClick={handleNewsletterSubmit}
                  style={{
                    background: 'linear-gradient(45deg, #0277bd, #01579b)',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(2, 119, 189, 0.4)',
                    whiteSpace: 'nowrap'
                  }}
                  sx={{
                    '&:hover': {
                      background: 'linear-gradient(45deg, #01579b, #0277bd)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Subscribe
                </Button>
              </motion.div>
            </div>
            
            <div className="flex items-center justify-center mt-6 text-sm text-gray-600">
              <FaMedal className="text-yellow-500 mr-2" />
              <span>Join 50,000+ subscribers getting exclusive deals</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Call to Action Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0277bd, #01579b)' }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white opacity-10"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-white opacity-5 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto px-4 relative z-10"
        >
          <motion.div
            className="inline-flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2 mb-6"
            animate={pulseAnimation}
          >
            <FaCrown className="text-yellow-300 mr-2" />
            <span className="text-white font-semibold">Premium Experience</span>
          </motion.div>
          
          <Typography variant="h3" component="h2" className="font-bold mb-6 text-white" style={{ fontSize: '2.5rem' }}>
            Ready for Your Next Adventure?
          </Typography>
          <Typography variant="h6" className="mb-10 text-white text-opacity-90" style={{ fontSize: '1.2rem' }}>
            Join thousands of satisfied travelers who have found their perfect stay with YoYo Hotels.
          </Typography>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleExploreClick}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0277bd',
                  padding: '14px 36px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#e0f7fa',
                  },
                }}
              >
                Explore Now
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                size="large"
                style={{
                  color: '#ffffff',
                  borderColor: '#ffffff',
                  padding: '14px 36px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  borderWidth: '2px',
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Learn More
              </Button>
            </motion.div>
          </div>
          
          <div className="flex justify-center mt-12 space-x-8">
            {[FaGem, FaMedal, FaStar].map((Icon, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
              >
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <Icon className="text-white text-2xl" />
                </div>
                <span className="text-white text-sm">
                  {['Premium', 'Trusted', 'Rated'][index]}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}

export default Home;