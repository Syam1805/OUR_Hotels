package com.hotelbooking.service;

import com.hotelbooking.dto.BookingDTO;
import com.hotelbooking.entity.Booking;
import com.hotelbooking.entity.Room;
import com.hotelbooking.entity.User;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Transactional
    public BookingDTO book(BookingDTO bookingDTO) {
        if (bookingDTO.getCheckInDate() == null || bookingDTO.getCheckOutDate() == null) {
            throw new IllegalArgumentException("Check-in and check-out dates are required");
        }
        if (!bookingDTO.getCheckOutDate().isAfter(bookingDTO.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out must be after check-in");
        }

        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Check overlaps
        var overlapping = bookingRepository.findOverlappingBookings(
                room.getRoomId(), bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate()
        );
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Room is already booked for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(bookingDTO.getCheckInDate());
        booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        booking.setTotalPrice(nights * room.getPricePerNight());
        booking.setStatus("CONFIRMED");

        Booking saved = bookingRepository.save(booking);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getByUser(Long userId) {
        return bookingRepository.findByUser_UserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancel(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus("CANCELED");
        bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /** ✅ NEW METHOD: Revenue Report */
    @Transactional(readOnly = true)
    public Map<String, Double> getRevenueReport(LocalDate startDate, LocalDate endDate) {
        List<Booking> bookings = bookingRepository.findAll();

        double totalRevenue = bookings.stream()
                .filter(b -> !b.getCheckInDate().isAfter(endDate) &&
                             !b.getCheckOutDate().isBefore(startDate) &&
                             "CONFIRMED".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        Map<String, Double> report = new HashMap<>();
        report.put("totalRevenue", totalRevenue);
        return report;
    }

    /** ✅ NEW METHOD: Occupancy Report */
    @Transactional(readOnly = true)
    public Map<String, Double> getOccupancyReport(LocalDate startDate, LocalDate endDate) {
        List<Booking> bookings = bookingRepository.findAll();
        List<Room> rooms = roomRepository.findAll();

        long totalRoomNights = rooms.size() * ChronoUnit.DAYS.between(startDate, endDate);
        long bookedRoomNights = bookings.stream()
                .filter(b -> !b.getCheckInDate().isAfter(endDate) &&
                             !b.getCheckOutDate().isBefore(startDate) &&
                             "CONFIRMED".equalsIgnoreCase(b.getStatus()))
                .mapToLong(b -> ChronoUnit.DAYS.between(
                        b.getCheckInDate().isBefore(startDate) ? startDate : b.getCheckInDate(),
                        b.getCheckOutDate().isAfter(endDate) ? endDate : b.getCheckOutDate()
                ))
                .sum();

        double occupancyRate = totalRoomNights == 0 ? 0.0 :
                ((double) bookedRoomNights / totalRoomNights) * 100.0;

        Map<String, Double> report = new HashMap<>();
        report.put("occupancyRate", occupancyRate);
        return report;
    }

    private BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setUserId(booking.getUser().getUserId());

        Room room = booking.getRoom();
        if (room != null) {
            dto.setRoomId(room.getRoomId());
            dto.setRoomType(room.getRoomType());

            if (room.getHotel() != null) {
                dto.setHotelName(room.getHotel().getName());
            }
        }

        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        return dto;
    }
}
