package com.alumniconnect.repository;

import com.alumniconnect.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * EventRepository - Data access layer for Event entity.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find upcoming events (events after today)
    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDate date);

    // Find events by category
    List<Event> findByCategory(String category);

    // Count total events (for admin dashboard)
    long count();
}
