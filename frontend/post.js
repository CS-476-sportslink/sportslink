
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