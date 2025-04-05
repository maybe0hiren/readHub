document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
  
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
      const msg = document.getElementById('registerMessage');
  
      if (res.ok) {
        msg.textContent = '✅ Registered successfully. Please login.';
      } else {
        msg.textContent = '❌ ' + data.message;
      }
    } catch (err) {
      document.getElementById('registerMessage').textContent = '❌ Registration failed.';
    }
  });
  