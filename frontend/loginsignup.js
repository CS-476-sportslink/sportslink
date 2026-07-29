// Login form
const loginForm = document.querySelector('.sl-login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#pswd').value;

        fetch('https://sportslink.tynan.pro/api/token/', {
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
                window.location.href = '..//home.html';
            } else {
                alert('Invalid email or password');
            }
        })
        .catch(function() {
            alert('Something went wrong, please try again');
        });
    });
}

// Signup form
/* Read the users first name, last name, email and password and save them to local storage. We are sending all of them together at the end so we just save them
in local storage for now. */
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
/* Save the selected role to local storage and redirect to bio page to continue letting user sign up */
const roleForm = document.querySelector('.sl-role-form');
if (roleForm) {
    roleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const role = document.querySelector('input[name="roleChoice"]:checked');
        if (!role) {
            alert('Please select a role');
            return;
        }
        // save role to local storage and move to bio page
        localStorage.setItem('signup_role', role.value.toLowerCase());
        window.location.href = 'bio.html';
    });
}

// Bio modal save button
/* When user clicks save, just temporarily put the info in local storage, so later we can send it to the backend all at once
 */

const bioSaveBtn = document.querySelector('#sl-bio-save');
if (bioSaveBtn) {
    bioSaveBtn.addEventListener('click', function() {
        const bio = document.querySelector('#modal-bio').value;
        localStorage.setItem('signup_bio', bio);
    });
}

// Sport modal save button
/* Same as bio, save the sport to local storage when the user clicks save */
const sportSaveBtn = document.querySelector('#sl-sport-save');
if (sportSaveBtn) {
    sportSaveBtn.addEventListener('click', function() {
        const sport = document.querySelector('#modal-sport').value;
        localStorage.setItem('signup_sport', sport);
    });
}

// Bio page submit
/* Since all of the data is in local storage we can get it and send it to the backend to register the user. If that succeeds
we can just log the user in */
const bioSubmit = document.querySelector('#sl-bio-submit');
if (bioSubmit) {
    bioSubmit.addEventListener('click', function(e) {
        e.preventDefault();
        const firstName = localStorage.getItem('signup_first_name');
        const lastName = localStorage.getItem('signup_last_name');
        const email = localStorage.getItem('signup_email');
        const password = localStorage.getItem('signup_password');
        const role = localStorage.getItem('signup_role');
        const bio = localStorage.getItem('signup_bio');
        const sport = localStorage.getItem('signup_sport');

        // send all the information we just collected to the backend so we can sign the user up
        fetch('https://sportslink.tynan.pro/api/auth/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
                role: role,
                bio: bio,
                sport: sport
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.id) {
                // registration worked so now we can log them in
                return fetch('https://sportslink.tynan.pro/api/token/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password })
                });
            } else {
                alert('Signup failed. Please try again.');
                window.location.href = 'signup.html';
            }
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                // clear all signup data from local storage as we dont need it anymore
                localStorage.removeItem('signup_first_name');
                localStorage.removeItem('signup_last_name');
                localStorage.removeItem('signup_email');
                localStorage.removeItem('signup_password');
                localStorage.removeItem('signup_role');
                localStorage.removeItem('signup_bio');
                localStorage.removeItem('signup_sport');
                window.location.href = '..//home.html';
            }
        })
        .catch(function() {
            alert('Something went wrong, please try again');
        });
    });
}

//forgot password button
const forgotPassword = document.querySelector('#forgotPassword');

if (forgotPassword) {
    forgotPassword.addEventListener('click', function() {
        //redirect to login page 
        window.location.href = 'forgot_password.html';
    });
}