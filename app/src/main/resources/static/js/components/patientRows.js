// patientRows.js
// export function createPatientRow(patient, appointmentId, doctorId) {
//   const tr = document.createElement("tr");
//   console.log("CreatePatientRow :: ", doctorId)
//   tr.innerHTML = `
//       <td class="patient-id">${patient.id}</td>
//       <td>${patient.name}</td>
//       <td>${patient.phone}</td>
//       <td>${patient.email}</td>
//       <td><img src="../assets/images/addPrescriptionIcon/addPrescription.png" alt="addPrescriptionIcon" class="prescription-btn" data-id="${patient.id}"></img></td>
//     `;

//   // Attach event listeners
//   tr.querySelector(".patient-id").addEventListener("click", () => {
//     window.location.href = `/pages/patientRecord.html?id=${patient.id}&doctorId=${doctorId}`;
//   });

//   tr.querySelector(".prescription-btn").addEventListener("click", () => {
//     window.location.href = `/pages/addPrescription.html?appointmentId=${appointmentId}&patientName=${patient.name}`;
//   });

//   return tr;
// }


// export function createPatientRow(patient, appointmentId, doctorId) {
//   const tr = document.createElement("tr");

//   tr.innerHTML = `
//     <td class="patient-id">${patient.id}</td>
//     <td>${patient.name}</td>
//     <td>${patient.phone}</td>
//     <td>${patient.email}</td>
//     <td>
//       <img src="../assets/images/addPrescriptionIcon/addPrescription.png"
//            alt="addPrescriptionIcon"
//            class="prescription-btn"
//            data-id="${patient.id}">
//     </td>
//   `;

//   // Safely attach event listeners
//   const idCell = tr.querySelector(".patient-id");
//   const prescriptionBtn = tr.querySelector(".prescription-btn");

//   if (idCell) {
//     idCell.addEventListener("click", () => {
//       window.location.href = `/pages/patientRecord.html?id=${patient.id}&doctorId=${doctorId}`;
//     });
//   }

//   if (prescriptionBtn) {
//     prescriptionBtn.addEventListener("click", () => {
//       window.location.href = `/pages/addPrescription.html?appointmentId=${appointmentId}&patientName=${encodeURIComponent(patient.name)}`;
//     });
//   }

//   return tr;
// }


export function createPatientRow(patient, appointmentId, doctorId) {
  const tr = document.createElement("tr");

  const idTd = document.createElement("td");
  idTd.className = "patient-id";
  idTd.textContent = patient.id;

  const nameTd = document.createElement("td");
  nameTd.textContent = patient.name;

  const phoneTd = document.createElement("td");
  phoneTd.textContent = patient.phone;

  const emailTd = document.createElement("td");
  emailTd.textContent = patient.email;

  const actionTd = document.createElement("td");
  const img = document.createElement("img");
  img.src = "../assets/images/addPrescriptionIcon/addPrescription.png";
  img.alt = "addPrescriptionIcon";
  img.className = "prescription-btn";
  img.dataset.id = patient.id;
  actionTd.appendChild(img);

  // Add click handlers
  idTd.addEventListener("click", () => {
    window.location.href = `/pages/patientRecord.html?id=${patient.id}&doctorId=${doctorId}`;
  });

  img.addEventListener("click", () => {
    window.location.href = `/pages/addPrescription.html?appointmentId=${appointmentId}&patientName=${encodeURIComponent(patient.name)}`;
  });

  tr.append(idTd, nameTd, phoneTd, emailTd, actionTd);
  return tr;
}


