// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    });

    // Password validation script
    var passwordInput = document.getElementById('password');

    passwordInput.addEventListener('input', function () {
        var passwordValue = passwordInput.value;
        var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (passwordPattern.test(passwordValue)) {
            passwordInput.setCustomValidity('');
        } else {
            passwordInput.setCustomValidity('Invalid');
        }
    });

    // Name validation script
    var nameInput = document.getElementById('name');

    nameInput.addEventListener('input', function () {
        var nameValue = nameInput.value;
        if (nameValue.length >= 4) {
            nameInput.setCustomValidity('');
        } else {
            nameInput.setCustomValidity('Invalid');
        }
    });

    // Email validation script
    var emailInput = document.getElementById('email');
   
    emailInput.addEventListener('input', function () {
        var emailValue = emailInput.value;
        // Regex pattern to validate email
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
        if (emailPattern.test(emailValue)) {
            emailInput.setCustomValidity('');
        } else {
            emailInput.setCustomValidity('Invalid');
        }
       });

    // Mobile number validation script
    var mobileInput = document.getElementById('mobn');
    // var mobileFeedback = document.getElementById('mobileFeedback');
 
    mobileInput.addEventListener('input', function () {
        var mobileValue = mobileInput.value;
        // Regex pattern to validate mobile number
        var mobilePattern = /^\d{3}\d{3}\d{4}$/;
 
        if (mobilePattern.test(mobileValue)) {
            mobileInput.setCustomValidity('');
        } else {
            mobileInput.setCustomValidity('Invalid');
        }
    });

    // NGO ID validation script
    var NGOIDInput = document.getElementById('ngoid');

    NGOIDInput.addEventListener('input', function () {
        var nameValue = NGOIDInput.value;
        if (nameValue.length >= 4) {
            NGOIDInput.setCustomValidity('');
        } else {
            NGOIDInput.setCustomValidity('Invalid');
        }
    });


  })()