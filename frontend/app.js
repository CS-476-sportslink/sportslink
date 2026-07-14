

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
                <a href="post.html" class="text-decoration-none text-dark">
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
    });
}