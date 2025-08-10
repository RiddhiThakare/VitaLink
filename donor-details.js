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
  const donorForm = document.getElementById("donor-form");
  const donorJson = document.getElementById("donor-json");
  const toggleBtn = document.getElementById("toggle-form");
  const formWrap = document.getElementById("donor-form-wrap");
  const savedSection = document.getElementById("donor-saved");

  let currentUserId = null;

  // Toggle form visibility
  toggleBtn.addEventListener("click", () => {
    formWrap.classList.toggle("hidden");
    savedSection.classList.add("hidden");
  });

  // Logout button
  document.getElementById("logout-btn")?.addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  });

  // Load existing data if user logged in
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      alert("Not logged in. Redirecting to login.");
      window.location.href = "index.html";
      return;
    }

    currentUserId = user.uid;

    const docSnap = await db.collection("users").doc(currentUserId).get();
    if (docSnap.exists && docSnap.data().donorDetails) {
      const donorData = docSnap.data().donorDetails;
      fillForm(donorData);
      donorJson.textContent = JSON.stringify(donorData, null, 2);
      savedSection.classList.remove("hidden");
    }
  });

  // Fill form from saved data
  function fillForm(data) {
    document.getElementById("donor-fullname").value = data.fullname || "";
    document.getElementById("donor-dob").value = data.dob || "";
    document.getElementById("donor-gender").value = data.gender || "";
    document.getElementById("donor-blood").value = data.bloodGroup || "";
    document.getElementById("donor-last-donation").value = data.lastDonation || "";
    document.getElementById("donor-eligibility").value = data.eligibility || "";
    document.getElementById("donor-location").value = data.location || "";
    document.getElementById("donor-availability").value = data.availability || "";
    document.getElementById("donor-phone").value = data.phone || "";
    document.getElementById("donor-email").value = data.email || "";
    document.getElementById("donor-consent").checked = !!data.consent;
  }

  // Form submit
  donorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("donor-fullname").value.trim();
    const dob = document.getElementById("donor-dob").value;
    const blood = document.getElementById("donor-blood").value;
    const location = document.getElementById("donor-location").value.trim();
    const phone = document.getElementById("donor-phone").value.trim();
    const email = document.getElementById("donor-email").value.trim();
    const consent = document.getElementById("donor-consent").checked;

    if (!fullname || !dob || !blood || !location || !phone || !email || !consent) {
      alert("Please fill all required fields and give consent.");
      return;
    }

    // Upload ID proof
    const fileInput = document.getElementById("donor-id-proof");
    let fileData = null;

    if (fileInput.files.length > 0) {
      try {
        const file = fileInput.files[0];
        const storageRef = storage.ref().child(`idProofs/${currentUserId}/${file.name}`);
        await storageRef.put(file);
        fileData = await storageRef.getDownloadURL();
      } catch (error) {
        alert("Error uploading ID proof: " + error.message);
        return;
      }
    }

    // Data object
    const donorDetails = {
      fullname,
      dob,
      gender: document.getElementById("donor-gender").value,
      bloodGroup: blood,
      lastDonation: document.getElementById("donor-last-donation").value,
      eligibility: document.getElementById("donor-eligibility").value,
      location,
      availability: document.getElementById("donor-availability").value,
      phone,
      email,
      idProofUrl: fileData,
      consent,
      savedAt: new Date().toISOString()
    };

    try {
      await db.collection("users").doc(currentUserId).set(
        { donorDetails },
        { merge: true }
      );
      alert("Donor details saved successfully!");
      donorJson.textContent = JSON.stringify(donorDetails, null, 2);
      savedSection.classList.remove("hidden");
      formWrap.classList.add("hidden");
    } catch (err) {
      alert("Error saving data: " + err.message);
    }
  });
});
