import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaUser, FaLock } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import { Button, TextField, Alert, AlertTitle } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const formVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      type: 'spring', 
      bounce: 0.4 
    } 
  },
  hover: { 
    scale: 1.02,
    boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
    transition: { duration: 0.3 }
  }
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      delay: 0.2,
      ease: 'easeOut'
    } 
  },
  focus: { 
    scale: 1.02,
    borderColor: '#ffffff',
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      delay: 0.4,
      ease: 'easeOut'
    } 
  },
  hover: { 
    scale: 1.05,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    boxShadow: '0 8px 20px rgba(255,255,255,0.3)',
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 }
};

const backgroundVariants = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 100%'],
    transition: {
      duration: 20,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'reverse'
    }
  }
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      delay: 0.3,
      type: 'spring',
      stiffness: 300,
      damping: 10
    } 
  },
  hover: { 
    rotate: 15,
    scale: 1.2,
    transition: { duration: 0.2 }
  }
};

function Login() {
  const theme = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Login failed');
      setShowErrorDialog(true);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/');
  };

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
    setError(null);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen flex flex-col items-center justify-start"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(30,30,60,0.8)), url('https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?cs=srgb&dl=pexels-asadphoto-457882.jpg&fm=jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: theme.palette?.text?.primary || '#ffffff'
      }}
      variants={backgroundVariants}
      animate="animate"
    >
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 left-10 w-16 h-16 rounded-full bg-white bg-opacity-10"
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-white bg-opacity-10"
        animate={{ 
          y: [0, 20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      <motion.div
        variants={formVariants}
        whileHover="hover"
        className="bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white border-opacity-30 w-full max-w-md relative z-10 mt-4"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        <motion.div 
          className="flex flex-col items-center justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className="mb-3"
          >
            <div className="w-16 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
              <FaSignInAlt size={28} className="text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Welcome Back</h2>
          <p className="text-white text-opacity-80 mt-1">Please login to your account</p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div 
            variants={inputVariants} 
            initial="hidden" 
            animate="visible" 
            whileFocus="focus"
            className="relative"
          >
            <div className="flex items-center mb-1">
              <FaUser className="text-white mr-2" />
              <label className="font-semibold text-white">Email</label>
            </div>
            <TextField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              variant="outlined"
              fullWidth
              required
              InputProps={{ 
                style: { 
                  color: '#ffffff', 
                  backgroundColor: isFocused.email ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease'
                },
                className: 'rounded-lg'
              }}
              InputLabelProps={{ style: { color: '#ffffff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isFocused.email ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                    borderWidth: isFocused.email ? '2px' : '1px',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                    borderWidth: '2px',
                  },
                },
              }}
            />
          </motion.div>
          
          <motion.div 
            variants={inputVariants} 
            initial="hidden" 
            animate="visible" 
            whileFocus="focus"
            className="relative"
          >
            <div className="flex items-center mb-1">
              <FaLock className="text-white mr-2" />
              <label className="font-semibold text-white">Password</label>
            </div>
            <TextField
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              variant="outlined"
              fullWidth
              required
              InputProps={{ 
                style: { 
                  color: '#ffffff', 
                  backgroundColor: isFocused.password ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease'
                },
                className: 'rounded-lg',
                endAdornment: (
                  <motion.button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                )
              }}
              InputLabelProps={{ style: { color: '#ffffff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isFocused.password ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                    borderWidth: isFocused.password ? '2px' : '1px',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                    borderWidth: '2px',
                  },
                },
              }}
            />
          </motion.div>
          
          <motion.div variants={buttonVariants} initial="hidden" animate="visible">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="py-2 text-lg font-semibold"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: '12px',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 'bold',
                fontSize: '1rem',
                padding: '10px 0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              Login
            </Button>
          </motion.div>
        </form>
        
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white text-opacity-90">
            Don't have an account?{' '}
            <motion.a 
              href="/register" 
              className="font-semibold text-white hover:underline"
              whileHover={{ scale: 1.05, color: '#f0f0f0' }}
              whileTap={{ scale: 0.95 }}
            >
              Register here
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
      
      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccessDialog}
        PaperProps={{
          component: motion.div,
          variants: {
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          },
          initial: "hidden",
          animate: "visible",
          transition: { type: 'spring', stiffness: 300, damping: 20 },
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle className="flex items-center" style={{ color: '#000000' }}>
          <FaCheckCircle className="mr-2" style={{ color: '#4caf50' }} />
          Login Successful
        </DialogTitle>
        <DialogContent>
          <Alert severity="success">
            <AlertTitle>Success!</AlertTitle>
            You have been successfully logged in. Redirecting to homepage...
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} style={{ color: '#000000' }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Error Dialog */}
      <Dialog
        open={showErrorDialog}
        onClose={handleCloseErrorDialog}
        PaperProps={{
          component: motion.div,
          variants: {
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          },
          initial: "hidden",
          animate: "visible",
          transition: { type: 'spring', stiffness: 300, damping: 20 },
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle className="flex items-center" style={{ color: '#000000' }}>
          <FaExclamationCircle className="mr-2" style={{ color: '#f44336' }} />
          Login Failed
        </DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error || 'Invalid email or password. Please try again.'}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} style={{ color: '#000000' }}>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}

export default Login;