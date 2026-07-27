// Load posts feed

const likedPostFeed = document.querySelector('#sl-liked-posts');//connect to sl-liked-posts tag
//null check to avoid crashing
if (likedPostFeed) {
    const token = localStorage.getItem('access_token');
    const savedPostIds = [];
    const likedPostIds = [];//arrays for liked posts and saved post ids

    //
    fetch('http://127.0.0.1:8000/api/posts/saved/', {//fetch saved posts
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
    fetch('http://127.0.0.1:8000/api/posts/liked/', {//fetch liked posts
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) { return response.json(); }) //convert response into javascript object
    .then(function(postsLiked) {
        postsLiked.forEach(function(liked) {
            likedPostIds.push(liked.post.id); //push id into array
        });
        return fetch('http://127.0.0.1:8000/api/posts/', {//fetch all posts
            headers: {
                'Authorization': 'Bearer ' + token //who am i
            }
        });
    })
    .then(function(response) { return response.json(); }) //get response from the backend as json and we use response.json to turn it into a usable JavaScript object
    // once we turned it into a usable javascript object we now have the posts which we can loop through.
    .then(function(posts) {
        if (posts.length === 0) {
            likedPostFeed.innerHTML = '<p class="text-muted text-center">No posts yet.</p>'; //Show that there are no posts if there are no posts.
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
            const isSaved = savedPostIds.includes(post.id) // check if posts are either liked or saved, used to set icons in html template and whether post is displayed (whether it is liked or not)
            const isLiked = likedPostIds.includes(post.id)
            const initials = post.user.first_name[0] + post.user.last_name[0]; 
            if(isLiked){//if post is liked, display on page
                const creator = getCardCreator(post);
                    likedPostFeed.innerHTML += creator.createCard(post, isSaved, isLiked);
            }
        });
        //listener functions to attatch btn listeners after posts have loaded and observer for like counts
        likeUpdateObserver();
        saveListeners();
        likeListeners();
        shareListeners();
    })
    //failed to load posts catch
    .catch(function(error) {
        likedPostFeed.innerHTML = '<p class="text-muted text-center">Failed to load posts.</p>';
    });
}
