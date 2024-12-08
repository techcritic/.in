document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/user-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Login successful') {
            // Hide the login popup and redirect to submit review page
            document.getElementById('loginPopup').style.display = 'none';
            window.location.href = '/my-profile';
        } else {
            document.getElementById('loginMessage').innerText = 'Login failed. Please try again.';
        }
    })
    .catch(error => console.error('Error:', error));
});
