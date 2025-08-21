package com.hotelbooking.controller;

import com.hotelbooking.dto.RoomDTO;
import com.hotelbooking.entity.Room;
import com.hotelbooking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping("/hotels/{id}/rooms")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomsByHotel(id));
    }

    @PostMapping("/admin/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> add(@RequestBody RoomDTO roomDTO) {
        System.out.println("Adding room: " + roomDTO);
        return ResponseEntity.ok(roomService.add(roomDTO));
    }


    @PutMapping("/admin/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> update(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.update(id, roomDTO));
    }

    @DeleteMapping("/admin/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.ok().build();
    }
}