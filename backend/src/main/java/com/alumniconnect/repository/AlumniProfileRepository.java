package com.alumniconnect.repository;

import com.alumniconnect.entity.AlumniProfile;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * AlumniProfileRepository - Data access layer for AlumniProfile entity.
 *
 * Provides methods to find alumni profiles with search and filter capabilities.
 */
@Repository
public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, Long> {

    // Find profile by the associated User object
    Optional<AlumniProfile> findByUser(User user);

    // Find profile by User's ID
    Optional<AlumniProfile> findByUserId(Long userId);

    // Find alumni profiles by company (for filtering)
    List<AlumniProfile> findByCompanyNameContainingIgnoreCase(String companyName);

    // Find alumni profiles by graduation year (for filtering)
    List<AlumniProfile> findByGraduationYear(Integer graduationYear);

    // Find alumni profiles by location
    List<AlumniProfile> findByLocationContainingIgnoreCase(String location);

    // Find alumni profiles by department
    List<AlumniProfile> findByDepartmentContainingIgnoreCase(String department);

    /**
     * Custom JPQL query to search across multiple fields.
     * @Query: Lets us write our own JPQL (Java Persistence Query Language)
     * JPQL is similar to SQL but works with entity class names and field names.
     *
     * This searches alumni where:
     *   - User's first name OR last name contains the search term, OR
     *   - Job role contains the search term, OR
     *   - Company name contains the search term
     */
    @Query("SELECT ap FROM AlumniProfile ap JOIN ap.user u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(ap.jobRole) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(ap.companyName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<AlumniProfile> searchAlumni(@Param("searchTerm") String searchTerm);
}
