# Arquitectura de `src/app`

Guía para quien programe en el sitio. Para instalar, compilar y publicar ver el [README principal](../../README.md);
para cambiar contenido sin programar ver [docs/GUIA_CONTENIDO.md](../../docs/GUIA_CONTENIDO.md).

## Convenciones

- Angular 20, **componentes *standalone*** (sin `NgModule`), `inject()` en vez de constructores con parámetros,
  flujo de control nuevo (`@if`, `@for`, `@switch`) y señales (`signal`, `computed`, `input()`, `toSignal`).
- Los componentes nuevos usan `ChangeDetectionStrategy.OnPush`.
- **Ningún texto visible va escrito en una plantilla**: sale del diccionario (`translate`) o de un dato bilingüe
  (`localized`). `npm run i18n:check` falla si queda texto fijo.
- Las rutas y las páginas cargan **bajo demanda** (`loadComponent`).
- Nada que use `window` / `document` / `localStorage` sin protegerlo: el código también corre en Node al prerenderizar
  (usa `afterNextRender`, el token `DOCUMENT` o `isPlatformBrowser`).
- Bootstrap 5 + SCSS; no se agregan librerías de interfaz sin justificarlo.

## Carpetas

```
src/
├── site.config.json            URL del sitio e imagen Open Graph (SEO, sitemap)
├── main.ts / main.server.ts    Arranque en el navegador / en el prerender
├── styles.scss                 Bootstrap modular + estilos globales (colores, tarjetas, skip-link)
├── assets/
│   ├── data/                   TODO el contenido (JSON) — ver "Datos"
│   ├── i18n/{es,en}.json       Textos de la interfaz
│   └── images/                 Imágenes (WebP/JPG/SVG); fotos de docentes en images/people/
└── app/
    ├── app.component.ts        Marco de la página: encabezado, menú, migas, <main>, pie
    ├── app.config.ts           Proveedores: router, HttpClient(fetch), hidratación, idioma
    ├── app.config.server.ts    Lo mismo para el prerender
    ├── app.routes.ts           Rutas del navegador (con las redirecciones de URL antiguas)
    ├── app.routes.server.ts    Rutas a prerenderizar (lee los ids de los JSON)
    ├── core/services/          Servicios de toda la app (una sola instancia)
    ├── shared/                 Lo reutilizable
    │   ├── components/         header, navigation, footer, breadcrumb, person-card, list-filters, …
    │   ├── constants/          site-map.ts (mapa del sitio), app.constants.ts
    │   ├── models/             Interfaces TypeScript de los datos (+ pruebas de integridad)
    │   ├── pipes/              translate, localized, localized-date, localized-number
    │   ├── services/           Un servicio por archivo de datos (PeopleService, ResearchService, …)
    │   ├── utils/              Funciones puras (fechas, texto, SEO, migas, personas, …)
    │   └── testing/            Datos ficticios y ayudas para las pruebas
    └── features/               Una carpeta por sección del sitio
        ├── home/  contact/  news/  events/
        ├── program/            program, impact
        ├── research/           groups, labs, lines, projects, publications
        ├── people/             people-list, person-detail
        └── students/           graduation-options, wellness, resources, faq
```

Cada página vive en `features/<sección>/…/pages/` con su `.ts`, `.html`, `.scss` y `.spec.ts`.
Lo que usan dos o más secciones va en `shared/`; lo que es de una sola sección se queda en ella.

## Rutas

`app.routes.ts` define las URL del navegador; `shared/constants/site-map.ts` define **qué se muestra** en menú, páginas
de sección y pie. Para el listado completo de URL ver el [README principal](../../README.md#estructura-del-sitio-rutas).

- Las páginas de sección (`/people`, `/students`) usan `SectionLandingComponent`, que dibuja tarjetas a partir de
  `site-map.ts`.
- `PeopleListComponent` sirve `/people/faculty`, `/people/students` y `/people/staff`; la categoría y los títulos
  llegan por `data` de la ruta. Muestra tarjetas (2/3) y, al lado, búsqueda, filtro por grupo y el panel de
  administración (1/3).
- Una subsección con `ready: false` muestra `ComingSoonComponent` y sale con `noindex`.
- Las URL antiguas son redirecciones **absolutas** (con destino relativo, el prerender las rompe).

## Datos

Los datos son JSON en `src/assets/data/`. `DataLoaderService.load('<archivo>')` los pide por HTTP una sola vez y los
guarda en caché; cada `*Service` de `shared/services/` expone métodos tipados y la página los convierte en señales con
`toSignal`.

| Archivo | Modelo (`shared/models/`) | Servicio | Contenido |
|---|---|---|---|
| `people.json` | `person.model.ts` | `PeopleService` | Docentes, estudiantes, personal y autoridades (`admin`) |
| `research-groups.json` | `research-group.model.ts` | `ResearchService` | Grupos de investigación |
| `labs.json` | `lab.model.ts` | `ResearchService` | Labs; los semilleros tienen `isSemillero` |
| `research-lines.json` | `research-line.model.ts` | `ResearchService` | Líneas de investigación |
| `projects.json` | `project.model.ts` | `ProjectService` | Proyectos |
| `publications.json` | `publication.model.ts` | `PublicationService` | Publicaciones |
| `graduation-options.json` | `graduation-*.model.ts` | `GraduationOptionsService` | Opciones de grado, ciclos, preguntas |
| `resources.json` | `resource.model.ts` | `ResourcesService` | Formatos, reglamentos, enlaces |
| `wellness.json` | `wellness.model.ts` | `WellnessService` | Bienestar |
| `faqs.json` | `faq.model.ts` | `FaqService` | Preguntas frecuentes |
| `program.json` | `program.model.ts` | `ProgramService` | Presentación, misión, visión, perfil… |
| `impact.json` | `impact.model.ts` | `ProgramService` | Impacto del programa |
| `news.json` / `events.json` | `news.model.ts` / `event.model.ts` | `NewsService` / `EventService` | Noticias y eventos |
| `people.template.json` | — | — | Plantilla para copiar; **la web no la lee** |

**Relaciones:** se hacen por `id` (un docente en `groupIds` o un grupo con `memberIds`/`leaderId`; un lab con `piId`).
Las ven las dos direcciones y `data-integrity.spec.ts` comprueba que cada id exista.

**Texto bilingüe:** `LocalizedText = { es: string; en: string }`.
- `localize(text, lang)` (`shared/utils/localized.util.ts`) devuelve el idioma pedido; si la traducción falta o es
  `TODO_TRADUCCION`, usa el español; si el dato es `TODO_CONTENIDO`, devuelve `''` y **la vista oculta el bloque**.
- Una plantilla nunca debe mostrar una sección vacía: `@if (dato | localized) { … }`.

## Idiomas (i18n)

- `core/services/language.service.ts` carga `assets/i18n/{es,en}.json`, decide el idioma inicial
  (`resolveInitialLanguage`: lo guardado → el del navegador → español) y lo guarda en el navegador. En el servidor no
  toca el almacenamiento.
- `app.config.ts` espera los textos del idioma inicial antes de arrancar (`provideAppInitializer`) para no mostrar
  claves sueltas.
- En plantillas: `{{ 'clave' | translate }}` (diccionario) y `{{ dato | localized }}` (datos).
  Fechas y números: `localizedDate`, `localizedNumber`.
- `ngx-translate` está configurado en `app.config.ts` pero **no se usa**; se mantiene hasta decidir si se quita.

## SEO y prerenderizado

- `core/services/seo.service.ts`: título (`página | sitio`), descripción (máx. 155 caracteres), Open Graph, Twitter,
  `canonical`, `robots` y `og:locale`. Se reinicia en cada navegación y se reaplica al cambiar de idioma.
  `seo.set({ title, description })` en una página de detalle; `seo.noIndex()` en páginas sin contenido.
  Las páginas sin metadatos propios heredan los de `site-map.ts` (`defaultPageMeta`).
- `app.routes.server.ts` marca todo como `RenderMode.Prerender`; las rutas con `:id` obtienen sus parámetros de los
  JSON (`getPrerenderParams`).
- `scripts/postbuild.mjs` verifica el HTML generado y crea `sitemap.xml`, `robots.txt`, `404.html` y `.nojekyll`
  (detalles en el [README principal](../../README.md#seo-y-prerenderizado)).

## Pruebas

- `*.spec.ts` junto a cada archivo (Jasmine/Karma). Los datos de prueba son **ficticios** y viven en
  `shared/testing/` (`people.fixtures.ts`, `research.fixtures.ts`, …); `page-spec.helpers.ts` simula la carga de los JSON.
- `shared/models/data-integrity.spec.ts` lee los JSON **reales** y valida ids únicos, referencias cruzadas y categorías.
- `i18n.spec.ts` y `scripts/check-i18n.mjs` cubren la paridad es/en.
- `app.routes.spec.ts` comprueba que cada ruta y cada redirección existan.

## Cómo agregar…

**Una página nueva dentro de una sección**
1. Crea `features/<sección>/<nombre>/pages/<nombre>.component.ts` (*standalone*, `OnPush`).
2. Agrega la ruta en `app.routes.ts` (con `loadComponent`) y, si lleva `:id`, su `getPrerenderParams` en `app.routes.server.ts`.
3. Agrégala a `shared/constants/site-map.ts` (clave de título y descripción, ícono, `ready`) para que salga en el menú,
   la sección y el sitemap.
4. Agrega las claves de texto en `es.json` **y** `en.json`; llama a `inject(SeoService).set(...)` si necesita metadatos propios.
5. Escribe su `.spec.ts`. Compila: `postbuild` revisará que el HTML salga completo.

**Un campo nuevo en un dato** (p. ej. `phone` en las personas): campo opcional en el modelo → plantilla que lo muestra
solo si existe → actualizar `people.template.json` y `docs/GUIA_CONTENIDO.md` → fixtures de prueba.

**Una sección nueva de datos**: JSON en `assets/data/`, modelo en `shared/models/`, servicio en `shared/services/`
(usa `DataLoaderService`), y una prueba de integridad en `data-integrity.spec.ts`.
