// ============================================
// navbar.js — Barra de navegación compartida
// Se inyecta en <nav id="navbar" data-nav="public|admin">
// Las categorías se generan dinámicamente desde peliculas.json
// ============================================
(function (window) {
    'use strict';

    const DATA_URL = 'assets/data/peliculas.json';

    // Etiqueta legible por género
    const ETIQUETAS = {
        'Accion': 'Acción',
        'Animacion': 'Animación',
        'Aventura': 'Aventura',
        'Ciencia Ficcion': 'Ciencia Ficción',
        'Conciertos': 'Conciertos',
        'Comedia': 'Comedia',
        'Documental': 'Documental',
        'Drama': 'Drama',
        'Fantasia': 'Fantasía',
        'Romance': 'Romance',
        'Superheroes': 'Superhéroes',
        'Terror': 'Terror',
        'Musical': 'Musical'
    };

    const NAV_LINKS = {
        public: [
            { label: 'Inicio', href: 'home.html' },
            { label: 'Categorías', dropdown: true },
            { label: 'Calendario', href: 'calendar.html' },
            { label: 'Acerca de Mí', href: 'acercademi.html' },
            { label: 'Iniciar Sesión', href: 'login.html' }
        ],
        admin: [
            { label: 'Inicio', href: 'home.html' },
            { label: 'Categorías', dropdown: true },
            { label: 'Panel Admin', href: 'admin.html' },
            { label: 'Cerrar Sesión', href: 'home.html', logout: true }
        ]
    };

    function escapar(str) {
        return String(str).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function listaCategorias(generos) {
        const vistos = new Set();
        const items = [];
        generos.forEach((g) => {
            const nombre = String(g || '').trim();
            if (!nombre) return;
            if (vistos.has(nombre)) return;
            vistos.add(nombre);
            items.push({ nombre, etiqueta: ETIQUETAS[nombre] || nombre });
        });
        items.sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, 'es'));
        return items;
    }

    function renderizar(tipo) {
        const nav = document.getElementById('navbar');
        if (!nav) return;

        const links = NAV_LINKS[tipo] || NAV_LINKS.public;
        let html = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="home.html">Cartelera de Cine</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">`;

        links.forEach((link) => {
            if (link.dropdown) {
                html += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Categorías</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown" id="navCategorias"></ul>
                    </li>`;
            } else if (link.logout) {
                html += `
                    <li class="nav-item">
                        <a class="nav-link" href="${escapar(link.href)}" data-logout>${escapar(link.label)}</a>
                    </li>`;
            } else {
                html += `
                    <li class="nav-item">
                        <a class="nav-link" href="${escapar(link.href)}">${escapar(link.label)}</a>
                    </li>`;
            }
        });

        html += `
                    </ul>
                    <form class="d-flex" role="search" onsubmit="return false;">
                        <input class="form-control me-2" type="search" id="busqueda" placeholder="Buscar..." aria-label="Buscar">
                    </form>
                    <button type="button" class="btn btn-outline-light ms-2" data-theme-toggle aria-label="Cambiar tema">
                        <i class="bi bi-moon" data-theme-icon></i> <span class="d-none d-sm-inline">Modo Oscuro</span>
                    </button>
                </div>
            </div>
        </nav>`;

        nav.innerHTML = html;

        // Cargar categorías desde el JSON
        const contCategorias = document.getElementById('navCategorias');
        if (contCategorias) {
            cargarCategorias(contCategorias);
        }

        // Cierre de sesión
        const logoutEl = nav.querySelector('[data-logout]');
        if (logoutEl) {
            logoutEl.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('cineSesion');
                window.location.href = logoutEl.getAttribute('href');
            });
        }

        // Sincroniza el icono de tema
        if (window.CineTheme) window.CineTheme.syncInterruptores();
    }

    function cargarCategorias(cont) {
        fetch(DATA_URL)
            .then(r => r.json())
            .then(data => {
                const generos = data.map(p => p.genero);
                pintarCategorias(cont, listaCategorias(generos));
            })
            .catch(() => pintarCategorias(cont, listaCategorias(Object.keys(ETIQUETAS))));
    }

    function pintarCategorias(cont, items) {
        cont.innerHTML = items.map((c) =>
            `<li><a class="dropdown-item" href="home.html?genero=${encodeURIComponent(c.nombre)}">${escapar(c.etiqueta)}</a></li>`
        ).join('');
    }

    window.CineNav = {
        renderizar
    };

    const aplicar = () => {
        const nav = document.getElementById('navbar');
        if (nav) renderizar(nav.dataset.nav || 'public');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicar);
    } else {
        aplicar();
    }
})(window);