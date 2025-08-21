package com.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    private Double amount;
    private String status;
    private LocalDateTime paymentDate;
}