//Forgot Password Form
const forgotPasswordForm = document.querySelector('#forgotPasswordForm');

if(forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit',function(e) {
        e.preventDefault();

        const email = document.querySelector('#email');
        const emailError = document.querySelector('#emailError');
        const alertSuccessfull = document.querySelector('#alertSuccessfull');

        //trim any empty spaces in the beginning or end
        const emailValue = email.value.trim();

        let isValid = true;
        //Email regex
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        //Input is empty display an error
        if(emailValue === ""){ 
            emailError.style.color = 'red';
            emailError.textContent = "Please enter an email address!";
            isValid = false;
        }

        //evaluate whether text matches the email format and if it passes both check then clear the error message
        if(isValid && !regex.test(emailValue)){
            emailError.style.color = 'red';
            emailError.textContent = "This email is invalid, Please enter a valid email!";  
            isValid = false; 
        }
        else if(isValid){
        emailError.textContent = "";
        }

        //fetch network request
        fetch('http://127.0.0',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({email: email})
        })
        .then(function(response){ 
            if(response.ok){
                window.location.href = 'forgot_password_sent.html';
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
        const pswdError = document.querySelector('#pswdError');
        const message = document.querySelector('#message');

        const params = URLSearchParams(window.location.search);
        const user_id = params.get("user_id");
        const token = params.get("token");

        if(!user_id || !token){
            message.style.color = 'red';
            message.textContent = "This link is invalid.";   
            return;
        }

        const pwdRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[A-Za-z\d\W_]{8,}$/;
        if(!pwdRegex.test(newpswd)){
            pswdError.style.color = 'red';
            pswdError.textContent = "Password much be minimum 8 characters, atleast 1 uppcase, 1 lowercase letter and 1 number."
            return;
        }

        if(newPswd !== confirmPswd){
            pswdError.style.color = 'red'
            pswdError.textContent - "The Passwords does not match ";
            return;
        }

        const response = await fetch('http://127.0.0', {
            headers: {'Content-Type': 'aaplication/json'},
            body: JSON.stringify({
                user_id: user_id,
                token: token,
                new_pwd: newPswd
            })
        })
        .then(function(response){
            if(response.okay){
                window.location.href = 'login.html';
            }
            else
                message.style.color = 'red';
                message.textContent = "Password can't be updated, please try again later."
        })
        .catch(function(error){
            pswdError.style.color = 'red'
            pswdError.textContent = "The reset password link is invalid."
        });

    });
}

