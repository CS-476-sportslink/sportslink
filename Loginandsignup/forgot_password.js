//Forgot Password Form
const forgotPasswordForm = document.querySelector('#forgotPasswordForm');

//similar template from app.js
//
if(forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit',function(e) {
        e.preventDefault();

        const email = document.querySelector('#email');
        const emailValue = email.value;
        const emailError = document.querySelector('#emailError');
        const alertSuccessfull = document.querySelector('#alertSuccessfull');


        let isValid = true;
        if(emailValue === ""){ 
            email.style.color = 'red';
            emailError.textContent = "Please enter an email address!";
            isValid = false;
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(isValid && !regex.test(emailValue)){
            emailError.style.color = 'red';
            emailError.textContent = "This email is invalid, Please enter a valid email!";  
            isValid = false; 
        }

        // stop here if validation failed - don't call the backend with bad input
        if(!isValid){
            return;
        }

        //fetch network request
        fetch('http://127.0.0.1:8000/api/auth/forgot-password/',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({email: emailValue})
        })
        .then(function(response){ 
            if(response.ok){
                window.location.href = 'reset_password_sent.html';
            }
            else
                alert('Something went wrong please enter your email again!')

        })
        .catch(function(error){
            alert('Something went wrong, Please try again!'); 
        }); 
    });
}

//back to login button 
const btnBackToLogin = document.querySelector('#btnBackToLogin');

if (btnBackToLogin) {
    btnBackToLogin.addEventListener('click', function() {
        //redirect to login page 
        window.location.href = 'login.html';
    });
}


//Password reset form 
const resetPasswordForm = document.querySelector('#resetPasswordForm');
if(resetPasswordForm){
    resetPasswordForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const newPswd = document.querySelector('#newPswd').value;
        const confirmPswd = document.querySelector('#confirmPswd').value;
        const pswdError = document.querySelector('#PswdError');
        const message = document.querySelector('#message');

        const params = new URLSearchParams(window.location.search);
        const user_id = params.get("user_id");
        const token = params.get("token");

        if(!user_id || !token){
            message.style.color = 'red';
            message.textContent = "This link is invalid.";   
            return;
        }

        const pwdRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[A-Za-z\d\W_]{8,}$/;
        if(!pwdRegex.test(newPswd)){
            pswdError.style.color = 'red';
            pswdError.textContent = "Password much be minimum 8 characters, atleast 1 uppcase, 1 lowercase letter and 1 number."
            return;
        }

        if(newPswd !== confirmPswd){
            pswdError.style.color = 'red'
            pswdError.textContent - "The Passwords does not match ";
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/auth/reset-password/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: user_id,
                token: token,
                new_pwd: newPswd
            })
        })
        .then(function(response){
            if(response.ok){
                window.location.href = 'login.html';
            } else {
                message.style.color = 'red';
                message.textContent = "Password can't be updated, please try again later.";
            }
        })
        .catch(function(error){
            pswdError.style.color = 'red'
            pswdError.textContent = "The reset password link is invalid."
        });

    });
}