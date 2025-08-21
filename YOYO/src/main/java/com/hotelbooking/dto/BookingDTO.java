package com.hotelbooking.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingDTO {
    private Long bookingId;
    private Long userId;
    private Long roomId;

    // Flattened fields for the UI (avoid lazy serialization problems)
    private String hotelName;   // from room.getHotel().getName()
    private String roomType;    // from room.getRoomType()

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalPrice;
    private String status;
}
