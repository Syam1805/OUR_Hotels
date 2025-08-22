package com.hotelbooking.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;
}