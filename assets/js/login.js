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

    // Guardar usuario en LocalStorage
    const user = {
        cedula,
        nombres,
        apellidos,
        email,
        genero,
        ubicacion,
        fechaNacimiento,
        password
    };
    localStorage.setItem('user', JSON.stringify(user));
    Swal.fire('Registro exitoso', 'Ahora puedes iniciar sesión.', 'success').then(() => {
        window.location.href = 'login.html';
    });
});

// Iniciar Sesión
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        Swal.fire('Error', 'No hay usuarios registrados.', 'error');
        return;
    }

    if (storedUser.email === email && storedUser.password === password) {
        localStorage.setItem('loggedIn', 'true');
        Swal.fire('Inicio de sesión exitoso', '', 'success').then(() => {
            window.location.href = 'home.html';
        });
    } else {
        Swal.fire('Error', 'Correo o contraseña incorrectos.', 'error');
    }
});

 



document.addEventListener('DOMContentLoaded', function () {
    const switchMode = document.getElementById('switchMode');

    

   
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (switchMode) {
            switchMode.checked = true;
        }
    }
    

    if (switchMode) {
        switchMode.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    // Verificar el estado guardado en localStorage
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        switchMode.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        switchMode.checked = false;
    }

    // Cambiar el modo al hacer clic en el switch
    switchMode.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        // Guardar el estado en localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('dark-mode', 'true');
        } else {
            localStorage.setItem('dark-mode', 'false');
        }
    });

   
 const logoutButton = document.getElementById('logoutButton');
 if (logoutButton) {
     logoutButton.addEventListener('click', function () {
         localStorage.removeItem('authenticated');
         window.location.href = 'login.html';
     });
 }

});