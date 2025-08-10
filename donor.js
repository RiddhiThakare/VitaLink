// Firebase config (same as main site)
const firebaseConfig = {
  apiKey: "AIzaSyB0xaN8jxCIoeoDVCMRyTfHRKktsXpLGiA",
  authDomain: "vitalink-fc777.firebaseapp.com",
  projectId: "vitalink-fc777",
  storageBucket: "vitalink-fc777.appspot.com",
  messagingSenderId: "814483569352",
  appId: "1:814483569352:web:14a6390a025704413643fd"
};
;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {

  // Listen for auth state changes (login/logout)
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in, load donor data
      loadDonorData(user.uid);
    } else {
      // No user logged in, redirect to login page
      window.location.href = "index.html";
    }
  });

  // Logout button
  document.getElementById("logout-link").addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  });
});

// Load donor data from Firestore and update UI
function loadDonorData(uid) {
  db.collection("users").doc(uid).get()
    .then(doc => {
      if (!doc.exists) {
        alert("No donor data found.");
        return;
      }
      const data = doc.data();

      // Fill in donor info (add fields if you store these in Firestore)
      document.getElementById("bloodGroup").textContent = data.bloodGroup || "--";
      document.getElementById("lastDonation").textContent = data.lastDonation || "--";
      document.getElementById("totalDonations").textContent = data.totalDonations || 0;

      if (data.lastDonation) {
        const nextEligibleDate = calculateNextDonation(data.lastDonation);
        document.getElementById("nextEligible").textContent = nextEligibleDate;
      }
    })
    .catch(error => {
      console.error("Error getting donor data:", error);
    });
}

function calculateNextDonation(lastDate) {
  const last = new Date(lastDate);
  last.setDate(last.getDate() + 90); 
  return last.toISOString().split("T")[0];
}
