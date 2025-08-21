package com.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)   // ✅ ensure not null
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)   // ✅ ensure not null
    private Room room;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalPrice;
    private String status; // CONFIRMED, CANCELED, COMPLETED
}
