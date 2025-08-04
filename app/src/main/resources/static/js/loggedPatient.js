// loggedPatient.js 
import { getDoctors } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';
import { filterDoctors } from './services/doctorServices.js';
import { bookAppointment } from './services/appointmentRecordService.js';


// export async function loadDoctorCards() {
//   // const contentDiv = document.getElementById("content");
//   // const contentDiv = document.getElementById("content");
//   // if (!contentDiv) {
//   //   console.error("⚠️ content div not found in DOM.");
//   //   return;
//   // }
//   const contentDiv = document.getElementById("content");
// if (!contentDiv) {
//   console.warn("⚠️ #content element not found. Skipping doctor rendering.");
//   return;
// }
// contentDiv.innerHTML = "";

//   try {
//     const doctors = await getDoctors();

//     if (!Array.isArray(doctors)) {
//       throw new Error("Expected doctors to be an array.");
//     }

//     // if (doctors.length === 0) {
//     //   contentDiv.innerHTML = "<p>No doctors available.</p>";
//     //   return;
//     // }

//     if (doctors.length > 0) {
//   doctors.forEach(doctor => {
//     const card = createDoctorCard(doctor);
//     contentDiv.appendChild(card);
//   });
// } else {
//   contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
// }

//     renderDoctorCards(doctors);
//   } catch (error) {
//     contentDiv.innerHTML = "<p>Error loading doctors.</p>";
//     console.error("Failed to load doctors:", error);
//   }
// }


export async function loadDoctorCards() {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) {
    console.warn("⚠️ #content element not found. Skipping doctor rendering.");
    return;
  }

  try {
    const doctors = await getDoctors();
    if (doctors.length === 0) {
      contentDiv.innerHTML = "<p>No doctors available.</p>";
      return;
    }
    renderDoctorCards(doctors);
  } catch (error) {
    contentDiv.innerHTML = "<p>Error loading doctors.</p>";
    console.error("Failed to load doctors:", error);
  }
}




export function showBookingOverlay(e, doctor, patient) {
  const button = e.target;
  const rect = button.getBoundingClientRect();
  console.log(patient.name)
  console.log(patient)
  const ripple = document.createElement("div");
  ripple.classList.add("ripple-overlay");
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);

  setTimeout(() => ripple.classList.add("active"), 50);

  const modalApp = document.createElement("div");
  modalApp.classList.add("modalApp");

  modalApp.innerHTML = `
    <h2>Book Appointment</h2>
    <input class="input-field" type="text" value="${patient.name}" disabled />
    <input class="input-field" type="text" value="${doctor.name}" disabled />
    <input class="input-field" type="text" value="${doctor.specialty}" disabled/>
    <input class="input-field" type="email" value="${doctor.email}" disabled/>
    <input class="input-field" type="date" id="appointment-date" />
    <select class="input-field" id="appointment-time">
      <option value="">Select time</option>
      ${doctor.availableTimes.map(t => `<option value="${t}">${t}</option>`).join('')}
    </select>
    <button class="confirm-booking">Confirm Booking</button>
  `;

  document.body.appendChild(modalApp);

  setTimeout(() => modalApp.classList.add("active"), 600);

  modalApp.querySelector(".confirm-booking").addEventListener("click", async () => {
    const date = modalApp.querySelector("#appointment-date").value;
    const time = modalApp.querySelector("#appointment-time").value;
    const token = localStorage.getItem("token");
    const startTime = time.split('-')[0];
    const appointment = {
      doctor: { id: doctor.id },
      patient: { id: patient.id },
      appointmentTime: `${date}T${startTime}:00`,
      status: 0
    };


    const { success, message } = await bookAppointment(appointment, token);

    if (success) {
      alert("Appointment Booked successfully");
      ripple.remove();
      modalApp.remove();
    } else {
      alert("❌ Failed to book an appointment :: " + message);
    }
  });
}





document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("content")) {
    // Only bind if content div exists
    document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
    document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
    document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);
  }
});



function filterDoctorsOnChange() {
  const searchBarInput = document.getElementById("searchBar");
  const filterTimeInput = document.getElementById("filterTime");
  const filterSpecialtyInput = document.getElementById("filterSpecialty");
  const contentDiv = document.getElementById("content");

  if (!contentDiv) {
    console.warn("⚠️ Element with id='content' not found. Skipping rendering.");
    return;
  }

  const name = searchBarInput?.value.trim() || "all";
  const time = filterTimeInput?.value.trim() || "all";
  const specialty = filterSpecialtyInput?.value.trim() || "all";

  filterDoctors(name, time, specialty)
    .then(response => {
      const doctors = response.doctors || response || [];

      contentDiv.innerHTML = "";

      if (doctors.length > 0) {
        doctors.forEach(doctor => {
          const card = createDoctorCard(doctor);
          contentDiv.appendChild(card);
        });
      } else {
        contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
      }
    })
    .catch(error => {
      console.error("Failed to filter doctors:", error);
      alert("❌ An error occurred while filtering doctors.");
    });
}



export function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });

}
