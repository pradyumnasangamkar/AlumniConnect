package com.alumniconnect.service;

import com.alumniconnect.dto.LoginRequest;
import com.alumniconnect.dto.LoginResponse;
import com.alumniconnect.dto.RegisterRequest;
import com.alumniconnect.entity.AlumniProfile;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.AlumniProfileRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * AuthService - Business logic for user registration and login.
 *
 * @Service marks this as a Spring Service component.
 * Services contain the business logic of the application.
 * They sit between Controller (receives requests) and Repository (accesses database).
 *
 * Interview explanation:
 *   "The Service layer contains the business rules. For example, the AuthService
 *    checks if an email already exists before registering, and verifies the password
 *    during login. The Controller delegates all logic to the Service."
 */
@Service
public class AuthService {

    /**
     * @Autowired tells Spring to automatically inject the required dependency.
     * This is called Dependency Injection - a core Spring concept.
     *
     * Interview explanation:
     *   "Dependency Injection means Spring creates and manages objects for us.
     *    Instead of writing 'new UserRepository()', I just declare @Autowired
     *    and Spring injects the correct implementation automatically."
     */
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AlumniProfileRepository alumniProfileRepository;

    /**
     * Registers a new user.
     *
     * Business rules:
     * 1. Check if email already exists → throw error if it does
     * 2. Store password as plain text (NOTE: In real world, use BCrypt encryption)
     * 3. Create User record
     * 4. If ALUMNI, also create an empty AlumniProfile
     */
    public User register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        // Validate role
        String role = request.getRole().toUpperCase();
        if (!role.equals("ADMIN") && !role.equals("ALUMNI") && !role.equals("STUDENT")) {
            throw new IllegalArgumentException("Invalid role. Must be ADMIN, ALUMNI, or STUDENT");
        }

        // Create the User entity from the request DTO
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        // NOTE: Plain text password for simplicity.
        // In production, use: BCryptPasswordEncoder.encode(request.getPassword())
        user.setPassword(request.getPassword());
        user.setRole(role);
        user.setGender(request.getGender());
        user.setGraduationYear(request.getGraduationYear());
        user.setDepartment(request.getDepartment());

        // Save user to the database (INSERT INTO users ...)
        User savedUser = userRepository.save(user);

        // If the user is ALUMNI, create an empty AlumniProfile for them
        if (role.equals("ALUMNI")) {
            AlumniProfile profile = new AlumniProfile();
            profile.setUser(savedUser);
            profile.setGraduationYear(request.getGraduationYear());
            profile.setDepartment(request.getDepartment());
            profile.setBio("Tell everyone about yourself...");
            alumniProfileRepository.save(profile);
        }

        return savedUser;
    }

    /**
     * Logs in a user.
     *
     * Business rules:
     * 1. Find user by email → throw error if not found
     * 2. Compare passwords → throw error if mismatch
     * 3. Return user data for the frontend to store in localStorage
     */
    public LoginResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No account found with email: " + request.getEmail()));

        // Verify password (plain text comparison)
        // In production: BCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        // Create and return login response (safe data for frontend)
        return new LoginResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                "Login successful",
                true
        );
    }
}
