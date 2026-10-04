package com.alumniconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * AlumniConnect - Alumni Management & Networking Platform
 *
 * Main entry point for the Spring Boot application.
 *
 * @SpringBootApplication combines:
 *   - @Configuration : Marks this as a configuration class
 *   - @EnableAutoConfiguration : Spring Boot auto-configures beans based on classpath
 *   - @ComponentScan : Scans this package and all sub-packages for Spring components
 *
 * When you run this class, Spring Boot:
 *   1. Starts an embedded Tomcat server on port 8080
 *   2. Configures JPA/Hibernate to connect to MySQL
 *   3. Creates/updates database tables based on @Entity classes
 *   4. Registers all @RestController, @Service, @Repository beans
 */
@SpringBootApplication
public class AlumniConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlumniConnectApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  AlumniConnect Backend Started Successfully!");
        System.out.println("  API Base URL: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}
