package com.alumniconnect.controller;

import com.alumniconnect.dto.AnnouncementDTO;
import com.alumniconnect.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AnnouncementController - Handles HTTP requests for Announcements.
 *
 * REST API endpoints:
 *   GET    /api/announcements              → Get all announcements
 *   GET    /api/announcements/{id}         → Get announcement by ID
 *   POST   /api/announcements?adminUserId=1 → Create announcement (Admin)
 *   PUT    /api/announcements/{id}         → Update announcement (Admin)
 *   DELETE /api/announcements/{id}         → Delete announcement (Admin)
 */
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    /**
     * GET /api/announcements
     * Returns all announcements, most recent first.
     */
    @GetMapping
    public ResponseEntity<List<AnnouncementDTO>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    /**
     * GET /api/announcements/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.getAnnouncementById(id));
    }

    /**
     * POST /api/announcements?adminUserId=1
     * Creates a new announcement. Admin only.
     */
    @PostMapping
    public ResponseEntity<AnnouncementDTO> createAnnouncement(
            @RequestBody AnnouncementDTO dto,
            @RequestParam Long adminUserId) {
        AnnouncementDTO created = announcementService.createAnnouncement(dto, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/announcements/{id}
     * Updates an existing announcement.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody AnnouncementDTO dto) {
        AnnouncementDTO updated = announcementService.updateAnnouncement(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/announcements/{id}
     * Deletes an announcement.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok(Map.of("message", "Announcement deleted successfully"));
    }
}
