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
        if (!calendarEl) return;
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: peliculas.map(pelicula => ({
                title: `${pelicula.titulo} - ${pelicula.horario || 'Por definir'}`,
                start: pelicula.fecha,
                extendedProps: {
                    genero: pelicula.genero,
                    horario: pelicula.horario
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

    // Configuración de ParticleJS para el lado izquierdo
    if (document.getElementById('particles-js-left')) {
        particlesJS('particles-js-left', {
            "particles": {
                "number": { "value": 20, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#2d24bb" }
            }
        });
    }

    // Configuración de ParticleJS para el lado derecho
    if (document.getElementById('particles-js-right')) {
        particlesJS('particles-js-right', {
            "particles": {
                "number": { "value": 20, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#2d24bb" }
            }
        });
    }
});