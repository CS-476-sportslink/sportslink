
/* This is for showing specific posts when a post is clicked on. 
We are grabbing the post id from the url and fetching that post to display
on the post page. */
const postDetail = document.querySelector('#sl-post-detail');
//null check to avoid crashing
if (postDetail) {
    const token = localStorage.getItem('access_token');
    const params = new URLSearchParams(window.location.search); //read everything in the URL after the ? and gives us a way to access each value
    const postId = params.get('id'); // from the URLSearchParams we can get the post id

    // Quick check to see if someone actually clicked on a post card. If they didnt and navigated to the post.html page with no id present just reroute them to home page.
    if (!postId) {
        window.location.href = 'home.html';
    }
    // need to run the same checks as we did in app.js to see if the post is in saved state already or not
    const savedPostIds = [];

    //send request to backend to get saved post Ids so we can show them as saved on load or reload
    //this fetch needs to be done first, we need to fill the array before we display the posts so we can show the proper saved state
    fetch('http://127.0.0.1:8000/api/posts/saved/', {
        headers: {
            'Authorization': 'Bearer ' + token //who am i
        }
    })
    .then(function(response) { return response.json(); }) //convert response into javascript object
    .then(function(postsSaved) {
        postsSaved.forEach(function(saved) {
            savedPostIds.push(saved.post.id); //push id into array
        });

    // Send a request to get that specific post from the backend using the postID
    // Django will route this to PostDetailView which queries PostgreSQL for the post with the same ID
        return fetch(`http://127.0.0.1:8000/api/posts/${postId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    })
    // get the response and turn it into a javascript object
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    .then(function(response) { return response.json(); })
    .then(function(post) {
        const isSaved = savedPostIds.includes(post.id); // check if the post id is in the array
        const initials = post.user.first_name[0] + post.user.last_name[0];
        postDetail.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex align-items-start gap-2 mb-2">
                        <div class="sl-post-avatar sl-avatar-player">${initials}</div>
                        <div>
                            <div class="d-flex align-items-center gap-3">
                            <a href="profile.html?id=${post.user.id}" class="fw-semibold text-dark text-decoration-none">${post.user.first_name} ${post.user.last_name}</a>                                
                            <button class="btn btn-outline-danger btn-sm py-0 sl-follow-btn">Follow</button>
                            </div>
                            <div class="text-muted small">
                                <span class="sl-badge-player me-1">${post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1)}</span>
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
                        <button class="btn btn-sm text-muted sl-share-btn" data-post-id="${post.id}"><i class="bi bi-share p-1"></i>Share</button>
                        <button class="btn btn-sm text-muted sl-save-btn ${isSaved ? 'saved' : ''}" data-post-id="${post.id}"><i class="bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} p-1"></i><span class="sl-save-label">${isSaved ? 'Saved' : 'Save'}</span></button>
                    </div>
                </div>
            </div>`;
            saveListeners();
            shareListeners();
        // send request to backend to retrieve comments tied to this specific post id
        // Django will route this to CommentListCreateView which will query PostgreSQL for the comments tied to this postid
        fetch(`http://127.0.0.1:8000/api/posts/${postId}/comments/`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        //turn the response into a javascript object
        .then(function(response) { return response.json(); })
        .then(function(comments) {
            const commentSection = document.querySelector('#sl-comments');
            //if theres no comments returned in our query then just write there are no comments yet.
            if (comments.length === 0) {
                commentSection.innerHTML = '<p class="text-muted small">No comments yet.</p>';
                return;
            }
            //when comments are returned in our query loop through each of them and display them on the page with same style we set the static comments up as
            comments.forEach(function(comment) {
                // grabs the initials to  use for the profile picture
                const initials = comment.user.first_name[0] + comment.user.last_name[0];
                commentSection.innerHTML += `
                    <div class="d-flex gap-3 mb-3 mt-3">
                        <div class="card shadow-sm w-100">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <div class="sl-post-avatar sl-avatar-player sl-comment-inner-avatar">${initials}</div>
                                    <div>
                                    <a href="profile.html?id=${comment.user.id}" class="fw-semibold text-dark text-decoration-none">${comment.user.first_name} ${comment.user.last_name}</a>                                        <div class="text-muted small"><span class="sl-badge-player me-1">${comment.user.role.charAt(0).toUpperCase() + comment.user.role.slice(1)}</span></div>
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
    //if any of the above fails just send user to home page instead of continuing on the broken page.
    .catch(function() {
        //window.location.href = 'home.html';

    });
}


// Create comment
/* Read what the user typed into the comment box so we can send to the backend
to be saved as a comment tied to the spciefic post id.*/
const postCommentBtn = document.querySelector('#sl-post-comment-btn');
//null check to avoid crashing
if (postCommentBtn) {
    postCommentBtn.addEventListener('click', function() {
        const body = document.querySelector('.sl-comment-body').value.trim();
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');

        //if nothing was typed into the box dont submit.
        if (!body) return;

        //send a request to the backend of type POST because we want to create a new comment at the specific postid.
        fetch(`http://127.0.0.1:8000/api/posts/${postId}/comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //sending json text
                'Authorization': 'Bearer ' + token //who am i
            },
            body: JSON.stringify({ body: body }) //convert javacscript object into json string  so the backend cna read it
        })
        .then(function(response) { return response.json(); }) //convert response into javascript object
        .then(function(comment) {
            // if the backend returned an ID it means the comment was created successfully so reload the page so the user can see the comment
            if (comment.id) {
                window.location.reload();
            }
        })
        //if any of the above fails send an error message.
        .catch(function(error) {
            alert('Something went wrong, please try again');
        });
    });
}