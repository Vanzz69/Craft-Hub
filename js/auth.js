import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Google Provider
const googleProvider = new GoogleAuthProvider();

// ===== INJECT MODAL HTML =====
const modalHTML = `
  <div class="modal-overlay" id="auth-modal">
    <div class="modal-content">
      <button class="modal-close" id="auth-close">&times;</button>
      <div class="auth-header">
        <h2 id="auth-title">Welcome Back</h2>
        <p id="auth-subtitle">Log in to discover handmade magic.</p>
      </div>

      <!-- Google Sign-In -->
      <button class="btn btn-google" id="btn-google" style="width:100%;margin-bottom:.75rem;">
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <div class="auth-divider"><span>or</span></div>

      <!-- Tabs -->
      <div class="auth-tabs" id="auth-tabs">
        <div class="auth-tab active" data-tab="login">Log In</div>
        <div class="auth-tab" data-tab="signup">Sign Up</div>
      </div>

      <form id="auth-form">
        <div class="auth-form-group" id="group-name" style="display:none;">
          <label for="auth-name">Full Name</label>
          <input type="text" id="auth-name" placeholder="Your name">
        </div>
        <div class="auth-form-group">
          <label for="auth-email">Email Address</label>
          <input type="email" id="auth-email" required placeholder="you@example.com">
        </div>
        <div class="auth-form-group">
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" required placeholder="••••••••" minlength="6">
        </div>

        <!-- Role Selector (signup only) -->
        <div id="group-role" style="display:none;">
          <label style="display:block;font-size:.9rem;margin-bottom:.5rem;font-weight:500">I want to...</label>
          <div class="role-selector">
            <div class="role-option selected" data-role="buyer" id="role-buyer">
              <span class="role-icon">🛍️</span>
              <span class="role-label">Shop for Goods</span>
            </div>
            <div class="role-option" data-role="seller" id="role-seller">
              <span class="role-icon">🎨</span>
              <span class="role-label">Sell my Creations</span>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:.75rem;" id="auth-submit-btn">Log In</button>
      </form>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

// ===== DOM REFS =====
const modal = document.getElementById('auth-modal');
const closeBtn = document.getElementById('auth-close');
const btnLoginOpen = document.getElementById('btn-login');
const btnSignupOpen = document.getElementById('btn-signup');
const authContainer = document.getElementById('auth-container');
const tabs = document.querySelectorAll('.auth-tab');
const title = document.getElementById('auth-title');
const subtitle = document.getElementById('auth-subtitle');
const groupName = document.getElementById('group-name');
const groupRole = document.getElementById('group-role');
const submitBtn = document.getElementById('auth-submit-btn');
const authForm = document.getElementById('auth-form');
const btnGoogle = document.getElementById('btn-google');

let currentMode = 'login';
let selectedRole = 'buyer';

// ===== ROLE SELECTOR =====
document.querySelectorAll('.role-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    selectedRole = opt.dataset.role;
  });
});

// ===== TAB SWITCHING =====
function setMode(mode) {
  currentMode = mode;
  tabs.forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${mode}"]`)?.classList.add('active');
  if (mode === 'signup') {
    title.textContent = 'Join Craft-Hub';
    subtitle.textContent = 'Create an account to shop or sell.';
    groupName.style.display = 'block';
    groupRole.style.display = 'block';
    submitBtn.textContent = 'Create Account';
  } else {
    title.textContent = 'Welcome Back';
    subtitle.textContent = 'Log in to discover handmade magic.';
    groupName.style.display = 'none';
    groupRole.style.display = 'none';
    submitBtn.textContent = 'Log In';
  }
}

tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.tab)));

function openModal(mode = 'login') { setMode(mode); modal.classList.add('active'); }
function closeModal() { modal.classList.remove('active'); }
window.openAuthModal = openModal;

if (btnLoginOpen) btnLoginOpen.addEventListener('click', () => openModal('login'));
if (btnSignupOpen) btnSignupOpen.addEventListener('click', () => openModal('signup'));
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ===== GOOGLE SIGN-IN =====
btnGoogle.addEventListener('click', async () => {
  btnGoogle.disabled = true;
  btnGoogle.textContent = 'Connecting...';
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Check if user doc exists, if not create one
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        name: user.displayName || 'User',
        email: user.email,
        role: 'buyer',
        photoURL: user.photoURL || '',
        createdAt: new Date()
      });
    }
    closeModal();
    if (window.showToast) window.showToast(`Welcome, ${user.displayName || 'friend'}! 🌿`, 'success');
  } catch (error) {
    console.error("Google auth error:", error);
    if (window.showToast) window.showToast('Google sign-in failed: ' + error.message, 'error');
  } finally {
    btnGoogle.disabled = false;
    btnGoogle.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Continue with Google`;
  }
});

// ===== EMAIL/PASSWORD AUTH =====
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-password').value;
  submitBtn.textContent = 'Processing...';
  submitBtn.disabled = true;

  try {
    if (currentMode === 'signup') {
      const name = document.getElementById('auth-name').value;
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, "users", userCred.user.uid), {
        name: name || 'Artisan',
        email,
        role: selectedRole,
        createdAt: new Date()
      });
      if (window.showToast) window.showToast(`Account created as ${selectedRole}! 🎉`, 'success');
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
      if (window.showToast) window.showToast('Welcome back! 🌿', 'success');
    }
    closeModal();
  } catch (error) {
    console.error("Auth error:", error);
    let msg = error.message;
    if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
    if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
    if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
    if (error.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
    if (window.showToast) window.showToast(msg, 'error');
  } finally {
    submitBtn.textContent = currentMode === 'signup' ? 'Create Account' : 'Log In';
    submitBtn.disabled = false;
  }
});

// ===== AUTH STATE OBSERVER =====
onAuthStateChanged(auth, async (user) => {
  if (!authContainer) return;
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      let role = 'buyer', name = user.displayName || 'User';
      if (docSnap.exists()) {
        role = docSnap.data().role || 'buyer';
        name = docSnap.data().name || name;
      }
      const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const isPages = window.location.pathname.includes('/pages/');
      const dashLink = role === 'seller' ? `<a href="${isPages ? './' : './pages/'}dashboard.html" style="color:var(--primary);font-weight:500;font-size:.9rem;text-decoration:none;margin-right:.25rem;">Dashboard</a>` : '';

      authContainer.innerHTML = `
        <div style="display:flex;align-items:center;gap:.75rem;">
          ${dashLink}
          <div style="width:34px;height:34px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600">${initials}</div>
          <span style="font-weight:500;color:var(--primary);font-size:.9rem">${name.split(' ')[0]}</span>
          <button class="btn btn-outline" id="btn-logout" style="padding:.4rem 1rem;font-size:.8rem">Log Out</button>
        </div>
      `;
      document.getElementById('btn-logout').addEventListener('click', () => {
        signOut(auth);
        if (window.showToast) window.showToast('Logged out successfully', 'success');
      });
    } catch (err) { console.error(err); }
  } else {
    authContainer.innerHTML = `
      <button class="btn btn-outline" id="btn-login" style="padding:.5rem 1.2rem;font-size:.9rem">Log In</button>
      <button class="btn btn-primary" id="btn-signup" style="padding:.5rem 1.2rem;font-size:.9rem">Join</button>
    `;
    document.getElementById('btn-login')?.addEventListener('click', () => openModal('login'));
    document.getElementById('btn-signup')?.addEventListener('click', () => openModal('signup'));
  }
});
