package com.alumniconnect.controller;

import com.alumniconnect.repository.AnnouncementRepository;
import com.alumniconnect.repository.EventRepository;
import com.alumniconnect.repository.JobRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AdminController - Provides admin dashboard statistics and overview data.
 *
 * REST API endpoints:
 *   GET /api/admin/stats → Returns platform-wide statistics
 *
 * This controller uses repositories directly (no service layer needed for simple counts).
 * This is acceptable for simple read-only statistics.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    /**
     * GET /api/admin/stats
     *
     * Returns key metrics for the Admin Dashboard:
     * - Total alumni count
     * - Total student count
     * - Total events count
     * - Total jobs count
     * - Total announcements count
     *
     * Uses countByRole() from UserRepository - Spring Data auto-generates the query:
     * SELECT COUNT(*) FROM users WHERE role = ?
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = Map.of(
                "totalAlumni", userRepository.countByRole("ALUMNI"),
                "totalStudents", userRepository.countByRole("STUDENT"),
                "totalEvents", eventRepository.count(),
                "totalJobs", jobRepository.count(),
                "totalAnnouncements", announcementRepository.count()
        );
        return ResponseEntity.ok(stats);
    }
}
