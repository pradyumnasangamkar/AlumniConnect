package com.alumniconnect.service;

import com.alumniconnect.dto.AlumniProfileDTO;
import com.alumniconnect.entity.AlumniProfile;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.AlumniProfileRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * AlumniService - Business logic for Alumni Profile management.
 *
 * Handles:
 * - Getting all alumni (for the directory)
 * - Getting a single alumni profile
 * - Updating an alumni profile
 * - Searching and filtering alumni
 */
@Service
public class AlumniService {

    @Autowired
    private AlumniProfileRepository alumniProfileRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all alumni profiles (for the Alumni Directory page).
     * Returns a List of AlumniProfileDTO objects (safe data without passwords).
     */
    public List<AlumniProfileDTO> getAllAlumni() {
        List<AlumniProfile> profiles = alumniProfileRepository.findAll();
        return profiles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a single alumni profile by User ID.
     */
    public AlumniProfileDTO getAlumniByUserId(Long userId) {
        AlumniProfile profile = alumniProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alumni profile not found for user id: " + userId));
        return convertToDTO(profile);
    }

    /**
     * Get a single alumni profile by Profile ID.
     */
    public AlumniProfileDTO getAlumniById(Long profileId) {
        AlumniProfile profile = alumniProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alumni profile", "id", profileId));
        return convertToDTO(profile);
    }

    /**
     * Update an alumni profile.
     * Only the alumni themselves can update their own profile.
     */
    public AlumniProfileDTO updateAlumniProfile(Long userId, AlumniProfileDTO dto) {

        // Find the existing profile
        AlumniProfile profile = alumniProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alumni profile not found for user id: " + userId));

        // Update the fields
        profile.setCompanyName(dto.getCompanyName());
        profile.setJobRole(dto.getJobRole());
        profile.setLocation(dto.getLocation());
        profile.setPhone(dto.getPhone());
        profile.setBio(dto.getBio());
        profile.setSkills(dto.getSkills());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setProfilePhotoUrl(dto.getProfilePhotoUrl());
        if (dto.getGraduationYear() != null) {
            profile.setGraduationYear(dto.getGraduationYear());
        }
        if (dto.getDepartment() != null) {
            profile.setDepartment(dto.getDepartment());
        }

        // Save the updated profile
        AlumniProfile updated = alumniProfileRepository.save(profile);
        return convertToDTO(updated);
    }

    /**
     * Search alumni by name, job role, or company.
     */
    public List<AlumniProfileDTO> searchAlumni(String searchTerm) {
        List<AlumniProfile> profiles = alumniProfileRepository.searchAlumni(searchTerm);
        return profiles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Filter alumni by graduation year.
     */
    public List<AlumniProfileDTO> getAlumniByGraduationYear(Integer year) {
        List<AlumniProfile> profiles = alumniProfileRepository.findByGraduationYear(year);
        return profiles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Filter alumni by department.
     */
    public List<AlumniProfileDTO> getAlumniByDepartment(String department) {
        List<AlumniProfile> profiles =
                alumniProfileRepository.findByDepartmentContainingIgnoreCase(department);
        return profiles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert AlumniProfile entity to AlumniProfileDTO.
     * This is done to avoid sending the password and other sensitive data.
     * This pattern is called "mapping" or "converting entity to DTO".
     */
    private AlumniProfileDTO convertToDTO(AlumniProfile profile) {
        AlumniProfileDTO dto = new AlumniProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setFirstName(profile.getUser().getFirstName());
        dto.setLastName(profile.getUser().getLastName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setDepartment(profile.getDepartment() != null ?
                profile.getDepartment() : profile.getUser().getDepartment());
        dto.setGraduationYear(profile.getGraduationYear() != null ?
                profile.getGraduationYear() : profile.getUser().getGraduationYear());
        dto.setCompanyName(profile.getCompanyName());
        dto.setJobRole(profile.getJobRole());
        dto.setLocation(profile.getLocation());
        dto.setPhone(profile.getPhone());
        dto.setBio(profile.getBio());
        dto.setSkills(profile.getSkills());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setProfilePhotoUrl(profile.getProfilePhotoUrl());
        return dto;
    }
}
