document.addEventListener('DOMContentLoaded', function () {
    let peliculas = [];

    cargarPeliculas();
    document.getElementById('busqueda').addEventListener('input', filtrarPeliculas);
    document.getElementById('filtroCategoria').addEventListener('change', filtrarPeliculas);

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
                mostrarPeliculas(peliculas);
                inicializarCalendario();  // Inicializar calendario después de cargar películas
            })
            .catch(error => console.error('Error al cargar las películas:', error));
    }

    function mostrarPeliculas(peliculas) {
        let peliculasHTML = '';
        peliculas.forEach(pelicula => {
            peliculasHTML += `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${pelicula.imagen}" class="card-img-top" alt="${pelicula.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${pelicula.titulo}</h5>
                            <p class="card-text">${pelicula.descripcion}</p>
                            <p class="card-text">${pelicula.fecha}</p>
                            <p class="card-text">${pelicula.actores}</p>
                            <p class="card-text">${pelicula.genero}</p>
                            <a href="${pelicula.trailer}" class="btn btn-primary" target="_blank">Ver Trailer</a>
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById('peliculas').innerHTML = peliculasHTML;
    }

    function filtrarPeliculas() {
        const busqueda = document.getElementById('busqueda').value.toLowerCase();
        const categoria = document.getElementById('filtroCategoria').value;
        const peliculasFiltradas = peliculas.filter(pelicula => {
            return (pelicula.titulo.toLowerCase().includes(busqueda) || pelicula.actores.some(actor => actor.toLowerCase().includes(busqueda)))
                && (categoria === '' || pelicula.genero === categoria);
        });
        mostrarPeliculas(peliculasFiltradas);
    }

    function inicializarCalendario() {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: peliculas.map(pelicula => ({
                title: pelicula.titulo,
                start: pelicula.fecha
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
        });
        calendar.render();
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
        inicializarCalendario();  // Re-inicializar calendario para aplicar el nuevo tema
    }

    // Load dark mode setting
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeSwitch').checked = true;
    }

    document.getElementById('darkModeSwitch').addEventListener('change', toggleDarkMode);

    // Ejemplo de notificación con SweetAlert2
    Swal.fire({
        title: '¡Estreno Imperdible!',
        text: 'No te pierdas el estreno de "Deadpool & Wolverine" este 25 de julio.',
        icon: 'info',
        confirmButtonText: 'OK'
    });

    // Configurar partículas
    particlesJS('left-particles', {
        particles: {
            number: { value: 50 },
            color: { value: '#185abc' },
            shape: { type: 'star' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            line_linked: { enable: false, color: '#ffffff' },
            move: { speed: 2 }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: 'repulse' } }
        }
    });

    particlesJS('right-particles', {
        particles: {
            number: { value: 50 },
            color: { value: '#185abc' },
            shape: { type: 'star' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            line_linked: { enable: false, color: '#ffffff' },
            move: { speed: 2 }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: 'repulse' } }
        }
    });

    // Check if dark mode is enabled in local storage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeSwitch').checked = true;
        pJSDom.forEach(p => {
            p.pJS.particles.color.value = '#bbbbbb';
            p.pJS.particles.line_linked.color = '#bbbbbb';
        });
    }

    document.getElementById('darkModeSwitch').addEventListener('change', function () {
        if (darkModeSwitch.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            pJSDom.forEach(p => {
                p.pJS.particles.color.value = '#bbbbbb';
                p.pJS.particles.line_linked.color = '#bbbbbb';
            });
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            pJSDom.forEach(p => {
                p.pJS.particles.color.value = '#ffffff';
                p.pJS.particles.line_linked.color = '#ffffff';
            });
        }

        inicializarCalendario();  // Re-inicializar calendario para aplicar el nuevo tema
    });
});
