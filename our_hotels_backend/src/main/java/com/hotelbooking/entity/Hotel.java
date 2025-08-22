package com.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hotelId;

    private String name;
    private String location;
    private String description;
    private Double rating;
    private Double price;
    private String roomType;

    @ElementCollection(fetch = FetchType.EAGER) // Store list of image URLs
    @CollectionTable(name = "hotel_images", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "image_url")
    private List<String> hotelImages; 
}
