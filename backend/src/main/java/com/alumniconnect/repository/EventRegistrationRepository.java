package com.alumniconnect.repository;

import com.alumniconnect.entity.Event;
import com.alumniconnect.entity.EventRegistration;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * EventRegistrationRepository - Data access for EventRegistration (junction table).
 */
@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    // Find all registrations for a specific event
    List<EventRegistration> findByEvent(Event event);

    // Find all registrations by a specific user
    List<EventRegistration> findByUser(User user);

    // Check if a user is already registered for an event (to prevent duplicates)
    boolean existsByUserAndEvent(User user, Event event);

    // Find a specific registration to allow cancellation
    Optional<EventRegistration> findByUserAndEvent(User user, Event event);

    // Count registrations for an event (to show participant count)
    long countByEvent(Event event);
}
