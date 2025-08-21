package com.hotelbooking.service;

import com.hotelbooking.dto.RoomDTO;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.entity.Room;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private HotelRepository hotelRepository;

    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelHotelId(hotelId);
    }

    public Room add(RoomDTO roomDTO) {
        Hotel hotel = hotelRepository.findById(roomDTO.getHotelId()).orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomType(roomDTO.getRoomType());
        room.setPricePerNight(roomDTO.getPricePerNight());
        room.setAmenities(roomDTO.getAmenities());
        room.setAvailabilityStatus(roomDTO.getAvailabilityStatus());
        return roomRepository.save(room);
    }

    public Room update(Long id, RoomDTO roomDTO) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        Hotel hotel = hotelRepository.findById(roomDTO.getHotelId()).orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        room.setHotel(hotel);
        room.setRoomType(roomDTO.getRoomType());
        room.setPricePerNight(roomDTO.getPricePerNight());
        room.setAmenities(roomDTO.getAmenities());
        room.setAvailabilityStatus(roomDTO.getAvailabilityStatus());
        return roomRepository.save(room);
    }

    public void delete(Long id) {
        roomRepository.deleteById(id);
    }
}