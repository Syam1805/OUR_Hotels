package com.hotelbooking.service;

import com.hotelbooking.dto.HotelDTO;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> searchHotels(String location, Double priceMin, Double priceMax, String roomType) {
        return hotelRepository.findWithFilters(location, priceMin, priceMax, roomType);
    }

    public Hotel getById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    public Hotel add(HotelDTO hotelDTO) {
        Hotel hotel = mapToEntity(hotelDTO);
        return hotelRepository.save(hotel);
    }

    public Hotel update(Long id, HotelDTO hotelDTO) {
        Hotel hotel = getById(id);
        hotel.setName(hotelDTO.getName());
        hotel.setLocation(hotelDTO.getLocation());
        hotel.setDescription(hotelDTO.getDescription());
        hotel.setRating(hotelDTO.getRating());
        hotel.setPrice(hotelDTO.getPrice());
        hotel.setRoomType(hotelDTO.getRoomType());
        hotel.setHotelImages(hotelDTO.getHotelImages());
        return hotelRepository.save(hotel);
    }

    public void delete(Long id) {
        Hotel hotel = getById(id);
        hotelRepository.delete(hotel);
    }

    private Hotel mapToEntity(HotelDTO dto) {
        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setLocation(dto.getLocation());
        hotel.setDescription(dto.getDescription());
        hotel.setRating(dto.getRating());
        hotel.setPrice(dto.getPrice());
        hotel.setRoomType(dto.getRoomType());
        hotel.setHotelImages(dto.getHotelImages());
        return hotel;
    }
}
