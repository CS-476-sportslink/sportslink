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
                                        <span class="sl-badge-player me-1">${post.user.role === 'athlete' ? 'Athlete' : 'Coach'}</span>
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