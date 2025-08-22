package com.hotelbooking.dto;

import lombok.Data;
import java.util.List;

@Data
public class HotelDTO {
    private String name;
    private String location;
    private String description;
    private Double rating;
    private Double price;
    private String roomType;
    private List<String> hotelImages; // multiple images
}
