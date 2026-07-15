
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

// Signup form
const signupForm = document.querySelector('.sl-signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.querySelector('#fname').value;
        const lastName = document.querySelector('#lname').value;
        const email = document.querySelector('#exampleEmail').value;
        const password = document.querySelector('#inputPswd').value;
        
        localStorage.setItem('signup_first_name', firstName);
        localStorage.setItem('signup_last_name', lastName);
        localStorage.setItem('signup_email', email);
        localStorage.setItem('signup_password', password);

        window.location.href = 'role.html';
    });
}

// Role selection
const roleForm = document.querySelector('.sl-role-form');
if (roleForm) {
    roleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const role = document.querySelector('input[name="roleChoice"]:checked');
        if (!role) {
            alert('Please select a role');
            return;
        }

        const firstName = localStorage.getItem('signup_first_name');
        const lastName = localStorage.getItem('signup_last_name');
        const email = localStorage.getItem('signup_email');
        const password = localStorage.getItem('signup_password');

        fetch('http://127.0.0.1:8000/api/auth/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
                role: role.value.toLowerCase()
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.email) {
                return fetch('http://127.0.0.1:8000/api/token/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: localStorage.getItem('signup_email'),
                        password: localStorage.getItem('signup_password')
                    })
                });
            } else {
                alert('Signup failed. Please try again.');
            }
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.removeItem('signup_first_name');
                localStorage.removeItem('signup_last_name');
                localStorage.removeItem('signup_email');
                localStorage.removeItem('signup_password');
                window.location.href = 'login.html';
            }
        })
        .catch(function(error) {
            alert('Something went wrong, please try again');
        });
    });
}