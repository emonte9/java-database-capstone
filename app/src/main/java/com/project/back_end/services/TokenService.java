package com.project.back_end.services;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;

import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

public class TokenService {
// 1. **@Component Annotation**
// The @Component annotation marks this class as a Spring component, meaning Spring will manage it as a bean within its application context.
// This allows the class to be injected into other Spring-managed components (like services or controllers) where it's needed.

// 2. **Constructor Injection for Dependencies**
// The constructor injects dependencies for `AdminRepository`, `DoctorRepository`, and `PatientRepository`,
// allowing the service to interact with the database and validate users based on their role (admin, doctor, or patient).
// Constructor injection ensures that the class is initialized with all required dependencies, promoting immutability and making the class testable.

// 3. **getSigningKey Method**
// This method retrieves the HMAC SHA key used to sign JWT tokens.
// It uses the `jwt.secret` value, which is provided from an external source (like application properties).
// The `Keys.hmacShaKeyFor()` method converts the secret key string into a valid `SecretKey` for signing and verification of JWTs.

// 4. **generateToken Method**
// This method generates a JWT token for a user based on their email.
// - The `subject` of the token is set to the user's email, which is used as an identifier.
// - The `issuedAt` is set to the current date and time.
// - The `expiration` is set to 7 days from the issue date, ensuring the token expires after one week.
// - The token is signed using the signing key generated by `getSigningKey()`, making it secure and tamper-proof.
// The method returns the JWT token as a string.

// 5. **extractEmail Method**
// This method extracts the user's email (subject) from the provided JWT token.
// - The token is first verified using the signing key to ensure it hasn’t been tampered with.
// - After verification, the token is parsed, and the subject (which represents the email) is extracted.
// This method allows the application to retrieve the user's identity (email) from the token for further use.

// 6. **validateToken Method**
// This method validates whether a provided JWT token is valid for a specific user role (admin, doctor, or patient).
// - It first extracts the email from the token using the `extractEmail()` method.
// - Depending on the role (`admin`, `doctor`, or `patient`), it checks the corresponding repository (AdminRepository, DoctorRepository, or PatientRepository)
//   to see if a user with the extracted email exists.
// - If a match is found for the specified user role, it returns true, indicating the token is valid.
// - If the role or user does not exist, it returns false, indicating the token is invalid.
// - The method gracefully handles any errors by returning false if the token is invalid or an exception occurs.
// This ensures secure access control based on the user's role and their existence in the system.






    // private final AdminRepository adminRepository;
    // private final DoctorRepository doctorRepository;
    // private final PatientRepository patientRepository;

    // @Value("${jwt.secret}")
    // private String jwtSecret;

    // private SecretKey secretKey;

    // public TokenService(AdminRepository adminRepository,
    //                     DoctorRepository doctorRepository,
    //                     PatientRepository patientRepository) {
    //     this.adminRepository = adminRepository;
    //     this.doctorRepository = doctorRepository;
    //     this.patientRepository = patientRepository;
    // }

    // @PostConstruct
    // private void initKey() {
    //     this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    // }

    // // 1. Generate JWT Token for a given email
    // public String generateToken(String email) {
    //     return Jwts.builder()
    //             .setSubject(email)
    //             .setIssuedAt(new Date(System.currentTimeMillis()))
    //             .setExpiration(new Date(System.currentTimeMillis() + 604800000)) // 7 days in ms
    //             .signWith(secretKey)
    //             .compact();
    // }

    // // 2. Extract Email from JWT Token
    // public String extractEmail(String token) {
    //     Claims claims = Jwts.parserBuilder()
    //             .setSigningKey(secretKey)
    //             .build()
    //             .parseClaimsJws(token)
    //             .getBody();

    //     return claims.getSubject();
    // }

    // // 3. Validate Token for a Given Role
    // public boolean validateToken(String token, String role) {
    //     try {
    //         String email = extractEmail(token);

    //         return switch (role.toLowerCase()) {
    //             case "admin" -> adminRepository.findByEmail(email).isPresent();
    //             case "doctor" -> doctorRepository.findByEmail(email).isPresent();
    //             case "patient" -> patientRepository.findByEmail(email).isPresent();
    //             default -> false;
    //         };
    //     } catch (Exception e) {
    //         return false;
    //     }
    // }




}
