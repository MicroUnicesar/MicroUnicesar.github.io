# 🔬 Micrositio — Departamento de Microbiología UNICESAR

Sitio web del Departamento de Microbiología de la **Universidad Popular del Cesar** (Valledupar, Colombia): investigación,
personas, estudiantes y programa, en **español e inglés**.

- **Sitio publicado:** https://microunicesar.github.io/
- **Arquitectura del código:** [src/app/README.md](src/app/README.md)
- **Cómo agregar o cambiar contenido (sin programar):** [docs/GUIA_CONTENIDO.md](docs/GUIA_CONTENIDO.md)
- **Qué se hizo, qué falta y riesgos:** [docs/INFORME_FINAL.md](docs/INFORME_FINAL.md)
- **Contenido que debe aportar el responsable:** [docs/CONTENIDO_PENDIENTE.md](docs/CONTENIDO_PENDIENTE.md)

## Contenido

- [Tecnologías](#tecnologías)
- [Primeros pasos](#primeros-pasos)
- [Estructura del sitio (rutas)](#estructura-del-sitio-rutas)
- [Datos e idiomas](#datos-e-idiomas)
- [SEO y prerenderizado](#seo-y-prerenderizado)
- [Calidad: pruebas y verificaciones](#calidad-pruebas-y-verificaciones)
- [Accesibilidad y rendimiento](#accesibilidad-y-rendimiento)
- [Despliegue](#despliegue)
- [Solución de problemas](#solución-de-problemas)
- [Licencia](#licencia)

## Tecnologías

| Para qué | Qué se usa |
|---|---|
| Aplicación | Angular 20 (componentes *standalone*, señales, flujo de control nuevo `@if` / `@for`) |
| Estilos | Bootstrap 5.3 (solo los módulos SCSS que se usan) + Bootstrap Icons |
| Generación del sitio | `@angular/ssr` + `@angular/platform-server`, salida **estática** (prerender de todas las rutas) |
| Idiomas | Servicio propio `LanguageService` con `src/assets/i18n/{es,en}.json` y *pipes* `translate` / `localized` |
| Pruebas | Karma + Jasmine (aplicación), `node:test` (scripts), `scripts/check-i18n.mjs` |

No hay servidor ni base de datos: todo el contenido son archivos JSON dentro del repositorio.

## Primeros pasos

Requisitos: **Node.js 20 o superior** y npm (probado con Node 24; el flujo de publicación propuesto usa Node 22).

```bash
npm ci            # instala las dependencias exactas del package-lock.json
npm start         # servidor de desarrollo en http://localhost:4200
```

| Comando | Qué hace |
|---|---|
| `npm start` | Desarrollo con recarga automática (muestra el sitio, **no** el HTML prerenderizado) |
| `npm run build` | Compila para producción, prerenderiza todas las rutas y ejecuta las verificaciones de `postbuild` |
| `npx ng test --watch=false --browsers=ChromeHeadless` | Pruebas de la aplicación, una sola vez (`npm test` se queda en modo *watch*) |
| `npm run i18n:check` | Revisa que es/en tengan las mismas claves y que los datos estén traducidos |
| `npm run test:scripts` | Pruebas de los scripts de `scripts/` |
| `npm run links:check` | Busca enlaces internos e imágenes rotas en el sitio compilado (ejecutar tras `npm run build`) |
| `npm run links:check:external` | Lo anterior y además comprueba las URL externas (necesita internet) |

El resultado de `npm run build` queda en `dist/webpage-micro-unicesar/browser/`.

## Estructura del sitio (rutas)

Las URL están en inglés y son estables. La fuente única del menú, las páginas de sección y el pie de página es
`src/app/shared/constants/site-map.ts`.

| Sección | Rutas |
|---|---|
| Portada | `/` |
| Programa | `/program`, `/program/impact` |
| Investigación | `/research`, `/research/groups`, `/research/groups/:id`, `/research/labs`, `/research/lines`, `/research/lines/:id`, `/research/projects`, `/research/publications` |
| Personas | `/people`, `/people/faculty`, `/people/faculty/:id`, `/people/students`, `/people/staff` |
| Estudiantes | `/students`, `/students/graduation-options`, `/students/graduation-options/:id`, `/students/wellness`, `/students/resources`, `/students/faq` |
| Noticias y eventos | `/news`, `/events` |
| Contacto | `/contact` |

- Los **semilleros** son laboratorios (`/research/labs`) marcados con `isSemillero`: cada docente puede tener un lab.
- Una sección con `ready: false` en `site-map.ts` existe como URL pero muestra "Próximamente", sale con `noindex` y no
  aparece en el menú ni en el mapa del sitio.
- Las URL antiguas (`/home`, `/graduation-option`, `/wellness`, `/more-info`, `/research-labs`, `/program/labs`,
  `/program/about`) **redirigen** a su nueva dirección. Una URL desconocida lleva a la portada.

## Datos e idiomas

### Datos
Todo el contenido vive en `src/assets/data/*.json` (ver la tabla en [src/app/README.md](src/app/README.md#datos)).
Cada archivo tiene su modelo TypeScript en `src/app/shared/models/` y su servicio en `src/app/shared/services/`.
Agregar un docente, grupo, noticia o recurso es **editar un JSON**; no hace falta tocar código.
Las pruebas (`src/app/shared/models/data-integrity.spec.ts`) revisan que los ids sean únicos y que las referencias
entre archivos existan.

### Idiomas
- Los textos de la interfaz están en `src/assets/i18n/es.json` y `en.json` (mismas claves en ambos) y se usan con el
  *pipe* `translate`.
- Los textos de los datos son objetos `{ "es": "…", "en": "…" }` y se muestran con el *pipe* `localized`.
- `TODO_CONTENIDO` marca un dato que falta: **la web lo oculta** (no se ve nunca). `TODO_TRADUCCION` marca una
  traducción pendiente: la web muestra el español mientras tanto.
- El idioma se guarda en el navegador y se cambia con los botones ES / EN del encabezado.
- `ngx-translate` sigue configurado en `app.config.ts` pero **no se usa** (ver "Riesgos" en el informe final).

## SEO y prerenderizado

El sitio es **estático** (`outputMode: "static"` en `angular.json`): al compilar, Angular genera un `index.html` con el
contenido real de cada ruta, y el navegador lo **hidrata** (lo reutiliza en vez de volver a dibujarlo).
Así los buscadores y las vistas previas al compartir (WhatsApp, Facebook) leen texto y no una página vacía.

**Cómo funciona**
- `src/app/app.routes.server.ts` lista las rutas del servidor. Las que llevan `:id` (grupos, líneas, docentes y
  opciones de grado) leen sus ids de los mismos JSON de `src/assets/data/`: **agregar un grupo, docente, línea u opción
  de grado lo prerenderiza solo**, sin tocar código.
- Los datos se cargan con `provideHttpClient(withFetch())`: durante el prerender las URL relativas (`assets/data/…`)
  solo se resuelven con el backend `fetch`. Sin él, las páginas salen **vacías** aunque el build "termine bien".
- `SeoService` pone en cada página título, descripción, Open Graph, Twitter, `canonical` y `robots`, en el idioma activo.
  Las páginas toman sus textos del mapa del sitio (`site-map.ts`); las de detalle los definen ellas.
  Las secciones "Próximamente" y "no encontrado" salen con `noindex`.
- La URL del sitio está en `src/site.config.json` (se puede sobrescribir con la variable `SITE_URL`).
- El código que usa `window`/`document` debe ir en `afterNextRender` o usar el token `DOCUMENT`; en el prerender (Node) no existen.

**Qué hace `scripts/postbuild.mjs`** (se ejecuta solo después de `npm run build`)
1. **Verifica** cada página prerenderizada y **hace fallar el build** si alguna tiene poco texto, errores de carga de
   datos (`ng-localhost`), título repetido, sin descripción, `canonical` incorrecto, sin Open Graph, **más o menos de un
   `<h1>`**, saltos de encabezados, imágenes sin `alt`, un marcador `TODO_CONTENIDO` visible, o si una redirección
   apunta a una página que no existe.
2. Genera `sitemap.xml` (solo páginas indexables, sin redirecciones ni "Próximamente") y `robots.txt`.
3. Crea `404.html` (el cascarón de la app) y `.nojekyll`.

**Limitación: el HTML prerenderizado está en español.** El idioma se elige en el navegador sobre la misma URL, así
que los buscadores solo ven la versión en español. Para indexar también el inglés habría que servir rutas por idioma
(`/en/...`), con `hreflang` entre ellas: es un cambio de enrutamiento mayor que no se hizo.

**Probar el resultado localmente** (sin JavaScript se ve lo que ve un buscador):
```bash
npm run build
npx http-server dist/webpage-micro-unicesar/browser   # o cualquier servidor estático
```

## Calidad: pruebas y verificaciones

| Verificación | Cuándo corre | Qué protege |
|---|---|---|
| `ng test` (≈360 pruebas) | A mano / antes de publicar | Componentes, servicios, utilidades, rutas, integridad de los datos |
| `npm run i18n:check` | Antes de `npm test` | Paridad es/en, claves usadas, datos traducidos, sin texto fijo en plantillas |
| `npm run test:scripts` | Antes de `npm test` | La lógica de `postbuild` y del buscador de enlaces |
| `postbuild` | Después de cada `npm run build` | HTML prerenderizado, SEO y accesibilidad básica (ver arriba) |
| `npm run links:check` | A mano tras el build | Enlaces internos, anclajes e imágenes rotas |

Antes de dar por buena una entrega: `npm run build` y `npx ng test --watch=false --browsers=ChromeHeadless` en verde.

## Accesibilidad y rendimiento

Auditoría con Lighthouse (móvil, red lenta simulada, servidor con compresión gzip como GitHub Pages):

| | Puntaje |
|---|---|
| Accesibilidad | 100 en las 10 páginas auditadas |
| SEO | 100 |
| Buenas prácticas | 100 |
| Rendimiento | 80–89 en páginas internas; 73 en la portada (su fondo decorativo y las imágenes de tarjetas) |

Convenciones que mantienen esos resultados:
- **Un solo `<h1>` por página** y encabezados sin saltos (lo exige `postbuild`). Para cambiar el tamaño visual de un
  título se usa una clase (`class="h5"`), no otra etiqueta.
- Toda imagen lleva `alt` (vacío `alt=""` si es decorativa), `width` y `height`, y `loading="lazy"` si no está en la
  parte superior.
- Los enlaces que se abren en otra pestaña llevan `rel="noopener noreferrer"`.
- Hay un enlace "Saltar al contenido principal" (primera parada del teclado) y los botones de idioma indican el
  nombre del idioma a los lectores de pantalla.
- **Imágenes: usar WebP, de unos 1600–2400 px de ancho como máximo y menos de ~250 kB** (`cwebp -q 80 -resize 1600 0 entrada.jpg -o salida.webp`).
  Las imágenes originales de 5–12 MB que había se convirtieron: el sitio pasó de 65 MB a 10 MB.
- Se revisó que **no haya desbordamiento horizontal** en 49 páginas a 360, 390, 768 y 1024 px de ancho.

## Despliegue

**Sitio publicado:** https://microunicesar.github.io/ (en la raíz del dominio; `<base href="/">`)

### Flujo actual

1. Se desarrolla en `develop`.
2. Para publicar, se hace merge de `develop` en la rama **`github-pages`** y se hace push.
3. El workflow `.github/workflows/deploy.yml` — que existe **solo en la rama `github-pages`** — compila
   (`npm ci` y `npm run build -- --base-href /`) y publica `dist/webpage-micro-unicesar/browser` con GitHub Pages.

> ⚠️ Con el prerenderizado, el paso **"Copy index.html to 404.html"** de ese workflow ya sobra: `npm run build` crea un
> `404.html` correcto, y ese paso lo sobrescribe con la portada prerenderizada. Funciona igual, pero conviene quitarlo.
> `deploy/github-pages.workflow.proposed.yml` es una versión mejorada **propuesta e inactiva** (Node 22, sin ese paso,
> con las verificaciones). No se aplica sola: para usarla hay que copiarla a la rama `github-pages`.

### Rutas profundas y 404 en GitHub Pages
Cada ruta tiene su propio `…/index.html`, así que **recargar o abrir un enlace directo funciona** sin 404.
Una URL que no existe recibe `404.html`: arranca la app y la lleva a la portada.

### Después de publicar (una sola vez)
1. Verificar el sitio en [Google Search Console](https://search.google.com/search-console) y enviar `https://microunicesar.github.io/sitemap.xml`.
2. Comprobar la vista previa al compartir con el [depurador de Facebook](https://developers.facebook.com/tools/debug/).
3. Reemplazar la imagen de Open Graph por una de 1200×630 (ver `docs/CONTENIDO_PENDIENTE.md`).

## Solución de problemas

| Síntoma | Causa y solución |
|---|---|
| `npm ci` falla con `ERESOLVE` | Las versiones de `@angular/ssr` y `@angular/platform-server` están **fijas** a propósito (un rango permitiría 20.3.x, que exige un `@angular/core` distinto). No las actualices por separado: actualiza todo Angular junto. |
| El build falla en `postbuild` | El mensaje dice qué ruta y qué problema (poco texto, falta `<h1>`, `TODO_CONTENIDO` visible…). Corrige eso y vuelve a compilar. |
| El build "pasa" pero las páginas salen vacías | Falta `provideHttpClient(withFetch())` en `app.config.ts`. `postbuild` lo detecta. |
| Una página nueva no aparece en el sitemap | Está marcada `ready: false` en `site-map.ts` o su ruta no está en `app.routes.server.ts`. |
| `ReferenceError: document is not defined` al compilar | Código que usa `window`/`document` fuera de `afterNextRender`. Usa el token `DOCUMENT`. |
| Puerto 4200 ocupado | `npm start -- --port 4300` |
| `npm test` no termina | Es el modo *watch*. Usa `npx ng test --watch=false --browsers=ChromeHeadless`. |

## Licencia

MIT. Ver el archivo `LICENSE`.
