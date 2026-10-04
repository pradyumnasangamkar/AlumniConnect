package com.alumniconnect.service;

import com.alumniconnect.dto.EventDTO;
import com.alumniconnect.entity.Event;
import com.alumniconnect.entity.EventRegistration;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.EventRegistrationRepository;
import com.alumniconnect.repository.EventRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * EventService - Business logic for Event management.
 *
 * Handles:
 * - Creating, updating, deleting events (Admin only)
 * - Listing all events
 * - Listing upcoming events
 * - User registration for events
 * - Getting registered participants
 */
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all events (most useful for Admin view).
     */
    public List<EventDTO> getAllEvents(Long currentUserId) {
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(event -> convertToDTO(event, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming events (for Alumni/Student dashboard).
     * Upcoming = events whose date is today or after today.
     */
    public List<EventDTO> getUpcomingEvents(Long currentUserId) {
        List<Event> events = eventRepository.findByEventDateAfterOrderByEventDateAsc(
                LocalDate.now().minusDays(1));
        return events.stream()
                .map(event -> convertToDTO(event, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * Get a single event by ID.
     */
    public EventDTO getEventById(Long id, Long currentUserId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return convertToDTO(event, currentUserId);
    }

    /**
     * Create a new event (Admin only).
     */
    public EventDTO createEvent(EventDTO dto, Long adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminUserId));

        Event event = new Event();
        event.setEventName(dto.getEventName());
        event.setEventDate(dto.getEventDate());
        if (dto.getEventTime() != null && !dto.getEventTime().isEmpty()) {
            try {
                event.setEventTime(LocalTime.parse(dto.getEventTime()));
            } catch (Exception e) {
                event.setEventTime(LocalTime.of(10, 0));
            }
        }
        event.setLocation(dto.getLocation());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setMaxParticipants(dto.getMaxParticipants());
        event.setCreatedBy(admin);

        Event saved = eventRepository.save(event);
        return convertToDTO(saved, adminUserId);
    }

    /**
     * Update an existing event (Admin only).
     */
    public EventDTO updateEvent(Long id, EventDTO dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        event.setEventName(dto.getEventName());
        event.setEventDate(dto.getEventDate());
        if (dto.getEventTime() != null && !dto.getEventTime().isEmpty()) {
            try {
                event.setEventTime(LocalTime.parse(dto.getEventTime()));
            } catch (Exception e) {
                event.setEventTime(LocalTime.of(10, 0));
            }
        }
        event.setLocation(dto.getLocation());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setMaxParticipants(dto.getMaxParticipants());

        Event updated = eventRepository.save(event);
        return convertToDTO(updated, null);
    }

    /**
     * Delete an event (Admin only).
     */
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        eventRepository.delete(event);
    }

    /**
     * Register a user for an event.
     * Prevents duplicate registrations.
     */
    public String registerForEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Check if already registered
        if (registrationRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalArgumentException("You are already registered for this event!");
        }

        // Check max participants limit if set
        if (event.getMaxParticipants() != null) {
            long currentCount = registrationRepository.countByEvent(event);
            if (currentCount >= event.getMaxParticipants()) {
                throw new IllegalArgumentException("This event has reached its maximum capacity!");
            }
        }

        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setRegistrationDate(LocalDate.now());

        registrationRepository.save(registration);
        return "Successfully registered for " + event.getEventName();
    }

    /**
     * Cancel an event registration.
     */
    public String cancelRegistration(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        EventRegistration registration = registrationRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "You are not registered for this event"));

        registrationRepository.delete(registration);
        return "Registration cancelled successfully";
    }

    /**
     * Get all registrations for a specific event (for Admin to see participants).
     */
    public List<String> getEventParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        List<EventRegistration> registrations = registrationRepository.findByEvent(event);
        return registrations.stream()
                .map(r -> r.getUser().getFirstName() + " " + r.getUser().getLastName()
                        + " (" + r.getUser().getEmail() + ")")
                .collect(Collectors.toList());
    }

    /**
     * Get events that a user has registered for.
     */
    public List<EventDTO> getUserRegisteredEvents(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<EventRegistration> registrations = registrationRepository.findByUser(user);
        return registrations.stream()
                .map(r -> convertToDTO(r.getEvent(), userId))
                .collect(Collectors.toList());
    }

    /**
     * Convert Event entity to EventDTO (safe data for frontend).
     */
    private EventDTO convertToDTO(Event event, Long currentUserId) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setEventDate(event.getEventDate());
        dto.setEventTime(event.getEventTime() != null ?
                event.getEventTime().toString() : "10:00");
        dto.setLocation(event.getLocation());
        dto.setDescription(event.getDescription());
        dto.setCategory(event.getCategory());
        dto.setMaxParticipants(event.getMaxParticipants());
        dto.setRegistrationCount(registrationRepository.countByEvent(event));

        if (event.getCreatedBy() != null) {
            dto.setCreatedBy(event.getCreatedBy().getId());
            dto.setCreatedByName(event.getCreatedBy().getFirstName()
                    + " " + event.getCreatedBy().getLastName());
        }

        // Check if current user has registered
        if (currentUserId != null) {
            userRepository.findById(currentUserId).ifPresent(user -> {
                dto.setRegistered(registrationRepository.existsByUserAndEvent(user, event));
            });
        }

        return dto;
    }
}
