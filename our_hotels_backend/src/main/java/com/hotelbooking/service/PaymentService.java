package com.hotelbooking.service;

import com.hotelbooking.dto.PaymentDTO;
import com.hotelbooking.entity.Booking;
import com.hotelbooking.entity.Payment;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingRepository bookingRepository;

    public Payment process(PaymentDTO paymentDTO) {
        Booking booking = bookingRepository.findById(paymentDTO.getBookingId()).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(paymentDTO.getAmount());
        payment.setStatus("COMPLETED"); // Mock success
        payment.setPaymentDate(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public Payment getByBooking(Long bookingId) {
        return paymentRepository.findByBookingBookingId(bookingId);
    }
}