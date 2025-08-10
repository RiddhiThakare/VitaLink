// Firebase config (same as your other files)
const firebaseConfig = {
  apiKey: "AIzaSyB0xaN8jxCIoeoDVCMRyTfHRKktsXpLGiA",
  authDomain: "vitalink-fc777.firebaseapp.com",
  projectId: "vitalink-fc777",
  storageBucket: "vitalink-fc777.appspot.com",
  messagingSenderId: "814483569352",
  appId: "1:814483569352:web:14a6390a025704413643fd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  // Listen to auth state changes
  auth.onAuthStateChanged(user => {
    if (user) {
      loadPatientData(user.uid);
    } else {
      window.location.href = "index.html"; // redirect if not logged in
    }
  });

  // Logout button
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  });
});

// Load patient data from Firestore and update UI
function loadPatientData(uid) {
  db.collection("users").doc(uid).get()
    .then(doc => {
      if (!doc.exists) {
        alert("No patient data found.");
        return;
      }
      const data = doc.data();
      document.getElementById("patient-name").textContent = data.username || "Patient";
      document.getElementById("blood-group").textContent = data.bloodGroup || "Not set";
      document.getElementById("hospital-name").textContent = data.hospital || "Not set";
      document.getElementById("appointment-date").textContent = data.nextAppointment || "Not set";
    })
    .catch(error => {
      console.error("Error fetching patient data:", error);
    });
}

// Placeholder functions for future features
function uploadReports() {
  alert("Upload Medical Reports feature coming soon!");
}

function viewDonors() {
  alert("View Matched Donors feature coming soon!");
}
