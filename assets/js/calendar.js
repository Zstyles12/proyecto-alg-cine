document.addEventListener('DOMContentLoaded', function() {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const body = document.body;

    // Check local storage for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
    } else {
        body.classList.remove('dark-mode');
        darkModeSwitch.checked = false;
    }

    // Toggle dark mode and save preference to local storage
    darkModeSwitch.addEventListener('change', function() {
        if (darkModeSwitch.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    let peliculas = [];

    cargarPeliculas();

    function cargarPeliculas() {
        fetch('assets/data/peliculas.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                peliculas = data;
                inicializarCalendario();
            })
            .catch(error => console.error('Error al cargar las películas:', error));
    }

    function inicializarCalendario() {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: peliculas.map(pelicula => ({
                title: pelicula.titulo,
                start: pelicula.fecha,
                extendedProps: {
                    genero: pelicula.genero
                }
            })),
            headerToolbar: {
                start: 'prev,next today',
                center: 'title',
                end: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
            },
            locale: "es",
            dayMaxEventRows: true,
            eventClick: function(info) {
                const genero = info.event.extendedProps.genero;
                window.location.href = `home.html?genero=${encodeURIComponent(genero)}`;
            }
        });
        calendar.render();
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
    }

    // Load dark mode setting
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    document.getElementById('darkModeSwitch').addEventListener('click', toggleDarkMode);
    // Configuración de ParticleJS para el lado izquierdo
    particlesJS('particles-js-left', {
        "particles": {
            "number": {
                "value": 20,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#2d24bb"
            },
            // Configuraciones adicionales de partículas según necesites
        }
    });

    // Configuración de ParticleJS para el lado derecho
    particlesJS('particles-js-right', {
        "particles": {
            "number": {
                "value": 20,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#2d24bb"
            },
            // Configuraciones adicionales de partículas según necesites
        }
    });
});
