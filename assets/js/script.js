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

    // Escapa caracteres HTML para evitar inyección (XSS)
    function escapar(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // Convierte un link de YouTube (watch/shorts/embed) a su ID de video
    function youtubeId(url) {
        const m = String(url || '').match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/
        );
        return m ? m[1] : null;
    }

    // Inserta el reproductor modal la primera vez
    const trailerModal = document.getElementById('trailerModal');
    if (!trailerModal) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'trailerModal';
        modal.tabIndex = -1;
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="background:#000">
                    <div class="modal-header border-0" style="background:#000">
                        <h5 class="modal-title text-white">Trailer</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body p-0" style="background:#000">
                        <div class="ratio ratio-16x9">
                            <iframe id="trailerFrame" src="about:blank" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture" title="Reproductor de trailer"></iframe>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }

    // Inserta el modal de detalle de película la primera vez
    const detalleModal = document.getElementById('detalleModal');
    if (!detalleModal) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'detalleModal';
        modal.tabIndex = -1;
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="detalleTitulo"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-5">
                                <img id="detalleImagen" class="img-fluid rounded" alt="">
                            </div>
                            <div class="col-md-7">
                                <p id="detalleDescripcion" class="card-text"></p>
                                <p id="detalleGenero"></p>
                                <p id="detalleActores"></p>
                                <p id="detalleFecha"></p>
                                <p id="detalleHorario"></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="detalleTrailerBtn">Ver Trailer</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }

    // Al pulsar "Detalles" se muestra el modal con la información de la película
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-detalle]');
        if (!btn) return;
        const id = String(btn.getAttribute('data-detalle'));
        const pelicula = peliculas.find(p => String(p.id) === id);
        if (!pelicula) {
            Swal.fire('Error', 'No se encontró la película.', 'error');
            return;
        }
        document.getElementById('detalleTitulo').textContent = pelicula.titulo || 'Sin título';
        const img = document.getElementById('detalleImagen');
        const imgCol = img.closest('.col-md-5');
        if (pelicula.imagen) {
            img.src = pelicula.imagen;
            img.alt = pelicula.titulo || '';
            imgCol.classList.remove('d-none');
        } else {
            img.removeAttribute('src');
            imgCol.classList.add('d-none');
        }
        document.getElementById('detalleDescripcion').textContent = pelicula.descripcion || '';
        document.getElementById('detalleGenero').innerHTML = '<span class="badge bg-secondary">' + escapar(pelicula.genero) + '</span>';
        const actores = (Array.isArray(pelicula.actores) && pelicula.actores.length) ? pelicula.actores.join(', ') : '';
        document.getElementById('detalleActores').textContent = actores ? 'Reparto: ' + actores : '';
        document.getElementById('detalleFecha').textContent = 'Estreno: ' + (pelicula.fecha || '');
        document.getElementById('detalleHorario').textContent = 'Horario: ' + (pelicula.horario || '18:00');
        document.getElementById('detalleTrailerBtn').setAttribute('data-trailer', pelicula.trailer || '');
        new bootstrap.Modal(document.getElementById('detalleModal')).show();
    });

    // Al pulsar "Ver Trailer" se abre el reproductor embebido
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('[data-trailer]');
        if (!btn) return;
        const id = youtubeId(btn.getAttribute('data-trailer'));
        if (!id) {
            Swal.fire('Error', 'No se encontró el enlace del trailer.', 'error');
            return;
        }
        const frame = document.getElementById('trailerFrame');
        if (frame) {
            frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        }
        const modalEl = document.getElementById('trailerModal');
        const modal = new bootstrap.Modal(modalEl);
        // Cerrar el detalle si estaba abierto
        const detalleModalEl = document.getElementById('detalleModal');
        if (detalleModalEl && detalleModalEl.classList.contains('show')) {
            bootstrap.Modal.getInstance(detalleModalEl)?.hide();
        }
        modal.show();
        // Detener el video al cerrar el modal
        modalEl.addEventListener('hidden.bs.modal', function () {
            if (frame) frame.src = 'about:blank';
        }, { once: true });
    });

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
        if (!peliculas.length) {
            peliculasHTML = '<p class="text-center text-muted">No se encontraron películas.</p>';
        }
        peliculas.forEach(pelicula => {
            peliculasHTML += `
                <div class="col-md-4">
                    <div class="card text-center">
                        <img src="${escapar(pelicula.imagen)}" class="card-img-top" alt="${escapar(pelicula.titulo)}" loading="lazy">
                        <div class="card-body">
                            <h5 class="card-title">${escapar(pelicula.titulo)}</h5>
                            <p class="card-text"><span class="badge bg-secondary">${escapar(pelicula.genero)}</span> · Estreno: ${escapar(pelicula.fecha)}</p>
                            <button type="button" class="btn btn-outline-primary" data-detalle="${escapar(pelicula.id)}">Ver Detalles</button>
                        </div>
                    </div>
                </div>`;
        });
        const peliculasElement = document.getElementById('peliculas');
        if (peliculasElement) {
            peliculasElement.innerHTML = peliculasHTML;
        }
    }

    function filtrarPeliculas() {
        const buscar = (document.getElementById('busqueda')?.value || '').toLowerCase();
        const peliculasFiltradas = peliculas.filter(pelicula => {
            const actores = Array.isArray(pelicula.actores) ? pelicula.actores.join(' ') : '';
            return pelicula.titulo.toLowerCase().includes(buscar) || actores.toLowerCase().includes(buscar);
        });
        mostrarPeliculas(peliculasFiltradas);
    }

    window.filtrarCategoria = function (categoria) {
        const peliculasFiltradas = peliculas.filter(pelicula => {
            return (pelicula.genero || '').trim() === categoria.trim();
        });
        mostrarPeliculas(peliculasFiltradas);
    }

    // Notificación de estreno solo la primera vez (evita popup en cada visita)
    if (!localStorage.getItem('cineBienvenidaVisto')) {
        Swal.fire({
            title: '¡Estreno Imperdible!',
            text: 'No te pierdas el estreno de "Deadpool & Wolverine" este 25 de julio.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
        localStorage.setItem('cineBienvenidaVisto', 'true');
    }

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
            }
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
            }
        }
    });
});