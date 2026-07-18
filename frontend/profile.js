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

// Edit profile page populate bio
const editBioDisplay = document.querySelector('#sl-edit-bio-display');
const editBioTextarea = document.querySelector('#sl-edit-bio-textarea');
if (editBioDisplay || editBioTextarea) {
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); })
    .then(function(user) {
        if (editBioDisplay) editBioDisplay.textContent = user.bio || 'No bio yet.';
        if (editBioTextarea) editBioTextarea.value = user.bio || '';
    });
}

// Save bio from edit profile page
const saveBioBtn = document.querySelector('#sl-save-bio-btn');
if (saveBioBtn) {
    saveBioBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const bio = document.querySelector('#sl-edit-bio-textarea').value.trim();

        fetch('http://127.0.0.1:8000/api/auth/me/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ bio: bio })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.id) {
                document.querySelector('#sl-edit-bio-display').textContent = bio;
                alert('Bio updated!');
            }
        })
        .catch(function() {
            alert('Something went wrong');
        });
    });
}

// Edit profile page posts
const editProfilePostFeed = document.querySelector('#sl-edit-profile-post-feed');
if (editProfilePostFeed) {
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
            editProfilePostFeed.innerHTML = '<p class="text-muted text-center">No posts yet.</p>';
            return;
        }
        posts.forEach(function(post) {
            const initials = post.user.first_name[0] + post.user.last_name[0];
            editProfilePostFeed.innerHTML += `
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

// Edit profile links
const saveLinksBtn = document.querySelector('#sl-save-links-btn');
if (saveLinksBtn) {
    const token = localStorage.getItem('access_token');

    // Populate links on page load
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); })
    .then(function(user) {
        const links = user.links || [];
        if (links[0]) {
            document.querySelector('#sl-link-1-url').value = links[0].url || '';
            document.querySelector('#sl-link-1-name').value = links[0].name || '';
        }
        if (links[1]) {
            document.querySelector('#sl-link-2-url').value = links[1].url || '';
            document.querySelector('#sl-link-2-name').value = links[1].name || '';
        }
        if (links[2]) {
            document.querySelector('#sl-link-3-url').value = links[2].url || '';
            document.querySelector('#sl-link-3-name').value = links[2].name || '';
        }

        //Show the links
        const editProfileLinks = document.querySelector('#sl-edit-profile-links');
        if (editProfileLinks && user.links && user.links.length > 0) {
            user.links.forEach(function(link) {
                editProfileLinks.innerHTML += `<p class="text-muted small mb-2"><a href="${link.url}" class="text-decoration-none" target="_blank">${link.name}</a></p>`;
            });
        } else if (editProfileLinks) {
            editProfileLinks.innerHTML = '<p class="text-muted small">No links added yet.</p>';
        }
    });

    // Save links
    saveLinksBtn.addEventListener('click', function() {
        const links = [
            { url: document.querySelector('#sl-link-1-url').value.trim(), name: document.querySelector('#sl-link-1-name').value.trim() },
            { url: document.querySelector('#sl-link-2-url').value.trim(), name: document.querySelector('#sl-link-2-name').value.trim() },
            { url: document.querySelector('#sl-link-3-url').value.trim(), name: document.querySelector('#sl-link-3-name').value.trim() }
        ].filter(function(link) { return link.url; }).map(function(link) {
            if (!link.url.startsWith('http')) {
                link.url = 'https://' + link.url;
            }
            return link;
        });

        fetch('http://127.0.0.1:8000/api/auth/me/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ links: links })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.id) {
                alert('Links saved!');
            }
        })
        .catch(function() {
            alert('Something went wrong');
        });
    });
}