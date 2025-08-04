package com.project.back_end.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

@Service
public class CentralService {
// 1. **@Service Annotation**
// The @Service annotation marks this class as a service component in Spring. This allows Spring to automatically detect it through component scanning
// and manage its lifecycle, enabling it to be injected into controllers or other services using @Autowired or constructor injection.

// 2. **Constructor Injection for Dependencies**
// The constructor injects all required dependencies (TokenService, Repositories, and other Services). This approach promotes loose coupling, improves testability,
// and ensures that all required dependencies are provided at object creation time.

// 3. **validateToken Method**
// This method checks if the provided JWT token is valid for a specific user. It uses the TokenService to perform the validation.
// If the token is invalid or expired, it returns a 401 Unauthorized response with an appropriate error message. This ensures security by preventing
// unauthorized access to protected resources.

// 4. **validateAdmin Method**
// This method validates the login credentials for an admin user.
// - It first searches the admin repository using the provided username.
// - If an admin is found, it checks if the password matches.
// - If the password is correct, it generates and returns a JWT token (using the admin’s username) with a 200 OK status.
// - If the password is incorrect, it returns a 401 Unauthorized status with an error message.
// - If no admin is found, it also returns a 401 Unauthorized.
// - If any unexpected error occurs during the process, a 500 Internal Server Error response is returned.
// This method ensures that only valid admin users can access secured parts of the system.

// 5. **filterDoctor Method**
// This method provides filtering functionality for doctors based on name, specialty, and available time slots.
// - It supports various combinations of the three filters.
// - If none of the filters are provided, it returns all available doctors.
// This flexible filtering mechanism allows the frontend or consumers of the API to search and narrow down doctors based on user criteria.

// 6. **validateAppointment Method**
// This method validates if the requested appointment time for a doctor is available.
// - It first checks if the doctor exists in the repository.
// - Then, it retrieves the list of available time slots for the doctor on the specified date.
// - It compares the requested appointment time with the start times of these slots.
// - If a match is found, it returns 1 (valid appointment time).
// - If no matching time slot is found, it returns 0 (invalid).
// - If the doctor doesn’t exist, it returns -1.
// This logic prevents overlapping or invalid appointment bookings.

// 7. **validatePatient Method**
// This method checks whether a patient with the same email or phone number already exists in the system.
// - If a match is found, it returns false (indicating the patient is not valid for new registration).
// - If no match is found, it returns true.
// This helps enforce uniqueness constraints on patient records and prevent duplicate entries.

// 8. **validatePatientLogin Method**
// This method handles login validation for patient users.
// - It looks up the patient by email.
// - If found, it checks whether the provided password matches the stored one.
// - On successful validation, it generates a JWT token and returns it with a 200 OK status.
// - If the password is incorrect or the patient doesn't exist, it returns a 401 Unauthorized with a relevant error.
// - If an exception occurs, it returns a 500 Internal Server Error.
// This method ensures only legitimate patients can log in and access their data securely.

// 9. **filterPatient Method**
// This method filters a patient's appointment history based on condition and doctor name.
// - It extracts the email from the JWT token to identify the patient.
// - Depending on which filters (condition, doctor name) are provided, it delegates the filtering logic to PatientService.
// - If no filters are provided, it retrieves all appointments for the patient.
// This flexible method supports patient-specific querying and enhances user experience on the client side.

private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    // Constructor injection
    public CentralService(TokenService tokenService, AdminRepository adminRepository, DoctorRepository doctorRepository,
                   PatientRepository patientRepository, DoctorService doctorService, PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }



 

    // 1. validateToken
    public ResponseEntity<Map<String, String>> validateToken(String token, String user) {
    Map<String, String> response = new HashMap<>();
    if (!tokenService.validateToken(token, user)) {
        response.put("status", "error");
        response.put("message", "Invalid or expired token");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    response.put("status", "success");
    response.put("message", "Token is valid");
    return ResponseEntity.ok(response);
}

public ResponseEntity<Map<String, String>> validateAdmin(@RequestBody Admin receivedAdmin) {
    Map<String, String> response = new HashMap<>();
    try {
        Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());
        if (admin == null || !admin.getPassword().equals(receivedAdmin.getPassword())) {
            response.put("status", "error");
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = tokenService.generateToken(admin.getUsername(), "admin");
        response.put("status", "success");
        response.put("token", token);
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        response.put("status", "error");
        response.put("message", "An error occurred during authentication");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}




    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
    Map<String, Object> result = new HashMap<>();
    try {
        return doctorService.filterDoctorsByNameSpecialtyAndTime(name, specialty, time);
    } catch (Exception e) {
        result.put("error", "Failed to filter doctors");
        return result;
    }
}

    // 4. validateAppointment
    public int validateAppointment(Appointment appointment) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(appointment.getDoctor().getId());
        
        if (doctorOpt.isEmpty()) {
            return -1; // Doctor doesn't exist
        }

        // Doctor doctor = doctorOpt.get();
        Doctor doctor = appointment.getDoctor();
        LocalDateTime time = appointment.getAppointmentTime();
        List<String> availableSlots = doctorService.getDoctorAvailability(doctor.getId(), time.toLocalDate());
        // List<TimeSlot> availableSlots = doctorService.getDoctorAvailability(doctor, appointment.getAppointmentTime());
        


        // Format the appointment time to match the slot format (e.g., "10:00 AM")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
        String formattedAppointmentTime = time.toLocalTime().format(formatter);

        for (String slot : availableSlots) {
            if (slot.equalsIgnoreCase(formattedAppointmentTime)) {
                return 1; // Valid time
            }
        }

        return 0; // Time not available
    }

    // 5. validatePatient (for registration)
   
    public boolean validatePatient(Patient patient) {
        return patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) == null;
    }

//     public boolean validatePatient(Patient patient) {
//     return patientRepository.findByEmail(patient.getEmail()) == null &&
//            patientRepository.find(patient.getPhone()) == null;
// }

    

// public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
//     System.out.println("Login email: " + login.getEmail());
//     System.out.println("Login password: " + login.getPassword());

//     Map<String, String> response = new HashMap<>();
//     try {
//         Patient patient = patientRepository.findByEmail(login.getEmail());

//         if (patient != null && patient.getPassword().equals(login.getPassword())) {
//             String token = tokenService.generateToken(patient.getEmail(), "patient");
//             response.put("status", "success");
//             response.put("token", token);
//             return ResponseEntity.ok(response);
//         } else {
//             response.put("status", "error");
//             response.put("message", "Invalid email or password");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//         }
//     } catch (Exception e) {
//         response.put("status", "error");
//         response.put("message", "Login failed due to server error");
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//     }
// }

@Autowired
private PasswordEncoder passwordEncoder;

  // 6. validatePatientLogin
    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        try {
            Patient patient = patientRepository.findByEmail(login.getEmail());
            if (patient != null && login.getPassword().equals(patient.getPassword())) {
                // valid
                // passwordEncoder.encode("plaintextPassword");
                String token = tokenService.generateToken(patient.getEmail(), "patient");
                // String token = tokenService.generateToken(admin.getUsername(), "admin");
                response.put("token", token);
                return ResponseEntity.ok(response);
            }else {
                response.put("error", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            // if (patient != null && patient.getPassword().equals(login.getPassword())) {
            //     String token = tokenService.generateToken(patient.getEmail(), "patient");
            //     // String token = tokenService.generateToken(admin.getUsername(), "admin");
            //     response.put("token", token);
            //     return ResponseEntity.ok(response);
            // } 
            // else {
            //     response.put("error", "Invalid email or password");
            //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            // }
        } catch (Exception e) {
            response.put("error", "Login failed due to server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    // 6. validatePatientLogin
//     public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
//         System.out.println("Login email: " + login.getEmail());
//         System.out.println("Login password: " + login.getPassword());
//     Map<String, String> response = new HashMap<>();
//     try {
//         // Patient patient = patientRepository.findByEmail(login.getIdentifier());
//          Patient patient = patientRepository.findByEmail(login.getEmail());
//         if (patient != null && patient.getPassword().equals(login.getPassword())) {
//             String token = tokenService.generateToken(patient.getEmail(), "patient");
//             response.put("status", "success");
//             response.put("token", token);
//             return ResponseEntity.ok(response);
//         } else {
//             response.put("status", "error");
//             response.put("message", "Invalid email or password");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//         }
//     } catch (Exception e) {
//         response.put("status", "error");
//         response.put("message", "Login failed due to server error");
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//     }
// }

 

    // 7. filterPatient
    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
    String email = tokenService.extractIdentifier(token);
    Patient patient = patientRepository.findByEmail(email);
    Map<String, Object> result = new HashMap<>();

    if (patient == null) {
        result.put("status", "error");
        result.put("message", "Patient not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }

    Long patientId = patient.getId();

    ResponseEntity<Map<String, Object>> response;
    if (condition != null && name != null) {
        response = patientService.filterByDoctorAndCondition(condition, name, patientId);
    } else if (condition != null) {
        response = patientService.filterByCondition(condition, patientId);
    } else if (name != null) {
        response = patientService.filterByDoctor(name, patientId);
    } else {
        result.put("status", "error");
        result.put("message", "Please provide filter criteria");
        return ResponseEntity.badRequest().body(result);
    }

    // Ensure response contains "status" if it's not already structured
    Map<String, Object> body = response.getBody();
    if (body != null && !body.containsKey("status")) {
        body.put("status", "success");
    }

    return response;
}
  

}
