package com.alumniconnect.repository;

import com.alumniconnect.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * AnnouncementRepository - Data access layer for Announcement entity.
 */
@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // Get all announcements, most recent first
    List<Announcement> findAllByOrderByCreatedAtDesc();

    // Get announcements by category
    List<Announcement> findByCategoryOrderByCreatedAtDesc(String category);
}
