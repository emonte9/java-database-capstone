## MySQL Database Design

## Table: patients
id: INT, Primary Key, AUTO_INCREMENT

name: VARCHAR(100), NOT NULL

email: VARCHAR(255), UNIQUE, NOT NULL

phone: VARCHAR(20), NOT NULL

gender: ENUM('Male', 'Female', 'Other'), NOT NULL

date_of_birth: DATE

created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

> 🔎 Note: Validate email and phone formats via backend validation. Appointments should not be deleted if a patient is removed—consider archiving.


## Table: doctors
id: INT, Primary Key, AUTO_INCREMENT

name: VARCHAR(100), NOT NULL

specialization: VARCHAR(100), NOT NULL

email: VARCHAR(255), UNIQUE, NOT NULL

phone: VARCHAR(20), NOT NULL

clinic_location_id: INT, Foreign Key → clinic_locations(id)

availability_start: TIME

availability_end: TIME

> 🔎 Note: Prevent overlapping appointments by validating slot times against availability and existing bookings.



## Table: appointments
id: INT, Primary Key, AUTO_INCREMENT

doctor_id: INT, Foreign Key → doctors(id), NOT NULL

patient_id: INT, Foreign Key → patients(id), NOT NULL

appointment_time: DATETIME, NOT NULL

duration_minutes: INT DEFAULT 60

status: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)

> 🧠 Note: Make appointment_time and doctor_id a compound unique key to prevent double booking. Past appointments should be retained for historical tracking.



## Table: admin
id: INT, Primary Key, AUTO_INCREMENT

username: VARCHAR(50), UNIQUE, NOT NULL

password_hash: VARCHAR(255), NOT NULL

email: VARCHAR(255), UNIQUE, NOT NULL

role: ENUM('superadmin', 'support'), DEFAULT 'support'

> 🔐 Note: Store password as hashed values. Consider audit logs in MongoDB for admin activities.



## Table: clinic_locations
id: INT, Primary Key, AUTO_INCREMENT

name: VARCHAR(255), NOT NULL

address: TEXT, NOT NULL

phone: VARCHAR(20)

email: VARCHAR(255)



## Table: payments
id: INT, Primary Key, AUTO_INCREMENT

appointment_id: INT, Foreign Key → appointments(id)

amount: DECIMAL(10,2), NOT NULL

payment_method: ENUM('cash', 'card', 'insurance'), NOT NULL

payment_date: DATE, NOT NULL

> 💳 Note: One-to-one relationship with appointment. Track refunds or disputes separately if needed.



# MongoDB Collection Design


## Collection: messages


{
  "_id": ObjectId("65f1a3b2c9d4e578f1234567"),
  "appointmentId": 102,
  "patientId": 21,
  "doctorId": 5,
  "startedAt": ISODate("2025-07-08T09:00:00Z"),
  "messages": [
    {
      "sender": "patient",
      "timestamp": ISODate("2025-07-08T09:01:12Z"),
      "content": "Hello Dr. Lee, I’m feeling better but still have a cough.",
      "attachments": []
    },
    {
      "sender": "doctor",
      "timestamp": ISODate("2025-07-08T09:02:45Z"),
      "content": "Great to hear! Continue the medication. Let me know if symptoms worsen.",
      "attachments": [
        {
          "type": "image",
          "url": "/uploads/xray-102.jpg",
          "caption": "Follow-up chest x-ray"
        }
      ]
    }
  ],
  "tags": ["follow-up", "respiratory"],
  "metadata": {
    "patientDevice": "iOS",
    "doctorBrowser": "Chrome",
    "ipAddress": "192.168.0.45"
  },
  "createdAt": ISODate("2025-07-08T09:00:00Z"),
  "updatedAt": ISODate("2025-07-08T09:05:00Z")
}




## Collection: prescriptions


{
  "_id": ObjectId("66abe124a1e5f23456789abc"),
  "appointmentId": 42,
  "patientId": 17,
  "doctorId": 3,
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "duration": "7 days"
    },
    {
      "name": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "As needed",
      "duration": "5 days"
    }
  ],
  "refillCount": 2,
  "pharmacy": {
    "name": "CareWell Pharmacy",
    "location": "456 Health St.",
    "phone": "555-1234"
  },
  "doctorNotes": "Monitor for rash or upset stomach. Follow up in one week.",
  "tags": ["antibiotic", "pain-relief"],
  "createdAt": ISODate("2025-07-08T10:30:00Z"),
  "updatedAt": ISODate("2025-07-08T10:30:00Z")
}




## Collection: feedback

{
  "_id": ObjectId("66dbe999f3a1b23456789cde"),
  "patientId": 17,
  "doctorId": 3,
  "appointmentId": 42,
  "rating": 4.5,
  "comments": "Dr. Lee was very attentive and explained everything clearly.",
  "tags": ["friendly", "clear-explanations"],
  "submittedAt": ISODate("2025-07-09T14:22:00Z"),
  "followUpRequested": false
}



## logs


{
  "_id": ObjectId("66dbeb22a1f2e34567890abc"),
  "entity": "patient",
  "entityId": 17,
  "action": "login",
  "performedBy": "patient",
  "timestamp": ISODate("2025-07-09T14:30:45Z"),
  "metadata": {
    "ip": "203.0.113.42",
    "userAgent": "Mozilla/5.0 (Windows NT)"
  }
}


or 


{
  "_id": ObjectId("66dbeb22a1f2e34567890abc"),
  "userType": "patient",
  "userId": 17,
  "action": "login",
  "target": "appointments",
  "targetId": 42,
  "timestamp": ISODate("2025-07-09T14:30:45Z"),
  "metadata": {
    "ip": "203.0.113.42",
    "userAgent": "Mozilla/5.0 (Windows NT)"
  }
}






