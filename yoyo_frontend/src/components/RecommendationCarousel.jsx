import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaCar, FaUtensils, FaSwimmingPool } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Sample hotel data with more details
const recommendations = [
  {
    id: 1,
    name: 'Grand Luxury Resort',
    location: 'Maldives',
    rating: 4.8,
    price: '$350',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    amenities: ['wifi', 'pool', 'restaurant', 'parking'],
    description: 'Experience luxury at its finest with ocean views and private beaches.'
  },
  {
    id: 2,
    name: 'Mountain View Lodge',
    location: 'Swiss Alps',
    rating: 4.6,
    price: '$280',
    image: 'https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    amenities: ['wifi', 'restaurant', 'parking'],
    description: 'Cozy mountain retreat with stunning alpine views and ski access.'
  },
  {
    id: 3,
    name: 'Urban Boutique Hotel',
    location: 'New York',
    rating: 4.7,
    price: '$420',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    amenities: ['wifi', 'restaurant', 'parking', 'pool'],
    description: 'Stylish accommodation in the heart of the city with rooftop bar.'
  },
  {
    id: 4,
    name: 'Seaside Paradise',
    location: 'Bali',
    rating: 4.9,
    price: '$310',
    image: 'https://media.istockphoto.com/id/1160947136/photo/couple-relax-on-the-beach-enjoy-beautiful-sea-on-the-tropical-island.jpg?s=612x612&w=0&k=20&c=WJWEH22TFinjI0edzblfH-Nw0cdBfPX5LV8EMvs8Quo=',
    amenities: ['wifi', 'pool', 'restaurant'],
    description: 'Tropical beachfront villa with private infinity pool and spa services.'
  },
  {
    id: 5,
    name: 'Historic Castle Hotel',
    location: 'Scotland',
    rating: 4.5,
    price: '$390',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    amenities: ['wifi', 'restaurant', 'parking'],
    description: 'Stay in a beautifully restored castle with modern amenities.'
  }
];

// Custom arrow components
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', left: '10px', zIndex: 10, color: '#8B0000' }}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', right: '10px', zIndex: 10, color: '#8B0000' }}
      onClick={onClick}
    />
  );
};

// Custom dot component
const CustomDot = (props) => {
  const { className, onClick, active } = props;
  return (
    <div
      className={className}
      style={{
        width: active ? '24px' : '12px',
        height: '12px',
        borderRadius: '6px',
        backgroundColor: active ? '#8B0000' : '#cccccc',
        transition: 'all 0.3s ease',
      }}
      onClick={onClick}
    />
  );
};

// Amenity icon mapping
const amenityIcons = {
  wifi: <FaWifi className="text-blue-500" />,
  pool: <FaSwimmingPool className="text-blue-400" />,
  restaurant: <FaUtensils className="text-red-500" />,
  parking: <FaCar className="text-gray-600" />,
};

function RecommendationCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    customPaging: (i) => <CustomDot active={false} />,
    appendDots: (dots) => (
      <div style={{ bottom: '-30px' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <motion.div 
      className="py-8 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-lg my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Recommended for You</h2>
          <p className="text-gray-600">Handpicked hotels based on your preferences</p>
        </motion.div>
        
        <Slider {...settings}>
          {recommendations.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              className="px-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
                whileHover={{ boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="relative">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg font-bold">
                    {hotel.price}<span className="text-sm font-normal">/night</span>
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                    <div className="flex items-center bg-red-50 px-2 py-1 rounded">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    <span>{hotel.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                        {amenityIcons[amenity]}
                        <span className="ml-1 capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <motion.div 
                  className="px-4 pb-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    onClick={() => alert(`Viewing details for ${hotel.name}`)}
                  >
                    View Details
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
}

export default RecommendationCarousel;