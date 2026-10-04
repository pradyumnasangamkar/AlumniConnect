package com.alumniconnect.controller;

import com.alumniconnect.dto.JobDTO;
import com.alumniconnect.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * JobController - Handles HTTP requests for Job postings.
 *
 * REST API endpoints:
 *   GET    /api/jobs                    → Get all jobs
 *   GET    /api/jobs/{id}               → Get job by ID
 *   POST   /api/jobs?alumniUserId=1     → Post a job (Alumni)
 *   PUT    /api/jobs/{id}?userId=1      → Update a job
 *   DELETE /api/jobs/{id}?userId=1      → Delete a job
 *   GET    /api/jobs/search?q=java      → Search jobs
 *   GET    /api/jobs/alumni/{userId}    → Jobs posted by an alumni
 *   POST   /api/jobs/{id}/apply        → Apply for a job
 *   GET    /api/jobs/user/{userId}/applications → User's applications
 */
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    /**
     * GET /api/jobs?userId=1
     * Returns all jobs. Optional userId to check application status.
     */
    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(jobService.getAllJobs(userId));
    }

    /**
     * GET /api/jobs/{id}?userId=1
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(jobService.getJobById(id, userId));
    }

    /**
     * GET /api/jobs/alumni/{userId}
     * Get all jobs posted by a specific alumni.
     */
    @GetMapping("/alumni/{userId}")
    public ResponseEntity<List<JobDTO>> getJobsByAlumni(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.getJobsByAlumni(userId));
    }

    /**
     * POST /api/jobs?alumniUserId=1
     * Creates a new job posting. Alumni only.
     */
    @PostMapping
    public ResponseEntity<JobDTO> createJob(
            @RequestBody JobDTO dto,
            @RequestParam Long alumniUserId) {
        JobDTO created = jobService.createJob(dto, alumniUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/jobs/{id}?userId=1
     * Updates a job posting. Only the poster can update.
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobDTO> updateJob(
            @PathVariable Long id,
            @RequestBody JobDTO dto,
            @RequestParam Long userId) {
        JobDTO updated = jobService.updateJob(id, dto, userId);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/jobs/{id}?userId=1
     * Deletes a job posting. Only the poster or admin can delete.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(
            @PathVariable Long id,
            @RequestParam Long userId) {
        jobService.deleteJob(id, userId);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    /**
     * GET /api/jobs/search?q=java
     * Searches jobs by title, company, skills, or location.
     */
    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> searchJobs(
            @RequestParam("q") String searchTerm,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(jobService.searchJobs(searchTerm, userId));
    }

    /**
     * POST /api/jobs/{id}/apply
     * Apply for a job.
     * Request body: { "userId": 5, "coverNote": "I am interested..." }
     */
    @PostMapping("/{id}/apply")
    public ResponseEntity<Map<String, String>> applyForJob(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String coverNote = (String) body.getOrDefault("coverNote", "");
        String message = jobService.applyForJob(id, userId, coverNote);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * GET /api/jobs/user/{userId}/applications
     * Get all jobs a user has applied to.
     */
    @GetMapping("/user/{userId}/applications")
    public ResponseEntity<List<JobDTO>> getUserApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.getUserApplications(userId));
    }
}
