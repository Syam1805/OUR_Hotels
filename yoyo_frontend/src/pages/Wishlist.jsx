import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaRegHeart, 
  FaMapMarkerAlt, 
  FaHotel, 
  FaStar, 
  FaTimes, 
  FaShareAlt,
  FaTrash,
  FaDownload,
  FaFilter
} from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import { 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { useWishlist } from "../context/WishlistContext";
import WishlistItem from '../components/WishlistItem';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  hover: {
    scale: 1.03,
    y: -10,
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3 },
  },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse"
  }
};

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist, shareWishlist } = useWishlist();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

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

  const handleBrowseHotels = () => {
    navigate('/hotels');
  };

  const handleClearWishlist = () => {
    clearWishlist();
    setConfirmDialogOpen(false);
    setSnackbarMessage("Wishlist cleared successfully");
    setSnackbarOpen(true);
  };

  const handleShareWishlist = () => {
    const shareData = shareWishlist();
    
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          setSnackbarMessage("Wishlist shared successfully");
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.log('Error sharing:', error);
        });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(JSON.stringify(shareData.data, null, 2));
      setSnackbarMessage("Wishlist copied to clipboard");
      setSnackbarOpen(true);
    }
    
    setShareDialogOpen(false);
  };

  const handleDownloadWishlist = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wishlist, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "my-wishlist.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setSnackbarMessage("Wishlist downloaded successfully");
    setSnackbarOpen(true);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  // Filter and sort wishlist
  const filteredWishlist = wishlist
    .filter(item => {
      if (filterBy === "high-rated") return (item.rating || 0) >= 4.5;
      if (filterBy === "low-price") return (item.price || 0) <= 150;
      return true;
    })
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.addedAt) - new Date(a.addedAt);
      if (sortBy === "oldest") return new Date(a.addedAt) - new Date(b.addedAt);
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen p-4 md:p-8 transition-all duration-300"
      style={{ 
        backgroundColor: theme.palette?.background?.default || "#F5F5F5",
        marginLeft: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%'
      }}
    >
      <Box className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4"
        >
          <div className="flex items-center">
            <Typography
              variant="h3"
              component="h1"
              className="font-bold flex items-center"
              style={{ color: theme.palette?.primary?.main || "#8B0000" }}
            >
              <FaRegHeart className="mr-3" />
              My Wishlist
            </Typography>
            <Chip 
              label={`${wishlist.length} items`} 
              color="primary" 
              size="small"
              className="ml-3"
              style={{ backgroundColor: theme.palette?.primary?.main || "#8B0000" }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              startIcon={<FaFilter />}
              onClick={handleFilterClick}
              className="px-4 py-2 rounded-lg"
              style={{ 
                borderColor: theme.palette?.primary?.main || "#8B0000",
                color: theme.palette?.primary?.main || "#8B0000"
              }}
            >
              Filter & Sort
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FaShareAlt />}
              onClick={() => setShareDialogOpen(true)}
              className="px-4 py-2 rounded-lg"
              style={{ 
                borderColor: theme.palette?.primary?.main || "#8B0000",
                color: theme.palette?.primary?.main || "#8B0000"
              }}
            >
              Share
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FaDownload />}
              onClick={handleDownloadWishlist}
              className="px-4 py-2 rounded-lg"
              style={{ 
                borderColor: theme.palette?.primary?.main || "#8B0000",
                color: theme.palette?.primary?.main || "#8B0000"
              }}
            >
              Export
            </Button>
            
            {wishlist.length > 0 && (
              <Button
                variant="contained"
                startIcon={<FaTrash />}
                onClick={() => setConfirmDialogOpen(true)}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
              >
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search hotels in your wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white rounded-lg"
            InputProps={{
              style: {
                borderRadius: '12px',
                backgroundColor: theme.palette?.background?.paper || '#ffffff'
              }
            }}
          />
        </motion.div>

        {filteredWishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl shadow-xl"
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
              border: '1px solid rgba(139, 0, 0, 0.1)'
            }}
          >
            <motion.div
              animate={floatingAnimation}
            >
              <FaRegHeart size={64} className="mx-auto mb-4 text-gray-400" />
            </motion.div>
            <Typography variant="h5" className="mb-2 text-gray-600">
              {wishlist.length === 0 ? "Your wishlist is empty" : "No hotels match your search"}
            </Typography>
            <Typography variant="body1" className="text-gray-500 mb-6 max-w-md mx-auto">
              {wishlist.length === 0 
                ? "Start adding hotels to your wishlist by clicking the heart icon on any hotel listing."
                : "Try adjusting your search or filter criteria."
              }
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={handleBrowseHotels}
                className="px-6 py-3 rounded-lg font-medium shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #8B0000 0%, #7f1d1d 100%)',
                  color: 'white'
                }}
              >
                Browse Hotels
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredWishlist.map((item) => (
                  <WishlistItem 
                    key={item.id} 
                    hotel={item} 
                    onRemove={removeFromWishlist} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <Typography variant="body1" className="text-gray-600 mb-4">
                Showing {filteredWishlist.length} of {wishlist.length} hotels in your wishlist
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBrowseHotels}
                  className="px-6 py-2.5 rounded-lg font-medium"
                  style={{ 
                    borderColor: theme.palette?.primary?.main || "#8B0000",
                    color: theme.palette?.primary?.main || "#8B0000"
                  }}
                >
                  Add More Hotels
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        className="mt-2"
      >
        <div className="p-4 w-72">
          <Typography variant="h6" className="mb-3">Sort By</Typography>
          <FormControl fullWidth className="mb-4">
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort"
              onChange={handleSortChange}
            >
              <MenuItem value="newest">Newest Added</MenuItem>
              <MenuItem value="oldest">Oldest Added</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="h6" className="mb-3">Filter By</Typography>
          <FormControl fullWidth>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={filterBy}
              label="Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Hotels</MenuItem>
              <MenuItem value="high-rated">High Rated (4.5+)</MenuItem>
              <MenuItem value="low-price">Budget Friendly ($150 or less)</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Menu>

      {/* Clear Wishlist Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        className="rounded-xl"
      >
        <DialogTitle className="text-red-600 font-bold">
          Clear Entire Wishlist?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all {wishlist.length} hotels from your wishlist? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            className="text-gray-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearWishlist}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Wishlist Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        className="rounded-xl"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="font-bold">
          Share Your Wishlist
        </DialogTitle>
        <DialogContent>
          <Typography className="mb-4">
            Share your wishlist with friends or family:
          </Typography>
          
          <div className="flex flex-col gap-3 mb-4">
            <Button
              variant="outlined"
              startIcon={<FaShareAlt />}
              onClick={handleShareWishlist}
              className="py-2.5 rounded-lg"
              style={{ 
                borderColor: theme.palette?.primary?.main || "#8B0000",
                color: theme.palette?.primary?.main || "#8B0000"
              }}
            >
              Share via Native Sharing
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FaDownload />}
              onClick={handleDownloadWishlist}
              className="py-2.5 rounded-lg"
              style={{ 
                borderColor: theme.palette?.primary?.main || "#8B0000",
                color: theme.palette?.primary?.main || "#8B0000"
              }}
            >
              Download as JSON
            </Button>
          </div>
          
          <Typography variant="body2" className="text-gray-500">
            Your wishlist contains {wishlist.length} hotels.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShareDialogOpen(false)}
            className="text-gray-600"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          className="rounded-lg"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

export default Wishlist;