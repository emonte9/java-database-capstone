// // updateAppointment.js
// import { updateAppointment } from "../js/services/appointmentRecordService.js";
// import { getDoctors } from "../js/services/doctorServices.js";
// document.addEventListener("DOMContentLoaded", initializePage);

// async function initializePage() {
//   const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
//   // Get appointmentId and patientId from the URL query parameters
//   const urlParams = new URLSearchParams(window.location.search);
//   const appointmentId = urlParams.get("appointmentId");
//   const patientId = urlParams.get("patientId");
//   const doctorId = urlParams.get("doctorId");
//   const patientName = urlParams.get("patientName");
//   const doctorName = urlParams.get("doctorName");
//   const appointmentDate = urlParams.get("appointmentDate");
//   const appointmentTime = urlParams.get("appointmentTime");

//   console.log(doctorId)
//   if (!token || !patientId) {
//     alert("Missing session data, redirecting to appointments page.");
//     window.location.href = "/pages/patientAppointments.html";
//     return;
//   }

 
//   // get doctor to display only the available time of doctor
//   getDoctors()
//     .then(doctors => {
//       // Find the doctor by the ID from the URL
//       const doctor = doctors.find(d => d.id == doctorId);
//       if (!doctor) {
//         alert("Doctor not found.");
//         return;
//       }

//       // Fill the form with the appointment data passed in the URL
//       document.getElementById("patientName").value = patientName || "You";
//       document.getElementById("doctorName").value = doctorName;
//       document.getElementById("appointmentDate").value = appointmentDate;
//       document.getElementById("appointmentTime").value = appointmentTime;

//       const timeSelect = document.getElementById("appointmentTime");
//       doctor.availableTimes.forEach(time => {
//         const option = document.createElement("option");
//         option.value = time;
//         option.textContent = time;
//         timeSelect.appendChild(option);
//       });

//       // Handle form submission for updating the appointment
//       document.getElementById("updateAppointmentForm").addEventListener("submit", async (e) => {
//         e.preventDefault(); // Prevent default form submission

//         const date = document.getElementById("appointmentDate").value;
//         const time = document.getElementById("appointmentTime").value;
//         const startTime = time.split('-')[0];
//         if (!date || !time) {
//           alert("Please select both date and time.");
//           return;
//         }

//         // const updatedAppointment = {
//         //   id: appointmentId,
//         //   doctor: { id: doctor.id },
//         //   patient: { id: patientId },
//         //   appointmentTime: `${date}T${startTime}:00`,
//         //   status: 0
//         // };


//         const updatedAppointment = {
//           id: Number(appointmentId),
//           doctor: { id: Number(doctor.id) },
//           patient: { id: Number(patientId) },
//           appointmentTime: `${date}T${startTime}:00`,
//           status: 0
//         };

//         const updateResponse = await updateAppointment(updatedAppointment, token);

//         if (updateResponse.success) {
//           alert("Appointment updated successfully!");
//           window.location.href = "/pages/patientAppointments.html"; // Redirect back to the appointments page
//         } else {
//           alert("❌ Failed to update appointment: " + updateResponse.message);
//         }
//       });

// //       document.getElementById("updateAppointmentForm").addEventListener("submit", async (e) => {
// //   e.preventDefault(); // Prevent default form submission

// //   const date = document.getElementById("appointmentDate").value;
// //   const time = document.getElementById("appointmentTime").value;

// //   if (!date || !time) {
// //     alert("Please select both date and time.");
// //     return;
// //   }

// //   const startTime = time.split('-')[0]; // e.g., "11:00"
// //   const appointmentDateTimeStr = `${date}T${startTime}:00`;
// //   const appointmentDateTime = new Date(appointmentDateTimeStr);
// //   const now = new Date();

// //   // ✅ Validate that the appointment is in the future
// //   if (appointmentDateTime <= now) {
// //     alert("⏰ Appointment time must be in the future.");
// //     return;
// //   }

// //   // Construct the updated appointment object
// //   const updatedAppointment = {
// //     id: Number(appointmentId),
// //     doctor: { id: Number(doctor.id) },
// //     patient: { id: Number(patientId) },
// //     appointmentTime: appointmentDateTimeStr,
// //     status: 0
// //   };

// //   const updateResponse = await updateAppointment(updatedAppointment, token);

// //   if (updateResponse.success) {
// //     alert("✅ Appointment updated successfully!");
// //     window.location.href = "/pages/patientAppointments.html";
// //   } else {
// //     alert("❌ Failed to update appointment: " + updateResponse.message);
// //   }
// // });
//     })
//     .catch(error => {
//       console.error("Error fetching doctors:", error);
//       alert("❌ Failed to load doctor data.");
//     });
// }



import { updateAppointment } from "../js/services/appointmentRecordService.js";
import { getDoctors } from "../js/services/doctorServices.js";

document.addEventListener("DOMContentLoaded", initializePage);

async function initializePage() {
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get("appointmentId");
  const patientId = urlParams.get("patientId");
  const doctorId = urlParams.get("doctorId");
  const patientName = urlParams.get("patientName");
  const doctorName = urlParams.get("doctorName");
  const appointmentDate = urlParams.get("appointmentDate");
  const appointmentTime = urlParams.get("appointmentTime");

  if (!token || !patientId) {
    alert("Missing session data, redirecting to appointments page.");
    window.location.href = "/pages/patientAppointments.html";
    return;
  }

  // Set min date = today
  const appointmentDateInput = document.getElementById("appointmentDate");
  const today = new Date().toISOString().split("T")[0];
  appointmentDateInput.min = today;
  appointmentDateInput.value = appointmentDate;

  // Set other form values
  document.getElementById("patientName").value = patientName || "You";
  document.getElementById("doctorName").value = doctorName;

  try {
    const doctors = await getDoctors();
    const doctor = doctors.find(d => d.id == doctorId);
    if (!doctor) {
      alert("Doctor not found.");
      return;
    }

    const timeSelect = document.getElementById("appointmentTime");
    timeSelect.innerHTML = ""; // Clear old options

    const filteredTimes = filterTimes(doctor.availableTimes, appointmentDate);

    filteredTimes.forEach(time => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      if (time === appointmentTime) {
        option.selected = true;
      }
      timeSelect.appendChild(option);
    });

    document.getElementById("updateAppointmentForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const date = document.getElementById("appointmentDate").value;
      const time = document.getElementById("appointmentTime").value;

      if (!date || !time) {
        alert("Please select both date and time.");
        return;
      }

      const startTime = time.split('-')[0];
      const appointmentDateTimeStr = `${date}T${startTime}:00`;
      const appointmentDateTime = new Date(appointmentDateTimeStr);
      const now = new Date();

      if (appointmentDateTime <= now) {
        alert("⏰ Appointment time must be in the future.");
        return;
      }

      const updatedAppointment = {
        id: Number(appointmentId),
        doctor: { id: Number(doctor.id) },
        patient: { id: Number(patientId) },
        appointmentTime: appointmentDateTimeStr,
        status: 0
      };

      const updateResponse = await updateAppointment(updatedAppointment, token);

      if (updateResponse.success) {
        alert("✅ Appointment updated successfully!");
        window.location.href = "/pages/patientAppointments.html";
      } else {
        alert("❌ Failed to update appointment: " + updateResponse.message);
      }
    });

  } catch (error) {
    console.error("Error fetching doctors:", error);
    alert("❌ Failed to load doctor data.");
  }
}

// Helper to filter out past times for today
function filterTimes(availableTimes, selectedDate) {
  const now = new Date();
  const selected = new Date(selectedDate);
  const isToday = now.toDateString() === selected.toDateString();

  return availableTimes.filter(timeSlot => {
    if (!isToday) return true;
    const [hour, minute] = timeSlot.split("-")[0].split(":");
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hour, minute, 0, 0);
    return slotTime > now;
  });
}

