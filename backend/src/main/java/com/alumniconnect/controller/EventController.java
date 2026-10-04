package com.alumniconnect.controller;

import com.alumniconnect.dto.EventDTO;
import com.alumniconnect.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * EventController - Handles HTTP requests for Events.
 *
 * REST API endpoints:
 *   GET    /api/events              → Get all events
 *   GET    /api/events/upcoming     → Get upcoming events
 *   GET    /api/events/{id}         → Get event by ID
 *   POST   /api/events              → Create event (Admin)
 *   PUT    /api/events/{id}         → Update event (Admin)
 *   DELETE /api/events/{id}         → Delete event (Admin)
 *   POST   /api/events/{id}/register → Register for event
 *   DELETE /api/events/{id}/register → Cancel registration
 *   GET    /api/events/{id}/participants → Get event participants
 *   GET    /api/events/user/{userId}/registered → Get user's registered events
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * GET /api/events?userId=1
     * Returns all events. Optional userId to check if user is registered.
     */
    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(eventService.getAllEvents(userId));
    }

    /**
     * GET /api/events/upcoming?userId=1
     * Returns upcoming events (after today).
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(eventService.getUpcomingEvents(userId));
    }

    /**
     * GET /api/events/{id}?userId=1
     * Returns a single event with registration details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(eventService.getEventById(id, userId));
    }

    /**
     * POST /api/events?adminUserId=1
     * Creates a new event. Admin only.
     * Request body contains event details as JSON.
     */
    @PostMapping
    public ResponseEntity<EventDTO> createEvent(
            @RequestBody EventDTO dto,
            @RequestParam Long adminUserId) {
        EventDTO created = eventService.createEvent(dto, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/events/{id}
     * Updates an existing event.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable Long id,
            @RequestBody EventDTO dto) {
        EventDTO updated = eventService.updateEvent(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/events/{id}
     * Deletes an event (Admin only).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }

    /**
     * POST /api/events/{id}/register
     * Registers a user for an event.
     * Request body: { "userId": 5 }
     */
    @PostMapping("/{id}/register")
    public ResponseEntity<Map<String, String>> registerForEvent(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        String message = eventService.registerForEvent(id, userId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * DELETE /api/events/{id}/register?userId=5
     * Cancels a user's event registration.
     */
    @DeleteMapping("/{id}/register")
    public ResponseEntity<Map<String, String>> cancelRegistration(
            @PathVariable Long id,
            @RequestParam Long userId) {
        String message = eventService.cancelRegistration(id, userId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * GET /api/events/{id}/participants
     * Gets list of participants for an event (for Admin view).
     */
    @GetMapping("/{id}/participants")
    public ResponseEntity<List<String>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventParticipants(id));
    }

    /**
     * GET /api/events/user/{userId}/registered
     * Gets all events a user has registered for.
     */
    @GetMapping("/user/{userId}/registered")
    public ResponseEntity<List<EventDTO>> getUserRegisteredEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(eventService.getUserRegisteredEvents(userId));
    }
}
