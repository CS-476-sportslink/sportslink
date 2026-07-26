//GoF Factory Design Pattern
/* The creator decalres the actual method
In the app we are not making a standard post card, there needs to be a type. It is either a social post taht everyone is free to use, or a tryout post that
can be used by sschools and coaches to get athletes to apply */
class PostCardCreator {
    createCard(post, isSaved, isLiked) { //there isnt a default post so no default method
        throw new Error('createCard() must be implemented by a subclass');
    }
}

//ConcreteCreator builds the social post card.
class SocialCardCreator extends PostCardCreator {
    createCard(post, isSaved, isLiked) {
        const initials = post.user.first_name[0] + post.user.last_name[0];
        return `
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
}

//ConcreteCreator builds the tryout post card. got nothing yet as the modal is not yet built
class TryoutCardCreator extends PostCardCreator {
    createCard(post, isSaved, isLiked) {
        const initials = post.user.first_name[0] + post.user.last_name[0];
        return `
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
                        <a href="${post.media_url}" class="btn btn-outline-danger btn-sm w-100 mb-2" target="_blank">Sign Up</a>` : ''}
                        </a>
                        <div class="d-flex gap-1 pt-2">
                            <button class="btn btn-sm text-muted sl-like-btn ${isLiked ? 'liked' : ''} data-post-id="${post.id}"><i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} p-1"></i><span class="sl-like-count">0</span></button>
                            <a href="post.html?id=${post.id}" class="text-decoration-none text-dark"> 
                                <button class="btn btn-sm text-muted"><i class="bi bi-chat p-1"></i>Comment</button>
                            </a>
                            <button class="btn btn-sm text-muted sl-share-btn" data-post-id="${post.id}"><i class="bi bi-share p-1"></i>Share</button>
                            <button class="btn btn-sm text-muted sl-save-btn ${isSaved ? 'saved' : ''}" data-post-id="${post.id}"><i class="bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} p-1"></i><span class="sl-save-label">${isSaved ? 'Saved' : 'Save'}</span></button>
                        </div>
                    </div>
                </div>`;
    }
}

//ConcreteCreator builds the tryout post card shorthand version thats placed on the right sidebar
class TryoutSidebarCardCreator extends PostCardCreator {
    createCard(post) {
        const initials = post.user.first_name[0] + post.user.last_name[0];
        //show first 40 characters of post since we dont have sport/date fields to go off of.
        return `
        <a href="post.html?id=${post.id}" class="text-decoration-none text-dark">
            <div class="list-group-item py-2">
                <div class="d-flex align-items-start gap-2 mb-2 mt-2">
                    <div class="sl-post-avatar sl-avatar-player">${initials}</div>
                    <div>
                        <div class="small fw-semibold">${post.user.first_name} ${post.user.last_name}</div>
                        <div class="text-muted small">${post.body.slice(0, 40)}${post.body.length > 40 ? '...' : ''}</div> 
                    </div>
                    <div class="text-muted small ms-auto">${new Date(post.created_at).toLocaleDateString()}</div>
                </div>
        </a>
            ${post.media_url ? `
            <a href="${post.media_url}" target="_blank" class="btn btn-outline-danger btn-sm w-100 mb-2">Sign Up</a>` : ''}
        </div>`;
    }

}

function getCardCreator(post) {
    if (post.post_type === 'tryout') {
        return new TryoutCardCreator();
    }
    return new SocialCardCreator();
}

//show this tab only when the user has the school or coach role.
const tryoutTab = document.querySelector('#sl-tryout-tab');
if (tryoutTab) {
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) { return response.json(); })
    .then(function(me) {
        if (me.role !== 'coach' && me.role !== 'school') {
            tryoutTab.style.display = 'none';
        }
    })
    .catch(function() {
        tryoutTab.style.display = 'none';
    });
}

// Load posts feed
const postFeed = document.querySelector('#sl-post-feed');
const sidebarPost = document.querySelector('#sl-open-tryouts');
//null check to avoid crashing
    
if (postFeed) {
    const token = localStorage.getItem('access_token');
    const savedPostIds = [];
    const likedPostIds = [];//array for liked post ids, similar to saved posts

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
            savedPostIds.push(saved.post.id);
        });
    })
    fetch('http://127.0.0.1:8000/api/posts/liked/', {//similar call as the saved post check for liked posts
        headers: {
            'Authorization': 'Bearer ' + token //who am i
        }
    })
    .then(function(response) { return response.json(); })
    .then(function(postsLiked) {
        postsLiked.forEach(function(liked) {
            likedPostIds.push(liked.post.id); //setup liked post array for checking if the user has liked the posts
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
            //each post gets inserted into the div on home page with id="sl-post-feed"
            // check if the post id is in the savedPostIds array
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes

            const isSaved = savedPostIds.includes(post.id) // check if the post id is in the array
            const isLiked = likedPostIds.includes(post.id) //creating is liked array similar to saved posts array
            const creator = getCardCreator(post);
            postFeed.innerHTML += creator.createCard(post, isSaved, isLiked); 
            // sidebar using factory design pattern
            console.log('post_type:', post.post_type, 'sidebarPost:', sidebarPost);
            if (sidebarPost && post.post_type === 'tryout') {
                const sidebarCreator = new TryoutSidebarCardCreator();
                sidebarPost.innerHTML += sidebarCreator.createCard(post);
            }
        });
        //listener functions to attatch btn listeners after posts have loaded
        likeUpdateObserver();//added like update observer for setting listeners as observers for like counts
        saveListeners();
        shareListeners();
        likeListeners();

    })
    //if any of the above breaks we display an error message, rather then jsut not doing anytihng
    .catch(function(error) {
        postFeed.innerHTML = '<p class="text-muted text-center">Failed to load posts.</p>';
    });
}

// Create post
/* When the user opens the create post modal we want the user to be able to enter in a full post and have it sent to the database when post button is clicked.
The window then refreshes and the user can see their post at the top with correct details, date, etc. */
//wrapped it in a function so now it can handle both types of posts not just one.
function createPost(buttonId, bodyClass, linkClass, postType) {
    const createPostBtn = document.querySelector(buttonId);
    if (!createPostBtn) return; 
    createPostBtn.addEventListener('click', function() {
        // gett the info from the post, and we are using trim to remove any spaces from the front or back by error or user error.
        const body = document.querySelector(bodyClass).value.trim();
        const mediaUrl = document.querySelector(linkClass).value.trim();
        const token = localStorage.getItem('access_token'); //we need to get the token so the backend knows what user is posting this

        //if the post body is empty we dont want to allow this post from going through so send an error message.
        if (!body) {
            alert('Please write something before posting');
            return;
        }

        /* Send post request to backend to the posts endpoint. Here we are sending as POST as we want to create post not retrieve */
        fetch('http://127.0.0.1:8000/api/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //sending JSON
                'Authorization': 'Bearer ' + token //whos sending
            },
            //this is the content we want to send to the backend, we use stringify to turn javascript object into JSON string
            body: JSON.stringify({
                body: body,
                media_url: mediaUrl,
                post_type: postType,
            })
        })
        //get the response from the backend and turn it into a javascript object
        .then(function(response) { return response.json(); })
        .then(function(postData) {
            //with the post info we recieved from the backend, if we recieve a post id then reload. As from our post model we NEED a id.
            if (postData.id) {
                window.location.reload();
            } else {
                alert('Failed to create post'); //if no post id was found something went wrong so show error.
            }
        })
        .catch(function(error) { //if anything else failed along the way show an error.
            alert('Something went wrong, please try again');
        });
    });
}
createPost('#sl-create-post-btn', '.sl-post-body', '.sl-post-media-url', 'social');
createPost('#sl-create-tryout-btn', '.sl-tryout-body', '.sl-tryout-signup-link', 'tryout');
