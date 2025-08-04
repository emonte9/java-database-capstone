// export function setRole(role) {
//   localStorage.setItem('role', role);
// }

// document.addEventListener("DOMContentLoaded", () => {
//   renderContent();
// });
document.addEventListener("DOMContentLoaded", () => {
  renderContent();  // checks role
  // initializePage(); // loads appointments
});

// render.js
 export function setRole(role) {
  localStorage.setItem('userRole', role);
 }

export function selectRole(role) {
  setRole(role);
  const token = localStorage.getItem('token');

  if (role === "admin") {
    if (token) {
      window.location.href = `/adminDashboard/${token}`;
    }
  } else if (role === "patient") {
    window.location.href = "/pages/patientDashboard.html";
  } else if (role === "doctor") {
    if (token) {
      window.location.href = `/doctorDashboard/${token}`;
    }
  } else if (role === "loggedPatient") {
    window.location.href = "/pages/loggedPatientDashboard.html";
  }
}

// export function renderContent() {
//   const role = localStorage.getItem('userRole');
//   if (!role) {
//     window.location.href = "/";
//     return;
//   }
// }

export function renderContent() {
  const role = localStorage.getItem('userRole');

  const isProtectedPage = window.location.pathname.includes('adminDashboard');

  if (isProtectedPage && role !== 'admin') {
    window.location.href = "/";
  }
}

// Optional: make selectRole globally accessible for inline HTML
window.selectRole = selectRole;
window.renderContent = renderContent;