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
            const isSaved = true;
            const creator = getCardCreator(post);
            savedPosts.innerHTML += creator.createCard(post, isSaved)
        });
        //listener functions to attatch btn listeners after posts have loaded
        saveListeners();
        shareListeners();
    });
}