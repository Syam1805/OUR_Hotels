package com.hotelbooking.dto;

import lombok.Data;

@Data
public class RoomDTO {
    private Long hotelId;
    private String roomType;
    private Double pricePerNight;
    private String amenities;
    private Boolean availabilityStatus;
}