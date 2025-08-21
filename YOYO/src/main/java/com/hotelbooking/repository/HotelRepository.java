package com.hotelbooking.repository;

import com.hotelbooking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocation(String location);

    @Query("SELECT h FROM Hotel h " +
           "WHERE (:location IS NULL OR h.location = :location) " +
           "AND (:priceMin IS NULL OR h.price >= :priceMin) " +
           "AND (:priceMax IS NULL OR h.price <= :priceMax) " +
           "AND (:roomType IS NULL OR h.roomType = :roomType)")
    List<Hotel> findWithFilters(
            @Param("location") String location,
            @Param("priceMin") Double priceMin,
            @Param("priceMax") Double priceMax,
            @Param("roomType") String roomType
    );
}