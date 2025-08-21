package com.hotelbooking.controller;

import com.hotelbooking.dto.PaymentDTO;
import com.hotelbooking.entity.Payment;
import com.hotelbooking.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> process(@RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.ok(paymentService.process(paymentDTO));
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getByBooking(bookingId));
    }
}