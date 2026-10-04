package com.alumniconnect.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * ResourceNotFoundException - Thrown when a requested resource is not found in the database.
 *
 * Example: GET /api/alumni/999 when alumni with ID 999 doesn't exist.
 *
 * @ResponseStatus(HttpStatus.NOT_FOUND) makes Spring return 404 HTTP status
 * when this exception is thrown.
 *
 * Interview explanation:
 *   "I created a custom exception that automatically returns HTTP 404
 *    when a resource like an alumni profile or event doesn't exist."
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }
}
