document.getElementById('changePasswordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const old_password = document.getElementById('old_password').value;
    const new_password = document.getElementById('new_password').value;
    const confirm_password = document.getElementById('confirm_password').value;
    const message = document.getElementById('message');

    if (new_password !== confirm_password) {
        message.style.color = "red";
        message.textContent = "New passwords do not match!";
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                old_password,
                new_password,
                confirm_password
            })
        });

        const data = await response.json();

        if (data.success) {
            message.style.color = "green";
            message.textContent = data.message;
        } else {
            message.style.color = "red";
            message.textContent = data.message;
        }

    } catch (error) {
        console.error(error);
        message.style.color = "red";
        message.textContent = "Error connecting to server!";
    }
});
