import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { register as apiRegister } from '../api/api';
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

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFocused, setIsFocused] = useState({
    username: false,
    email: false,
    password: false,
    phone: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate username
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 8 characters with one uppercase, one lowercase, one number, and one special character";
    }
    
    // Validate phone
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      setShowErrorDialog(true);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Register payload:', formData);
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      };
      const resp = await apiRegister(payload);
      console.log('Register response:', resp);
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
      setError(msg);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/login');
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
      className="min-h-screen flex flex-col items-center justify-start px-4 py-0"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(30,30,60,0.8)), url('https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?cs=srgb&dl=pexels-asadphoto-457882.jpg&fm=jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
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
        className="bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-5 border border-white border-opacity-30 w-full max-w-md relative z-10 mt-2"
        style={{
          background: 'rgba(113, 30, 202, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        <motion.div 
          className="flex flex-col items-center justify-center mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className="mb-2"
          >
            <div className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
              <FaUserPlus size={24} className="text-white" />
            </div>
          </motion.div>
          <h2 className="text-xl font-bold text-white drop-shadow-lg">Create Account</h2>
          <p className="text-white text-opacity-80 mt-1 text-sm">Join us today</p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
            <div className="flex items-center mb-1">
              <FaUser className="text-white mr-2 text-sm" />
              <label className="font-semibold text-white text-sm">Username</label>
            </div>
            <TextField
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => handleFocus('username')}
              onBlur={() => handleBlur('username')}
              variant="outlined"
              fullWidth
              required
              error={!!validationErrors.username}
              helperText={validationErrors.username}
              InputProps={{ 
                style: { 
                  color: '#ffffff', 
                  backgroundColor: isFocused.username ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
                  borderRadius: '8px',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease'
                },
                className: 'rounded-lg'
              }}
              InputLabelProps={{ style: { color: '#ffffff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isFocused.username ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                    borderWidth: isFocused.username ? '2px' : '1px',
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
          
          <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
            <div className="flex items-center mb-1">
              <FaEnvelope className="text-white mr-2 text-sm" />
              <label className="font-semibold text-white text-sm">Email</label>
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
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              InputProps={{ 
                style: { 
                  color: '#ffffff', 
                  backgroundColor: isFocused.email ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
                  borderRadius: '8px',
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
          
          <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
            <div className="flex items-center mb-1">
              <FaLock className="text-white mr-2 text-sm" />
              <label className="font-semibold text-white text-sm">Password</label>
            </div>
            <div className="relative">
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
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{ 
                  style: { 
                    color: '#ffffff', 
                    backgroundColor: isFocused.password ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
                    borderRadius: '8px',
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
            </div>
          </motion.div>
          
          <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
            <div className="flex items-center mb-1">
              <FaPhone className="text-white mr-2 text-sm" />
              <label className="font-semibold text-white text-sm">Phone</label>
            </div>
            <TextField
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => handleFocus('phone')}
              onBlur={() => handleBlur('phone')}
              variant="outlined"
              fullWidth
              required
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
              InputProps={{ 
                style: { 
                  color: '#ffffff', 
                  backgroundColor: isFocused.phone ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
                  borderRadius: '8px',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease'
                },
                className: 'rounded-lg'
              }}
              InputLabelProps={{ style: { color: '#ffffff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isFocused.phone ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                    borderWidth: isFocused.phone ? '2px' : '1px',
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
              disabled={loading}
              className="py-1.5 text-base font-semibold"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </motion.div>
        </form>
        
        <motion.div 
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white text-opacity-90 text-sm">
            Already have an account?{' '}
            <motion.a 
              href="/login" 
              className="font-semibold text-white hover:underline"
              whileHover={{ scale: 1.05, color: '#f0f0f0' }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in here
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
          Registration Successful
        </DialogTitle>
        <DialogContent>
          <Alert severity="success">
            <AlertTitle>Success!</AlertTitle>
            Your account has been created successfully. Redirecting to login page...
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
          Registration Failed
        </DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error || 'Please correct the errors in the form and try again.'}
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

export default Register;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaUserPlus, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaUser, FaEnvelope, FaLock, FaPhone, FaUserShield } from 'react-icons/fa';
// import { register as apiRegister } from '../api/api';
// import { Button, TextField, Alert, AlertTitle, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
// import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// const fadeIn = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
// };

// const formVariants = {
//   hidden: { scale: 0.9, opacity: 0 },
//   visible: { 
//     scale: 1, 
//     opacity: 1,
//     transition: { 
//       duration: 0.6, 
//       type: 'spring', 
//       bounce: 0.4 
//     } 
//   },
//   hover: { 
//     scale: 1.02,
//     boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
//     transition: { duration: 0.3 }
//   }
// };

// const inputVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { 
//     opacity: 1, 
//     x: 0,
//     transition: { 
//       duration: 0.5,
//       delay: 0.2,
//       ease: 'easeOut'
//     } 
//   },
//   focus: { 
//     scale: 1.02,
//     borderColor: '#ffffff',
//     transition: { duration: 0.2 }
//   }
// };

// const buttonVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     transition: { 
//       duration: 0.5,
//       delay: 0.4,
//       ease: 'easeOut'
//     } 
//   },
//   hover: { 
//     scale: 1.05,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     color: '#ffffff',
//     boxShadow: '0 8px 20px rgba(255,255,255,0.3)',
//     transition: { duration: 0.3 }
//   },
//   tap: { scale: 0.95 }
// };

// const backgroundVariants = {
//   animate: {
//     backgroundPosition: ['0% 0%', '100% 100%'],
//     transition: {
//       duration: 20,
//       ease: 'linear',
//       repeat: Infinity,
//       repeatType: 'reverse'
//     }
//   }
// };

// const iconVariants = {
//   hidden: { opacity: 0, scale: 0 },
//   visible: { 
//     opacity: 1, 
//     scale: 1,
//     transition: { 
//       duration: 0.5,
//       delay: 0.3,
//       type: 'spring',
//       stiffness: 300,
//       damping: 10
//     } 
//   },
//   hover: { 
//     rotate: 15,
//     scale: 1.2,
//     transition: { duration: 0.2 }
//   }
// };

// function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     phone: '',
//     role: 'USER',
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showSuccessDialog, setShowSuccessDialog] = useState(false);
//   const [showErrorDialog, setShowErrorDialog] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});
//   const [isFocused, setIsFocused] = useState({
//     username: false,
//     email: false,
//     password: false,
//     phone: false,
//     role: false
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleFocus = (field) => {
//     setIsFocused({ ...isFocused, [field]: true });
//   };

//   const handleBlur = (field) => {
//     setIsFocused({ ...isFocused, [field]: false });
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     // Validate username
//     if (!formData.username.trim()) {
//       errors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       errors.username = "Username must be at least 3 characters";
//     }
    
//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!emailRegex.test(formData.email)) {
//       errors.email = "Please enter a valid email address";
//     }
    
//     // Validate password
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!formData.password) {
//       errors.password = "Password is required";
//     } else if (!passwordRegex.test(formData.password)) {
//       errors.password = "Password must be at least 8 characters with one uppercase, one lowercase, one number, and one special character";
//     }
    
//     // Validate phone
//     const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
//     if (!formData.phone.trim()) {
//       errors.phone = "Phone number is required";
//     } else if (!phoneRegex.test(formData.phone)) {
//       errors.phone = "Please enter a valid phone number";
//     }
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
    
//     if (!validateForm()) {
//       setShowErrorDialog(true);
//       return;
//     }
    
//     setLoading(true);
//     try {
//       console.log('Register payload:', formData);
//       const payload = {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         phone: formData.phone,
//         role: formData.role,
//       };
//       const resp = await apiRegister(payload);
//       console.log('Register response:', resp);
//       setShowSuccessDialog(true);
      
//       // Set timeout to navigate after showing success dialog
//       setTimeout(() => {
//         setShowSuccessDialog(false);
        
//         // Navigate based on role
//         if (formData.role === 'ADMIN') {
//           navigate('/admin');
//         } else {
//           navigate('/user-dashboard');
//         }
//       }, 2000);
//     } catch (err) {
//       console.error('Registration error:', err);
//       const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
//       setError(msg);
//       setShowErrorDialog(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleCloseSuccessDialog = () => {
//     setShowSuccessDialog(false);
//     // Navigate based on role when closing dialog
//     if (formData.role === 'ADMIN') {
//       navigate('/admin');
//     } else {
//       navigate('/user-dashboard');
//     }
//   };

//   const handleCloseErrorDialog = () => {
//     setShowErrorDialog(false);
//     setError(null);
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={fadeIn}
//       className="min-h-screen flex flex-col items-center justify-start px-4 py-0"
//       style={{
//         backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(30,30,60,0.8)), url('https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?cs=srgb&dl=pexels-asadphoto-457882.jpg&fm=jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         backgroundAttachment: 'fixed',
//       }}
//       variants={backgroundVariants}
//       animate="animate"
//     >
//       {/* Decorative elements */}
//       <motion.div 
//         className="absolute top-20 left-10 w-16 h-16 rounded-full bg-white bg-opacity-10"
//         animate={{ 
//           y: [0, -20, 0],
//           scale: [1, 1.1, 1]
//         }}
//         transition={{ 
//           duration: 4, 
//           repeat: Infinity,
//           repeatType: 'reverse'
//         }}
//       />
//       <motion.div 
//         className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-white bg-opacity-10"
//         animate={{ 
//           y: [0, 20, 0],
//           scale: [1, 1.2, 1]
//         }}
//         transition={{ 
//           duration: 5, 
//           repeat: Infinity,
//           repeatType: 'reverse'
//         }}
//       />
      
//       <motion.div
//         variants={formVariants}
//         whileHover="hover"
//         className="bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-5 border border-white border-opacity-30 w-full max-w-md relative z-10 mt-2"
//         style={{
//           background: 'rgba(113, 30, 202, 0.1)',
//           boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//         }}
//       >
//         <motion.div 
//           className="flex flex-col items-center justify-center mb-3"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1, duration: 0.5 }}
//         >
//           <motion.div
//             variants={iconVariants}
//             whileHover="hover"
//             className="mb-2"
//           >
//             <div className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
//               <FaUserPlus size={24} className="text-white" />
//             </div>
//           </motion.div>
//           <h2 className="text-xl font-bold text-white drop-shadow-lg">Create Account</h2>
//           <p className="text-white text-opacity-80 mt-1 text-sm">Join us today</p>
//         </motion.div>
        
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
//             <div className="flex items-center mb-1">
//               <FaUser className="text-white mr-2 text-sm" />
//               <label className="font-semibold text-white text-sm">Username</label>
//             </div>
//             <TextField
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               onFocus={() => handleFocus('username')}
//               onBlur={() => handleBlur('username')}
//               variant="outlined"
//               fullWidth
//               required
//               error={!!validationErrors.username}
//               helperText={validationErrors.username}
//               InputProps={{ 
//                 style: { 
//                   color: '#ffffff', 
//                   backgroundColor: isFocused.username ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
//                   borderRadius: '8px',
//                   backdropFilter: 'blur(5px)',
//                   transition: 'all 0.3s ease'
//                 },
//                 className: 'rounded-lg'
//               }}
//               InputLabelProps={{ style: { color: '#ffffff' } }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: isFocused.username ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
//                     borderWidth: isFocused.username ? '2px' : '1px',
//                     transition: 'all 0.3s ease'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: 'rgba(255, 255, 255, 0.8)',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#ffffff',
//                     borderWidth: '2px',
//                   },
//                 },
//               }}
//             />
//           </motion.div>
          
//           <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
//             <div className="flex items-center mb-1">
//               <FaEnvelope className="text-white mr-2 text-sm" />
//               <label className="font-semibold text-white text-sm">Email</label>
//             </div>
//             <TextField
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               onFocus={() => handleFocus('email')}
//               onBlur={() => handleBlur('email')}
//               variant="outlined"
//               fullWidth
//               required
//               error={!!validationErrors.email}
//               helperText={validationErrors.email}
//               InputProps={{ 
//                 style: { 
//                   color: '#ffffff', 
//                   backgroundColor: isFocused.email ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
//                   borderRadius: '8px',
//                   backdropFilter: 'blur(5px)',
//                   transition: 'all 0.3s ease'
//                 },
//                 className: 'rounded-lg'
//               }}
//               InputLabelProps={{ style: { color: '#ffffff' } }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: isFocused.email ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
//                     borderWidth: isFocused.email ? '2px' : '1px',
//                     transition: 'all 0.3s ease'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: 'rgba(255, 255, 255, 0.8)',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#ffffff',
//                     borderWidth: '2px',
//                   },
//                 },
//               }}
//             />
//           </motion.div>
          
//           <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
//             <div className="flex items-center mb-1">
//               <FaLock className="text-white mr-2 text-sm" />
//               <label className="font-semibold text-white text-sm">Password</label>
//             </div>
//             <div className="relative">
//               <TextField
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onFocus={() => handleFocus('password')}
//                 onBlur={() => handleBlur('password')}
//                 variant="outlined"
//                 fullWidth
//                 required
//                 error={!!validationErrors.password}
//                 helperText={validationErrors.password}
//                 InputProps={{ 
//                   style: { 
//                     color: '#ffffff', 
//                     backgroundColor: isFocused.password ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
//                     borderRadius: '8px',
//                     backdropFilter: 'blur(5px)',
//                     transition: 'all 0.3s ease'
//                   },
//                   className: 'rounded-lg',
//                   endAdornment: (
//                     <motion.button
//                       type="button"
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
//                       whileHover={{ scale: 1.2, rotate: 5 }}
//                       whileTap={{ scale: 0.8 }}
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </motion.button>
//                   )
//                 }}
//                 InputLabelProps={{ style: { color: '#ffffff' } }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: isFocused.password ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
//                       borderWidth: isFocused.password ? '2px' : '1px',
//                       transition: 'all 0.3s ease'
//                     },
//                     '&:hover fieldset': {
//                       borderColor: 'rgba(255, 255, 255, 0.8)',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#ffffff',
//                       borderWidth: '2px',
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </motion.div>
          
//           <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
//             <div className="flex items-center mb-1">
//               <FaPhone className="text-white mr-2 text-sm" />
//               <label className="font-semibold text-white text-sm">Phone</label>
//             </div>
//             <TextField
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               onFocus={() => handleFocus('phone')}
//               onBlur={() => handleBlur('phone')}
//               variant="outlined"
//               fullWidth
//               required
//               error={!!validationErrors.phone}
//               helperText={validationErrors.phone}
//               InputProps={{ 
//                 style: { 
//                   color: '#ffffff', 
//                   backgroundColor: isFocused.phone ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)', 
//                   borderRadius: '8px',
//                   backdropFilter: 'blur(5px)',
//                   transition: 'all 0.3s ease'
//                 },
//                 className: 'rounded-lg'
//               }}
//               InputLabelProps={{ style: { color: '#ffffff' } }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: isFocused.phone ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
//                     borderWidth: isFocused.phone ? '2px' : '1px',
//                     transition: 'all 0.3s ease'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: 'rgba(255, 255, 255, 0.8)',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#ffffff',
//                     borderWidth: '2px',
//                   },
//                 },
//               }}
//             />
//           </motion.div>
          
//           {/* Role Selection */}
//           <motion.div variants={inputVariants} initial="hidden" animate="visible" whileFocus="focus" className="relative">
//             <div className="flex items-center mb-1">
//               <FaUserShield className="text-white mr-2 text-sm" />
//               <label className="font-semibold text-white text-sm">Register As</label>
//             </div>
//             <FormControl 
//               component="fieldset" 
//               fullWidth
//               onFocus={() => handleFocus('role')}
//               onBlur={() => handleBlur('role')}
//               style={{ 
//                 color: '#ffffff',
//                 backgroundColor: isFocused.role ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
//                 borderRadius: '8px',
//                 padding: '10px',
//                 backdropFilter: 'blur(5px)',
//                 transition: 'all 0.3s ease',
//                 border: isFocused.role ? '2px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.5)'
//               }}
//             >
//               <RadioGroup
//                 row
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 style={{ color: '#ffffff' }}
//               >
//                 <FormControlLabel 
//                   value="USER" 
//                   control={<Radio style={{ color: '#ffffff' }} />} 
//                   label="User" 
//                   style={{ color: '#ffffff' }}
//                 />
//                 <FormControlLabel 
//                   value="ADMIN" 
//                   control={<Radio style={{ color: '#ffffff' }} />} 
//                   label="Admin" 
//                   style={{ color: '#ffffff' }}
//                 />
//               </RadioGroup>
//             </FormControl>
//           </motion.div>
          
//           <motion.div variants={buttonVariants} initial="hidden" animate="visible">
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={loading}
//               className="py-1.5 text-base font-semibold"
//               style={{
//                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                 color: '#ffffff',
//                 borderRadius: '8px',
//                 backdropFilter: 'blur(5px)',
//                 border: '1px solid rgba(255, 255, 255, 0.3)',
//                 fontWeight: 'bold',
//                 fontSize: '0.95rem',
//                 boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
//                 transition: 'all 0.3s ease'
//               }}
//             >
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </Button>
//           </motion.div>
//         </form>
        
//         <motion.div 
//           className="mt-3 text-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//         >
//           <p className="text-white text-opacity-90 text-sm">
//             Already have an account?{' '}
//             <motion.a 
//               href="/login" 
//               className="font-semibold text-white hover:underline"
//               whileHover={{ scale: 1.05, color: '#f0f0f0' }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Sign in here
//             </motion.a>
//           </p>
//         </motion.div>
//       </motion.div>
      
//       {/* Success Dialog */}
//       <Dialog
//         open={showSuccessDialog}
//         onClose={handleCloseSuccessDialog}
//         PaperProps={{
//           component: motion.div,
//           variants: {
//             hidden: { scale: 0.8, opacity: 0 },
//             visible: { scale: 1, opacity: 1 },
//           },
//           initial: "hidden",
//           animate: "visible",
//           transition: { type: 'spring', stiffness: 300, damping: 20 },
//           style: {
//             background: 'rgba(255, 255, 255, 0.9)',
//             backdropFilter: 'blur(10px)',
//             borderRadius: '12px'
//           }
//         }}
//       >
//         <DialogTitle className="flex items-center" style={{ color: '#000000' }}>
//           <FaCheckCircle className="mr-2" style={{ color: '#4caf50' }} />
//           Registration Successful
//         </DialogTitle>
//         <DialogContent>
//           <Alert severity="success">
//             <AlertTitle>Success!</AlertTitle>
//             Your account has been created successfully. Redirecting to {formData.role === 'ADMIN' ? 'Admin Dashboard' : 'User Dashboard'}...
//           </Alert>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseSuccessDialog} style={{ color: '#000000' }}>
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>
      
//       {/* Error Dialog */}
//       <Dialog
//         open={showErrorDialog}
//         onClose={handleCloseErrorDialog}
//         PaperProps={{
//           component: motion.div,
//           variants: {
//             hidden: { scale: 0.8, opacity: 0 },
//             visible: { scale: 1, opacity: 1 },
//           },
//           initial: "hidden",
//           animate: "visible",
//           transition: { type: 'spring', stiffness: 300, damping: 20 },
//           style: {
//             background: 'rgba(255, 255, 255, 0.9)',
//             backdropFilter: 'blur(10px)',
//             borderRadius: '12px'
//           }
//         }}
//       >
//         <DialogTitle className="flex items-center" style={{ color: '#000000' }}>
//           <FaExclamationCircle className="mr-2" style={{ color: '#f44336' }} />
//           Registration Failed
//         </DialogTitle>
//         <DialogContent>
//           <Alert severity="error">
//             <AlertTitle>Error</AlertTitle>
//             {error || 'Please correct the errors in the form and try again.'}
//           </Alert>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseErrorDialog} style={{ color: '#000000' }}>
//             Try Again
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </motion.div>
//   );
// }

// export default Register;