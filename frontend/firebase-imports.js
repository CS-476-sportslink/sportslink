//Redirect to login if not logged in
if (!localStorage.getItem('access_token') && window.location.pathname.includes('home.html')) {
    window.location.href = '../Loginandsignup/login.html';
}
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