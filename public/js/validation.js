/* ===========================================
   Form Validation — Login, Register, Profile forms
   =========================================== */
$(document).ready(function () {

    // ========================================================================
    // Login Page (login.html)
    // ========================================================================
    const $loginForm = $('#login-form');
    if ($loginForm.length) {
        $loginForm.on('submit', function (e) {
            e.preventDefault();
            const email = $('#login-email').val().trim();
            const password = $('#login-password').val().trim();
            let errors = [];

            if (!email) errors.push('Email is required');
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format');
            if (!password) errors.push('Password is required');
            else if (password.length < 6) errors.push('Password must be at least 6 characters');

            if (errors.length > 0) {
                showFormError($loginForm, errors.join('<br>'));
                return;
            }

            // Mock login success
            sessionStorage.setItem('inwza_user', JSON.stringify({
                username: email.split('@')[0],
                email: email,
                role: 'customer'
            }));
            showToast('Login successful!');
            setTimeout(function () {
                window.location.href = '/';
            }, 1000);
        });
    }

    // ========================================================================
    // Register Page (register.html)
    // ========================================================================
    const $registerForm = $('#register-form');
    if ($registerForm.length) {
        $registerForm.on('submit', function (e) {
            e.preventDefault();
            const firstname = $('#reg-firstname').val().trim();
            const lastname = $('#reg-lastname').val().trim();
            const email = $('#reg-email').val().trim();
            const password = $('#reg-password').val().trim();
            let errors = [];

            if (!firstname) errors.push('First name is required');
            if (!lastname) errors.push('Last name is required');
            if (!email) errors.push('Email is required');
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format');
            if (!password) errors.push('Password is required');
            else if (password.length < 6) errors.push('Password must be at least 6 characters');

            if (errors.length > 0) {
                showFormError($registerForm, errors.join('<br>'));
                return;
            }

            showToast('Registration successful! Please login.');
            setTimeout(function () {
                window.location.href = '/auth/login';
            }, 1500);
        });
    }

    // ========================================================================
    // Helper: Show form error
    // ========================================================================
    function showFormError($form, message) {
        let $error = $form.find('.form-error-alert');
        if ($error.length === 0) {
            $form.prepend('<div class="alert alert-danger form-error-alert mb-3"></div>');
            $error = $form.find('.form-error-alert');
        }
        $error.html(message).show();
        setTimeout(function () {
            $error.fadeOut();
        }, 5000);
    }
});
