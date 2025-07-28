// loggedPatient.js 
import { getDoctors } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';
import { filterDoctors } from './services/doctorServices.js';
import { bookAppointment } from './services/appointmentRecordService.js';


// document.addEventListener("DOMContentLoaded", () => {
//   loadDoctorCards();
// });

// function loadDoctorCards() {
//   getDoctors()
//     .then(doctors => {
//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       doctors.forEach(doctor => {
//         const card = createDoctorCard(doctor);
//         contentDiv.appendChild(card);
//       });
//     })
//     .catch(error => {
//       console.error("Failed to load doctors:", error);
//     });
// }


// function loadDoctorCards() {
//   getDoctors()
//     .then(doctors => {
//       console.log("Loaded doctors:", doctors);
//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       doctors.forEach(doctor => {
//         const card = createDoctorCard(doctor);
//         console.log("Generated card:", card);  // 🔍 Test what it returns
//         if (card instanceof HTMLElement) {
//           contentDiv.appendChild(card);
//         } else {
//           console.warn("createDoctorCard did not return a DOM element for:", doctor);
//         }
//       });
//     })
//     .catch(error => {
//       console.error("Failed to load doctors:", error);
//     });
// }


function loadDoctorCards() {
  getDoctors()
  .then(response => {
    // const doctors = response.doctors; // ✅ Fix here
    // const doctors = response;
    // const doctors = response.doctors.doctors;
    const doctors = response.doctors;
    console.log("Loaded doctors:", doctors);

    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    doctors.forEach(doctor => {
      const div = document.createElement("div");
      div.textContent = `${doctor.name} — ${doctor.specialty}`;
      div.style.padding = "10px";
      div.style.border = "1px solid #ccc";
      div.style.margin = "5px";
      contentDiv.appendChild(div);
    });
  })
  .catch(error => {
    console.error("Failed to load doctors:", error);
  });
  //   getDoctors().then(doctors => {
//   const contentDiv = document.getElementById("content");
//   contentDiv.innerHTML = "";

//   doctors.forEach(doctor => {
//     const card = createDoctorCard(doctor);
//     contentDiv.appendChild(card);
//   });
// })
}

// function loadDoctorCards() {
//   getDoctors()
//     .then(response => {
//       const doctors = response.doctors;  // ✅ extract the array
//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       doctors.forEach(doctor => {
//         const card = createDoctorCard(doctor);
//         contentDiv.appendChild(card);
//       });
//     })
//     .catch(error => {
//       console.error("Failed to load doctors:", error);
//     });
// }

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



// Filter Input
// document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
// document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
// document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  const searchBar = document.getElementById("searchBar");
  const timeFilter = document.getElementById("filterTime");
  const specialtyFilter = document.getElementById("filterSpecialty");

  if (searchBar) {
    searchBar.addEventListener("input", filterDoctorsOnChange);
  }
  if (timeFilter) {
    timeFilter.addEventListener("change", filterDoctorsOnChange);
  }
  if (specialtyFilter) {
    specialtyFilter.addEventListener("change", filterDoctorsOnChange);
  }
});


// function filterDoctorsOnChange() {
//   const searchBar = document.getElementById("searchBar").value.trim();
//   const filterTime = document.getElementById("filterTime").value;
//   const filterSpecialty = document.getElementById("filterSpecialty").value;


//   const name = searchBar.length > 0 ? searchBar : null;
//   const time = filterTime.length > 0 ? filterTime : null;
//   const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

//   filterDoctors(name, time, specialty)
//     .then(response => {
//       const doctors = response.doctors;
//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       if (doctors.length > 0) {
//         console.log(doctors);
//         doctors.forEach(doctor => {
//           const card = createDoctorCard(doctor);
//           contentDiv.appendChild(card);
//         });
//       } else {
//         contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
//         console.log("Nothing");
//       }
//     })
//     .catch(error => {
//       console.error("Failed to filter doctors:", error);
//       alert("❌ An error occurred while filtering doctors.");
//     });
// }



// function filterDoctorsOnChange() {
//   const searchBarInput = document.getElementById("searchBar");
//   const filterTimeInput = document.getElementById("filterTime");
//   const filterSpecialtyInput = document.getElementById("filterSpecialty");

//   const searchBar = searchBarInput ? searchBarInput.value.trim() : "";
//   const filterTime = filterTimeInput ? filterTimeInput.value : "";
//   const filterSpecialty = filterSpecialtyInput ? filterSpecialtyInput.value : "";

//   const name = searchBar.length > 0 ? searchBar : null;
//   const time = filterTime.length > 0 ? filterTime : null;
//   const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

//   // filterDoctors(name, time, specialty)
//   //   .then(response => {
//   //     const doctors = response.doctors;
//   //     const contentDiv = document.getElementById("content");
//   //     contentDiv.innerHTML = "";

//   //     if (doctors.length > 0) {
//   //       doctors.forEach(doctor => {
//   //         const card = createDoctorCard(doctor);
//   //         contentDiv.appendChild(card);
//   //       });
//   //     } else {
//   //       contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
//   //     }
//   //   })


//   filterDoctors(name, time, specialty)
//   .then(response => {
//     let doctors = response.doctors;

//     // if (timeFilter === "AM") {
//     //   doctors = doctors.filter(doc => 
//     //     console.log(doc),
//     //     doc.availableTimes.some(t => t.includes("AM"))
//     //   );
//     // } else if (timeFilter === "PM") {
//     //   doctors = doctors.filter(doc => 
//     //     doc.availableTimes.some(t => t.includes("PM"))
//     //   );
//     // }
//     if (filterTime === "AM") {
//   doctors = doctors.filter(doc => 
//     doc.availableTimes.some(t => {
//       const hour = parseInt(t.split("-")[0].split(":")[0], 10);
//       return hour >= 0 && hour < 12;
//     })
//   );
// } else if (filterTime === "PM") {
//   doctors = doctors.filter(doc => 
//     doc.availableTimes.some(t => {
//       const hour = parseInt(t.split("-")[0].split(":")[0], 10);
//       return hour >= 12 && hour < 24;
//     })
//   );
// }

//     const contentDiv = document.getElementById("content");
//     contentDiv.innerHTML = "";

//     if (doctors.length > 0) {
//       doctors.forEach(doctor => {
//         const card = createDoctorCard(doctor);
//         contentDiv.appendChild(card);
//       });
//     } else {
//       contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
//       console.log("Nothing");
//     }
//   })
//     .catch(error => {
//       console.error("Failed to filter doctors:", error);
//       alert("❌ An error occurred while filtering doctors.");
//     });
// }


// function filterDoctorsOnChange() {
//   const searchBarInput = document.getElementById("searchBar");
//   const filterTimeInput = document.getElementById("filterTime");
//   const filterSpecialtyInput = document.getElementById("filterSpecialty");

//   const searchBar = searchBarInput ? searchBarInput.value.trim() : "";
//   const filterTime = filterTimeInput ? filterTimeInput.value : "";
//   const filterSpecialty = filterSpecialtyInput ? filterSpecialtyInput.value : "";

//   const name = searchBar.length > 0 ? searchBar : null;
//   const time = "all"; // Always fetch all times
//   const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

//   filterDoctors(name, time, specialty)
//     .then(response => {
//       let doctors = response.doctors;

//       // Apply time filtering client-side
//       // if (filterTime === "AM") {
//       //   doctors = doctors.filter(doc =>
//       //     doc.availableTimes.some(t => {
//       //       const hour = parseInt(t.split("-")[0].split(":")[0], 10);
//       //       return hour >= 0 && hour < 12;
//       //     })
//       //   );
//       // } else if (filterTime === "PM") {
//       //   doctors = doctors.filter(doc =>
//       //     doc.availableTimes.some(t => {
//       //       const hour = parseInt(t.split("-")[0].split(":")[0], 10);
//       //       return hour >= 12 && hour < 24;
//       //     })
//       //   );
//       // }


//       if (filterTime === "AM") {
//   doctors = doctors.filter(doc =>
//     Array.isArray(doc.availableTimes) &&
//     doc.availableTimes.some(t => {
//       const hour = parseInt(t.split("-")[0].split(":")[0], 10);
//       return hour >= 0 && hour < 12;
//     })
//   );
// } else if (filterTime === "PM") {
//   doctors = doctors.filter(doc =>
//     Array.isArray(doc.availableTimes) &&
//     doc.availableTimes.some(t => {
//       const hour = parseInt(t.split("-")[0].split(":")[0], 10);
//       return hour >= 12 && hour < 24;
//     })
//   );
// }

//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       if (doctors.length > 0) {
//         doctors.forEach(doctor => {
//           const card = createDoctorCard(doctor);
//           contentDiv.appendChild(card);
//         });
//       } else {
//         contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
//         console.log("Nothing");
//       }
//     })
//     .catch(error => {
//       console.error("Failed to filter doctors:", error);
//       alert("❌ An error occurred while filtering doctors.");
//     });
// }


function filterDoctorsOnChange() {
  const searchBarInput = document.getElementById("searchBar");
  const filterTimeInput = document.getElementById("filterTime");
  const filterSpecialtyInput = document.getElementById("filterSpecialty");

  const name = searchBarInput && searchBarInput.value.trim() !== "" ? searchBarInput.value : "all";
  const time = filterTimeInput && filterTimeInput.value.trim() !== "" ? filterTimeInput.value : "all";
  const specialty = filterSpecialtyInput && filterSpecialtyInput.value.trim() !== "" ? filterSpecialtyInput.value : "all";

  filterDoctors(name, time, specialty)
    .then(response => {
      let doctors = response.doctors;

      const contentDiv = document.getElementById("content");
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
