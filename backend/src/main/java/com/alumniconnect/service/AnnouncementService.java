package com.alumniconnect.service;

import com.alumniconnect.dto.AnnouncementDTO;
import com.alumniconnect.entity.Announcement;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.AnnouncementRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * AnnouncementService - Business logic for Announcements.
 */
@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all announcements (most recent first).
     */
    public List<AnnouncementDTO> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAllByOrderByCreatedAtDesc();
        return announcements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a single announcement by ID.
     */
    public AnnouncementDTO getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
        return convertToDTO(announcement);
    }

    /**
     * Create a new announcement (Admin only).
     */
    public AnnouncementDTO createAnnouncement(AnnouncementDTO dto, Long adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminUserId));

        Announcement announcement = new Announcement();
        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcement.setCategory(dto.getCategory() != null ? dto.getCategory() : "GENERAL");
        announcement.setCreatedBy(admin);

        Announcement saved = announcementRepository.save(announcement);
        return convertToDTO(saved);
    }

    /**
     * Update an announcement (Admin only).
     */
    public AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO dto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));

        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcement.setCategory(dto.getCategory());

        Announcement updated = announcementRepository.save(announcement);
        return convertToDTO(updated);
    }

    /**
     * Delete an announcement (Admin only).
     */
    public void deleteAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
        announcementRepository.delete(announcement);
    }

    /**
     * Convert Announcement entity to DTO.
     */
    private AnnouncementDTO convertToDTO(Announcement announcement) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setContent(announcement.getContent());
        dto.setCategory(announcement.getCategory());
        dto.setCreatedAt(announcement.getCreatedAt());
        if (announcement.getCreatedBy() != null) {
            dto.setCreatedBy(announcement.getCreatedBy().getId());
            dto.setCreatedByName(announcement.getCreatedBy().getFirstName()
                    + " " + announcement.getCreatedBy().getLastName());
        }
        return dto;
    }
}
