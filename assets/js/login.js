// ============================================
// login.js — Registro, inicio de sesión y logout
// El modo oscuro lo gestiona theme.js (assets/js/theme.js)
// ============================================

// Registro de Usuario
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const cedula = document.getElementById('cedula').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const genero = document.getElementById('genero').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const fechaNacimiento = document.getElementById('fecha_nacimiento').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones
    if (!/^\d{7,8}$/.test(cedula)) {
        Swal.fire('Error', 'La cédula debe tener entre 7 y 8 caracteres numéricos.', 'error');
        return;
    }
    if (!/^[a-zA-Z\s]+$/.test(nombres)) {
        Swal.fire('Error', 'Los nombres solo pueden contener letras y espacios.', 'error');
        return;
    }
    if (!/^[a-zA-Z\s]+$/.test(apellidos)) {
        Swal.fire('Error', 'Los apellidos solo pueden contener letras y espacios.', 'error');
        return;
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        Swal.fire('Error', 'El correo debe mantener el formato XXX@XXX.XXX.', 'error');
        return;
    }
    const currentDate = new Date();
    const birthDate = new Date(fechaNacimiento);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 18 || (age === 18 && currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)))) {
        Swal.fire('Error', 'Debes ser mayor de 18 años.', 'error');
        return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[*/_])[A-Za-z\d*/_]{8,}$/.test(password)) {
        Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, incluir un número, un carácter especial (*_/), y letras mayúsculas y minúsculas.', 'error');
        return;
    }
    if (password !== confirmPassword) {
        Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        return;
    }

    // Guardar usuario en LocalStorage (contraseña hasheada, nunca en texto plano)
    hashearPassword(password).then(hash => {
        const user = {
            cedula,
            nombres,
            apellidos,
            email,
            genero,
            ubicacion,
            fechaNacimiento,
            password: hash
        };

        // Mantener múltiples usuarios registrados
        const usuarios = JSON.parse(localStorage.getItem('cineUsuarios') || '[]');
        if (usuarios.some(u => u.email === email)) {
            Swal.fire('Error', 'Ya existe una cuenta con este correo.', 'error');
            return;
        }
        usuarios.push(user);
        localStorage.setItem('cineUsuarios', JSON.stringify(usuarios));
        Swal.fire('Registro exitoso', 'Ahora puedes iniciar sesión.', 'success').then(() => {
            window.location.href = 'login.html';
        });
    });
});

// Iniciar Sesión
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const usuarios = JSON.parse(localStorage.getItem('cineUsuarios') || '[]');

    if (!usuarios.length) {
        Swal.fire('Error', 'No hay usuarios registrados.', 'error');
        return;
    }

    hashearPassword(password).then(hash => {
        const usuario = usuarios.find(u => u.email === email && u.password === hash);
        if (usuario) {
            localStorage.setItem('cineSesion', JSON.stringify({ email: usuario.email, nombres: usuario.nombres }));
            Swal.fire('Inicio de sesión exitoso', `¡Bienvenido, ${usuario.nombres}!`, 'success').then(() => {
                window.location.href = 'index-admin.html';
            });
        } else {
            Swal.fire('Error', 'Correo o contraseña incorrectos.', 'error');
        }
    });
});

// Hash SHA-256 de la contraseña
function hashearPassword(password) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then(hash => {
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

// Cierre de sesión (botón dentro de navbar.js toca localStorage directamente;
// este handler es el respaldo para cualquier botón .logout-btn en páginas)
document.addEventListener('click', function (e) {
    if (e.target.closest('#logoutButton, [data-logout]')) {
        localStorage.removeItem('cineSesion');
        // El navbar.js ya redirige; aquí solo limpiamos.
    }
});