// Colour-cycling on input focus
const COLOURS = ['#7f5af0','#2cb67d','#ff8906','#e53170','#0ea5e9'];
let colourIdx = 0;

document.querySelectorAll('.input-group input').forEach(inp => {
  inp.addEventListener('focus', () => {
    inp.style.setProperty('--input-glow', COLOURS[colourIdx % COLOURS.length]);
    colourIdx++;
  });
  inp.addEventListener('input', () => {
    inp.style.setProperty('--input-glow', COLOURS[Math.floor(Math.random() * COLOURS.length)]);
  });
});

async function doLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';

  if (!username || !password) {
    errEl.textContent = 'Please enter username and password.';
    return;
  }

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
    window.location.href = 'dashboard.html';
  } catch (err) {
    errEl.textContent = err.message || 'Login failed';
  }
}

// Allow Enter key to submit
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});