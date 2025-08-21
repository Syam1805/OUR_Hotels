package com.hotelbooking.controller;

import com.hotelbooking.dto.ContactDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@Validated
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @PostMapping
    public ResponseEntity<String> handleContact(@Valid @RequestBody ContactDTO contactDTO) {
        // For now: Mock email sending by logging
        logger.info("📩 New contact form submission: Name={}, Email={}, Message={}",
                contactDTO.getName(), contactDTO.getEmail(), contactDTO.getMessage());

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body("Message sent successfully ✅");
    }
}
