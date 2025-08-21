package com.hotelbooking.controller;

import com.hotelbooking.dto.AuthResponse;
import com.hotelbooking.dto.LoginDTO;
import com.hotelbooking.dto.UserDTO;
import com.hotelbooking.entity.User;
import com.hotelbooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserDTO userDTO) {
        User registeredUser = userService.register(userDTO);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO) {
        AuthResponse response = userService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
}
