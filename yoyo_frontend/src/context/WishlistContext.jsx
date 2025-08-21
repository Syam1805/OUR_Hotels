import React, { createContext, useState, useEffect, useContext } from "react";

// Create context with default value
const WishlistContext = createContext({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  clearWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {},
  getWishlistCount: () => 0,
  shareWishlist: () => {},
});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Error parsing wishlist from localStorage:", error);
      return [];
    }
  });

  // Persist wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add hotel to wishlist (avoid duplicates)
  const addToWishlist = (hotel) => {
    setWishlist((prev) => {
      if (!prev.some((item) => item.id === hotel.id)) {
        return [...prev, { ...hotel, addedAt: new Date().toISOString() }];
      }
      return prev;
    });
  };

  // Remove hotel by ID
  const removeFromWishlist = (hotelId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== hotelId));
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  // Check if hotel is in wishlist
  const isInWishlist = (hotelId) => {
    return wishlist.some((item) => item.id === hotelId);
  };

  // Toggle hotel in wishlist
  const toggleWishlist = (hotel) => {
    if (isInWishlist(hotel.id)) {
      removeFromWishlist(hotel.id);
    } else {
      addToWishlist(hotel);
    }
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Share wishlist (returns a shareable URL or data)
  const shareWishlist = () => {
    // In a real app, this might generate a shareable link
    // For now, we'll return the wishlist data
    return {
      title: "My Hotel Wishlist",
      text: `Check out my wishlist with ${wishlist.length} hotels!`,
      url: window.location.href,
      data: wishlist
    };
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        toggleWishlist,
        getWishlistCount,
        shareWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to use Wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

export default WishlistContext;