package com.project.back_end.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.back_end.models.Appointment;

import jakarta.transaction.Transactional;

// @Repository
// public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

//    // 1. Extend JpaRepository:
// //    - The repository extends JpaRepository<Appointment, Long>, which gives it basic CRUD functionality.
// //    - The methods such as save, delete, update, and find are inherited without the need for explicit implementation.
// //    - JpaRepository also includes pagination and sorting features.

// // Example: public interface AppointmentRepository extends JpaRepository<Appointment, Long> {}

// // 2. Custom Query Methods:

// //    - **findByDoctorIdAndAppointmentTimeBetween**:
// //      - This method retrieves a list of appointments for a specific doctor within a given time range.
// //      - The doctor’s available times are eagerly fetched to avoid lazy loading.
// //      - Return type: List<Appointment>
// //      - Parameters: Long doctorId, LocalDateTime start, LocalDateTime end
// //      - It uses a LEFT JOIN to fetch the doctor’s available times along with the appointments.

// //    - **findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween**:
// //      - This method retrieves appointments for a specific doctor and patient name (ignoring case) within a given time range.
// //      - It performs a LEFT JOIN to fetch both the doctor and patient details along with the appointment times.
// //      - Return type: List<Appointment>
// //      - Parameters: Long doctorId, String patientName, LocalDateTime start, LocalDateTime end

// //    - **deleteAllByDoctorId**:
// //      - This method deletes all appointments associated with a particular doctor.
// //      - It is marked as @Modifying and @Transactional, which makes it a modification query, ensuring that the operation is executed within a transaction.
// //      - Return type: void
// //      - Parameters: Long doctorId

// //    - **findByPatientId**:
// //      - This method retrieves all appointments for a specific patient.
// //      - Return type: List<Appointment>
// //      - Parameters: Long patientId

// //    - **findByPatient_IdAndStatusOrderByAppointmentTimeAsc**:
// //      - This method retrieves all appointments for a specific patient with a given status, ordered by the appointment time.
// //      - Return type: List<Appointment>
// //      - Parameters: Long patientId, int status

// //    - **filterByDoctorNameAndPatientId**:
// //      - This method retrieves appointments based on a doctor’s name (using a LIKE query) and the patient’s ID.
// //      - Return type: List<Appointment>
// //      - Parameters: String doctorName, Long patientId

// //    - **filterByDoctorNameAndPatientIdAndStatus**:
// //      - This method retrieves appointments based on a doctor’s name (using a LIKE query), patient’s ID, and a specific appointment status.
// //      - Return type: List<Appointment>
// //      - Parameters: String doctorName, Long patientId, int status

// //    - **updateStatus**:
// //      - This method updates the status of a specific appointment based on its ID.
// //      - Return type: void
// //      - Parameters: int status, long id

// // 3. @Modifying and @Transactional annotations:
// //    - The @Modifying annotation is used to indicate that the method performs a modification operation (like DELETE or UPDATE).
// //    - The @Transactional annotation ensures that the modification is done within a transaction, meaning that if any exception occurs, the changes will be rolled back.

// // 4. @Repository annotation:
// //    - The @Repository annotation marks this interface as a Spring Data JPA repository.
// //    - Spring Data JPA automatically implements this repository, providing the necessary CRUD functionality and custom queries defined in the interface.



//     // 1. Appointments for a doctor in a time range (with eager doctor fetch)
//     @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor d WHERE d.id = :doctorId AND a.appointmentTime BETWEEN :start AND :end")
//     List<Appointment> findByDoctorIdAndAppointmentTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);


//     // 2. Query by doctor ID, patient name (case-insensitive), and time range
//     @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor d LEFT JOIN FETCH a.patient p " +
//            "WHERE d.id = :doctorId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :patientName, '%')) " +
//            "AND a.appointmentTime BETWEEN :start AND :end")
//     List<Appointment> findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
//             Long doctorId, String patientName, LocalDateTime start, LocalDateTime end);

//     // 3. Delete all appointments by doctor ID
//     @Modifying
//     @Transactional
//     void deleteAllByDoctorId(Long doctorId);

//     // 4. Find all appointments for a patient
//     List<Appointment> findByPatientId(Long patientId);

//     // 5. Find all appointments for a patient with a specific status ordered by time
//     List<Appointment> findByPatient_IdAndStatusOrderByAppointmentTimeAsc(Long patientId, int status);

//     // 6. Filter by doctor name and patient ID
//     @Query("SELECT a FROM Appointment a WHERE LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :doctorName, '%')) " +
//            "AND a.patient.id = :patientId")
//     List<Appointment> filterByDoctorNameAndPatientId(String doctorName, Long patientId);

//     // 7. Filter by doctor name, patient ID, and status
//     @Query("SELECT a FROM Appointment a WHERE LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :doctorName, '%')) " +
//            "AND a.patient.id = :patientId AND a.status = :status")
//     List<Appointment> filterByDoctorNameAndPatientIdAndStatus(String doctorName, Long patientId, int status);

//     // 8. Update appointment status by ID
//     @Modifying
//     @Transactional
//     @Query("UPDATE Appointment a SET a.status = :status WHERE a.id = :id")
//     void updateStatus(int status, long id);

// }










@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // 1. Appointments for a doctor in a time range
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor d WHERE d.id = :doctorId AND a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findByDoctorIdAndAppointmentTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

    // 2. Doctor ID + patient name (case-insensitive) + time range
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor d LEFT JOIN FETCH a.patient p " +
           "WHERE d.id = :doctorId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :patientName, '%')) " +
           "AND a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
            Long doctorId, String patientName, LocalDateTime start, LocalDateTime end);

    // 3. Delete all appointments by doctor ID
    @Modifying
    @Transactional
    void deleteAllByDoctorId(Long doctorId);

    // 4. All appointments for a patient
    List<Appointment> findByPatientId(Long patientId);

    // 5. Appointments for a patient with specific status, ordered by time
    List<Appointment> findByPatient_IdAndStatusOrderByAppointmentTimeAsc(Long patientId, int status);

    // 6. Filter by doctor name + patient ID (case-insensitive)
    @Query("SELECT a FROM Appointment a WHERE LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :doctorName, '%')) " +
           "AND a.patient.id = :patientId")
    List<Appointment> filterByDoctorNameAndPatientId(String doctorName, Long patientId);

    // 7. Filter by doctor name + patient ID + status
    @Query("SELECT a FROM Appointment a WHERE LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :doctorName, '%')) " +
           "AND a.patient.id = :patientId AND a.status = :status")
    List<Appointment> filterByDoctorNameAndPatientIdAndStatus(String doctorName, Long patientId, int status);

    // 8. Update appointment status by ID
    @Modifying
    @Transactional
    @Query("UPDATE Appointment a SET a.status = :status WHERE a.id = :id")
    void updateStatus(int status, long id);
}
