import { auth, db } from './firebase-config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Inject Modal HTML into the DOM
const modalHTML = `
  <div class="modal-overlay" id="auth-modal">
    <div class="modal-content">
      <button class="modal-close" id="auth-close">&times;</button>
      <div class="auth-header">
        <h2 id="auth-title">Welcome Back</h2>
        <p id="auth-subtitle">Log in to discover handmade magic.</p>
      </div>
      <div class="auth-tabs" id="auth-tabs">
        <div class="auth-tab active" data-tab="login">Log In</div>
        <div class="auth-tab" data-tab="signup">Sign Up</div>
      </div>
      <form id="auth-form">
        <div class="auth-form-group" id="group-name" style="display:none;">
          <label for="auth-name">Full Name</label>
          <input type="text" id="auth-name" placeholder="Artisan or Buyer Name">
        </div>
        <div class="auth-form-group">
          <label for="auth-email">Email Address</label>
          <input type="email" id="auth-email" required placeholder="you@example.com">
        </div>
        <div class="auth-form-group">
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" required placeholder="••••••••">
        </div>
        <div class="auth-form-group" id="group-role" style="display:none;">
          <label for="auth-role">I want to...</label>
          <select id="auth-role">
            <option value="buyer">Shop for Goods</option>
            <option value="seller">Sell my Creations</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;" id="auth-submit-btn">Log In</button>
      </form>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('auth-modal');
const closeBtn = document.getElementById('auth-close');
const btnLoginOpen = document.getElementById('btn-login');
const btnSignupOpen = document.getElementById('btn-signup');
const authContainer = document.getElementById('auth-container');

// Tabs
const tabs = document.querySelectorAll('.auth-tab');
const title = document.getElementById('auth-title');
const subtitle = document.getElementById('auth-subtitle');
const groupName = document.getElementById('group-name');
const groupRole = document.getElementById('group-role');
const submitBtn = document.getElementById('auth-submit-btn');
const authForm = document.getElementById('auth-form');

let currentMode = 'login'; // 'login' or 'signup'

function setMode(mode) {
  currentMode = mode;
  tabs.forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${mode}"]`).classList.add('active');

  if (mode === 'signup') {
    title.textContent = 'Join Craft-Hub';
    subtitle.textContent = 'Create an account to shop or sell.';
    groupName.style.display = 'block';
    groupRole.style.display = 'block';
    submitBtn.textContent = 'Sign Up';
  } else {
    title.textContent = 'Welcome Back';
    subtitle.textContent = 'Log in to discover handmade magic.';
    groupName.style.display = 'none';
    groupRole.style.display = 'none';
    submitBtn.textContent = 'Log In';
  }
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => setMode(tab.dataset.tab));
});

function openModal(mode = 'login') {
  setMode(mode);
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

// Global modal triggers
window.openAuthModal = openModal;

if (btnLoginOpen) btnLoginOpen.addEventListener('click', () => openModal('login'));
if (btnSignupOpen) btnSignupOpen.addEventListener('click', () => openModal('signup'));
closeBtn.addEventListener('click', closeModal);

// Auth Form Submission
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-password').value;
  
  // Submit btn state
  submitBtn.textContent = 'Processing...';
  submitBtn.disabled = true;
  
  try {
    if (currentMode === 'signup') {
      const name = document.getElementById('auth-name').value;
      const role = document.getElementById('auth-role').value;
      
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      
      // Save role to firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        role,
        createdAt: new Date()
      });
      console.log("Signup successful as", role);
    } else {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      console.log("Login successful");
    }
    closeModal();
  } catch(error) {
    console.error("Auth error:", error);
    alert("Authentication failed: " + error.message);
  } finally {
    submitBtn.textContent = currentMode === 'signup' ? 'Sign Up' : 'Log In';
    submitBtn.disabled = false;
  }
});

// Update UI based on auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      let role = 'buyer';
      let name = 'User';
      if (docSnap.exists()) {
        role = docSnap.data().role;
        name = docSnap.data().name;
      }
      
      authContainer.innerHTML = `
        <div class="user-greeting" style="display: flex; align-items: center;">
          <span style="font-weight: 500; margin-right: 1rem; color: var(--color-primary)">Hi, ${name}</span>
          <button class="btn btn-outline" id="btn-logout" style="padding: 0.5rem 1.2rem; font-size: 0.9rem;">Log Out</button>
        </div>
      `;
      document.getElementById('btn-logout').addEventListener('click', () => {
        signOut(auth);
      });
    } catch(err) {
      console.error(err);
    }
  } else {
    // User is signed out.
    authContainer.innerHTML = `
      <button class="btn btn-outline" id="btn-login" style="padding: 0.5rem 1.2rem; font-size: 0.9rem;">Log In</button>
      <button class="btn btn-primary" id="btn-signup" style="padding: 0.5rem 1.2rem; font-size: 0.9rem;">Join</button>
    `;
    document.getElementById('btn-login').addEventListener('click', () => openModal('login'));
    document.getElementById('btn-signup').addEventListener('click', () => openModal('signup'));
  }
});
