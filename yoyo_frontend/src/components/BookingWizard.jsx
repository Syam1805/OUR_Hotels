import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { 
  FaBed, 
  FaUser, 
  FaCreditCard, 
  FaHotel, 
  FaUtensils, 
  FaWifi, 
  FaSwimmingPool, 
  FaParking, 
  FaCar, 
  FaConciergeBell,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaCalendarAlt,
  FaUsers,
  FaChild,
  FaInfoCircle
} from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  hover: { scale: 1.03, transition: { duration: 0.3 } }
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } },
  hover: { rotate: 15, scale: 1.2, transition: { duration: 0.3 } }
};

function BookingWizard() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    room: '',
    guests: {
      adults: 1,
      children: 0
    },
    dates: {
      checkIn: '',
      checkOut: ''
    },
    guestDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: ''
    },
    payment: {
      method: 'credit',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    },
    termsAccepted: false
  });

  const steps = [
    { 
      label: 'Room Selection', 
      icon: <FaBed />,
      description: 'Choose your perfect room'
    },
    { 
      label: 'Guest Details', 
      icon: <FaUser />,
      description: 'Provide your information'
    },
    { 
      label: 'Payment', 
      icon: <FaCreditCard />,
      description: 'Complete your booking'
    }
  ];

  const roomTypes = [
    {
      id: 'standard',
      name: 'Standard Room',
      price: 99,
      description: 'Comfortable room with all essential amenities',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      amenities: ['Free WiFi', 'Air Conditioning', 'TV']
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      price: 149,
      description: 'Spacious room with premium amenities',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar']
    },
    {
      id: 'suite',
      name: 'Executive Suite',
      price: 249,
      description: 'Luxury suite with separate living area',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Jacuzzi']
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setBookingData({
      room: '',
      guests: {
        adults: 1,
        children: 0
      },
      dates: {
        checkIn: '',
        checkOut: ''
      },
      guestDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: ''
      },
      payment: {
        method: 'credit',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
      },
      termsAccepted: false
    });
  };

  const handleRoomSelect = (room) => {
    setBookingData(prev => ({ ...prev, room }));
    handleNext();
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setBookingData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Typography variant="h5" className="mb-6 font-bold text-gray-800">
              Select Your Room
            </Typography>
            <Grid container spacing={4}>
              {roomTypes.map((room) => (
                <Grid item xs={12} md={4} key={room.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleRoomSelect(room.id)}
                    className="cursor-pointer"
                  >
                    <Card className="h-full shadow-lg rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300">
                      <CardMedia
                        component="div"
                        style={{
                          height: 180,
                          backgroundImage: `url(${room.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" className="font-bold text-gray-800 mb-2">
                          {room.name}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 mb-3">
                          {room.description}
                        </Typography>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {room.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                              {amenity}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="h6" className="font-bold text-blue-600">
                            ${room.price}<span className="text-sm font-normal text-gray-500">/night</span>
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            style={{ backgroundColor: theme.palette.primary.main }}
                          >
                            Select
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Typography variant="h5" className="mb-6 font-bold text-gray-800">
              Guest Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={bookingData.guestDetails.firstName}
                  onChange={(e) => handleNestedInputChange('guestDetails', 'firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={bookingData.guestDetails.lastName}
                  onChange={(e) => handleNestedInputChange('guestDetails', 'lastName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={bookingData.guestDetails.email}
                  onChange={(e) => handleNestedInputChange('guestDetails', 'email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={bookingData.guestDetails.phone}
                  onChange={(e) => handleNestedInputChange('guestDetails', 'phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Special Requests"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={bookingData.guestDetails.specialRequests}
                  onChange={(e) => handleNestedInputChange('guestDetails', 'specialRequests', e.target.value)}
                  placeholder="Any special requests or requirements..."
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Typography variant="h5" className="mb-6 font-bold text-gray-800">
              Payment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={bookingData.payment.method}
                    onChange={(e) => handleNestedInputChange('payment', 'method', e.target.value)}
                  >
                    <FormControlLabel value="credit" control={<Radio />} label="Credit Card" />
                    <FormControlLabel value="debit" control={<Radio />} label="Debit Card" />
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              {(bookingData.payment.method === 'credit' || bookingData.payment.method === 'debit') && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Card Number"
                      variant="outlined"
                      fullWidth
                      value={bookingData.payment.cardNumber}
                      onChange={(e) => handleNestedInputChange('payment', 'cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Expiry Date"
                      variant="outlined"
                      fullWidth
                      value={bookingData.payment.expiryDate}
                      onChange={(e) => handleNestedInputChange('payment', 'expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="CVV"
                      variant="outlined"
                      fullWidth
                      value={bookingData.payment.cvv}
                      onChange={(e) => handleNestedInputChange('payment', 'cvv', e.target.value)}
                      placeholder="123"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Name on Card"
                      variant="outlined"
                      fullWidth
                      value={bookingData.payment.cardName}
                      onChange={(e) => handleNestedInputChange('payment', 'cardName', e.target.value)}
                      required
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Divider className="my-3" />
                <div className="flex items-start">
                  <Checkbox
                    checked={bookingData.termsAccepted}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    color="primary"
                  />
                  <Typography variant="body2" className="ml-2">
                    I agree to the Terms and Conditions and Privacy Policy. I understand that my booking is subject to availability and cancellation policies.
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return 'Unknown step';
    }
  };

  const getSelectedRoom = () => {
    return roomTypes.find(room => room.id === bookingData.room);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-xl my-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Complete Your Booking
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Follow these simple steps to book your perfect stay
        </Typography>
      </motion.div>

      <Stepper activeStep={activeStep} orientation="horizontal" className="mb-8">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={() => (
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    activeStep === index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {step.icon}
                </motion.div>
              )}
            >
              <div>
                <Typography variant="subtitle1" className="font-semibold">
                  {step.label}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  {step.description}
                </Typography>
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mb-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {getStepContent(activeStep)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            startIcon={<FaArrowLeft />}
            style={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
          >
            Back
          </Button>
        </motion.div>

        <div className="flex items-center">
          {activeStep === steps.length - 1 ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={handleReset}
                endIcon={<FaCheck />}
                style={{ backgroundColor: theme.palette.primary.main }}
                disabled={!bookingData.termsAccepted}
              >
                Complete Booking
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<FaArrowRight />}
                style={{ backgroundColor: theme.palette.primary.main }}
                disabled={activeStep === 0 && !bookingData.room}
              >
                Next
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Booking Summary */}
      {activeStep > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
        >
          <Typography variant="h6" className="font-bold text-blue-800 mb-3 flex items-center">
            <FaInfoCircle className="mr-2" />
            Booking Summary
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Typography variant="body2" className="text-gray-600">Room</Typography>
              <Typography variant="body1" className="font-semibold">
                {getSelectedRoom()?.name || 'Not selected'}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" className="text-gray-600">Guests</Typography>
              <Typography variant="body1" className="font-semibold">
                {bookingData.guests.adults} Adults, {bookingData.guests.children} Children
              </Typography>
            </div>
            <div>
              <Typography variant="body2" className="text-gray-600">Price</Typography>
              <Typography variant="body1" className="font-semibold text-blue-600">
                ${getSelectedRoom()?.price || '0'}/night
              </Typography>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default BookingWizard;