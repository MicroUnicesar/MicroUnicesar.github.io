# Informe final — Reestructuración del sitio de Microbiología UNICESAR

Cierre de las fases 0 a 9 del plan de reestructuración. Fecha: octubre de 2026.

- Cómo usar y mantener el sitio: [README.md](../README.md) · [src/app/README.md](../src/app/README.md)
- Cómo cambiar contenido sin programar: [GUIA_CONTENIDO.md](GUIA_CONTENIDO.md)
- **Lo que debe aportar el responsable del contenido:** [CONTENIDO_PENDIENTE.md](CONTENIDO_PENDIENTE.md)

## 1. Resumen

El sitio pasó de una página con datos de plantilla, textos fijos en el código, grupos en ventanas emergentes y sin
posicionamiento en buscadores, a un **sitio estático bilingüe (español / inglés)** donde **todo el contenido son archivos de
datos** y cada grupo, docente, línea y opción de grado tiene **su propia página y dirección web**.

**Qué se puede hacer hoy sin programar:** agregar un docente, grupo, noticia, evento, recurso o traducción editando un
archivo (ver la guía). El sitio **oculta solo** lo que aún no tiene datos, así que nunca se ve texto de relleno.

**Lo que más falta no es código sino contenido:** de 16 docentes solo 1 tiene su texto de investigación y su cargo;
los 15 labs y semilleros no tienen descripción; faltan fotos, teléfonos, proyectos y publicaciones. Está detallado en
[CONTENIDO_PENDIENTE.md](CONTENIDO_PENDIENTE.md).

## 2. Qué se hizo

| Fase | Resultado |
|---|---|
| 0. Diagnóstico | Se encontró un build roto (Bootstrap), 60 vulnerabilidades de npm, archivos duplicados, textos fijos fuera de i18n, contenido de plantilla en todos los grupos, ninguna página con título propio y SPA sin prerenderizado. |
| 1. Datos y modelos | Todo el contenido pasó a `src/assets/data/*.json` con un modelo TypeScript y un servicio por archivo; relaciones por `id` (personas ↔ grupos ↔ labs ↔ líneas); pruebas de integridad sobre los datos reales. |
| 2. Rutas y menú | Jerarquía en inglés (`/research/groups/pam`, `/people/faculty/:id`…), mapa único del sitio (`site-map.ts`), migas, páginas de sección, "Próximamente" para lo que no tiene datos y **redirecciones** de las URL antiguas. |
| 3. Grupos | Página propia por grupo; los datos de plantilla (requisitos, "Proyecto 1, 2, 3") se retiraron. |
| 4. Personas | Listado de docentes con búsqueda y filtro por grupo; ficha con foto, cargo, contacto, investigación, formación, grupos, publicaciones, cursos y equipo; sección oculta si no hay datos. |
| 5 / 5B. Estudiantes | Recursos, bienestar y preguntas frecuentes; las opciones de grado dejaron de ser un modal de 1.185 líneas y son 8 páginas con pasos, documentos y contacto. |
| 6. Programa y portada | Página del programa, impacto, portada con tarjetas de sección, labs y semilleros dentro de Investigación. |
| 7. Idiomas | Español e inglés completos; el idioma se recuerda; paridad de claves verificada automáticamente; `TODO_TRADUCCION` cae al español. |
| 8. SEO y prerender | Las 62 rutas se generan como HTML real; título, descripción, Open Graph y `canonical` por página; `sitemap.xml` (49 URL), `robots.txt`, `404.html`; un guardián en el build que falla si una página sale vacía. |
| 9. Calidad y entrega | Auditoría de accesibilidad y rendimiento con correcciones, buscador de enlaces rotos, guía de contenido, documentación y este informe (ver sección 3). |
| Ajustes | Escudo y nombre de departamento en el pie, tarjetas con color cálido, listado de docentes en 2/3 + 1/3 con panel de administración, texto corto y largo de investigación por docente, contacto en la ficha. |

## 3. Fase 9 en detalle

### 3.1 Qué se midió
Lighthouse en móvil (red lenta simulada) sobre 10 páginas, con un servidor comprimido como GitHub Pages:

| Medida | Resultado final |
|---|---|
| Accesibilidad | **100** en todas las páginas auditadas |
| SEO | **100** |
| Buenas prácticas | **100** (antes 96: el favicon daba 404) |
| Rendimiento, páginas internas | **80–89** (contacto 89, docentes 87, grupo 83, labs 84, investigación 80) |
| Rendimiento, portada | **73** (ver 3.5) |
| Peso del sitio compilado | **10 MB** (eran 65 MB) |
| Desbordamiento horizontal en móvil | **0 de 49 páginas** a 360, 390, 768 y 1024 px (antes, unas 40 de 49 desbordaban 12 px) |
| Enlaces internos / imágenes rotos | **0** (antes 1 imagen: `news/research.jpg`) |

Una primera medición, sin compresión y con los banners de 5–12 MB, daba rendimiento ~63 con un tiempo de carga de la
imagen principal de 7 a 30 s; las comparaciones de rendimiento "antes/después" no son exactas porque cambió el servidor de
prueba, pero el peso de las imágenes era la causa principal.

### 3.2 Qué se corrigió (claro y seguro)
- **Imágenes (la causa del rendimiento):** 6 banners de grupos de 5–12 MB y 4 imágenes de noticias pasaron a WebP
  (de ~50 MB a ~1 MB). Los originales siguen en el historial de git.
- **Imagen de noticia inexistente** (`news/research.jpg`): ahora usa `home/research.jpg`.
- **Favicon:** el ícono daba 404 en cada página (ruta mal escrita y carpeta `public/` sin copiar).
- **Desbordamiento en móvil:** filas con `g-5` fuera de su contenedor, portada con degradado que sobresalía, `/research/labs`
  sin contenedor, e insignias largas que no partían el texto.
- **Accesibilidad:** orden de encabezados en la portada (h5/h6 → h3), botones de idioma con nombre accesible
  ("ES – Español"), enlaces "Más información" distinguibles por grupo, contraste de las insignias de labs y eventos,
  enlace "Saltar al contenido principal", `rel="noopener noreferrer"` en los enlaces externos y ruta del logo.
- **Guardas permanentes en el build** (`postbuild`): un solo `<h1>`, sin saltos de encabezados, imágenes con `alt` y
  ningún `TODO_CONTENIDO` visible. Si alguien rompe una de estas reglas, el build falla.
- **Buscador de enlaces** (`npm run links:check`, y `:external`), con pruebas.
- **Pruebas de integridad:** ahora validan que los grupos y labs solo apunten a proyectos y publicaciones que existan
  (antes exigían que no hubiera ninguno, lo que impedía cargar proyectos).

### 3.3 Enlaces externos (22 revisados)
20 responden bien. Dos no se pudieron verificar automáticamente por bloqueo a robots, no por estar rotos:
ResearchGate (HTTP 403) y Scopus (la conexión es rechazada). Conviene abrirlos a mano una vez.

### 3.4 `TODO_CONTENIDO` restantes
Ninguno se ve en la web (lo comprueba el build). En los datos quedan:

| Archivo | Marcadores | Qué falta |
|---|---|---|
| `people.json` | 98 | Cargo, `research` y `summary` de 15 de 16 docentes; textos de las 2 autoridades |
| `labs.json` | 30 | Descripción de los 15 labs/semilleros |
| `faqs.json` | 10 | Respuestas de las preguntas frecuentes |
| `program.json` | 8 | Misión, visión, perfil, plan de estudios, acreditación… |

### 3.5 Revisado y dejado sin cambiar (decisión pendiente)
- **`NgOptimizedImage`:** no se adoptó. Con las imágenes ya en WebP y `lazy`, el beneficio restante es pequeño y exige
  declarar tamaños en todas las plantillas.
- **Portada (rendimiento 73):** el elemento más grande es el fondo decorativo `main_home.svg` (99 kB comprimido) y 8
  imágenes de tarjetas. Se puede mejorar precargando la imagen principal o simplificando el SVG.
- **Cambio de diseño (CLS) 0.04–0.06** en la ficha de docente, programa y líneas: dentro de lo aceptable (< 0.1); viene
  de imágenes sin tamaño fijo.
- **Imágenes sin usar** en `src/assets/images/news/`: `destacado_1.jpg` (748 kB), `destacado_2.jpg`, `destacado_3.jpg`.
  No están referenciadas; se dejaron por si son material del equipo.
- **Teclado y foco:** se verificó el enlace "saltar al contenido" y que Bootstrap conserva el anillo de foco; solo dos
  componentes (`person-card`, `lines`) lo reemplazan por un contorno propio. No se hizo una prueba manual completa
  con lector de pantalla.

## 4. Pendientes de contenido (resumen)

El detalle completo, fase por fase, está en [CONTENIDO_PENDIENTE.md](CONTENIDO_PENDIENTE.md). Lo más importante:

1. **Docentes (15 de 16):** cargo, texto de investigación (largo) y resumen (corto), fotos con autorización, teléfonos,
   formación, líneas y enlaces académicos.
2. **Autoridades:** fotos de la jefa de departamento y del decano.
3. **Labs y semilleros (15):** descripción.
4. **Programa:** misión, visión, perfil del egresado, plan de estudios, acreditación y cifras confirmadas.
5. **Grupos:** líder, miembros, proyectos y publicaciones reales; contacto.
6. **Estudiantes:** respuestas de preguntas frecuentes, calendario, bienestar, movilidad y becas.
7. **Noticias y eventos:** las actuales son de ejemplo; reemplazarlas por reales (la imagen de la noticia 4 es provisional).
8. **Imagen para compartir en redes:** 1200 × 630 px con autorización (ahora se usa una foto de investigación).
9. **Traducciones técnicas** al inglés que requieran revisión por un especialista.

## 5. Riesgos

| Riesgo | Gravedad | Detalle y mitigación |
|---|---|---|
| **Vulnerabilidades de npm** | Media | `npm audit`: 61 (4 críticas, 43 altas); 8 en dependencias de producción, todas por usar Angular 20.1.x. El sitio publicado es estático (no ejecuta código de servidor), pero conviene **actualizar Angular a 20.3.x completo** (con `@angular/ssr` y `platform-server` juntos, que están fijados a mano) y volver a ejecutar todas las verificaciones. No se hizo en esta fase porque cambia el `package-lock.json` entero. |
| **Solo el español está prerenderizado** | Media | Los buscadores ven la versión en español. Para posicionar también el inglés hay que servir rutas por idioma (`/en/...`) con `hreflang`: es un cambio de enrutamiento grande. |
| **Sitio con muchas fichas vacías** | Media | Mientras 15 de 16 docentes no tengan datos, sus tarjetas muestran solo el nombre. Se puede dejar de publicar un docente quitándolo de `people.json` hasta tener su información. |
| **Publicación manual** | Media | Se publica haciendo merge de `develop` a `github-pages`; el workflow solo existe en esa rama y tiene un paso (`cp index.html 404.html`) que sobrescribe el `404.html` correcto. Hay una versión mejorada en `deploy/` **sin aplicar**. |
| **Dependencias sin uso** | Baja | `@fortawesome/fontawesome-free` (no se importa en ningún archivo), `@ngx-translate/*` (configurados pero sin usar) y `@popperjs/core`. Quitarlos reduce la instalación y las alertas de npm. |
| **Versiones de Node** | Baja | Probado en local con Node 24; el flujo propuesto usa Node 22. El `package-lock.json` se generó con `--legacy-peer-deps` (para fijar Angular 20.1.x) y se verificó con `npm ci` en un checkout limpio. |
| **Textos de ejemplo** | Baja | Noticias y eventos actuales son de muestra; si no se reemplazan se publican como verdaderos. |
| **Enlaces externos que cambian** | Baja | Los PDF y formularios están en sitios de la universidad (SharePoint, Office Forms); si cambian, se rompen. Revisar con `npm run links:check:external` cada cierto tiempo. |

## 6. Próximos pasos (en orden sugerido)

1. **Cargar el contenido pendiente** de docentes, labs y programa (es lo que más mejora el sitio).
2. **Aplicar el workflow mejorado** de `deploy/github-pages.workflow.proposed.yml` en la rama `github-pages` y
   publicar. Después, verificar el sitio en Google Search Console y enviar `sitemap.xml`.
3. **Actualizar Angular a 20.3.x** (y quitar las dependencias sin uso) en una rama aparte, con todas las verificaciones.
4. **Reemplazar** la imagen de Open Graph y las noticias/eventos de ejemplo.
5. Decidir sobre **rutas por idioma** (`/en/...`) si el posicionamiento en inglés es importante.
6. **Activar secciones** cuando tengan datos: poner `ready: true` en `site-map.ts` para Proyectos, Publicaciones,
   Estudiantes, Personal y Preguntas frecuentes.
7. **Repetir la auditoría** (Lighthouse, `npm run links:check:external`) cada cierto tiempo o tras cambios grandes.

## 7. Cómo se verifica una entrega

```bash
npm run build                                          # compila, prerenderiza y verifica cada página
npx ng test --watch=false --browsers=ChromeHeadless    # 360 pruebas de la aplicación
npm run test:scripts                                   # 20 pruebas de los scripts
npm run links:check                                    # enlaces e imágenes
```

Estado al cierre: **build correcto** (62 rutas prerenderizadas: 49 indexables, 6 "Próximamente", 7 redirecciones),
**360 pruebas de la aplicación y 20 de scripts en verde**, `i18n:check` correcto y **0 enlaces internos rotos**.

## 8. Documentos retirados

Al cerrar el proyecto se eliminaron de `docs/` los documentos de trabajo que ya no sirven: el plan por fases
(`PLAN.md`), los diagnósticos (`DIAGNOSTICO.md`, `DIAGNOSTICO_GRADO.md`) y la guía de personas (`GUIA_AGREGAR_PERSONA.md`,
reemplazada por [GUIA_CONTENIDO.md](GUIA_CONTENIDO.md)). Sus conclusiones están resumidas en las secciones 2 y 3 de este
informe, y el historial de git conserva el código de cada fase.
