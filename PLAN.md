# Plan de Mejora — Página de Cine

> Sitio estático de cartelera de cine (HTML + CSS + JS vanilla, Bootstrap 5,
> DataTables, FullCalendar, SweetAlert2, particles.js). Los datos viven en
> `assets/data/peliculas.json` y el "login" es 100% cliente (localStorage).

Este documento detalla el análisis y el plan de trabajo. Se organiza por
prioridad y cada ítem indica archivos afectados y verificación.

---

## A. Hallazgos actuales

### A1. HTML malformado / navegación rota (crítico)
- **`calendar.html`**, **`admin.html`**, **`acercademi.html`**, **`index-admin.html`**:
  los `<ul class="dropdown-menu">` quedan **sueltos**, sin el `<a dropdown-toggle>` ni
  el `<li>` que los contiene, y fuera del `<ul class="navbar-nav">`. Resultado:
  el menú "Categorías" no se ve, no hay ningún `<li class="nav-item dropdown">`.
- Varias páginas tienen `</ul>` / `</li>` / `</div>` sin abrir (HTML inválido).

### A2. Seguridad (crítico)
- Contraseñas **en texto plano** dentro de `localStorage` (`login.js:60`).
- **Sin protección real**: `admin.html` e `index-admin.html` son accesibles sin
  autenticarse; basta con `localStorage.setItem('loggedIn','true')`.
- Posible **XSS** en `script.js` (`mostrarPeliculas`): inyecta contenido del JSON
  con `innerHTML` sin escapar.

### A3. Modo oscuro duplicado y contradictorio
- Existen **tres claves distintas** de localStorage: `darkMode`, `theme`, `dark-mode`.
- El código se repite y **se cancela a sí mismo** (lncontrar listeners duplicados en
  `login.js:106` y `127`).

### A4. Datos inconsistentes
- Géneros con **espacios finales** (`"Ciencia Ficcion  "` x3) rompen el filtrado.
- Existe `Musical` en datos pero **no está en el menú** del navbar.
- Varias películas **sin `horario`** → el calendario muestra `undefined`.
- Películas sin **id** único (necesario para el CRUD persistente).

### A5. Rutas y recursos
- Imágenes con ruta absoluta `/assets/...` se rompen con `file://` o subcarpetas.
- `login.html:9` enlaza a `/assets/icons/...` (una **carpeta**, no un CSS) → roto.
- El popup de SweetAlert aparece en **cada carga**.

### A6. CRUD "falso"
- `admin.js`: el CRUD de DataTables es **solo en memoria**; se pierde al recargar
  y no escribe en el JSON (imposible en estático, pero puede persistir en localStorage).

### A7. Menos
- Navbar **duplicada a mano** en 7 páginas.
- `<input type="checkbox">` estilizado de botón como switch de dark mode (confuso).
- `acercademi.html` usa clases `card1-header`/`card1-body` sin estilo.
- CSS con reglas muertas/duplicadas (`home.css`, `styles.css`).

---

## Plan de trabajo ordenado

### Fase 0 — Preparación
- Crear/Mantener `.gitignore` para `node_modules` (si se añade build) y respaldo.
- Crear un archivo `assets/js/` con utilidades compartidas (ver Fase 1).

### Fase 1 — Corrección de HTML (prioridad alta)
| Tarea | Archivos |
|-------|----------|
| Arreglar el navbar malformado y el dropdown de Categorías en las 4 páginas afectadas | `calendar.html`, `admin.html`, `acercadm.mi`, `index-admin.html` |
| Balancear `</ul>`/`</li>`/`</div>` en todas las páginas | todos los `.html` |

**Verificación**: abrir cada página y comprobar que el navbar y el dropdown
"Categorías" funcionan en desktop y móvil.

### Fase 2 — Unificar navbar (mantenimiento)
- [ ] Crear `assets/js/navbar.js` que renderice la barra común (con links, dropdown
      de categorías auto-generado desde el JSON, buscador, switch dark mode).
- [ ] Reemplazar el HTML duplicado de navbar en las 6+ páginas por un `<nav id="navbar-cont"></nav>`.
- [ ] Categorías generadas a partir de los géneros reales del JSON (evita items huérfanos).

### Fase 3 — Modo oscuro unificado
- [ ] Crear `assets/js/theme.js` con UNA clave (`cine:theme`) y funciones `initTheme/toggle`.
- [ ] Eliminar los bloques duplicados/contradictorios en `script.js`, `calendar.js`,
      `login.js`, `admin.js` y sus listeners duplicados.
- [ ] Sustituir el checkbox-switch por un botón accesible con icono (`bi-sun`/`bi-moon`).

### Fase 4 — Datos (JSON)
- [ ] Añadir campo `id` (entero) a cada película.
- [ ] Quitar espacios finales/principales en géneros (`Ciencia Ficcon`).
- [ ] Normalizar `horario` (todos con `"HH:MM"`) o usar valor por defecto.
- [ ] Añadir categoria `Musical` si se desea (y cualquier género faltante).

### Fase 5 — Seguridad / saneo
- [ ] Añadir utilidad `escapeHTML()` y aplicarla en `mostrarPeliculas` y toda
      inyección dinámica.
- [ ] **Hash de contraseñas** (SHA-256 vía `crypto.subtle`) en `login.js` en lugar
      de texto plano.
- [ ] Establecer una bandera de sesión robusta y proteger `admin.html`/
      `index-admin.html` (redirigir a `login.html` si no hay sesión válida).

### Fase 6 — Rutas relativas
- [ ] Convertir rutas de imágenes del JSON a relativas (`assets/img/...`) y
      actualizar CSS en `styles.css` (fondo `xo.jfif`).
- [ ] Corregir el `<link>` roto en `login.html`.

### Fase 7 — CRUD persistente
- [ ] En `admin.js`: mantener el listado en `localStorage` (`cine:peliculas`),
      sincronizándolo con el JSON inicial y persistiendo altas/bajas/ediciones.

### Fase 8 — UX / pulido
- [ ] Mostrar el SweetAlert de bienvenida solo una vez (flag en localStorage).
- [ ] Botón "Ver Trailer" y tarjeta con info (incluir `horario` en la tarjeta).
- [ ] Limpieza de CSS: eliminar reglas muertas y duplicadas.
- [ ] Correcciones de `acercademi.html` (clases `card1-header/body`).

### Fase 9 — Verificación final
- [ ] Probar todas las páginas (navegación, filtros, oscuro, login, calendario, admin)
      tanto servidor local (`python -m http.server`) como `file://`.
- [ ] `git status` limpio y commit por fases.

---

## Criterios de aceptación
- Navegación vertical (navbar/dropdown de Categorías) funcional en las **7** páginas
  y responsive.
- Modo oscuro coherente entre páginas, persistente y sin conflictos.
- Filtros por categoría y búsqueda correctos con los datos saneados.
- Calendario muestra eventos sin `undefined`.
- Passwords hasheados; acceso admin protegido.
- No se rompe el sitio al abrirlo bajo `file://`.

> **Nota**: este es un sitio estático; "persistencia" se limita a `localStorage`.
> Para un CRUD real con backend (users + películas) se requeriría un pequeño servidor
> (Node/PHP/Python); se puede plantear como ampliación futura.