package com.hotelbooking.repository;

import com.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Correct property path through the relation: user.userId
    List<Booking> findByUser_UserId(Long userId);

    @Query("SELECT b FROM Booking b " +
           "WHERE b.room.roomId = :roomId " +
           "AND b.status = 'CONFIRMED' " +
           "AND (b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)")
    List<Booking> findOverlappingBookings(@Param("roomId") Long roomId,
                                          @Param("checkInDate") LocalDate checkInDate,
                                          @Param("checkOutDate") LocalDate checkOutDate);
}
