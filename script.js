// Credenciales válidas para la simulación
const DEMO_USER = {
    email: 'admin@correo.com',
    password: '123456'
};

// Referencias a elementos del DOM
const loginCard = document.getElementById('loginCard');
const dashboardCard = document.getElementById('dashboardCard');
const loginForm = document.getElementById('loginForm');
const correoInput = document.getElementById('correo');
const contrasenaInput = document.getElementById('contrasena');
const recordarmeCheckbox = document.getElementById('recordarme');
const correoError = document.getElementById('correoError');
const contrasenaError = document.getElementById('contrasenaError');
const loginAlert = document.getElementById('loginAlert');
const alertMessage = document.getElementById('alertMessage');
const submitBtn = document.getElementById('submitBtn');
const btnSpinner = document.getElementById('btnSpinner');
const btnText = submitBtn.querySelector('.btn-text');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const eyeOpen = togglePasswordBtn.querySelector('.eye-open');
const eyeClosed = togglePasswordBtn.querySelector('.eye-closed');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const demoFillBtn = document.getElementById('demoFillBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
const displayUserEmail = document.getElementById('displayUserEmail');

// Inicialización: Cargar usuario recordado si existe
document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('login_remembered_email');
    if (savedEmail) {
        correoInput.value = savedEmail;
        recordarmeCheckbox.checked = true;
        contrasenaInput.focus();
    }
});

// Validación de formato de correo
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Limpiar alertas y errores
function clearErrors() {
    correoInput.classList.remove('input-error');
    contrasenaInput.classList.remove('input-error');
    correoError.textContent = '';
    contrasenaError.textContent = '';
    loginAlert.className = 'alert hidden';
    alertMessage.textContent = '';
}

// Mostrar alerta principal
function showAlert(message, type = 'error') {
    loginAlert.className = `alert alert-${type}`;
    alertMessage.textContent = message;

    if (type === 'error') {
        loginCard.classList.remove('shake');
        // Forzar reflow para reiniciar la animación de shake
        void loginCard.offsetWidth;
        loginCard.classList.add('shake');
    }
}

// Alternar visibilidad de la contraseña
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = contrasenaInput.getAttribute('type') === 'password';
    contrasenaInput.setAttribute('type', isPassword ? 'text' : 'password');
    eyeOpen.classList.toggle('hidden', isPassword);
    eyeClosed.classList.toggle('hidden', !isPassword);
    contrasenaInput.focus();
});

// Botón para autocompletar credenciales demo
demoFillBtn.addEventListener('click', () => {
    correoInput.value = DEMO_USER.email;
    contrasenaInput.value = DEMO_USER.password;
    clearErrors();
    contrasenaInput.setAttribute('type', 'password');
    eyeOpen.classList.remove('hidden');
    eyeClosed.classList.add('hidden');
    showAlert('Credenciales cargadas. Haz clic en "Iniciar Sesión".', 'success');
});

// Limpiar errores mientras el usuario escribe
correoInput.addEventListener('input', () => {
    if (correoInput.classList.contains('input-error')) {
        correoInput.classList.remove('input-error');
        correoError.textContent = '';
    }
    if (!loginAlert.classList.contains('hidden')) {
        loginAlert.classList.add('hidden');
    }
});

contrasenaInput.addEventListener('input', () => {
    if (contrasenaInput.classList.contains('input-error')) {
        contrasenaInput.classList.remove('input-error');
        contrasenaError.textContent = '';
    }
    if (!loginAlert.classList.contains('hidden')) {
        loginAlert.classList.add('hidden');
    }
});

// Enlace de "¿Olvidaste tu contraseña?"
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = correoInput.value.trim();
    if (!email || !isValidEmail(email)) {
        showAlert('Ingresa tu correo para enviarte instrucciones de recuperación.');
        correoInput.focus();
    } else {
        showAlert(`Enlace de restablecimiento enviado a ${email}`, 'success');
    }
});

// Manejo del envío del formulario (Submit)
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    const email = correoInput.value.trim();
    const password = contrasenaInput.value;
    let hasError = false;

    // Validación de campos
    if (!email) {
        correoInput.classList.add('input-error');
        correoError.textContent = 'Por favor ingresa tu correo electrónico.';
        hasError = true;
    } else if (!isValidEmail(email)) {
        correoInput.classList.add('input-error');
        correoError.textContent = 'El formato de correo no es válido.';
        hasError = true;
    }

    if (!password) {
        contrasenaInput.classList.add('input-error');
        contrasenaError.textContent = 'Por favor ingresa tu contraseña.';
        hasError = true;
    } else if (password.length < 6) {
        contrasenaInput.classList.add('input-error');
        contrasenaError.textContent = 'La contraseña debe tener mínimo 6 caracteres.';
        hasError = true;
    }

    if (hasError) {
        loginCard.classList.remove('shake');
        void loginCard.offsetWidth;
        loginCard.classList.add('shake');
        return;
    }

    // Estado de carga en el botón
    submitBtn.disabled = true;
    btnSpinner.classList.remove('hidden');
    btnText.textContent = 'Comprobando...';

    // Simulación de respuesta de red/servidor (700 ms)
    setTimeout(() => {
        submitBtn.disabled = false;
        btnSpinner.classList.add('hidden');
        btnText.textContent = 'Iniciar Sesión';

        // Verificación de credenciales
        if (email.toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
            // Guardar o borrar preferencia de recordar
            if (recordarmeCheckbox.checked) {
                localStorage.setItem('login_remembered_email', email);
            } else {
                localStorage.removeItem('login_remembered_email');
            }

            // Transición a la vista de sesión exitosa
            loginCard.classList.add('hidden');
            displayUserEmail.textContent = email;
            userAvatar.textContent = email.charAt(0).toUpperCase();
            dashboardCard.classList.remove('hidden');
        } else {
            showAlert('Credenciales incorrectas. Prueba admin@correo.com / 123456');
            contrasenaInput.value = '';
            contrasenaInput.focus();
        }
    }, 700);
});

// Manejo de Cerrar Sesión
logoutBtn.addEventListener('click', () => {
    dashboardCard.classList.add('hidden');
    contrasenaInput.value = '';
    clearErrors();
    loginCard.classList.remove('hidden');

    if (!recordarmeCheckbox.checked) {
        correoInput.value = '';
        correoInput.focus();
    } else {
        contrasenaInput.focus();
    }
});