// ==== 1. Firebase Config ====
const firebaseConfig = {
  apiKey: "AIzaSyB0xaN8jxCIoeoDVCMRyTfHRKktsXpLGiA",
  authDomain: "vitalink-fc777.firebaseapp.com",
  projectId: "vitalink-fc777",
  storageBucket: "vitalink-fc777.appspot.com",
  messagingSenderId: "814483569352",
  appId: "1:814483569352:web:14a6390a025704413643fd",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==== 2. Create animated background particles ====
function createParticles() {
  const container = document.getElementById("particles");
  const particleCount = 150; // More particles for rich atmosphere

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random size and position with more variety
    const size = Math.random() * 8 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 25 + "s";
    particle.style.animationDuration = Math.random() * 15 + 12 + "s";

    // Add some variety in opacity for depth
    particle.style.opacity = Math.random() * 0.4 + 0.1;

    container.appendChild(particle);
  }
}

// ==== 3. Enhanced form switching with smooth animations ====
function showSignup() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm.classList.add("form-switch-exit");

  setTimeout(() => {
    loginForm.classList.add("hidden");
    loginForm.classList.remove("form-switch-exit");
    signupForm.classList.remove("hidden");
    signupForm.classList.add("form-switch-enter");

    setTimeout(() => {
      signupForm.classList.remove("form-switch-enter");
    }, 500);
  }, 250);
}

function showLogin() {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  signupForm.classList.add("form-switch-exit");

  setTimeout(() => {
    signupForm.classList.add("hidden");
    signupForm.classList.remove("form-switch-exit");
    loginForm.classList.remove("hidden");
    loginForm.classList.add("form-switch-enter");

    setTimeout(() => {
      loginForm.classList.remove("form-switch-enter");
    }, 500);
  }, 250);
}

// ==== 4. Custom modal for password recovery ====
function showRecovery() {
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

  modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 400px;
            animation: scaleIn 0.3s ease;
        ">
            <h3 style="color: var(--text); margin-bottom: 15px;">Password Recovery</h3>
            <p style="color: var(--text-light); margin-bottom: 20px;">Password recovery not implemented yet. Contact support for assistance.</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: var(--primary);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            ">OK</button>
        </div>
    `;

  document.body.appendChild(modal);
}

// ==== 5. Custom toast notifications ====
function showCustomAlert(message, type = "info") {
  const alertBox = document.createElement("div");
  alertBox.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "linear-gradient(135deg, #4caf50, #66bb6a)"
            : type === "error"
            ? "linear-gradient(135deg, #f44336, #ef5350)"
            : "linear-gradient(135deg, #f57c00, #ff9800)"
        };
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 4s forwards;
    `;

  alertBox.textContent = message;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    if (alertBox.parentNode) {
      alertBox.remove();
    }
  }, 4500);
}

// ==== 6. Enhanced Signup Function ====
function signUp(event) {
  event.preventDefault();

  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const userTypeElement = document.querySelector(
    'input[name="user-type"]:checked'
  );

  if (!userTypeElement) {
    showCustomAlert("Please select a user type (Donor or Patient).", "error");
    return;
  }

  const userType = userTypeElement.value;

  console.log("Signing up:", username, email, userType);

  // Create user in Firebase Auth
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      // Save extra data in Firestore
      return db.collection("users").doc(uid).set({
        username: username,
        email: email,
        userType: userType,
      });
    })
    .then(() => {
      showCustomAlert(
        `Successfully signed up as ${userType}! You can now log in.`,
        "success"
      );
      // Clear form
      document.getElementById("signup-username").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
      document.querySelector('input[name="user-type"]:checked').checked = false;

      // Switch to login form after a delay
      setTimeout(() => {
        showLogin();
      }, 1500);
    })
    .catch((error) => {
      console.error("Signup error:", error);
      showCustomAlert(error.message, "error");
    });
}

// ==== 7. Enhanced Login Function ====
function goToWebsite(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showCustomAlert("Please enter both email and password.", "error");
    return;
  }

  console.log("Logging in with:", email);

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      console.log("Login successful, UID:", uid);
      showCustomAlert("Login successful! Redirecting...", "success");

      // Fetch user details from Firestore
      return db.collection("users").doc(uid).get();
    })
    .then((doc) => {
      if (!doc.exists) {
        console.error("User document does not exist");
        showCustomAlert(
          "User profile not found! Please contact support.",
          "error"
        );
        return;
      }

      const userData = doc.data();
      console.log("User data retrieved:", userData);

      if (!userData.userType) {
        console.error("User type missing in document");
        showCustomAlert(
          "User type not found! Please contact support.",
          "error"
        );
        return;
      }

      // Redirect based on role with a slight delay for better UX
      setTimeout(() => {
        if (userData.userType === "donor") {
          console.log("Redirecting to donor.html");
          window.location.href = "donor.html";
        } else if (userData.userType === "patient") {
          console.log("Redirecting to patient.html");
          window.location.href = "patient.html";
        } else {
          console.error("Unknown user type:", userData.userType);
          showCustomAlert(
            "Unknown user type! Please contact support.",
            "error"
          );
        }
      }, 1500);
    })
    .catch((error) => {
      console.error("Login error:", error);
      let errorMessage = error.message;

      // Provide more user-friendly error messages
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      showCustomAlert(errorMessage, "error");
    });
}

// ==== 8. Initialize particles on load ====
document.addEventListener("DOMContentLoaded", function () {
  createParticles();

  // Add dynamic CSS for animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideInRight {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: translateX(100px); }
        }
    `;
  document.head.appendChild(style);
});
