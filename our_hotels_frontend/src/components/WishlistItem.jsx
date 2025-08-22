import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMapMarkerAlt, FaStar, FaShareAlt, FaEye, FaHeart, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Button, Typography, Card, CardContent, CardMedia, IconButton, Tooltip, Snackbar } from '@mui/material';
import { useWishlist } from '../context/WishlistContext';

function WishlistItem({ hotel, onRemove }) {
  const theme = useTheme();
  const { removeFromWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromWishlist(hotel.id);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/hotels/${hotel.id}`;
    const shareText = `Check out ${hotel.name} in ${hotel.location}`;
    
    // Try using the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        console.log('Error sharing:', error);
        // Fall back to clipboard copy if sharing fails
      }
    }
    
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setShareOpen(true);
      
      // Reset the copied status after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCloseShareNotification = () => {
    setShareOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          scale: 1.03, 
          boxShadow: `0 10px 30px ${theme.palette?.accent?.main || '#FF5722'}40`,
          y: -5
        }}
        className="border rounded-xl overflow-hidden relative"
        style={{ 
          backgroundColor: theme.palette?.background?.paper || '#ffffff',
          borderColor: theme.palette?.divider || '#e0e0e0'
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Floating heart animation */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            rotate: isHovered ? [0, 15, -15, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
            <FaHeart />
          </div>
        </motion.div>
        <Card className="h-full border-0 shadow-none">
          <CardMedia
            component="div"
            style={{
              height: '200px',
              backgroundImage: `url(${hotel.image || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            <motion.div
              className="absolute top-3 right-3 flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tooltip title={isCopied ? "Copied!" : "Share"}>
                <IconButton
                  className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
                  aria-label="Share hotel"
                  sx={{ minWidth: 'auto', p: 1 }}
                  onClick={handleShare}
                >
                  {isCopied ? (
                    <FaCheck style={{ color: theme.palette?.success?.main || '#4caf50' }} />
                  ) : (
                    <FaShareAlt style={{ color: theme.palette?.primary?.main || '#8B0000' }} />
                  )}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Quick View">
                <IconButton
                  className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
                  aria-label="Quick view"
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  <FaEye style={{ color: theme.palette?.primary?.main || '#8B0000' }} />
                </IconButton>
              </Tooltip>
            </motion.div>
            
            <Button
              className="absolute bottom-3 right-3 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
              onClick={handleRemove}
              aria-label={`Remove ${hotel.name} from wishlist`}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <FaTrash />
            </Button>
          </CardMedia>
          
          <CardContent className="p-5">
            <Typography 
              variant="h5" 
              component="h3" 
              className="font-bold mb-2"
              style={{ color: theme.palette?.primary?.dark || '#7f1d1d' }}
            >
              {hotel.name}
            </Typography>
            
            <Typography 
              variant="body1" 
              className="flex items-center mb-3 text-gray-600"
            >
              <FaMapMarkerAlt className="mr-2 text-red-600" />
              {hotel.location}
            </Typography>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <FaStar className="mr-1 text-yellow-500" />
                <Typography variant="body1" fontWeight="bold">
                  {hotel.rating || '4.5'}
                </Typography>
                <span className="text-sm text-gray-500 ml-1">(128)</span>
              </div>
              
              <Typography 
                variant="h5" 
                fontWeight="bold"
                style={{ color: theme.palette?.primary?.main || '#8B0000' }}
              >
                ${hotel.price || '100'}
                <span className="text-sm font-normal text-gray-500">/night</span>
              </Typography>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="contained"
                fullWidth
                component={Link}
                to={`/hotels/${hotel.id}`}
                className="py-2.5 rounded-lg font-medium shadow-md"
                sx={{
                  backgroundColor: theme.palette?.primary?.main || '#8B0000',
                  '&:hover': {
                    backgroundColor: theme.palette?.primary?.dark || '#7f1d1d',
                  },
                  flex: 3
                }}
              >
                View Details
              </Button>
              
              <Button
                variant="outlined"
                className="py-2.5 rounded-lg font-medium"
                onClick={handleShare}
                sx={{
                  borderColor: theme.palette?.primary?.main || '#8B0000',
                  color: theme.palette?.primary?.main || '#8B0000',
                  '&:hover': {
                    borderColor: theme.palette?.primary?.dark || '#7f1d1d',
                    backgroundColor: 'rgba(139, 0, 0, 0.05)',
                  },
                  flex: 1
                }}
              >
                {isCopied ? <FaCheck /> : <FaShareAlt />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Snackbar
        open={shareOpen}
        autoHideDuration={3000}
        onClose={handleCloseShareNotification}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            backgroundColor: theme.palette?.success?.main || '#4caf50',
            color: 'white',
            fontWeight: 'bold',
          }
        }}
      />
    </>
  );
}

export default WishlistItem;