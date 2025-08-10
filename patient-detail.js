// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0xaN8jxCIoeoDVCMRyTfHRKktsXpLGiA",
  authDomain: "vitalink-fc777.firebaseapp.com",
  projectId: "vitalink-fc777",
  storageBucket: "vitalink-fc777.appspot.com",
  messagingSenderId: "814483569352",
  appId: "1:814483569352:web:14a6390a025704413643fd"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

document.addEventListener("DOMContentLoaded", () => {
  const patientForm = document.getElementById("patient-form");
  const patientJson = document.getElementById("patient-json");
  const savedDetailsContainer = document.getElementById("patient-saved");
  const toggleFormBtn = document.getElementById("toggle-form");
  const patientFormWrap = document.getElementById("patient-form-wrap");
  const editBtn = document.getElementById("edit-patient");
  let currentUserId = null;

  // Toggle form when clicking "Fill / Edit Details"
  toggleFormBtn.addEventListener("click", () => {
    patientFormWrap.classList.toggle("hidden");
    savedDetailsContainer.classList.add("hidden");
  });

  // Toggle form when clicking "Edit"
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      patientFormWrap.classList.remove("hidden");
      savedDetailsContainer.classList.add("hidden");
    });
  }

  // Load logged-in user data
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      alert("Not logged in. Redirecting to login.");
      window.location.href = "index.html";
      return;
    }

    currentUserId = user.uid;
    const docSnap = await db.collection("users").doc(currentUserId).get();
    if (docSnap.exists && docSnap.data().patientDetails) {
      const patientData = docSnap.data().patientDetails;
      fillForm(patientData);
      showSavedDetails(patientData);
      patientFormWrap.classList.add("hidden");
      savedDetailsContainer.classList.remove("hidden");
    } else {
      patientFormWrap.classList.remove("hidden");
    }
  });

  function fillForm(data) {
    document.getElementById("patient-fullname").value = data.fullname || "";
    document.getElementById("patient-dob").value = data.dob || "";
    document.getElementById("patient-gender").value = data.gender || "";
    document.getElementById("patient-blood").value = data.bloodGroup || "";
    document.getElementById("thalassemia").value = data.thalassemia || "";
    document.getElementById("diagnosis-date").value = data.diagnosisDate || "";
    document.getElementById("treatment").value = data.treatment || "";
    document.getElementById("doctor-name").value = data.doctorName || "";
    document.getElementById("doctor-contact").value = data.doctorContact || "";
    document.getElementById("hospital-name").value = data.hospital || "";
    document.getElementById("patient-location").value = data.location || "";
    document.getElementById("patient-phone").value = data.phone || "";
    document.getElementById("patient-email").value = data.email || "";
    document.getElementById("emergency-name").value = data.emergencyName || "";
    document.getElementById("emergency-phone").value = data.emergencyPhone || "";
    document.getElementById("patient-consent").checked = !!data.consent;
  }

  function showSavedDetails(data) {
    savedDetailsContainer.classList.remove("hidden");
    patientFormWrap.classList.add("hidden");
    patientJson.textContent = JSON.stringify(data, null, 2);
  }

  patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("patient-fullname").value.trim();
    const dob = document.getElementById("patient-dob").value;
    const blood = document.getElementById("patient-blood").value;
    const thal = document.getElementById("thalassemia").value;
    const location = document.getElementById("patient-location").value.trim();
    const phone = document.getElementById("patient-phone").value.trim();
    const email = document.getElementById("patient-email").value.trim();
    const consent = document.getElementById("patient-consent").checked;

    if (!fullname || !dob || !blood || !thal || !location || !phone || !email || !consent) {
      alert("Please fill all required fields and give consent.");
      return;
    }

    // Upload medical reports
    const fileInput = document.getElementById("medical-reports");
    let fileUrls = [];

    if (fileInput.files.length > 0) {
      try {
        fileUrls = await Promise.all(
          Array.from(fileInput.files).map(async (file) => {
            const storageRef = storage.ref().child(`medicalReports/${currentUserId}/${file.name}`);
            await storageRef.put(file);
            return await storageRef.getDownloadURL();
          })
        );
      } catch (error) {
        alert("Error uploading files: " + error.message);
        return;
      }
    }

    const patientDetails = {
      fullname,
      dob,
      gender: document.getElementById("patient-gender").value,
      bloodGroup: blood,
      thalassemia: thal,
      diagnosisDate: document.getElementById("diagnosis-date").value,
      treatment: document.getElementById("treatment").value,
      doctorName: document.getElementById("doctor-name").value,
      doctorContact: document.getElementById("doctor-contact").value,
      hospital: document.getElementById("hospital-name").value,
      location,
      phone,
      email,
      emergencyName: document.getElementById("emergency-name").value,
      emergencyPhone: document.getElementById("emergency-phone").value,
      medicalReports: fileUrls,
      consent,
      savedAt: new Date().toISOString()
    };

    try {
      await db.collection("users").doc(currentUserId).set(
        { patientDetails },
        { merge: true }
      );
      alert("Patient details saved successfully!");
      showSavedDetails(patientDetails);
    } catch (err) {
      alert("Error saving data: " + err.message);
    }
  });
});
