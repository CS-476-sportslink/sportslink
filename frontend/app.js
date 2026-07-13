//firebase auth
// Import the functions you need from the SDKs you need
import * as firebase from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js';
import * as firebaseui from 'https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js';
// Add Firebase products that you want to use
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAfVBGewFfHm4C2SAiJ2mwzgJlhq2WGEnc",
    authDomain: "sportslink-e870e.firebaseapp.com",
    projectId: "sportslink-e870e",
    storageBucket: "sportslink-e870e.firebasestorage.app",
    messagingSenderId: "686493557751",
    appId: "1:686493557751:web:d361470a7f55b8c72404f2",
    measurementId: "G-P1NTDL75E3"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// Initialize the FirebaseUI Widget using Firebase.
var auth = getAuth(app);
const provider = new GoogleAuthProvider();
//can move this to where it is needed for login page
//from the firebase sample: https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk
signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });


//like button change class and increment like count
document.querySelectorAll('.sl-like-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
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
document.querySelectorAll('.sl-save-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
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

document.querySelectorAll('.sl-follow-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const followingCount = document.querySelector('.sl-following-count');

        if (this.classList.contains('following')) {
            this.classList.remove('following');
            this.classList.remove('btn-danger');
            this.classList.add('btn-outline-danger');
            this.textContent = 'Follow';
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) - 1;
            }
        } else {
            this.classList.add('following');
            this.classList.remove('btn-outline-danger');
            this.classList.add('btn-danger');
            this.textContent = 'Following';
            if (followingCount) {
                followingCount.textContent = parseInt(followingCount.textContent) + 1;
            }
        }
    });
});

//Notifications
const readAllBtn = document.querySelector('.sl-read-all-btn');
if (readAllBtn) {
    readAllBtn.addEventListener('click', function (e) {
        e.stopPropagation();

        const badge = document.querySelector('.sl-notification-badge');
        if (badge) {
            badge.classList.add('sl-hidden');
        }

        document.querySelectorAll('.sl-notification-unread').forEach(function (notification) {
            notification.classList.remove('sl-notification-unread');
        });
    });
};

//Resize comment area on post.html
document.querySelectorAll('textarea').forEach(function (textarea) {
    textarea.addEventListener('input', function (e) {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});

//Post replies
document.querySelectorAll('.sl-reply-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        const replyBox = this.closest('.card-body').querySelector('.sl-reply-box');
        replyBox.classList.toggle('sl-hidden');
    });
});

// Hide and display content on settings tabs
document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {

        document.querySelectorAll('.sl-settings-section').forEach(function (s) {
            s.classList.remove('active');
        });
        document.querySelectorAll('.sl-settings-nav .nav-link').forEach(function (l) {
            l.classList.remove('active');
        });

        const section = this.getAttribute('data-section');
        document.getElementById('section-' + section).classList.add('active');
        this.classList.add('active');
    });
});