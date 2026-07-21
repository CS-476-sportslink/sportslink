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

/* Save and unsave a post. When the save button is clicked we need to save it to our saved posts page.
If the save button has already been clicked and we click it again we need to delete the post from the saved posts page
Update the icon so it shows a saved state. */
document.querySelectorAll('sl-save-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) { //add click listener to the save icon
        e.stopPropagation(); //stops the click from going up to the <a> tag and going into the post.
        const postId = btn.getAttribute('data-post-id'); // grab the post id from the button
        const token = localStorage.getItem('access_token');
        const icon = btn.querySelector('i');
        const label = btn.querySelector('sl-save-label') // Saved and saved text
        if (btn.classList.contains('saved')) {
            //this is for when a post is already saved. If clicked again we need to send delete request to backend to remove it from saved posts page.
            fetch(`http://127.0.0.1:8000/api/posts/${postId}/save/`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token } // who am i
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
                headers: { 'Authorization': 'Bearer ' + token } // who am i
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