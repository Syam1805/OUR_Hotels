package com.hotelbooking.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long bookingId;
    private Double amount;
    private String status;
}