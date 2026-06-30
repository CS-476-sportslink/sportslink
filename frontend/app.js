

//like button change class and increment like count
document.querySelectorAll('.sl-like-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        const icon = this.querySelector('i');
        const likeCount = this.querySelector('.sl-like-count');
        let count = parseInt(likeCount.textContent);

        if (this.classList.contains('liked')) {
            this.classList.remove('liked');
            this.classList.add('text-muted');   
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            likeCount.textContent = count - 1;
        } else {
            this.classList.add('liked');
            this.classList.remove('text-muted');
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            likeCount.textContent = count + 1;
        }
    });
});


//Save button similar to like button
document.querySelectorAll('.sl-save-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        const icon = this.querySelector('i');
        const label = this.querySelector('.sl-save-label');

        
        if (this.classList.contains('saved')) {
            this.classList.remove('saved');
            this.classList.add('text-muted');
            icon.classList.remove('bi-bookmark-fill');
            icon.classList.add('bi-bookmark')
            label.textContent = 'Save';
        } else {
            this.classList.add('saved');
            this.classList.remove('text-muted');
            icon.classList.remove('bi-bookmark');
            icon.classList.add('bi-bookmark-fill');
            label.textContent = 'Saved';
        }
    });
});


/*Follow button functionality*/

document.querySelectorAll('.sl-follow-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        const followingCount = document.querySelector('.sl-following-count');
        let count = parseInt(followingCount.textContent);

        if (this.classList.contains('following')) {
            this.classList.remove('following');
            this.classList.remove('btn-danger');
            this.classList.add('btn-outline-danger');
            this.textContent = 'Follow';
            followingCount.textContent = count - 1;
        } else {
            this.classList.add('following');
            this.classList.remove('btn-outline-danger');
            this.classList.add('btn-danger');
            this.textContent = 'Following';
            followingCount.textContent = count + 1;
        }
    });
});