package com.hotelbooking.controller;

import com.hotelbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Double>> getRevenueReport(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(bookingService.getRevenueReport(startDate, endDate));
    }

    @GetMapping("/occupancy")
    public ResponseEntity<Map<String, Double>> getOccupancyReport(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(bookingService.getOccupancyReport(startDate, endDate));
    }
}
