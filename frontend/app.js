//post page when card is clicked
document.querySelectorAll('.sl-post-card').forEach(function(card) {
    card.addEventListener('click', function() {
        window.location = 'post.html';
    });
});


//like button change class and increment like count
document.querySelectorAll('.sl-like-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();

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