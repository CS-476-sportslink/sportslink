// Load profile page posts
/* get the logged in users own post and display them on the profile.html.
this may need to be altered after thinking about it the profile page shouldnt
only show the logged in users. Anyone should be able to navigate to a users profile.
*/

//This checks if there is a userid present in the search bar. If there is that means we are viewing someone elses profile
//If there is no userid present then it means we are viewing our own profile
const profilePostFeed = document.querySelector('#sl-profile-post-feed');
//null check to avoid crashing
if (profilePostFeed) {
    const token = localStorage.getItem('access_token');

    //if user id in the url then we fetch that user. If there userId is null then there is no id in the search bar and we fetch the logged in user instead
    let profileUrl = 'http://127.0.0.1:8000/api/auth/me/'; //fetch logged in user
    //the null check to see if theres an id in search bar.
    if (userId) { //we get this userId from the app.js file
        profileUrl = `http://127.0.0.1:8000/api/auth/users/${userId}/`; //fetch the user using the user id instead of logged in user
    }

    //fetch request to the backend to get the currently logged in user
    fetch(profileUrl, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); }) //turn response into javascript object
    //now that we have the user send a request to the backend to get all the posts made by the user using their id.
    .then(function(user) {
        const contact = document.querySelector('#sl-contact-btn');
        if (contact) {
            // if there is no userId we are on our own profile so we dont need to see the contact button
            if (!userId) {
                contact.style.display = 'none';
            } else {
                // this runs when we are on someone elses profile. We need to fetch logged in user so we can check their role
                fetch('http://127.0.0.1:8000/api/auth/me/', {
                    headers: { 'Authorization': 'Bearer ' + token }
                })
                .then(function(response) { return response.json(); }) //convert response to javascript object
                .then(function(me) { // now we can access logged in users information
                    // if our id matches the users id we dont need to show the contact button because it is us.
                    //Also only show the button if the logged in user is a coach or a school.
                    // we need to check our own id because if we navigate to our own profile by going to our post and clicking a name our id shows up in the url.
                    if (me.id !== user.id && (me.role === 'coach' || me.role === 'school')) {
                        contact.setAttribute('href', 'mailto:' + user.email);
                        contact.style.display = 'inline-block';
			if (followBtn) followBtn.style.display = 'inline-block';
                    } else {
                        contact.style.display = 'none'; //hide button for athletes.
                    }
		    if (followBtn) {
			if (me.id === user.id) {
			    followBtn.style.display = 'none';
			}
		    }
                    const editProfileBtn = document.querySelector('#sl-edit-profile-btn');
                    if(editProfileBtn) {
                        if (me.id !== user.id) { //same check as before, if we are not on our own profile we do not want to see the edit profile button
                            editProfileBtn.style.display = 'none';
                        } else {
                            editProfileBtn.style.display = 'inline-block'
                        }
                    }
                });
            }
        }
        return fetch(`http://127.0.0.1:8000/api/posts/?user=${user.id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
    })
    .then(function(response) { return response.json(); }) //turn response into javascript object
    //if we get posts back loop through them and display them, if none come back display no posts yet.
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
                                        <span class="sl-badge-player me-1">${post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1)}</span>
                                        <span class="text-dark">${post.user.sport ? ' • ' + post.user.sport : ''}</span>
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
/* When the edit profile page loads we need to get the users current bio and put it into the display and textarea so the user can see what they have before
they chage it. */
const editBioDisplay = document.querySelector('#sl-edit-bio-display');
const editBioTextarea = document.querySelector('#sl-edit-bio-textarea');
//null check to avoid crashing
if (editBioDisplay || editBioTextarea) {
    const token = localStorage.getItem('access_token');
    //fetch the currently logged on user
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); }) //turn response into javascript object
    //if the user has a bio then display it else show no bio yet and leave the text area blank
    .then(function(user) {
        if (editBioDisplay) editBioDisplay.textContent = user.bio || 'No bio yet.';
        if (editBioTextarea) editBioTextarea.value = user.bio || '';
    });
}

// Save bio from edit profile page
/* When a user types in a new bio and clicks on the save button we need to send it to the backend
so that it can be saved properly as the users bio.  */
const saveBioBtn = document.querySelector('#sl-save-bio-btn');
//null check to avoid crashing
if (saveBioBtn) {
    saveBioBtn.addEventListener('click', function(e) { //wait for user to click on the save button
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const bio = document.querySelector('#sl-edit-bio-textarea').value.trim();

        //send a PATCH request to the backend to only update the bio field for the user that is logged on
        //PATCH method is uesd to update specific fields only
        fetch('http://127.0.0.1:8000/api/auth/me/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ bio: bio }) //convert bio into json so backend can read it
        })
        .then(function(response) { return response.json(); }) //get response and turn it into javavscript object
        // if we get back a user.id we know the backend succesfully saved the update
        .then(function(user) {
            if (user.id) {
                document.querySelector('#sl-edit-bio-display').textContent = bio; //show the new bio
                alert('Bio updated!');
            }
        })
        //if something went wrong show an error message
        .catch(function() {
            alert('Something went wrong');
        });
    });
}

// Edit profile page posts
/* This is the exact same as the profile page posts but for the editprofile page.
We grab the logged in users posts but this time its just on a different page.  */
const editProfilePostFeed = document.querySelector('#sl-edit-profile-post-feed');
//null check to avoid crashing
if (editProfilePostFeed) {
    const token = localStorage.getItem('access_token');
    //fetch request to the backend to get the currently logged in user
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); }) //convert resposne into javascript object
     //now that we have the user send a request to the backend to get all the posts made by the user using their id.
    .then(function(user) {
        return fetch(`http://127.0.0.1:8000/api/posts/?user=${user.id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
    })
    .then(function(response) { return response.json(); }) //convert response into javascript object
    //if we get posts back loop through them and display them, if none come back display no posts yet.
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
                                        <span class="sl-badge-player me-1">${post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1)}</span>
                                        <span class="text-dark">${post.user.sport ? ' • ' + post.user.sport : ''}</span>
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
/* This is for the my links section on the edit profile page.
At this time we are only allowing max 3 links to be displayed could be looked into for more or less in the future
When the new links are saved we want to send to the backend to save properly and display them on page. */
const saveLinksBtn = document.querySelector('#sl-save-links-btn');
//null check to avoid crashing
if (saveLinksBtn) {
    const token = localStorage.getItem('access_token');

    // get the currently logged in user
    fetch('http://127.0.0.1:8000/api/auth/me/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(response) { return response.json(); }) //convert response into javascript object
    .then(function(user) {
        // if there are links already on the user model store it in links else it becomes an empty array.
        const links = user.links || [];
        //for each of the links in the links array, if there exists any we display them, if not it becomes an empty string
        //These are displayed only on the input boxes, we display them properly after this has happened.
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
        //null check and check to see if div exists and there are actually links available to display.
        if (editProfileLinks && user.links.length > 0) {
            //loop through each available link and display them
            user.links.forEach(function(link) {
                editProfileLinks.innerHTML += `<p class="text-muted small mb-2"><a href="${link.url}" class="text-decoration-none" target="_blank">${link.name}</a></p>`;
            });
            //if there are no links then just say no links added yet.
        } else if (editProfileLinks) {
            editProfileLinks.innerHTML = '<p class="text-muted small">No links added yet.</p>';
        }
    });

    // Save links
    // Read the values from the input boxes and store them into an array
    // Map() functionality https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    saveLinksBtn.addEventListener('click', function() { //click listener waits for user to click on save
        const links = [
            { url: document.querySelector('#sl-link-1-url').value.trim(), name: document.querySelector('#sl-link-1-name').value.trim() },
            { url: document.querySelector('#sl-link-2-url').value.trim(), name: document.querySelector('#sl-link-2-name').value.trim() },
            { url: document.querySelector('#sl-link-3-url').value.trim(), name: document.querySelector('#sl-link-3-name').value.trim() }
        ].map(function(link) { //loop through the array, if the link entered does not start with http then add it. If we dont it will try to open from a file and it will fail, it needs http to go to an external site.
            if (!link.url.startsWith('http')) {
                link.url = 'https://' + link.url;
            }
            return link; //return updated link back into the array. If we dont return it map() will throw the modified version away.
        });

        // send request to backend to save links array on the logged in users account
        fetch('http://127.0.0.1:8000/api/auth/me/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', //sending json
                'Authorization': 'Bearer ' + token //who am i
            },
            body: JSON.stringify({ links: links }) //convert into json string so backend can read it
        })
        .then(function(response) { return response.json(); }) //convert response into javascript object
        .then(function(user) {
            if (user.id) { //if we are provided the id that means request to backend was succesfull so show message stating it worked
                alert('Links saved!');
            }
        })
        // if anything goes wrong show an error message
        .catch(function() {
            alert('Something went wrong');
        });
    });
}

/* For this to work we need to change the users name div in feed.js to a <a> tag with link containing the user id.
Then in post.js we need to do the exact same thing so a user can click on the users profile and be taken there properly. On both the posts and the comments.
In this file we need to read the id from the url, send a fetch request to backend to get the users data. And then populate the profile page with the users information we pulled from the backend. Should be pretty similar to fetching our own
profile information, just using the users id to get the information instead of the currently logged on user. */

// Follow button
const followBtn = document.querySelector('#sl-follow-btn');
if (followBtn && userId) {
    const token = localStorage.getItem('access_token');

    // Set the user id on the button
    followBtn.setAttribute('data-user-id', userId);

    // Check existing connection
    // by setting conn as a check if the profile you're viewing is involved with a connection with your profile (the logged in user
    // if it is then it checks the status that is set in the backend and stored in the database as either pending or accepted
    // then it sets the text to show the correct response such as Requested if pending and Connected if accepted
    // otherwise it will keep the follow button as it is by default
    fetch('http://127.0.0.1:8000/api/connections/', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(res) { return res.json(); })
    .then(function(connections) {
        const conn = connections.find(function(c) {
            return c.initiator.id === userId || c.receiver.id === userId;
        });

        if (conn) {
            if (conn.status === 'pending') {
                followBtn.textContent = 'Requested';
                followBtn.classList.remove('btn-outline-danger');
                followBtn.classList.add('btn-warning');
                followBtn.setAttribute('data-state', 'pending');
                followBtn.setAttribute('data-connection-id', conn.id);
            } else if (conn.status === 'accepted') {
                followBtn.textContent = 'Connected';
                followBtn.classList.remove('btn-outline-danger');
                followBtn.classList.add('btn-danger');
                followBtn.setAttribute('data-state', 'accepted');
                followBtn.setAttribute('data-connection-id', conn.id);
            }
        } else {
            followBtn.setAttribute('data-state', 'none');
        }
    });
}
