
// Login form
const loginForm = document.querySelector('.sl-login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.querySelector('#uname').value;
        const password = document.querySelector('#pswd').value;

        fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                window.location.href = '../frontend/home.html';
            } else {
                alert('Invalid email or password');
            }
        })
        .catch(function(error) {
            alert('Something went wrong, please try again');
        });
    });
}