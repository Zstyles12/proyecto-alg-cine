// ============================================
// theme.js — Modo oscuro unificado
// Una sola clave en localStorage: 'cineTheme'
// ============================================
(function (window) {
    'use strict';

    const THEME_KEY = 'cineTheme';
    const DARK_CLASS = 'dark-mode';

    // Aplica el tema guardado (o el de preferencia del sistema la 1a vez)
    function aplicarTema() {
        const guardado = localStorage.getItem(THEME_KEY);
        const preferencia = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const oscuro = guardado ? guardado === 'dark' : preferencia;
        setTema(oscuro, false);
    }

    function setTema(oscuro, guardar = true) {
        document.body.classList.toggle(DARK_CLASS, oscuro);
        if (guardar) {
            localStorage.setItem(THEME_KEY, oscuro ? 'dark' : 'light');
        }
        syncInterruptores();
    }

    function toggleTema() {
        setTema(!document.body.classList.contains(DARK_CLASS));
    }

    function esOscuro() {
        return document.body.classList.contains(DARK_CLASS);
    }

    // Sincroniza cualquier interruptor que tenga data-theme-toggle
    function syncInterruptores() {
        const oscuro = esOscuro();
        document.querySelectorAll('[data-theme-toggle]').forEach((el) => {
            if (el.type === 'checkbox') {
                el.checked = oscuro;
            }
        });
        document.querySelectorAll('[data-theme-icon]').forEach((icon) => {
            icon.classList.toggle('bi-moon', oscuro);
            icon.classList.toggle('bi-sun', !oscuro);
        });
    }

    // Delegación de eventos (funciona aunque el navbar se pinte con JS)
    document.addEventListener('change', (e) => {
        if (e.target && e.target.dataset && e.target.dataset.themeToggle !== undefined) {
            setTema(e.target.checked);
        }
    });

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-theme-toggle]');
        if (btn && btn.type !== 'checkbox') {
            e.preventDefault();
            toggleTema();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarTema);
    } else {
        aplicarTema();
    }

    window.CineTheme = { aplicarTema, toggleTema, esOscuro, syncInterruptores };
})(window);