const API_BASE = 'https://splitwise-lite-backend-production.up.railway.app/api'; // change to live URL later

function getToken() { return localStorage.getItem('token'); }
function getUser()  { return JSON.parse(localStorage.getItem('user') || 'null'); }

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Session timeout: 2 min inactivity OR tab hidden OR tab closed
const SESSION_TIMEOUT = 10 * 60 * 1000;
let timeoutHandle;

function resetTimer() {
  clearTimeout(timeoutHandle);
  timeoutHandle = setTimeout(logout, SESSION_TIMEOUT);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

if (getToken()) {
  ['click','keydown','touchstart','scroll','mousemove'].forEach(e =>
    document.addEventListener(e, resetTimer, { passive: true })
  );

  // Only logout on tab hidden, not on every navigation
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Give 500ms grace in case it's just a page navigation
      setTimeout(() => {
        if (document.hidden) logout();
      }, 500);
    }
  });

  resetTimer();
}
