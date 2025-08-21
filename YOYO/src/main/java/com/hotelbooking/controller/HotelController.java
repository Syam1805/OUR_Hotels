package com.hotelbooking.controller;

import com.hotelbooking.dto.HotelDTO;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> search(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) String roomType
    ) {
        return ResponseEntity.ok(
            hotelService.searchHotels(location, priceMin, priceMax, roomType)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> add(@RequestBody HotelDTO hotelDTO) {
        return new ResponseEntity<>(hotelService.add(hotelDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> update(@PathVariable Long id, @RequestBody HotelDTO hotelDTO) {
        return ResponseEntity.ok(hotelService.update(id, hotelDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hotelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
