// ==== 1. Firebase Config ====
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

// ==== 2. Show/Hide Forms ====
function showSignup() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('signup-form').classList.remove('hidden');
}

function showLogin() {
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
}

// ==== 3. Signup Function ====
function signUp(event) {
  event.preventDefault();

  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  // Fixed selector: 'user-type' (all lowercase)
  const userType = document.querySelector('input[name="user-type"]:checked').value;

  console.log("Signing up:", username, email, userType);

  // Create user in Firebase Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      // Save extra data in Firestore
      return db.collection("users").doc(uid).set({
        username: username,
        email: email,
        userType: userType
      });
    })
    .then(() => {
      alert("Signed up as " + userType + "! You can now log in.");
      showLogin();
    })
    .catch(error => {
      alert(error.message);
    });
}

// ==== 4. Login Function ====
function goToWebsite(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  console.log("Logging in with:", email);

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      // Fetch user details from Firestore
      return db.collection("users").doc(uid).get();
    })
    .then(doc => {
      if (!doc.exists) {
        alert("User data not found!");
        return;
      }
      const userData = doc.data();
      // Redirect based on role
      if (userData.userType === "donor") {
        window.location.href = "donor.html";
      } else if (userData.userType === "patient") {
        window.location.href = "patient.html";
      }
    })
    .catch(error => {
      alert(error.message);
    });
}
