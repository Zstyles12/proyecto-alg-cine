$(document).ready(function() {
    var table = $('#moviesTable').DataTable({
        responsive: true
    });

    // Función para abrir el modal y preparar el formulario para añadir una nueva película
    $('#addMovieBtn').on('click', function() {
        $('#movieForm')[0].reset();
        $('#movieModalLabel').text('Añadir Película');
        $('#movieId').val('');
    });

    // Función para abrir el modal y cargar los datos de la película en el formulario para editar
    $('#moviesTable tbody').on('click', '.edit-btn', function() {
        var data = table.row($(this).parents('tr')).data();
        $('#title').val(data[0]);
        $('#genre').val(data[1]);
        $('#duration').val(data[2]);
        $('#releaseDate').val(data[3]);
        $('#movieId').val($(this).data('id'));
        $('#movieModalLabel').text('Editar Película');
        $('#movieModal').modal('show');
    });

    // Función para manejar el envío del formulario y realizar las operaciones CRUD
    $('#movieForm').on('submit', function(e) {
        e.preventDefault();
        var movieId = $('#movieId').val();
        var movieData = {
            title: $('#title').val(),
            genre: $('#genre').val(),
            duration: $('#duration').val(),
            releaseDate: $('#releaseDate').val()
        };

        if (movieId) {
            // Editar película
            table.row($('.edit-btn[data-id="' + movieId + '"]').parents('tr')).data([
                movieData.title,
                movieData.genre,
                movieData.duration,
                movieData.releaseDate,
                '<button class="btn btn-warning btn-sm edit-btn" data-id="' + movieId + '">Editar</button> <button class="btn btn-danger btn-sm delete-btn" data-id="' + movieId + '">Eliminar</button>'
            ]).draw();
        } else {
            // Añadir nueva película
            table.row.add([
                movieData.title,
                movieData.genre,
                movieData.duration,
                movieData.releaseDate,
                '<button class="btn btn-warning btn-sm edit-btn" data-id="' + new Date().getTime() + '">Editar</button> <button class="btn btn-danger btn-sm delete-btn" data-id="' + new Date().getTime() + '">Eliminar</button>'
            ]).draw();
        }

        $('#movieModal').modal('hide');
    });

    // Función para manejar la eliminación de películas
    $('#moviesTable tbody').on('click', '.delete-btn', function() {
        table.row($(this).parents('tr')).remove().draw();
    });
});

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