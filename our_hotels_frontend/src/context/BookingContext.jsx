import React, { createContext, useState } from 'react';
import { createBooking, getUserBookings, cancelBooking } from '../api/api.js';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  const bookRoom = async (bookingData) => {
    const newBooking = await createBooking(bookingData);
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  const fetchBookings = async (userId) => {
    const userBookings = await getUserBookings(userId);
    setBookings(userBookings);
    return userBookings;
  };

  const cancel = async (bookingId) => {
    await cancelBooking(bookingId);
    setBookings(bookings.filter((b) => b.bookingId !== bookingId));
  };

  return (
    <BookingContext.Provider value={{ bookings, bookRoom, fetchBookings, cancel }}>
      {children}
    </BookingContext.Provider>
  );
}