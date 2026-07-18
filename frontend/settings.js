// Save profile settings
const saveProfileBtn = document.querySelector('#sl-save-profile-btn');
if (saveProfileBtn) {
    const token = localStorage.getItem('access_token');

    // Populate fields on page load
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); })
    .then(function(user) {
        const nameField = document.querySelector('#sl-profile-name');
        const bioField = document.querySelector('#sl-profile-bio');
        if (nameField) nameField.value = user.first_name + ' ' + user.last_name;
        if (bioField) bioField.value = user.bio || '';
    });

    saveProfileBtn.addEventListener('click', function() {
        const name = document.querySelector('#sl-profile-name').value.trim().split(' ');
        const firstName = name[0];
        const lastName = name.slice(1).join(' ');

        fetch('http://127.0.0.1:8000/api/auth/me/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                bio: document.querySelector('#sl-profile-bio').value.trim(),
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.id) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        })
        .catch(function() {
            alert('Something went wrong, please try again');
        });
    });
}

// Populate current email on settings page
const currentEmail = document.querySelector('#sl-current-email');
if (currentEmail) {
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); })
    .then(function(user) {
        currentEmail.textContent = user.email;
    });
}

// Save email settings page
const saveEmailBtn = document.querySelector('#sl-save-email-btn');
if (saveEmailBtn) {
    saveEmailBtn.addEventListener('click', function() {
        const newEmail = document.querySelector('#sl-new-email').value.trim();
        const token = localStorage.getItem('access_token');

        if (!newEmail) {
            alert('Please enter a new email');
            return;
        }

        fetch('http://127.0.0.1:8000/api/auth/me/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ email: newEmail })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.id) {
                alert('Email updated successfully!');
                document.querySelector('#sl-current-email').textContent = newEmail;
            } else {
                alert('Failed to update email');
            }
        })
        .catch(function() {
            alert('Something went wrong, please try again');
        });
    });
}

// Change password
const savePasswordBtn = document.querySelector('#sl-save-password-btn');
if (savePasswordBtn) {
    savePasswordBtn.addEventListener('click', function() {
        const currentPassword = document.querySelector('#sl-current-password').value.trim();
        const newPassword = document.querySelector('#sl-new-password').value.trim();
        const confirmPassword = document.querySelector('#sl-confirm-new-password').value.trim();
        const token = localStorage.getItem('access_token');

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        fetch('http://127.0.0.1:8000/api/auth/change-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.message) {
                alert('Password updated successfully!');
            } else {
                alert(data.error || 'Failed to update password');
            }
        })
        .catch(function() {
            alert('Something went wrong, please try again');
        });
    });
}