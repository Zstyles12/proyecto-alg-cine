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
    const busquedaElement = document.getElementById('busqueda');
    if (busquedaElement) {
        busquedaElement.addEventListener('input', filtrarPeliculas);
    }
    const filtroCategoriaElement = document.getElementById('filtroCategoria');
    if (filtroCategoriaElement) {
        filtroCategoriaElement.addEventListener('change', function () {
            filtrarCategoria(this.value);
        });
    }

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
                // Aplicar filtro de categoría si existe en la URL
                const urlParams = new URLSearchParams(window.location.search);
                const genero = urlParams.get('genero');
                if (genero) {
                    filtrarCategoria(genero);
                }
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
        const peliculasElement = document.getElementById('peliculas');
        if (peliculasElement) {
            peliculasElement.innerHTML = peliculasHTML;
        }
    }

    function filtrarPeliculas() {
        const busqueda = document.getElementById('busqueda').value.toLowerCase();
        const peliculasFiltradas = peliculas.filter(pelicula => {
            return pelicula.titulo.toLowerCase().includes(busqueda) || pelicula.actores.some(actor => actor.toLowerCase().includes(busqueda));
        });
        mostrarPeliculas(peliculasFiltradas);
        
    }

    window.filtrarCategoria = function(categoria) {
        const peliculasFiltradas = peliculas.filter(pelicula => pelicula.genero === categoria);
        mostrarPeliculas(peliculasFiltradas);
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
    }



    // Ejemplo de notificación con SweetAlert2
    Swal.fire({
        title: '¡Estreno Imperdible!',
        text: 'No te pierdas el estreno de "Deadpool & Wolverine" este 25 de julio.',
        icon: 'info',
        confirmButtonText: 'OK'
    });
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
