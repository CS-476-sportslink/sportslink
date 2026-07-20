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