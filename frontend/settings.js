// Save profile settings
/* When a user makes changes to their profile in the settings page and clicks save we need to send this information to the backend */
const saveProfileBtn = document.querySelector('#sl-save-profile-btn');
//null check to avoid crashing
if (saveProfileBtn) {
    const token = localStorage.getItem('access_token');

    // fetch the logged in users information
    fetch('https://sportslink.tynan.pro/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); }) //convert response into javascript object
    .then(function(user) {
        //grab the location of these input boxes.
        const bioField = document.querySelector('#sl-profile-bio');
        const sportField = document.querySelector('#sl-profile-sport');
        //from information returned from the backend set these input values to the users name and bio if the user has a bio.
        if (bioField) bioField.value = user.bio || '';
        if (sportField) sportField.value = user.sport || '';
    });

    saveProfileBtn.addEventListener('click', function() { //add a click listener to the save button
        //send a patch request to backend to update users first name last name and bio
        fetch('https://sportslink.tynan.pro/api/auth/me/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ //convert to json string so backend can read it.
                bio: document.querySelector('#sl-profile-bio').value.trim(),
                sport: document.querySelector('#sl-profile-sport').value.trim(),
            })
        })
        .then(function(response) { return response.json(); }) //convert response into javascript object
        .then(function(user) {
            if (user.id) { //if we got a user id returned we know the backend update was a success so display a message
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile'); //if we didnt get an id then return error message
            }
        })
        //if anything else above fails show error message
        .catch(function() {
            alert('Something went wrong, please try again');
        });
    });
}

// Change password
/* This lets a user change their password with the right credentials.
A user needs to be able to provide their old password and confirm their new password
by entering it twice. */
const savePasswordBtn = document.querySelector('#sl-save-password-btn');
//null check to avoid crashing
if (savePasswordBtn) {
    savePasswordBtn.addEventListener('click', function() { //add click listener on save button
        const currentPassword = document.querySelector('#sl-current-password').value.trim();
        const newPassword = document.querySelector('#sl-new-password').value.trim();
        const confirmPassword = document.querySelector('#sl-confirm-new-password').value.trim();
        const token = localStorage.getItem('access_token');

        //This checks to ensure all fields have information entered. We need every single field filled out to process this request.
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        //The new password has to be entered twice, and they need to match
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        // send a POST request to the backend to change the users password
        // we cant use PATCH as we aren't just updated a field on user model. We need the backend to verify the old password before setting the new one.
        // The ChangePasswordView handles the old password verification
        fetch('https://sportslink.tynan.pro/api/auth/change-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ //send as json string so backend can read it
                current_password: currentPassword,
                new_password: newPassword
            })
        })
        .then(function(response) { return response.json(); }) //convert response into javascript object.
        .then(function(result) {
            //our changepasswordview returns a success message or an error.
            //if we get a message back that means it was successful so show successful update
            if (result.message) {
                alert('Password updated successfully!');
            } else {
                alert(result.error || 'Failed to update password'); //if we received an error tell the user there was an error
            }
        })
        //show error message if anything else fails.
        .catch(function() {
            alert('Something went wrong, please try again');
        });
    });
}