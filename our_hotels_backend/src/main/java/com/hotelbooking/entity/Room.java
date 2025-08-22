package com.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    private String roomType; // single, double, suite
    private Double pricePerNight;
    private String amenities;
    private Boolean availabilityStatus;
}