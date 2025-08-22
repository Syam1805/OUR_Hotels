package com.hotelbooking.repository;

import com.hotelbooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelHotelId(Long hotelId);
}