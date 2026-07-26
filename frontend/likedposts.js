// Load posts feed

const postFeed = document.querySelector('#sl-liked-posts');
//null check to avoid crashing
if (postFeed) {
    const token = localStorage.getItem('access_token');
    const savedPostIds = [];
    const likedPostIds = [];//array for liked post ids, similar to saved posts

    //
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
    })
    fetch('http://127.0.0.1:8000/api/posts/liked/', {
        headers: {
            'Authorization': 'Bearer ' + token //who am i
        }
    })
    .then(function(response) { return response.json(); }) //convert response into javascript object
    .then(function(postsLiked) {
        postsLiked.forEach(function(liked) {
            likedPostIds.push(liked.post.id); //push id into array
        });
        //send request to backend to retrieve posts. Use the auth token so the backend knows who is making the request.
        //When we are not specifying the method like GET, POST, PATCH the default method is GET.
        //call this fetch as a return so we can give its result to the next .then()
        return fetch('http://127.0.0.1:8000/api/posts/', {
            headers: {
                'Authorization': 'Bearer ' + token //who am i
            }
        });
    })
    .then(function(response) { return response.json(); }) //get response from the backend as json and we use response.json to turn it into a usable JavaScript object
    // once we turned it into a usable javascript object we now have the posts which we can loop through.
    .then(function(posts) {
        if (posts.length === 0) {
            postFeed.innerHTML = '<p class="text-muted text-center">No posts yet.</p>'; //Show that there are no posts if there are no posts.
            return;
        }
        // when there is at least one post returned, we can display the post on the page. Using foreach so that we can do this exact same format for each post returned.
        posts.forEach(function(post) {
            //`${}` is a template literal which lets us put variables inside the html, ${} being the placeholder for those variables
            //each post gets inserted into the div on home page with id="sl-post-feed"
            /* the ? is terenary operator. We use it here on line 45 because if a user does not add any link or media to their post there is no reason for us to show that link box
            so we have if post.media_url does exists display that html with the link box on the post. : acts as the else condition so we have : '' which means
            if it does not exist just show nothing */

            // check if the post id is in the savedPostIds array
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
            const isSaved = savedPostIds.includes(post.id) // check if the post id is in the array
            const isLiked = likedPostIds.includes(post.id) //creaing is liked array similar to saved posts array
            const initials = post.user.first_name[0] + post.user.last_name[0]; 
            //add postHTML to whatever is already in postFeed. Could be nothing but could be posts that have already been created.
             if(isLiked){
                    postFeed.innerHTML += `
                    <a href="post.html?id=${post.id}" class="text-decoration-none text-dark"> 
                        <div class="card shadow-sm mb-4 sl-post-card">
                            <div class="card-body">
                                <div class="d-flex align-items-start gap-2 mb-2">
                                    <div class="sl-post-avatar sl-avatar-player">${initials}</div>
                                    <div>
                                        <div class="d-flex align-items-center gap-3">
                                            <div class="fw-semibold">${post.user.first_name} ${post.user.last_name}</div>
                                            <button class="btn btn-outline-danger btn-sm py-0 sl-follow-btn">Follow</button>
                                        </div>
                                        <div class="text-muted small">
                                            <span class="sl-badge-player me-1">${post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1)}</span>
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
                                </a>
                                <div class="d-flex gap-1 pt-2">
                                    <button class="btn btn-sm text-muted sl-like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}"><i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} p-1"></i><span class="sl-like-count">0</span></button>
                                    <button class="btn btn-sm text-muted"><i class="bi bi-chat p-1"></i>Comment</button>
                                    <button class="btn btn-sm text-muted sl-share-btn" data-post-id="${post.id}"><i class="bi bi-share p-1"></i>Share</button>
                                    <button class="btn btn-sm text-muted sl-save-btn ${isSaved ? 'saved' : ''}" data-post-id="${post.id}"><i class="bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} p-1"></i><span class="sl-save-label">${isSaved ? 'Saved' : 'Save'}</span></button>
                                </div>
                            </div>
                        </div>`;
                                }
        });
        //listener functions to attatch btn listeners after posts have loaded
        likeUpdateObserver();
        saveListeners();
        likeListeners();
        shareListeners();
    })
    //if any of the above breaks we display an error message, rather then jsut not doing anytihng
    .catch(function(error) {
        postFeed.innerHTML = '<p class="text-muted text-center">Failed to load posts.</p>';
    });
}
