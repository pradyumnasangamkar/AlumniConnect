package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * AnnouncementDTO - Used to create/update announcements and return data to the client.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementDTO {

    private Long id;
    private String title;
    private String content;
    private String category;
    private LocalDateTime createdAt;
    private Long createdBy;
    private String createdByName;
}
