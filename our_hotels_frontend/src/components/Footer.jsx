import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle, FaHotel } from 'react-icons/fa';
import ContactForm from './ContactForm';
import HelpAgent from './HelpAgent';

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
    backgroundColor: '#ffffff',
    color: '#1a73e8',
    borderRadius: '50%',
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.9 }
};

function Footer({ showOnlyOnHome = false, currentPage = '' }) {
  // State variables for popups - MOVED TO THE TOP
  const [showContactForm, setShowContactForm] = useState(false);
  const [showHelpAgent, setShowHelpAgent] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  
  // Don't render footer if showOnlyOnHome is true and currentPage is not home
  if (showOnlyOnHome && currentPage !== 'home') {
    return null;
  }
  
  // Handler functions
  const handlePhoneClick = () => {
    setShowPhoneNumber(true);
    // Hide the phone number after 3 seconds
    setTimeout(() => setShowPhoneNumber(false), 3000);
  };

  const handleMailClick = () => {
    setShowContactForm(true);
  };

  const handleQuestionClick = () => {
    setShowHelpAgent(true);
  };

  const closeContactForm = () => {
    setShowContactForm(false);
  };

  const closeHelpAgent = () => {
    setShowHelpAgent(false);
  };
  
  return (
    <>
      {/* Phone number popup */}
      <AnimatePresence>
        {showPhoneNumber && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 z-50 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <FaPhoneAlt className="text-blue-500 mr-2" />
              <span className="font-medium">8919004890</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Popup */}
      {showContactForm && <ContactForm onClose={closeContactForm} />}

      {/* Help Agent Popup */}
      {showHelpAgent && <HelpAgent onClose={closeHelpAgent} />}

      <motion.footer
        initial="hidden"
        animate="visible"
        variants={footerVariants}      
        className="py-3 px-4 shadow-lg w-full transition-all duration-300"
        style={{
          background: 'linear-gradient(to right, #1a73e8, #4285f4)',
          color: '#ffffff',
          borderTop: '3px solid #ffffff'
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Hotel Name on Left */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center"
          >
            <FaHotel size={28} style={{ color: '#ffffff' }} className="mr-2" />
            <span className="text-xl font-bold" style={{ color: '#ffffff' }}>OUR Hotels</span>
          </motion.div>
          
          {/* Contact Icons on Right */}
          <div className="flex space-x-4">
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center cursor-pointer p-2 rounded-full"
              title="Contact"
              onClick={handlePhoneClick}
            >
              <FaPhoneAlt size={20} style={{ color: '#ffffff' }} />
            </motion.div>
            
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center cursor-pointer p-2 rounded-full"
              title="Mail"
              onClick={handleMailClick}
            >
              <FaEnvelope size={20} style={{ color: '#ffffff' }} />
            </motion.div>
            
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center cursor-pointer p-2 rounded-full"
              title="Help"
              onClick={handleQuestionClick}
            >
              <FaQuestionCircle size={20} style={{ color: '#ffffff' }} />
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </>
  );
}

export default Footer;