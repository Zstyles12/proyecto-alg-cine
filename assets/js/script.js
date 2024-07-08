// script.js
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
                inicializarCalendario();  // Mueve esta línea aquí
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

    // Ejemplo de notificación con SweetAlert2
    Swal.fire({
        title: '¡Estreno Imperdible!',
        text: 'No te pierdas el estreno de "Deapool & Wolverine" este 25 de julio.',
        icon: 'info',
        confirmButtonText: 'OK'
    });
});
