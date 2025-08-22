package com.hotelbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;   // JWT or Session token
    private String role;    // USER or ADMIN
    private Long userId;    // For tracking logged-in user
}
