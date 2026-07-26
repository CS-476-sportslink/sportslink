//Redirect to login if not logged in, need to speak with team on this one. Do we want a user to be able to access
// the website even if they are not signed in? I know some pages probably not but homepage?
if (!localStorage.getItem('access_token') && (
    window.location.pathname.includes('home.html') || 
    window.location.pathname.includes('post.html') || 
    window.location.pathname.includes('profile.html') || 
    window.location.pathname.includes('editprofile.html') || 
    window.location.pathname.includes('settings.html'))
){
    window.location.href = '../Loginandsignup/login.html';
}

//like button change class and increment like count
/* Go through and find every like button. Add an eventlistner for the click. Once
that click is recieved we can incrememnt the like count or decrease it
change the style of the icon, etc. */
document.querySelectorAll('.sl-like-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const icon = btn.querySelector('i');
        const likeCount = btn.querySelector('.sl-like-count');
        //Likes are stored as text parseInt converts that text into a real number so we can do operations such as subtraction or addition on it
        let count = parseInt(likeCount.textContent);
        if (btn.classList.contains('liked')) {
            btn.classList.remove('liked');
            btn.classList.add('text-muted');
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            likeCount.textContent = count - 1;
        } else {
            btn.classList.add('liked');
            btn.classList.remove('text-muted');
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            likeCount.textContent = count + 1;
        }
    });
});


//Save button similar to like button
/* This is pretty much identical to the like button
we look for all the save buttons present on the page.
We listen for a click and once we recieve it we change the icon style
to match what we are wanting */

//Follow button functionality
/* Same concept as both buttons above, we find each follow button, wait for a click through the event listener
and then we change the style of the button accordingly  */
document.querySelectorAll('.sl-follow-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const followingCount = document.querySelector('.sl-following-count');
        if (btn.classList.contains('following')) {
            btn.classList.remove('following');
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-outline-danger');
            btn.textContent = 'Follow';
            // Since the followers are stored as text, convert that text to a number so we can perform operations using parseInt
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) - 1;
            }
        } else {
            btn.classList.add('following');
            btn.classList.remove('btn-outline-danger');
            btn.classList.add('btn-danger');
            btn.textContent = 'Following';
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) + 1;
            }
        }
    });
});

//Notifications
/* Find the read all button on the notifications tab.
add eventlistener to listen for a click, once that button is clicked
change/remove styles to give the notifications a style that makes them feel like they have been read
also the number for missed notifications disappears once read all is clicked. */
const readAllBtn = document.querySelector('.sl-read-all-btn');
if (readAllBtn) {
    readAllBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const badge = document.querySelector('.sl-notification-badge');
        if (badge) {
            badge.classList.add('sl-hidden'); //gets rid of the missed notification badge/number
        }
        document.querySelectorAll('.sl-notification-unread').forEach(function (notification) {
            notification.classList.remove('sl-notification-unread'); //get rid of the highlighted notification to make it feel like its been read.
        });
    });
};

//Resize comment area on post.html
/*  */
document.querySelectorAll('textarea').forEach(function (textarea) {
    textarea.addEventListener('input', function (e) {
        textarea.style.height = 'auto'; // When we delete text from comment box, if we do not have this line the browser keeps the size of the box to what it was set to previously. Need this to resize the box down so when there is no content we dont have a large text box.
        textarea.style.height = textarea.scrollHeight + 'px'; // when text is added into the textbox, make the textbox grow with the text, when the box grows with our text we dont see that ugly scrollbar showup
    });
});

//Post replies
// This may get deleted as we haven't configured the ability to reply to a comment yet.
document.querySelectorAll('.sl-reply-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        const replyBox = btn.closest('.card-body').querySelector('.sl-reply-box'); // search up to the comment card for the reply box thats inside of it. Closest searches up where queryselector searches down
        replyBox.classList.toggle('sl-hidden'); // hide the reply box until it is clicked on. toggle just switches it back and forth between hidden and not hidden.
    });
});

// Hide and display content on settings tabs
/* When the user clicks on the specific tab they want to see we then show them the details of that tab.
we dont want the user seeing all the page information at one time so we hide it under sections until it is clicked on. When
that section is clicked on show it and hide the others. */
//sets up event listeners
document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
        // hide the content of the tabs/sections
        document.querySelectorAll('.sl-settings-section').forEach(function (section) {
            section.classList.remove('active');
        });
        //go through all nav links remove the highlighted navlink
        document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function (navLink) {
            navLink.classList.remove('active');
        });
        // when tab is clicked, we show the section details that matches the tab that was clicked on.
        const section = link.getAttribute('data-section'); //our only two options ar e either account or profile
        document.getElementById('section-' + section).classList.add('active'); //show the tab content
        link.classList.add('active'); // highlight which tab is chosen on left hand side of page.
    });
});



// Fetch logged in user and update UI
/* Everytime a page loads we need to get the currently logged in users information.
Once we get it we use it to update the page with their name, initials, role, bio. links, whatever is available and present on the current page.
 */
const token = localStorage.getItem('access_token'); //gets the auth token from local storage
//check if there is an id in the search bar. if not the userId is null and we fetch logged in user.
const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

//if user id in the url then we fetch that user. If there userId is null then there is no id in the search bar and we fetch the logged in user instead
let profileUrl = 'http://127.0.0.1:8000/api/auth/me/'; //fetch logged in user
//the null check to see if theres an id in search bar and make sure we are on profile page.
if (userId && window.location.pathname.includes('profile.html')) {
    profileUrl = `http://127.0.0.1:8000/api/auth/users/${userId}/`; //fetch the user using the user id instead of logged in user
}
//null check to prevent crashing
if (token) {
    fetch(profileUrl, { //send an http request to the backend. At the specified endpoint that returns information
        headers: {
            'Authorization': 'Bearer ' + token //this proves to the backend who we are
        }
    })
    .then(function(response) { return response.json(); })
    .then(function(user) {
        // to avoid issues in the future regarding id showing or not showing in url depending on how you accessed the profile.
        // set the id in our own profile url
        const profileURL = document.querySelector('#sl-my-profile');
        if (profileURL) {
            profileURL.setAttribute('href', 'profile.html?id=' + user.id); //find href and change the value
        }
        // gets the users initials by taking index 0 of their first and last name
        const initials = user.first_name[0] + user.last_name[0]

        //every avatar circle that is available replace with the current users initials. Will change depending on when/how we setup file storage for images.
        document.querySelectorAll('.sl-current-user-avatar').forEach(function(avatar) {
            avatar.textContent = initials;
        });

        // Gets the users name and shows it everywhere the user appears
        document.querySelectorAll('.sl-current-user-name').forEach(function(name) {
            name.textContent = user.first_name + ' ' + user.last_name;
        });

        //Profile card in the left sidebar to show the logged in users role underneath the name
        const userInfo = document.querySelector('#sl-current-user-info');
        //null check, if userInfo does not exist and crashes then this whole script crashes
        if (userInfo) {
            userInfo.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1); //Removed the ternery operator here, we need to show it this way as our way before only handled two roles. This way we can show whatever role is saved. We make the firs char uppercase and the slice joins everything from index 1 onwards.
        }

        // About me bio on the profile page
        const profileBio = document.querySelector('#sl-profile-bio');
        //null check to prevent crashing
        if (profileBio) {
            profileBio.textContent = user.bio || 'No bio yet.'; //text area shows the users bio, if there is no bio found then it will say no bio yet
        }

        // Get the users profile links
        const profileLinks = document.querySelector('#sl-profile-links');
        //null check to prevent crashing
        if (profileLinks) {
            //loop through all links if there are any and display them on profile. If there are none show no links added message.
            if (user.links && user.links.length > 0) {
                user.links.forEach(function(link) {
                    profileLinks.innerHTML += `<p class="text-muted small mb-2"><a href="${link.url}" class="text-decoration-none" target="_blank">${link.name}</a></p>`;
                });
            } else {
                profileLinks.innerHTML = '<p class="text-muted small">No links added yet.</p>';
            }
        }
    });
}

// Logout
const logoutBtn = document.querySelector('#sl-logout-btn');
//null check to avoid crashing
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();

        //from our local storage we need to get tokens that were saved when a user logged in. Access token is to prove who the user is, and refresh token is used to get a new access token when old one expires.
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // we are sending the logout request to the backend via POST. Have to use POST because we are asking server to do something, not just retrieve something
        fetch('http://127.0.0.1:8000/api/auth/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //tells server request body is json
                'Authorization': 'Bearer ' + accessToken //sends token so server knows what user is making request
            },
            body: JSON.stringify({ refresh: refreshToken }) //gives the backend our refresh token as that is what we need to invalidate or blacklist
        })
        // Whether the fetch request succeeds or fails, we remove everything from the browsers local storage and redirect user to the login screen.
        // We need to clear it so the frontend doesnt hold any of that logged in information from the user
        .then(function() {
            localStorage.clear();
            window.location.href = '../Loginandsignup/login.html';
        })
        .catch(function() {
            localStorage.clear();
            window.location.href = '../Loginandsignup/login.html';
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
        btn.addEventListener('click', function() { //add click listener to the save icon
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

/* Now we need to create a function that pretty much does the exact same thing as the saveListeners function.
We need to make a function for the share button and then attatch them after all the posts have already been loaded onto the page.
 */
function shareListeners() {
    //find every share button that was created by the post cards
    document.querySelectorAll('.sl-share-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const postId = btn.getAttribute('data-post-id'); // grab the post id from the button
            const postUrl = window.location.origin + '/post.html?id=' + postId; //get full url to post

            // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
            //writeText's result gets given to .then() same concept as fetch.
            navigator.clipboard.writeText(postUrl) //copy the url to users clipboard
            //once has copied to clipboard let user know
            .then(function() {
                alert('Link copied to clipboard.');
            })
            //if something fails tell the user and give the link so they can copy manually
            .catch(function(){
                alert('Could not copy link, please copy it manually: ' + postUrl);
            });
        });
    });
}

/* creating function for like listeners, will be similar to saving function above*/

const notifyObserver = new CustomEvent("notifyObserver", {//create custom event to notify observers of updates to likes, contains id of post which has been liked.
    bubbles: true, //bubbles from within listener (subject) for observer to receive data
});

function likeUpdateObserver() {
    document.querySelectorAll('.sl-like-btn').forEach(function(btn) {
        btn.addEventListener('notifyObserver', function() {
            const postId = btn.getAttribute('data-post-id'); // grab the post id from the button
            const label = btn.querySelector('.sl-like-count');
            var postLikes = Number();
            fetch(`http://127.0.0.1:8000/api/posts/likes/${postId}/`, {
                method: 'GET',
                headers: { 
                    'Authorization': 'Bearer ' + token 
                } // who am i
            })
            .then(function(response) { return response.json(); }) //convert response into javascript object
            .then(function(likes) {
                postLikes = likes.length;
                label.textContent = postLikes;
            })
            .catch(function() {
                alert('Failed to update like count');
            });
            } 
    )});
}

function likeListeners() {
    document.querySelectorAll('.sl-like-btn').forEach(function(btn) {
        btn.dispatchEvent(notifyObserver);//dispatch notify observer function to update all like buttons upon loading the page
        btn.addEventListener('click', function() { //add click listener to the like button
            const postId = btn.getAttribute('data-post-id'); // grab the post id from the button
            const token = localStorage.getItem('access_token');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('liked')) {
                fetch(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': 'Bearer ' + token 
                    } // who am i
                })
                .then(function() {
                    btn.classList.remove('liked');
                    icon.classList.remove('bi-heart-fill');
                    icon.classList.add('bi-heart');
                    btn.dispatchEvent(notifyObserver);//dispatch event to observer that like count needs to be updated
                })
                .catch(function() {
                    alert('Failed to unlike post');
                });//check if post is liked by the user, if it is don't run fetch to like the post
            } else {
                fetch(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {//when the post is not liked, send request to backend to like post.
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer ' + token 
                    } // who am i
                })
                .then(function(response) { return response.json(); }) //convert response into javascript object
                .then(function(result) {
                    if (result.message) {
                        //show button is in liked state
                        btn.classList.add('liked');
                        icon.classList.remove('bi-heart');
                        icon.classList.add('bi-heart-fill');
                        btn.dispatchEvent(notifyObserver);//dispatch event to observer that like count needs to be updated
                    }
                })
                .catch(function() {
                    alert('Failed to like post');
                });
            }
        });
    });    
}


