package com.alumniconnect.controller;

import com.alumniconnect.dto.AlumniProfileDTO;
import com.alumniconnect.service.AlumniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AlumniController - Handles HTTP requests for Alumni profiles.
 *
 * REST API endpoints:
 *   GET    /api/alumni              → Get all alumni (directory)
 *   GET    /api/alumni/{id}         → Get alumni by profile ID
 *   GET    /api/alumni/user/{userId}→ Get alumni by user ID
 *   PUT    /api/alumni/user/{userId}→ Update alumni profile
 *   GET    /api/alumni/search       → Search alumni (with query param)
 *   GET    /api/alumni/filter       → Filter alumni (by year/dept)
 *
 * @PathVariable: Extracts value from URL path. E.g., /api/alumni/5 → id = 5
 * @RequestParam: Extracts value from query string. E.g., /api/alumni/search?q=java → q = "java"
 * @RequestBody: Reads JSON from request body and converts to Java object
 */
@RestController
@RequestMapping("/api/alumni")
public class AlumniController {

    @Autowired
    private AlumniService alumniService;

    /**
     * GET /api/alumni
     * Returns all alumni profiles for the Alumni Directory.
     */
    @GetMapping
    public ResponseEntity<List<AlumniProfileDTO>> getAllAlumni() {
        List<AlumniProfileDTO> alumni = alumniService.getAllAlumni();
        return ResponseEntity.ok(alumni);
    }

    /**
     * GET /api/alumni/{id}
     * Returns a single alumni profile by its profile ID.
     *
     * @PathVariable Long id → extracts {id} from the URL
     */
    @GetMapping("/{id}")
    public ResponseEntity<AlumniProfileDTO> getAlumniById(@PathVariable Long id) {
        AlumniProfileDTO alumni = alumniService.getAlumniById(id);
        return ResponseEntity.ok(alumni);
    }

    /**
     * GET /api/alumni/user/{userId}
     * Returns a single alumni profile by the User ID.
     * Used to fetch logged-in alumni's own profile.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<AlumniProfileDTO> getAlumniByUserId(@PathVariable Long userId) {
        AlumniProfileDTO alumni = alumniService.getAlumniByUserId(userId);
        return ResponseEntity.ok(alumni);
    }

    /**
     * PUT /api/alumni/user/{userId}
     * Updates an alumni profile.
     *
     * @RequestBody AlumniProfileDTO dto → reads the updated profile from request JSON body
     */
    @PutMapping("/user/{userId}")
    public ResponseEntity<AlumniProfileDTO> updateAlumniProfile(
            @PathVariable Long userId,
            @RequestBody AlumniProfileDTO dto) {
        AlumniProfileDTO updated = alumniService.updateAlumniProfile(userId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET /api/alumni/search?q=searchTerm
     * Searches alumni by name, job role, or company.
     *
     * @RequestParam String q → reads "q" from query string: /api/alumni/search?q=java
     */
    @GetMapping("/search")
    public ResponseEntity<List<AlumniProfileDTO>> searchAlumni(
            @RequestParam("q") String searchTerm) {
        List<AlumniProfileDTO> results = alumniService.searchAlumni(searchTerm);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/alumni/filter?year=2022&department=Computer Science
     * Filters alumni by graduation year and/or department.
     */
    @GetMapping("/filter")
    public ResponseEntity<List<AlumniProfileDTO>> filterAlumni(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String department) {

        if (year != null) {
            return ResponseEntity.ok(alumniService.getAlumniByGraduationYear(year));
        } else if (department != null && !department.isEmpty()) {
            return ResponseEntity.ok(alumniService.getAlumniByDepartment(department));
        } else {
            return ResponseEntity.ok(alumniService.getAllAlumni());
        }
    }
}
