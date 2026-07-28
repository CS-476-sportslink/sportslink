//essentially the same as likedposts.js, just changed so saved posts are displayed rather than liked posts.

const savedPostFeed = document.querySelector('#sl-saved-posts');
//null check to avoid crashing
if (savedPostFeed) {
    const token = localStorage.getItem('access_token');
    const savedPostIds = [];
    const likedPostIds = [];//arrays for liked posts and saved posts

    //
    fetch('https://sportslink.tynan.pro/api/posts/saved/', {
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
    fetch('https://sportslink.tynan.pro/api/posts/liked/', {
        headers: {
            'Authorization': 'Bearer ' + token //who am i
        }
    })
    .then(function(response) { return response.json(); }) //convert response into javascript object
    .then(function(postsLiked) {
        postsLiked.forEach(function(liked) {
            likedPostIds.push(liked.post.id); //push id into array
        });
        return fetch('https://sportslink.tynan.pro/api/posts/', {//retrieve posts
            headers: {
                'Authorization': 'Bearer ' + token //who am i
            }
        });
    })
    .then(function(response) { return response.json(); }) //get response from the backend as json and we use response.json to turn it into a usable JavaScript object
    // once we turned it into a usable javascript object we now have the posts which we can loop through.
    .then(function(posts) {
        if (posts.length === 0) {
            savedPostFeed.innerHTML = '<p class="text-muted text-center">No posts yet.</p>'; //Show that there are no posts if there are no posts.
            return;
        }
        posts.forEach(function(post) {//for each loop to go through all post data received
            //`${}` is a template literal which lets us put variables inside the html, ${} being the placeholder for those variables
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
            const isSaved = savedPostIds.includes(post.id) // check which posts ids are liked or saved, use this to set buttons and decide if post is displayed or not
            const isLiked = likedPostIds.includes(post.id)
            const initials = post.user.first_name[0] + post.user.last_name[0]; 
             if(isSaved){//if post is saved, display post
                const creator = getCardCreator(post);
                    savedPostFeed.innerHTML += creator.createCard(post, isSaved, isLiked);
                }
        });
        //listener functions to attatch btn listeners after posts have loaded and observers for like count updating
        likeUpdateObserver();
        saveListeners();
        likeListeners();
        shareListeners();
    })
    //catch if something goes wrong
    .catch(function(error) {
        savedPostFeed.innerHTML = '<p class="text-muted text-center">Failed to load posts.</p>';
    });
}
