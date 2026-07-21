/* Going to need to setup a few things to get saved posts to actually work.
Backend:
    -Saved post model we need the user, post, created_at time so we can sort from most recently saved
    - Saved Post Serializer
    - Add two endpoints one for post and one for GET: /api/posts/id/save/ and GET /api/posts/saved/
    - Run the migrations so the table is created to store saved posts
Frontend:
    - Link the save button to POST endpoint
    - on the html page fetch and display all saved posts
    - put the functionality to make the save icon change when a user clicks on the save button */

/* Display the saved posts. Very very similar to the feed in home.html, we just need to get the saved posts, and display
them in a feed style. */
const savedPosts = document.querySelector('#sl-saved-posts');
if(savedPosts) {
    const token = localStorage.getItem('access_token');
    //request the backend to send us all posts logged in user has saved
    fetch('http://127.0.0.1:8000/api/posts/saved/', {
        headers: { 'Authorization': 'Bearer ' + token } // who am i
    })
    .then(function(response) { return response.json(); }) //convert backend response into javascript object
    .then(function(posts) { 
        //if there are no saved posts just show the user there is no saved posts
        if (posts.length === 0) {
            savedPosts.innerHTML = '<p class="text-muted text-center mt-4">No saved posts.</p>';
            return; //do not continue as theres nothing to display
        }
        //if there are posts, loop through all of them and display them on the page
        posts.forEach(function(savedPost) {
            const post = savedPost.post; //store the post details
            const initials = post.user.first_name[0] + post.user.last_name[0];
            savedPosts.innerHTML += `
                <div class="card shadow-sm mb-4 sl-post-card">
                    <a href="post.html?id=${post.id}" class="text-decoration-none text-dark">
                        <div class="card-body">
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
                        </div>
                    </a>
                    <div class="d-flex gap-1 px-3 pb-2">
                        <button class="btn btn-sm text-muted sl-like-btn"><i class="bi bi-heart p-1"></i><span class="sl-like-count">0</span></button>
                        <button class="btn btn-sm text-muted"><i class="bi bi-chat p-1"></i>Comment</button>
                        <button class="btn btn-sm text-muted"><i class="bi bi-share p-1"></i>Share</button>
                        <button class="btn btn-sm text-muted sl-save-btn" data-post-id="${post.id}"><i class="bi bi-bookmark p-1"></i><span class="sl-save-label">Save</span></button>
                    </div>
                </div>`;
        });
    });
}