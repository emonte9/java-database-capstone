package com.project.back_end.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.back_end.models.Prescription;
import com.project.back_end.repo.PrescriptionRepository;

@Service
public class PrescriptionService {
    
 // 1. **Add @Service Annotation**:
//    - The `@Service` annotation marks this class as a Spring service component, allowing Spring's container to manage it.
//    - This class contains the business logic related to managing prescriptions in the healthcare system.
//    - Instruction: Ensure the `@Service` annotation is applied to mark this class as a Spring-managed service.

// 2. **Constructor Injection for Dependencies**:
//    - The `PrescriptionService` class depends on the `PrescriptionRepository` to interact with the database.
//    - It is injected through the constructor, ensuring proper dependency management and enabling testing.
//    - Instruction: Constructor injection is a good practice, ensuring that all necessary dependencies are available at the time of service initialization.

// 3. **savePrescription Method**:
//    - This method saves a new prescription to the database.
//    - Before saving, it checks if a prescription already exists for the same appointment (using the appointment ID).
//    - If a prescription exists, it returns a `400 Bad Request` with a message stating the prescription already exists.
//    - If no prescription exists, it saves the new prescription and returns a `201 Created` status with a success message.
//    - Instruction: Handle errors by providing appropriate status codes and messages, ensuring that multiple prescriptions for the same appointment are not saved.

// 4. **getPrescription Method**:
//    - Retrieves a prescription associated with a specific appointment based on the `appointmentId`.
//    - If a prescription is found, it returns it within a map wrapped in a `200 OK` status.
//    - If there is an error while fetching the prescription, it logs the error and returns a `500 Internal Server Error` status with an error message.
//    - Instruction: Ensure that this method handles edge cases, such as no prescriptions found for the given appointment, by returning meaningful responses.

// 5. **Exception Handling and Error Responses**:
//    - Both methods (`savePrescription` and `getPrescription`) contain try-catch blocks to handle exceptions that may occur during database interaction.
//    - If an error occurs, the method logs the error and returns an HTTP `500 Internal Server Error` response with a corresponding error message.
//    - Instruction: Ensure that all potential exceptions are handled properly, and meaningful responses are returned to the client.


    private final PrescriptionRepository prescriptionRepository;


    // Constructor injection
    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    // Save a new prescription
    // public ResponseEntity<Map<String, String>> savePrescription(Prescription prescription) {
    //     Map<String, String> response = new HashMap<>();
    //     try {
    //         // Check for existing prescription for the appointment
    //         if (prescriptionRepository.findByAppointmentId(prescription.getAppointmentId()) != null) {
    //             response.put("message", "Prescription already exists for this appointment");
    //             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    //         }

    //         // Save if no existing prescription
    //         prescriptionRepository.save(prescription);
    //         response.put("message", "Prescription saved");
    //         return ResponseEntity.status(HttpStatus.CREATED).body(response);

    //     } catch (Exception e) {
    //         response.put("error", "An error occurred while saving the prescription");
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    //     }
    // }



    public ResponseEntity<Map<String, Object>> savePrescription(Prescription prescription) {
    Map<String, Object> response = new HashMap<>();
    try {
        if (prescriptionRepository.findByAppointmentId(prescription.getAppointmentId()) != null) {
            response.put("status", "error");
            response.put("message", "Prescription already exists for this appointment");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        prescriptionRepository.save(prescription);
        response.put("status", "success");
        response.put("message", "Prescription saved successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    } catch (Exception e) {
        response.put("status", "error");
        response.put("message", "An error occurred while saving the prescription");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

    // Retrieve prescription by appointment ID
    // public ResponseEntity<Map<String, Object>> getPrescription(Long appointmentId) {
    //     Map<String, Object> result = new HashMap<>();
    //     try {
    //         List<Prescription> prescriptions = prescriptionRepository.findByAppointmentId(appointmentId);
    //         if (prescriptions == null || prescriptions.isEmpty()) {
    //             result.put("message", "No prescription found for this appointment");
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    //         }

    //         // result.put("prescription", prescriptions.get(0));
    //         result.put("prescription", prescriptions);
    //         return ResponseEntity.ok(result);

    //     } catch (Exception e) {
    //         result.put("error", "An error occurred while retrieving the prescription");
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    //     }
    // }


    public ResponseEntity<Map<String, Object>> getPrescription(Long appointmentId) {
    Map<String, Object> result = new HashMap<>();
    try {
        List<Prescription> prescriptions = prescriptionRepository.findByAppointmentId(appointmentId);
        if (prescriptions == null || prescriptions.isEmpty()) {
            result.put("status", "error");
            result.put("message", "No prescription found for this appointment");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }

        result.put("status", "success");
        result.put("data", prescriptions); // could be a single item if needed
        return ResponseEntity.ok(result);

    } catch (Exception e) {
        result.put("status", "error");
        result.put("message", "An error occurred while retrieving the prescription");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}

}
