$(document).ready(function() {
    // ============================================
    // admin.js - CRUD persistente (localStorage)
    // Los datos viven en cine:peliculas; se siembran
    // desde assets/data/peliculas.json la primera vez.
    // ============================================

    var STORAGE_KEY = 'cine:peliculas';

    function leerPeliculas() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }
        return null;
    }

    function guardarPeliculas(lista) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    }

    // Semilla inicial desde el JSON
    var peliculas = leerPeliculas();
    if (peliculas === null) {
        $.getJSON('assets/data/peliculas.json', function(data) {
            peliculas = data.map(function(p) {
                return {
                    id: p.id || new Date().getTime() + Math.random(),
                    title: p.titulo || p.title || '',
                    genre: p.genero || p.genre || '',
                    duration: p.duracion || p.duration || '',
                    releaseDate: p.fechaEstreno || p.releaseDate || '',
                    horario: p.horario || '18:00'
                };
            });
            guardarPeliculas(peliculas);
            renderTabla();
        }).fail(function() {
            peliculas = [];
            renderTabla();
        });
    } else {
        renderTabla();
    }

    var table;

    function renderTabla() {
        if ($.fn.DataTable.isDataTable('#moviesTable')) {
            $('#moviesTable').DataTable().destroy();
        }
        $('#moviesTable tbody').empty();

        table = $('#moviesTable').DataTable({
            responsive: true,
            data: peliculas,
            columns: [
                { data: 'title', title: 'Título' },
                { data: 'genre', title: 'Género' },
                { data: 'duration', title: 'Duración' },
                { data: 'releaseDate', title: 'Estreno' },
                { data: 'horario', title: 'Horario' },
                {
                    data: 'id',
                    title: 'Acciones',
                    render: function(id) {
                        return '<button class="btn btn-warning btn-sm edit-btn" data-id="' + id + '">Editar</button> ' +
                               '<button class="btn btn-danger btn-sm delete-btn" data-id="' + id + '">Eliminar</button>';
                    }
                }
            ],
            language: {
                search: 'Buscar:',
                lengthMenu: 'Mostrar _MENU_',
                info: 'Mostrando _START_ a _END_ de _TOTAL_ películas',
                paginate: { first: 'Primero', last: 'Último', next: 'Siguiente', previous: 'Anterior' },
                emptyTable: 'No hay películas registradas'
            }
        });
    }

    // Abrir modal para añadir
    $('#addMovieBtn').on('click', function() {
        $('#movieForm')[0].reset();
        $('#movieModalLabel').text('Añadir Película');
        $('#movieId').val('');
    });

    // Abrir modal para editar
    $('#moviesTable tbody').on('click', '.edit-btn', function() {
        var id = String($(this).data('id'));
        var movie = peliculas.find(function(p) { return String(p.id) === id; });
        if (!movie) return;
        $('#title').val(movie.title);
        $('#genre').val(movie.genre);
        $('#duration').val(movie.duration);
        $('#releaseDate').val(movie.releaseDate);
        $('#horario').val(movie.horario);
        $('#movieId').val(id);
        $('#movieModalLabel').text('Editar Película');
        $('#movieModal').modal('show');
    });

    // Guardar (alta o edición)
    $('#movieForm').on('submit', function(e) {
        e.preventDefault();
        var movieId = $('#movieId').val();
        var movieData = {
            title: $('#title').val(),
            genre: $('#genre').val(),
            duration: $('#duration').val(),
            releaseDate: $('#releaseDate').val(),
            horario: $('#horario').val() || '18:00'
        };

        if (movieId) {
            var idx = peliculas.findIndex(function(p) { return String(p.id) === movieId; });
            if (idx >= 0) {
                peliculas[idx] = $.extend({}, peliculas[idx], movieData);
            }
        } else {
            var nuevo = $.extend({}, movieData, { id: Date.now() });
            peliculas.push(nuevo);
        }

        guardarPeliculas(peliculas);
        renderTabla();
        $('#movieModal').modal('hide');
    });

    // Eliminar
    $('#moviesTable tbody').on('click', '.delete-btn', function() {
        var id = String($(this).data('id'));
        if (confirm('¿Estás seguro de eliminar esta película?')) {
            peliculas = peliculas.filter(function(p) { return String(p.id) !== id; });
            guardarPeliculas(peliculas);
            renderTabla();
        }
    });
});
