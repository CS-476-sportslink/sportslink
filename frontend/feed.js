// Load posts feed

const postFeed = document.querySelector('#sl-post-feed');
//null check to avoid crashing
if (postFeed) {
    const token = localStorage.getItem('access_token');
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
            const initials = post.user.first_name[0] + post.user.last_name[0]; 
            //add postHTML to whatever is already in postFeed. Could be nothing but could be posts that have already been created.
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
                            </a>
                            <div class="d-flex gap-1 pt-2">
                                <button class="btn btn-sm text-muted sl-like-btn"><i class="bi bi-heart p-1"></i><span class="sl-like-count">0</span></button>
                                <button class="btn btn-sm text-muted"><i class="bi bi-chat p-1"></i>Comment</button>
                                <button class="btn btn-sm text-muted"><i class="bi bi-share p-1"></i>Share</button>
                                <button class="btn btn-sm text-muted sl-save-btn ${isSaved ? 'saved' : ''}" data-post-id="${post.id}"><i class="bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} p-1"></i><span class="sl-save-label">${isSaved ? 'Saved' : 'Save'}</span></button>
                            </div>
                        </div>
                    </div>`;
        });
        saveListeners();
    })
    //if any of the above breaks we display an error message, rather then jsut not doing anytihng
    .catch(function(error) {
        postFeed.innerHTML = '<p class="text-muted text-center">Failed to load posts.</p>';
    });
}

// Create post
/* When the user opens the create post modal we want the user to be able to enter in a full post and have it sent to the database when post button is clicked.
The window then refreshes and the user can see their post at the top with correct details, date, etc. */
const createPostBtn = document.querySelector('#sl-create-post-btn');
//null check to avoid crashing
if (createPostBtn) {
    createPostBtn.addEventListener('click', function() {
        // gett the info from the post, and we are using trim to remove any spaces from the front or back by error or user error.
        const body = document.querySelector('.sl-post-body').value.trim();
        const mediaUrl = document.querySelector('.sl-post-media-url').value.trim();
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
                //below is useless for the time being until we figure out if we are storing images too.
               // media_type: mediaUrl ? 'video' : '' //if mediaURL has something send 'video' so the backend can use that information else send empty string
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

//we need to create a function so that we attatch the save post button listeners AFTER all the posts have been loaded, it is not working when they run at the same time
/* Tried to call this function right below it and it didnt work. I moved the call to this function after we load in all the posts on line 67. Now works. */
/* Save and unsave a post. When the save button is clicked we need to save it to our saved posts page.
If the save button has already been clicked and we click it again we need to delete the post from the saved posts page
Update the icon so it shows a saved state. */
function saveListeners() {
    document.querySelectorAll('.sl-save-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) { //add click listener to the save icon
            const postId = btn.getAttribute('data-post-id'); // grab the post id from the button
            const token = localStorage.getItem('access_token');
            const icon = btn.querySelector('i');
            const label = btn.querySelector('.sl-save-label') // Saved and saved text
            if (btn.classList.contains('saved')) {
                //this is for when a post is already saved. If clicked again we need to send delete request to backend to remove it from saved posts page.
                fetch(`http://127.0.0.1:8000/api/posts/${postId}/save/`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': 'Bearer ' + token 
                    } // who am i
                })
                .then(function() {
                    //change the button so it doesnt show saved state anymore
                    btn.classList.remove('saved');
                    icon.classList.remove('bi-bookmark-fill');
                    icon.classList.add('bi-bookmark');
                    label.textContent = 'Save';
                })
                .catch(function() {
                    alert('Failed to unsave post');
                });
            } else {
                //when the post is not saved, send request to backend to save post.
                fetch(`http://127.0.0.1:8000/api/posts/${postId}/save/`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer ' + token 
                    } // who am i
                })
                .then(function(response) { return response.json(); }) //convert response into javascript object
                .then(function(result) {
                    if (result.message) {
                        //show button is in saved state
                        btn.classList.add('saved');
                        icon.classList.remove('bi-bookmark');
                        icon.classList.add('bi-bookmark-fill');
                        label.textContent = 'Saved';
                    }
                })
                .catch(function() {
                    alert('Failed to save post');
                });
            }
        });
    });    
}
