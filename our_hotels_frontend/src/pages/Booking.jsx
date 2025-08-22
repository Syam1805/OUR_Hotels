import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import Loader from '../components/Loader';
import LoginPopup from '../components/LoginPopup';
import PriceAlert from '../components/PriceAlert';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookRoom } = useBooking();
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
      return;
    }
    // Show confirmation dialog instead of booking immediately
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      const bookingData = {
        userId: user.userId,
        roomId: parseInt(roomId),
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
      };
      const booking = await bookRoom(bookingData);
      navigate('/order-history');
    } catch (err) {
      setError(err.response?.data || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto mt-8 px-4 max-w-md"
      style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}
    >
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.palette.primary.main }}>Book Room</h2>
      {error && <p className="text-error mb-4" style={{ color: theme.palette.error.main }}>{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Check-in Date"
          type="date"
          name="checkInDate"
          value={formData.checkInDate}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          InputProps={{ style: { color: theme.palette.text.primary } }}
        />
        <TextField
          label="Check-out Date"
          type="date"
          name="checkOutDate"
          value={formData.checkOutDate}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          InputProps={{ style: { color: theme.palette.text.primary } }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
        >
          Book Now
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setShowPriceAlert(true)}
          className="mt-2"
        >
          Set Price Alert
        </Button>
      </form>
      
      {/* Booking Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={handleCancelBooking}
        aria-labelledby="booking-confirmation-title"
        aria-describedby="booking-confirmation-description"
      >
        <DialogTitle id="booking-confirmation-title">Confirm Booking</DialogTitle>
        <DialogContent>
          <DialogContentText id="booking-confirmation-description">
            Are you sure you want to book this room from {formData.checkInDate} to {formData.checkOutDate}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelBooking} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmBooking} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      {showPriceAlert && <PriceAlert onClose={() => setShowPriceAlert(false)} />}
    </motion.div>
  );
}

export default Booking;