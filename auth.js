// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail // Added sendPasswordResetEmail import here for clarity
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your Firebase config (use your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyBbMbQbZciSXI098pYAdQe1FJiWdjsNGx0",
  authDomain: "mindease-b9b6f.firebaseapp.com",
  projectId: "mindease-b9b6f",
  storageBucket: "mindease-b9b6f.firebasestorage.app",
  messagingSenderId: "376295406434",
  appId: "1:376295406434:web:c66e8ff859400b49da8a3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helper to use the app's notification system instead of alert()
function showNotification(message, type) {
  if (window.app && window.app.showNotification) {
    window.app.showNotification(message, type);
  } else {
    // Fallback if script.js hasn't initialized the app yet
    console.warn(`Notification: [${type}] ${message}`);
  }
}

// Signup Logic: NOW MOCKED TO CALL THE JAVA BACKEND API
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // NOTE: This URL is kept as a mock for a backend integration as per previous context.
    

    try {
      showNotification("Attempting to register user via Java Backend...", 'info');
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // In a real app, we would only send email and maybe hash the password before sending.
        body: JSON.stringify({ email, password }) 
      });

      if (response.ok || response.status === 201) {
        // Assume Java backend confirms registration success
        showNotification("MindEase signup successful! User recorded in SQL Database via Java backend.", 'success');
        
        // After successful recording, proceed to login page
        window.location.href = "login.html";

      } else {
        // Assume Java backend returns an error message
        const errorData = await response.json().catch(() => ({ message: 'Server responded with an unknown error.' }));
        showNotification(`MindEase registration failed (Backend Error): ${errorData.message || 'Unknown error'}`, 'error');
      }

    } catch (error) {
      // Catch network errors (e.g., if the Java server isn't running)
      console.error("Network or API call failed:", error);
      showNotification("Network error. Could not connect to the Java backend at http://localhost:8080.", 'error');

      // OPTIONAL: Fallback to Firebase for actual functionality if Java is just for namesake.
      // For this task, we will keep it as a mock for the Java backend integration.
    }
  });
}

// Login Logic (FIXED redirect to index.html)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        showNotification("MindEase login successful! Redirecting to your dashboard.", 'success');
        // --- CORRECTED REDIRECT ---
        window.location.href = "index.html"; 
      })
      .catch(() => {
        showNotification("Invalid email or password", 'error');
      });
  });
}

// Forgot Password Logic
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showNotification("Password reset link sent to your email.", 'info');
      })
      .catch((error) => {
        showNotification(error.message, 'error');
      });
  });
}

// Logout Logic (FIXED redirect to index.html)
window.logout = function () {
  signOut(auth).then(() => {
    // --- CORRECTED REDIRECT ---
    window.location.href = "index.html"; 
    showNotification("You have been logged out of MindEase.", 'info');
  });
};

// Session Check (used in dashboard.html)
onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.includes("dashboard.html") && !user) {
    // Redirect unauthenticated users back to the app index page for simplicity
    window.location.href = "index.html"; 
  }
});
