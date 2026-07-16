//Redirect to login if not logged in
if (!localStorage.getItem('access_token') && window.location.pathname.includes('home.html')) {
    window.location.href = '../Loginandsignup/login.html';
}

//like button change class and increment like count
document.querySelectorAll('.sl-like-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        const icon = this.querySelector('i');
        const likeCount = this.querySelector('.sl-like-count');
        let count = parseInt(likeCount.textContent);

        if (this.classList.contains('liked')) {
            this.classList.remove('liked');
            this.classList.add('text-muted');   
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            likeCount.textContent = count - 1;
        } else {
            this.classList.add('liked');
            this.classList.remove('text-muted');
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            likeCount.textContent = count + 1;
        }
    });
});


//Save button similar to like button
document.querySelectorAll('.sl-save-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        const icon = this.querySelector('i');
        const label = this.querySelector('.sl-save-label');

        
        if (this.classList.contains('saved')) {
            this.classList.remove('saved');
            this.classList.add('text-muted');
            icon.classList.remove('bi-bookmark-fill');
            icon.classList.add('bi-bookmark')
            label.textContent = 'Save';
        } else {
            this.classList.add('saved');
            this.classList.remove('text-muted');
            icon.classList.remove('bi-bookmark');
            icon.classList.add('bi-bookmark-fill');
            label.textContent = 'Saved';
        }
    });
});


/*Follow button functionality*/

document.querySelectorAll('.sl-follow-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        const followingCount = document.querySelector('.sl-following-count');

        if (this.classList.contains('following')) {
            this.classList.remove('following');
            this.classList.remove('btn-danger');
            this.classList.add('btn-outline-danger');
            this.textContent = 'Follow';
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) - 1;
            }
        } else {
            this.classList.add('following');
            this.classList.remove('btn-outline-danger');
            this.classList.add('btn-danger');
            this.textContent = 'Following';
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) + 1;
            }
        }
    });
});

//Notifications
const readAllBtn = document.querySelector('.sl-read-all-btn');
if (readAllBtn) {
    readAllBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        const badge = document.querySelector('.sl-notification-badge');
        if (badge) {
            badge.classList.add('sl-hidden');
        }

        document.querySelectorAll('.sl-notification-unread').forEach(function(notification) {
            notification.classList.remove('sl-notification-unread');
        });
    });
};

//Resize comment area on post.html
document.querySelectorAll('textarea').forEach(function(textarea) {
    textarea.addEventListener('input', function(e) {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});

//Post replies
document.querySelectorAll('.sl-reply-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        const replyBox = this.closest('.card-body').querySelector('.sl-reply-box');
        replyBox.classList.toggle('sl-hidden');
    });
});

// Hide and display content on settings tabs
document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {

        document.querySelectorAll('.sl-settings-section').forEach(function(s) {
            s.classList.remove('active');
        });
        document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function(l) {
            l.classList.remove('active');
        });

        const section = this.getAttribute('data-section');
        document.getElementById('section-' + section).classList.add('active');
        this.classList.add('active');
    });
});


// Load posts feed
const postFeed = document.querySelector('#sl-post-feed');
if (postFeed) {
    const token = localStorage.getItem('access_token');

    fetch('http://127.0.0.1:8000/api/posts/', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) { return response.json(); })
    .then(function(posts) {
        if (posts.length === 0) {
            postFeed.innerHTML = '<p class="text-muted text-center">No posts yet.</p>';
            return;
        }

        posts.forEach(function(post) {
            const postHTML = `
                <a href="post.html?id=${post.id}" class="text-decoration-none text-dark">
                    <div class="card shadow-sm mb-4 sl-post-card">
                        <div class="card-body">
                            <div class="d-flex align-items-start gap-2 mb-2">
                                <div class="sl-post-avatar sl-avatar-player">${post.user.first_name[0]}${post.user.last_name[0]}</div>
                                <div>
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="fw-semibold">${post.user.first_name} ${post.user.last_name}</div>
                                        <button class="btn btn-outline-danger btn-sm py-0 sl-follow-btn">Follow</button>
                                    </div>
                                    <div class="text-muted small">
                                        <span class="sl-badge-player me-1">Athlete</span>
                                    </div>
                                </div>
                                <div class="text-muted small ms-auto">${new Date(post.created_at).toLocaleDateString()}</div>
                            </div>
                            <p class="small mb-2">${post.body}</p>
                            ${post.media_url ? `
                            <div class="d-flex align-items-center gap-2 p-2 mb-2 sl-video-block">
                                <div class="sl-play-btn">
                                    <i class="bi bi-play-fill text-white"></i>
                                </div>
                                <div>
                                    <div class="small fw-semibold"><a href="${post.media_url}" target="_blank" class="text-decoration-none text-dark">Watch video</a></div>
                                </div>
                            </div>` : ''}
                            <div class="d-flex gap-1 pt-2">
                                <button class="btn btn-sm text-muted sl-like-btn"><i class="bi bi-heart p-1"></i><span class="sl-like-count">0</span></button>
                                <button class="btn btn-sm text-muted"><i class="bi bi-chat p-1"></i>Comment</button>
                                <button class="btn btn-sm text-muted"><i class="bi bi-share p-1"></i>Share</button>
                                <button class="btn btn-sm text-muted sl-save-btn"><i class="bi bi-bookmark p-1"></i><span class="sl-save-label">Save</span></button>
                            </div>
                        </div>
                    </div>
                </a>`;
            postFeed.innerHTML += postHTML;
        });
    })
    .catch(function(error) {
        postFeed.innerHTML = '<p class="text-muted text-center">Failed to load posts.</p>';
    });
}

// Create post
const createPostBtn = document.querySelector('#sl-create-post-btn');
if (createPostBtn) {
    createPostBtn.addEventListener('click', function() {
        const body = document.querySelector('.sl-post-body').value.trim();
        const mediaUrl = document.querySelector('.sl-post-media-url').value.trim();
        const token = localStorage.getItem('access_token');

        if (!body) {
            alert('Please write something before posting');
            return;
        }

        fetch('http://127.0.0.1:8000/api/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                body: body,
                media_url: mediaUrl,
                media_type: mediaUrl ? 'video' : ''
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.id) {
                window.location.reload();
            } else {
                alert('Failed to create post');
            }
        })
        .catch(function(error) {
            alert('Something went wrong, please try again');
        });
    });
}

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

//Post page show post details
const postDetail = document.querySelector('#sl-post-detail');
if (postDetail) {
    const token = localStorage.getItem('access_token');
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        window.location.href = 'home.html';
    }

    fetch(`http://127.0.0.1:8000/api/posts/${postId}/`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) { return response.json(); })
    .then(function(post) {
        const initials = post.user.first_name[0] + post.user.last_name[0];
        postDetail.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex align-items-start gap-2 mb-2">
                        <div class="sl-post-avatar sl-avatar-player">${initials}</div>
                        <div>
                            <div class="d-flex align-items-center gap-3">
                                <div class="fw-semibold">${post.user.first_name} ${post.user.last_name}</div>
                                <button class="btn btn-outline-danger btn-sm py-0 sl-follow-btn">Follow</button>
                            </div>
                            <div class="text-muted small">
                                <span class="sl-badge-player me-1">${post.user.role === 'athlete' ? 'Athlete' : 'Coach'}</span>
                            </div>
                        </div>
                        <div class="text-muted small ms-auto">${new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                    <p class="mb-2">${post.body}</p>
                    ${post.media_url ? `
                    <div class="d-flex align-items-center gap-2 p-2 mb-2 sl-video-block">
                        <div class="sl-play-btn">
                            <i class="bi bi-play-fill text-white"></i>
                        </div>
                        <div>
                            <div class="small fw-semibold"><a href="${post.media_url}" target="_blank" class="text-decoration-none text-dark">Watch video</a></div>
                        </div>
                    </div>` : ''}
                    <div class="d-flex gap-1 pt-2">
                        <button class="btn btn-sm text-muted sl-like-btn"><i class="bi bi-heart p-1"></i><span class="sl-like-count">0</span></button>
                        <button class="btn btn-sm text-muted"><i class="bi bi-share p-1"></i>Share</button>
                        <button class="btn btn-sm text-muted sl-save-btn"><i class="bi bi-bookmark p-1"></i><span class="sl-save-label">Save</span></button>
                    </div>
                </div>
            </div>`;
        // Load comments
        fetch(`http://127.0.0.1:8000/api/posts/${postId}/comments/`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(function(response) { return response.json(); })
        .then(function(comments) {
            const commentSection = document.querySelector('#sl-comments');
            if (!commentSection) return;

            if (comments.length === 0) {
                commentSection.innerHTML = '<p class="text-muted small">No comments yet.</p>';
                return;
            }

            comments.forEach(function(comment) {
                const initials = comment.user.first_name[0] + comment.user.last_name[0];
                commentSection.innerHTML += `
                    <div class="d-flex gap-3 mb-3 mt-3">
                        <div class="card shadow-sm w-100">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <div class="sl-post-avatar sl-avatar-player sl-comment-inner-avatar">${initials}</div>
                                    <div>
                                        <div class="fw-semibold small">${comment.user.first_name} ${comment.user.last_name}</div>
                                        <div class="text-muted small"><span class="sl-badge-player me-1">${comment.user.role === 'athlete' ? 'Athlete' : 'Coach'}</span></div>
                                    </div>
                                    <div class="text-muted small ms-auto">${new Date(comment.created_at).toLocaleDateString()}</div>
                                </div>
                                <p class="small mb-2">${comment.body}</p>
                                <button class="btn btn-sm text-muted sl-like-btn"><i class="bi bi-heart p-1"></i><span class="sl-like-count">0</span></button>
                                <button class="btn btn-sm text-muted sl-reply-btn">Reply</button>
                            </div>
                        </div>
                    </div>`;
            });
        });
    })
    .catch(function() {
        window.location.href = 'home.html';
    });
}


// Create comment
const postCommentBtn = document.querySelector('#sl-post-comment-btn');
if (postCommentBtn) {
    postCommentBtn.addEventListener('click', function() {
        const body = document.querySelector('.sl-comment-body').value.trim();
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');

        if (!body) return;

        fetch(`http://127.0.0.1:8000/api/posts/${postId}/comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ body: body })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.id) {
                window.location.reload();
            }
        })
        .catch(function(error) {
            alert('Something went wrong, please try again');
        });
    });
}

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

// Load profile page posts
const profilePostFeed = document.querySelector('#sl-profile-post-feed');
if (profilePostFeed) {
    const token = localStorage.getItem('access_token');

    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); })
    .then(function(user) {
        return fetch(`http://127.0.0.1:8000/api/posts/?user=${user.id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
    })
    .then(function(response) { return response.json(); })
    .then(function(posts) {
        if (posts.length === 0) {
            profilePostFeed.innerHTML = '<p class="text-muted text-center">No posts yet.</p>';
            return;
        }
        posts.forEach(function(post) {
            const initials = post.user.first_name[0] + post.user.last_name[0];
            profilePostFeed.innerHTML += `
                <a href="post.html?id=${post.id}" class="text-decoration-none text-dark">
                    <div class="card shadow-sm mb-4 sl-post-card">
                        <div class="card-body">
                            <div class="d-flex align-items-start gap-2 mb-2">
                                <div class="sl-post-avatar sl-avatar-player">${initials}</div>
                                <div>
                                    <div class="fw-semibold">${post.user.first_name} ${post.user.last_name}</div>
                                    <div class="text-muted small">
                                        <span class="sl-badge-player me-1">${post.user.role === 'athlete' ? 'Athlete' : 'Coach'}</span>
                                    </div>
                                </div>
                                <div class="text-muted small ms-auto">${new Date(post.created_at).toLocaleDateString()}</div>
                            </div>
                            <p class="small mb-2">${post.body}</p>
                            <div class="d-flex gap-1 pt-2">
                                <button class="btn btn-sm text-muted sl-like-btn"><i class="bi bi-heart p-1"></i><span class="sl-like-count">0</span></button>
                                <button class="btn btn-sm text-muted"><i class="bi bi-chat p-1"></i>Comment</button>
                                <button class="btn btn-sm text-muted"><i class="bi bi-share p-1"></i>Share</button>
                                <button class="btn btn-sm text-muted sl-save-btn"><i class="bi bi-bookmark p-1"></i><span class="sl-save-label">Save</span></button>
                            </div>
                        </div>
                    </div>
                </a>`;
        });
    });
}