// patientDashboard.js
import { selectRole } from './render.js'; 
import { getDoctors } from './services/doctorServices.js';
import { openModal } from './components/modals.js';
import { createDoctorCard } from './components/doctorCard.js';
import { filterDoctors } from './services/doctorServices.js';//call the same function to avoid duplication coz the functionality was same
// import { patientSignup, patientLogin } from './services/patientServices.js';
import { patientSignup, patientLogin } from './services/patientServices.js';
////



import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

const tableBody = document.getElementById("patientTableBody");
const searchBar = document.getElementById("searchBar");
const filterSelect = document.getElementById("appointmentFilter");
let token = localStorage.getItem("token");

// Optional search and filter values
let patientName = null;
let filterType = "allAppointments";

// Search bar filtering
searchBar?.addEventListener("input", () => {
  const value = searchBar.value.trim();
  patientName = value !== "" ? value : null;
  loadAppointments();
});

// Dropdown filtering (future, past, all)
filterSelect?.addEventListener("change", () => {
  filterType = filterSelect.value;
  loadAppointments();
});

async function loadAppointments() {
  try {
    const appointments = await getAllAppointments({ name: patientName, type: filterType, token });

    tableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No appointments found.</td></tr>`;
      return;
    }

    appointments.forEach(appointment => {
      const row = createPatientRow(appointment);
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading appointments:", error);
    tableBody.innerHTML = `<tr><td colspan="5">Error loading appointments.</td></tr>`;
  }
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
});


///


document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("patientSignup");
  if (btn) {
    btn.addEventListener("click", () => openModal("patientSignup"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("patientLogin")
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      // loginBtn
      openModal("patientLogin")
      // openModal("loginBtn")
    })
  }
})



function loadDoctorCards() {

  getDoctors()
  .then(doctors => {
    console.log("Loaded doctors:", doctors);
    if (!Array.isArray(doctors)) {
      throw new Error("Expected an array of doctors but got: " + typeof doctors);
    }

    // Now just work with `doctors`, no redeclaration
    const displayDoctors = doctors; // or rename if needed
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (displayDoctors.length > 0) {
      displayDoctors.forEach(doc => {
        const card = createDoctorCard(doc);
        contentDiv.appendChild(card);
      });
    } else {
      contentDiv.innerHTML = "<p>No doctors found.</p>";
    }
  })
    .catch(error => {
      console.error("Failed to load doctors:", error);
    });
}


// Filter Input
document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);



function filterDoctorsOnChange() {
  const searchBarInput = document.getElementById("searchBar");
  const filterTimeInput = document.getElementById("filterTime");
  const filterSpecialtyInput = document.getElementById("filterSpecialty");

  const name = searchBarInput && searchBarInput.value.trim() !== "" ? searchBarInput.value : "all";
  const time = filterTimeInput && filterTimeInput.value.trim() !== "" ? filterTimeInput.value : "all";
  const specialty = filterSpecialtyInput && filterSpecialtyInput.value.trim() !== "" ? filterSpecialtyInput.value : "all";

  filterDoctors(name, time, specialty)
    .then(response => {
      const doctors = response.doctors || response || [];  // defensive fix if response is array or object with doctors

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




window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);
    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    }
    else alert(message);
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};




window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);

    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

