// ============================================
// auth.js - Guard de proteccion de paginas admin
// Redirige a login.html si no hay sesion valida
// ============================================
(function () {
    try {
        var sesion = localStorage.getItem('cineSesion');
        if (!sesion) {
            window.location.replace('login.html');
            return;
        }
        try {
            var data = JSON.parse(sesion);
            if (!data || !data.email) {
                window.location.replace('login.html');
            }
        } catch (e) {
            window.location.replace('login.html');
        }
    } catch (e) {
        // localStorage no disponible: bloquea por seguridad
        window.location.replace('login.html');
    }
})();