document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
    const msg = document.getElementById('message');
  
    if (res.ok) {
      msg.textContent = 'Login successful!';
      window.location.href = 'home.html'; // or wherever you want to redirect
    } else {
      msg.textContent = data.message;
    }
  });