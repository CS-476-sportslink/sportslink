//Redirect to login if not logged in
if (!localStorage.getItem('access_token') && window.location.pathname.includes('home.html') || 
    window.location.pathname.includes('post.html') || 
    window.location.pathname.includes('profile.html') || 
    window.location.pathname.includes('editprofile.html') || 
    window.location.pathname.includes('settings.html')) {
    window.location.href = '../Loginandsignup/login.html';
}
//like button change class and increment like count
document.querySelectorAll('.sl-like-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const icon = btn.querySelector('i');
        const likeCount = btn.querySelector('.sl-like-count');
        let count = parseInt(likeCount.textContent);
        if (btn.classList.contains('liked')) {
            btn.classList.remove('liked');
            btn.classList.add('text-muted');
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            likeCount.textContent = count - 1;
        } else {
            btn.classList.add('liked');
            btn.classList.remove('text-muted');
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            likeCount.textContent = count + 1;
        }
    });
});


//Save button similar to like button
document.querySelectorAll('.sl-save-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const icon = btn.querySelector('i');
        const label = btn.querySelector('.sl-save-label');
        if (btn.classList.contains('saved')) {
            btn.classList.remove('saved');
            btn.classList.add('text-muted');
            icon.classList.remove('bi-bookmark-fill');
            icon.classList.add('bi-bookmark')
            label.textContent = 'Save';
        } else {
            btn.classList.add('saved');
            btn.classList.remove('text-muted');
            icon.classList.remove('bi-bookmark');
            icon.classList.add('bi-bookmark-fill');
            label.textContent = 'Saved';
        }
    });
});


//Follow button functionality

document.querySelectorAll('.sl-follow-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const followingCount = document.querySelector('.sl-following-count');
        if (btn.classList.contains('following')) {
            btn.classList.remove('following');
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-outline-danger');
            btn.textContent = 'Follow';
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) - 1;
            }
        } else {
            btn.classList.add('following');
            btn.classList.remove('btn-outline-danger');
            btn.classList.add('btn-danger');
            btn.textContent = 'Following';
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) + 1;
            }
        }
    });
});

//Notifications
const readAllBtn = document.querySelector('.sl-read-all-btn');
if (readAllBtn) {
    readAllBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const badge = document.querySelector('.sl-notification-badge');
        if (badge) {
            badge.classList.add('sl-hidden');
        }
        document.querySelectorAll('.sl-notification-unread').forEach(function (notification) {
            notification.classList.remove('sl-notification-unread');
        });
    });
};

//Resize comment area on post.html
document.querySelectorAll('textarea').forEach(function (textarea) {
    textarea.addEventListener('input', function (e) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
});

//Post replies
document.querySelectorAll('.sl-reply-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        const replyBox = btn.closest('.card-body').querySelector('.sl-reply-box');
        replyBox.classList.toggle('sl-hidden');
    });
});

// Hide and display content on settings tabs
document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
        document.querySelectorAll('.sl-settings-section').forEach(function (section) {
            section.classList.remove('active');
        });
        document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function (navLink) {
            navLink.classList.remove('active');
        });

        const section = link.getAttribute('data-section');
        document.getElementById('section-' + section).classList.add('active');
        link.classList.add('active');
    });
});



// Fetch logged in user and update UI
const token = localStorage.getItem('access_token');
if (token) {
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) { return response.json(); })
    .then(function(user) {
        const initials = (user.first_name && user.last_name)
            ? user.first_name[0] + user.last_name[0]
            : user.email[0].toUpperCase();

        document.querySelectorAll('.sl-current-user-avatar').forEach(function(avatar) {
            avatar.textContent = initials;
        });

        document.querySelectorAll('.sl-current-user-name').forEach(function(name) {
            name.textContent = user.first_name + ' ' + user.last_name;
        });

        //Profile card 
        const userInfo = document.querySelector('#sl-current-user-info');
        if (userInfo) {
            userInfo.textContent = user.role === 'athlete' ? 'Athlete' : 'Coach'
        }

        // About me bio
        const profileBio = document.querySelector('#sl-profile-bio');
        if (profileBio) {
            profileBio.textContent = user.bio || 'No bio yet.';
        }

        // Get the users profile links
        const profileLinks = document.querySelector('#sl-profile-links');
        if (profileLinks) {
            if (user.links && user.links.length > 0) {
                user.links.forEach(function(link) {
                    profileLinks.innerHTML += `<p class="text-muted small mb-2"><a href="${link.url}" class="text-decoration-none" target="_blank">${link.name}</a></p>`;
                });
            } else {
                profileLinks.innerHTML = '<p class="text-muted small">No links added yet.</p>';
            }
        }
    });
}

// Logout
const logoutBtn = document.querySelector('#sl-logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        fetch('http://127.0.0.1:8000/api/auth/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({ refresh: refreshToken })
        })
        .then(function() {
            localStorage.clear();
            window.location.href = '../Loginandsignup/login.html';
        })
        .catch(function() {
            localStorage.clear();
            window.location.href = '../Loginandsignup/login.html';
        });
    });
}
