import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle, FaHotel, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaTripadvisor } from 'react-icons/fa';
import ContactForm from './ContactForm';
import HelpAgent from './HelpAgent';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 300,
      damping: 15
    } 
  },
  hover: { 
    scale: 1.2,
    backgroundColor: '#7f1d1d',
    color: '#ffffff',
    borderRadius: '50%',
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.9 }
};

const copyrightVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7 }
  }
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 300,
      damping: 20
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3 }
  }
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  },
  hover: { 
    x: 5,
    color: '#ffffff',
    transition: { duration: 0.2 }
  }
};

function Footer({ showOnlyOnHome = false, currentPage = '' }) {
  const theme = useTheme();
  const [showContact, setShowContact] = useState(false);
  const [showMailForm, setShowMailForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
  
  // Don't render footer if showOnlyOnHome is true and currentPage is not home
  if (showOnlyOnHome && currentPage !== 'home') {
    return null;
  }
  
  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}      
      className="py-8 px-4 shadow-2xl w-full transition-all duration-300"
      style={{
        backgroundColor: '#1a1a1a', // Dark background for luxury feel
        color: '#e0e0e0', // Light text for contrast
        marginLeft: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%',
        borderTop: '4px solid #7f1d1d' // Brand color accent
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hotel Info Section */}
          <motion.div variants={footerVariants} className="col-span-1 md:col-span-2">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center mb-4"
            >
              <FaHotel size={32} style={{ color: '#7f1d1d' }} className="mr-3" />
              <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>YoYo Hotels</span>
            </motion.div>
            <p className="mb-4 text-gray-300">
              Experience luxury and comfort at its finest. YoYo Hotels offers exceptional service and unforgettable stays in prime locations worldwide.
            </p>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt style={{ color: '#7f1d1d' }} className="mr-2" />
              <span>123 Luxury Avenue, Paradise City</span>
            </div>
            <div className="flex space-x-4 mt-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, color: '#7f1d1d' }}
                className="text-gray-300"
              >
                <FaFacebook size={24} />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, color: '#7f1d1d' }}
                className="text-gray-300"
              >
                <FaTwitter size={24} />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, color: '#7f1d1d' }}
                className="text-gray-300"
              >
                <FaInstagram size={24} />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, color: '#7f1d1d' }}
                className="text-gray-300"
              >
                <FaTripadvisor size={24} />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Quick Links Section */}
          <motion.div variants={footerVariants}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#ffffff' }}>Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Rooms', 'Restaurants', 'Spa', 'Events', 'Offers'].map((item) => (
                <motion.li key={item} variants={linkVariants}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Section */}
          <motion.div variants={footerVariants}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#ffffff' }}>Contact Us</h3>
            <div className="flex flex-col space-y-4">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center cursor-pointer p-2 rounded-full"
                onClick={() => setShowContact(true)}
                title="Contact"
              >
                <FaPhoneAlt size={20} style={{ color: '#7f1d1d' }} className="mr-2" />
                <span>+1 (555) 123-4567</span>
              </motion.div>
              
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center cursor-pointer p-2 rounded-full"
                onClick={() => setShowMailForm(true)}
                title="Mail"
              >
                <FaEnvelope size={20} style={{ color: '#7f1d1d' }} className="mr-2" />
                <span>info@yoyohotels.com</span>
              </motion.div>
              
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center cursor-pointer p-2 rounded-full"
                onClick={() => setShowHelp(true)}
                title="Help"
              >
                <FaQuestionCircle size={20} style={{ color: '#7f1d1d' }} className="mr-2" />
                <span>24/7 Customer Support</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Copyright Section */}
        <motion.div
          variants={copyrightVariants}
          className="border-t border-gray-700 mt-8 pt-6 text-center"
        >
          <span className="font-semibold" style={{ color: '#e0e0e0' }}>
            © 2025 YoYo Hotels. All rights reserved. | 
          </span>
          <span className="mx-2" style={{ color: '#e0e0e0' }}>
            Privacy Policy | Terms of Service
          </span>
        </motion.div>
      </div>
      
      {/* Contact Popup */}
      {showContact && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowContact(false)}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
            style={{ color: '#7f1d1d' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-6">
              <FaPhoneAlt 
                size={28} 
                style={{ color: '#7f1d1d' }} 
                className="mr-3" 
              />
              <h2 className="text-2xl font-bold" style={{ color: '#7f1d1d' }}>Contact Us</h2>
            </div>
            <p className="text-lg mb-4">
              Call us at <span className="font-bold text-xl" style={{ color: '#7f1d1d' }}>+1 (555) 123-4567</span>
            </p>
            <p className="mb-6">
              Our customer service team is available 24/7 to assist you with your booking and any inquiries.
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg font-semibold shadow-lg"
                style={{
                  backgroundColor: '#7f1d1d',
                  color: '#ffffff'
                }}
                onClick={() => setShowContact(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Mail Popup */}
      {showMailForm && (
        <ContactForm onClose={() => setShowMailForm(false)} />
      )}
      
      {/* Help Popup */}
      {showHelp && (
        <HelpAgent onClose={() => setShowHelp(false)} />
      )}
    </motion.footer>
  );
}

export default Footer;