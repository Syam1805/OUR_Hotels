import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPayment, processPayment } from '../api/api';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaPaypal, 
  FaLock,
  FaCalendarAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaMoneyBillWave
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

const buttonHover = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 }
};

const successAnimation = {
  hidden: { scale: 0 },
  visible: { 
    scale: [0, 1.2, 1], 
    transition: { duration: 0.5, times: [0, 0.6, 1] } 
  }
};

const paymentMethods = [
  { id: 'card', name: 'Credit Card', icon: <FaCreditCard /> },
  { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
  { id: 'cash', name: 'Cash on Delivery', icon: <FaMoneyBillWave /> }
];

const cardTypes = [
  { id: 'visa', name: 'Visa', icon: <FaCcVisa className="text-blue-600" /> },
  { id: 'mastercard', name: 'Mastercard', icon: <FaCcMastercard className="text-red-500" /> },
  { id: 'amex', name: 'American Express', icon: <FaCcAmex className="text-blue-700" /> }
];

function Payment() {
  const { bookingId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    type: 'visa'
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    setLoading(true);
    getPayment(bookingId)
      .then((data) => setPayment(data))
      .catch((err) => setError('Failed to load payment information'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (!loading && !success && payment) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setError('Payment session expired. Please refresh the page.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, success, payment]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.1);
    } else {
      setError('Invalid promo code');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateCardDetails = () => {
    if (selectedMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.length < 16) {
        setError('Please enter a valid card number');
        return false;
      }
      if (!cardDetails.name) {
        setError('Please enter cardholder name');
        return false;
      }
      if (!cardDetails.expiry) {
        setError('Please enter expiry date');
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
    }
    return true;
  };

  const handlePay = async () => {
    if (!validateCardDetails()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await processPayment({ 
        bookingId, 
        method: selectedMethod,
        cardDetails: selectedMethod === 'card' ? cardDetails : null,
        discount
      });
      setSuccess(true);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const finalAmount = payment ? payment.amount * (1 - discount) : 0;

  if (loading) return <Loader />;
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto mt-8 px-4 max-w-md"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-200">
        <div className="bg-gradient-to-r from-red-700 to-red-900 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">Payment</h2>
          <div className="flex justify-between items-center">
            <p className="text-sm opacity-90">Complete your booking</p>
            <div className="flex items-center bg-red-800 px-3 py-1 rounded-full">
              <FaCalendarAlt className="mr-1" />
              <span className="text-sm">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {success ? (
            <motion.div 
              variants={successAnimation}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center py-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <FaCheckCircle size={64} className="text-green-600 mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">Your booking has been confirmed</p>
              
              <motion.button
                variants={buttonHover}
                whileHover="whileHover"
                whileTap="whileTap"
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition w-full max-w-xs flex items-center justify-center"
              >
                View Booking Details
                <FiArrowRight className="ml-2" />
              </motion.button>
            </motion.div>
          ) : payment ? (
            <div>
              <motion.div variants={slideIn} className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <FaCreditCard className="text-red-700 mr-2" />
                    <span className="font-semibold text-red-800">Amount Due</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-red-800">
                      ${finalAmount.toFixed(2)}
                    </p>
                    {discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        ${payment.amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  Booking ID: <span className="font-medium">{payment.bookingId}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Service: <span className="font-medium">{payment.serviceName || 'Premium Service'}</span>
                </div>
              </motion.div>

              <motion.div variants={slideIn} className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Promo Code</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={handlePromoCode}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-lg transition"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-green-600 text-sm mt-1">
                    10% discount applied!
                  </p>
                )}
              </motion.div>

              <motion.div variants={slideIn} className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      variants={buttonHover}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition ${
                        selectedMethod === method.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-red-700 text-xl mb-1">{method.icon}</span>
                      <span className="text-xs text-gray-700">{method.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <AnimatePresence>
                {selectedMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <h3 className="font-semibold text-gray-700 mb-3">Card Details</h3>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Card Type</span>
                      </div>
                      <div className="flex space-x-3">
                        {cardTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setCardDetails(prev => ({ ...prev, type: type.id }))}
                            className={`p-2 rounded-lg border-2 flex items-center ${
                              cardDetails.type === type.id
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200'
                            }`}
                          >
                            {type.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400">
                          <FaLock />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={cardDetails.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="saveMethod"
                        checked={savePaymentMethod}
                        onChange={() => setSavePaymentMethod(!savePaymentMethod)}
                        className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="saveMethod" className="text-sm text-gray-700">
                        Save payment method for future bookings
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                variants={buttonHover}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={handlePay}
                className="bg-gradient-to-r from-red-700 to-red-800 text-white px-4 py-3 rounded-lg shadow-lg hover:from-red-800 hover:to-red-900 transition w-full flex items-center justify-center"
              >
                <span>Pay ${finalAmount.toFixed(2)}</span>
                <FiArrowRight className="ml-2" />
              </motion.button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <FaLock className="mr-1" />
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No payment info found.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Payment;