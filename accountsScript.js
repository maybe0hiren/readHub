document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    const msg = document.getElementById('message');

    if (res.ok) {
      msg.textContent = '✅ Login successful! Redirecting...';
      setTimeout(() => {
        window.location.href = 'index.html'; // Change if needed
      }, 1000);
    } else {
      msg.textContent = '❌ ' + data.message;
    }
  } catch (error) {
    document.getElementById('message').textContent = '❌ Could not connect to server.';
    console.error(error);
  }
});
