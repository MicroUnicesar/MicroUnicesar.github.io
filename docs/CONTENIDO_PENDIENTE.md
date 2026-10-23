# Contenido pendiente

Registro de datos que **no existen en el repositorio** y que debe aportar el responsable del contenido.
La IA no los inventa: quedan como marcador `TODO_CONTENIDO` (o ausentes/vacíos cuando el dato es una referencia por id).

Marcadores:
- `TODO_CONTENIDO`: el dato falta. Las vistas lo ocultan (el pipe `localized` devuelve texto vacío).
- `TODO_TRADUCCION`: existe solo en español; la versión en inglés está pendiente. Mientras tanto la web muestra el español como respaldo.

## Fase 1 — Capa de datos

### Eliminado por ser contenido de plantilla

| Archivo | Campo | Qué se eliminó | Qué se necesita |
|---|---|---|---|
| `src/assets/data/research-groups.json` | `requirements` (los 5 grupos) | Texto idéntico en todos los grupos (biodiversidad, ecología, trabajo de campo, conservación), copiado de una plantilla; no corresponde a PAM, MAGYA, CINBIOS, BIOTECGEN ni ZOOBIOS. Se eliminó el campo del modelo y la sección "Requisitos de ingreso" del modal. | Confirmar si cada grupo tiene requisitos de ingreso reales y, si es así, enviarlos (es/en) para reincorporar el campo. |
| `src/assets/data/research-groups.json` | `projects` ("Proyecto 1" a "Proyecto 4", los 5 grupos) | Marcadores de posición. Se reemplazó por `projectIds: []` y se quitó la sección "Proyectos" del modal. | Proyectos reales de cada grupo: título, descripción (es/en), estado, años. |
| `src/assets/data/labs.json` | `projects` ("Project 1", "Project 2", los 15 labs/semilleros) | Marcadores de posición. Se reemplazó por `projectIds: []`. | Proyectos reales de cada semillero. |

### Marcado `TODO_CONTENIDO`

| Archivo | Campo | Detalle | Qué se necesita |
|---|---|---|---|
| `src/assets/data/labs.json` | `description` (los 15) | Todos tenían el mismo texto ("El uso de microorganismos como bioindicadores representa una herramienta"), copiado de la línea Bioindicadores y cortado a media frase. | Descripción real de cada laboratorio/semillero (es/en). |

### Campos nuevos del modelo `ResearchGroup`, sin datos todavía

Aplica a los 5 grupos en `src/assets/data/research-groups.json`:

| Campo | Estado | Qué se necesita |
|---|---|---|
| `leaderId` | Ausente (es una referencia a `Person`; no se puede poner un marcador sin romper la referencia) | Líder de cada grupo (se enlazará a su ficha en la Fase 4). |
| `memberIds` | `[]` | Miembros de cada grupo. |
| `projectIds` | `[]` | Ver "Eliminado" arriba. |
| `publicationIds` | `[]` | Publicaciones de cada grupo (título, autores, año, revista, DOI). |
| `contact` | Ausente | Correo de contacto de cada grupo. |

### Traducciones al inglés pendientes (`TODO_TRADUCCION`)

Todo texto de datos existe solo en español. El campo `en` contiene `TODO_TRADUCCION` en:

| Archivo | Campos |
|---|---|
| `src/assets/data/research-groups.json` | `name`, `category`, `briefDescription`, `description`, `researchLines[]` |
| `src/assets/data/research-lines.json` | `name`, `description` |
| `src/assets/data/labs.json` | `name` |
| `src/assets/data/graduation-options.json` | `options[].name/description`, `resources[].name`, `cicles[]` (fechas), `faqs[].question/answer/steps[]` |

Nota: las fechas de `cicles` se guardaron como texto en español ("15 de agosto de 2025") para no alterar lo que se ve hoy. Conviene pasarlas a fecha ISO y formatearlas por idioma en la Fase 7.

### Observaciones sobre datos existentes (sin cambiar)

- **Labs y semilleros:** cada docente (~30) tiene su lab; los semilleros son labs marcados con `isSemillero: true` y se muestran en la sección de semilleros. Los 15 registros actuales de `labs.json` eran los semilleros que ya listaba la web, por eso quedaron con `isSemillero: true` (confirmar). Faltan los labs de los demás docentes y definir cuáles de los actuales no son semillero.
- Cada lab incluye `pi` y `contact` (nombre y correo institucional). Son datos que ya estaban en el repositorio y se conservaron tal cual; confirmar que siguen vigentes y que se autoriza su publicación.
- La página de la sección de investigación afirma "Actualmente, el programa de Microbiología cuenta con 14 semilleros", pero `labs.json` tiene 15 registros. Confirmar la cifra (se dejó el texto como estaba).
- Artículos relevantes: cada persona tendrá los suyos (`Person.featuredPublications`) y también podrán asociarse a grupos y labs/semilleros (`Publication.groupIds/labIds`). Pendiente que el responsable los aporte; `research-manuscripts.ts` (sin uso) se eliminó.

## Fase 2 — Rutas y navegación

### Preguntas frecuentes generales (antes en "Más información")

| Archivo | Campo | Detalle | Qué se necesita |
|---|---|---|---|
| `src/assets/data/faqs.json` | `answer` (las 5 preguntas) | Las 5 preguntas eran reales ("¿En qué puede trabajar un microbiólogo?", requisitos de grado, inglés, Saber Pro, prácticas), pero **las respuestas eran copias de las FAQs de opciones de grado** y no respondían a la pregunta. Se movieron a `/students/faq` con la respuesta marcada `TODO_CONTENIDO`. | Respuesta real (es/en) de cada pregunta. La página muestra solo las preguntas con respuesta y, mientras no haya ninguna, el estado "Próximamente". Cuando haya respuestas, cambiar `ready: true` de `/students/faq` en `src/app/shared/constants/site-map.ts` para que aparezca en menú y landing. |

### Secciones sin contenido (muestran "Próximamente")

`/program/about`, `/research/groups`, `/research/lines`, `/research/projects`, `/research/publications`, `/people/faculty`, `/people/students`, `/people/staff`, `/students/resources`, `/students/faq`. Las rutas existen y no se enlazan desde el menú; en las landing aparecen como tarjetas "Próximamente" sin enlace. Cada una se activa con `ready: true` en `site-map.ts` cuando tenga contenido (Fases 3 a 6).

### Textos nuevos que requieren revisión humana

- Los textos de menú y de las tarjetas de las landing (`nav-*`, `desc-*`, `coming-soon-*`, `footer-*` en `src/assets/i18n/es.json` y `en.json`) los redactó la IA como descripciones genéricas de cada sección; no afirman datos. Revisar el tono.
- Traducción técnica: `nav-program-labs` → "Labs and research seedbeds" (término "semillero"; no existe equivalente exacto en inglés).
- Los nombres de página `nav-people-students` ("Estudiantes e investigadores jóvenes") y `nav-people-staff` ("Personal de apoyo") vienen del plan; confirmar que son los que quiere el programa.

### Datos de contacto en la página de contacto (sin cambios)

La página de contacto conserva tal cual el correo, horario, ubicación y enlaces a redes (`href="#"` en Facebook, X e Instagram: **enlaces sin destino real**). Confirmar los datos y aportar las URL de redes sociales.

## Fase 3 — Páginas de grupos de investigación

Las páginas de grupos solo muestran las secciones que tienen datos. Hoy cada grupo muestra: cabecera, descripción, líneas de investigación e información (categoría y GrupLAC). Para que aparezcan las demás secciones hace falta cargar datos:

| Archivo | Estado | Qué se necesita |
|---|---|---|
| `src/assets/data/people.json` | `[]` (vacío) | Personas (docentes, estudiantes, personal) con el modelo `Person`. Es la base de la Fase 4. Sin personas no se muestran líder ni miembros en los grupos. |
| `src/assets/data/projects.json` | `[]` (vacío) | Proyectos reales: título y descripción (es/en), grupos, estado, años. Se asocian a un grupo por `projectIds`. |
| `src/assets/data/publications.json` | `[]` (vacío) | Publicaciones: título, autores, año, revista, DOI, grupos. Se asocian a un grupo por `publicationIds`. |
| `research-groups.json` | `leaderId`, `memberIds`, `contact` sin datos | Ver Fase 1. Los `memberIds` deben ser ids de `people.json`; los que no existan se omiten. |

- `/research/projects` y `/research/publications` existen y muestran "Próximamente" mientras sus JSON estén vacíos; **no aparecen en el menú**. Al cargar datos, cambiar `ready: true` de ambas en `src/app/shared/constants/site-map.ts`.
- Las fichas de docente (`/people/faculty/:id`) no existen hasta la Fase 4. Los miembros con categoría `faculty` ya enlazan a esa ruta, así que no cargar docentes en `people.json` antes de esa fase.
- **Líneas de investigación:** ZOOBIOS no figura en ninguna línea de `research-lines.json` (su filtro en `/research/lines?group=zoobios` da vacío). Confirmar si debe asociarse a alguna.
- **Imágenes de los grupos:** `src/assets/images/research/group_slide_*.png` son banners de 4825×1536 que pesan entre 5 y 12 MB cada uno. Se usan como cabecera del detalle. Conviene reexportarlos (por ejemplo a 1600 px de ancho en WebP) antes de publicar. Se aborda en la Fase 9.
- **Traducciones:** nombre, categoría y descripción de cada grupo siguen en español en la versión en inglés (`TODO_TRADUCCION`, ver Fase 1).

## Fase 4 — Personas

### Qué se cargó y de dónde

`src/assets/data/people.json` tiene **15 docentes**. No se inventó ninguno: salen de los responsables (`pi`) de `labs.json`, que ya estaban publicados en la página de semilleros con su nombre y correo institucional. De cada uno solo existen **nombre completo y correo**; cada docente quedó vinculado a su lab con `piId`.

**Por confirmar:**
- Que se autoriza publicar el nombre y el correo de estas 15 personas en una ficha propia (ya se mostraban en la página de labs).
- Que los 15 son docentes (`category: faculty`). Se asumió por lo indicado: cada semillero es el lab de un docente.
- Si falta algún docente más (son unos 30 en total): agregar con `docs/GUIA_CONTENIDO.md`.

### Datos que faltan por cada docente (los 15)

| Campo | Estado |
|---|---|
| `role` (cargo, es/en) | `TODO_CONTENIDO` |
| `bio` (biografía, es/en) | `TODO_CONTENIDO` |
| `photo` y autorización de uso de imagen | Ausente |
| `groupIds` | `[]`. No se asignó ningún grupo: el repositorio no dice a cuál pertenece cada docente. Al completarlo, el docente aparece en la página del grupo y viceversa. |
| `researchLines`, `education`, `courses` | Ausentes |
| `links` (ORCID, Google Scholar, CvLAC, Scopus, ResearchGate, sitio web) | `{}` |
| `featuredPublications` | Ausentes |
| `teamMembers` (equipo actual y egresados) | Ausentes |

### Líderes y miembros de los grupos

`leaderId` y `memberIds` de `research-groups.json` siguen sin datos. Ahora se pueden completar con los ids de `people.json` (por ejemplo `pedro-fragozo-castilla`).

### Categorías sin personas

`/people/students` (estudiantes e investigadores jóvenes) y `/people/staff` (personal de apoyo) muestran "Próximamente" y no están en el menú: no hay datos de esas personas. Al cargar la primera persona de cada categoría, cambiar `ready: true` en `src/app/shared/constants/site-map.ts`.

### Otros

- `src/assets/data/people.template.json` es la plantilla (un único registro marcado `PLANTILLA`). La web no lo lee, pero al estar en `assets` se copia al sitio publicado y es accesible por su URL. Si no se quiere, moverlo fuera de `assets`.
- Fotos: carpeta `src/assets/images/people/` (vacía). Pedir fotos de buena calidad y la autorización de cada persona.

## Fase 5 — Estudiantes

### Recursos (`src/assets/data/resources.json`)

La página `/students/resources` solo muestra las categorías que tienen recursos. Hoy hay 9, todos con URL que **ya existían en el repositorio** (ninguna se inventó):

| Categoría | Estado | Recursos |
|---|---|---|
| Formatos de trabajo de grado | Con datos | Formato de solicitud, formato de anteproyecto, formato de trabajo final, formulario web de selección (antes en la página de opciones de grado) |
| Reglamentos | Con datos | Acuerdo 005 de 2025, Ruta global para la selección de grado (antes en opciones de grado) |
| Enlaces institucionales | Con datos | Universidad Popular del Cesar, información general del programa, inscripciones (los tres enlaces de la cabecera del sitio) |
| **Calendario académico** | **Vacía, falta contenido** | URL real del calendario académico vigente (con título es/en) |
| **Guías de laboratorio** | **Vacía, falta contenido** | Guías de laboratorio: archivo o URL real, título (es/en), descripción |

Al agregar un recurso a esas categorías la sección aparece sola; no hay que tocar código. Formato de cada recurso: `id`, `category`, `type` (`pdf`, `doc`, `form` o `link`), `title` (es/en), `description` (opcional), `url`, `file` (opcional).

**Por confirmar:**
- La clasificación: "Ruta global para la selección de grado" se puso en *Reglamentos*, y el formulario web en *Formatos de trabajo de grado*.
- Los enlaces de SharePoint (`unicesareduco-my.sharepoint.com`) de los formatos son vínculos de descarga directa a una carpeta personal del comité (`comiteinvestigacionmicro`). Si esa carpeta cambia de permisos o dueño, los enlaces dejan de funcionar. Conviene alojarlos en un sitio institucional estable.
- Traducciones al inglés de los títulos (`TODO_TRADUCCION`, también los 3 enlaces institucionales).
- Los recursos de opciones de grado ahora viven en `resources.json` y esa página solo lista sus ids (`resourceIds`). Para agregar un recurso a esa página: crearlo en `resources.json` y añadir su id a `graduation-options.json`.

### Hub /students

- Tarjetas: Opciones de grado, Bienestar, Recursos y Semilleros (enlaza a `/program/labs`, que ya tiene contenido real). Preguntas frecuentes sigue como "Próximamente" (ver Fase 2).
- **Movilidad y becas:** no hay contenido en el repositorio, así que no hay tarjeta ni página. Se necesita: descripción del programa de movilidad, convenios, convocatorias de becas, requisitos y contacto responsable.

### Texto fijo en español que sigue pendiente (Fase 7)

- **Bienestar:** su contenido (consejería, protocolo de maltrato y acoso, representante estudiantil, Saber Pro, procesos y formatos) está escrito directamente en `wellness.component.ts` y solo existe en español. Falta moverlo a JSON bilingüe y traducirlo. No tiene enlaces ni contactos reales: confirmar si deben agregarse (por ejemplo, el correo o la oficina de Bienestar Universitario).
- Los modales de opciones de grado (`graduation-option-modal.html`) y los títulos de la página siguen en español fijo.

### Corregido

- `en.json`: "Estudy Microbiology" → "Study Microbiology" (error de ortografía en la cabecera).

## Fase 6 — Programa y portada

### Cifras y afirmaciones que DEBES CONFIRMAR (no se eliminaron ni se inventaron)

| Dónde | Texto actual | Qué se necesita |
|---|---|---|
| `src/assets/data/program.json` → `presentation[1]` (visible en `/program`) | "…en la ejecución de **más de 30 proyectos activos** en diversas áreas de la microbiología…" (antes en la portada) | Confirmar la cifra o dar el número real y su fecha de corte. Está marcada en el dato con `unconfirmed: ["más de 30 proyectos activos"]` y una prueba automática falla si el fragmento deja de coincidir con el texto. |
| `program.json` → `accreditation` (visible en `/program`) | "**Programa acreditado** con los más altos estándares de calidad educativa." (antes una tarjeta "Acreditación de Calidad" en la portada) | Confirmar que está acreditado y aportar: entidad que acredita, número y fecha de la resolución, vigencia. Marcado con `unconfirmed: ["acreditado"]`. |
| `src/app/features/research/pages/research.component.html` | "…cuenta con **14 semilleros**…" (texto fijo en `/research`) | `labs.json` tiene 15 registros. Confirmar la cifra. Pasa a datos en la Fase 7. |
| `program.json` → `presentation` | "proyectos con impacto a nivel **nacional e internacional**", "amplia colaboración con instituciones nacionales e internacionales", "cursos, talleres y seminarios" | Afirmaciones sin cifra que ya estaban en la portada. Confirmar y, si es posible, nombrar convenios o instituciones. |

### Página /program (`src/assets/data/program.json`)

Se muestra hoy: **presentación, áreas de especialización, acreditación y contacto** (todo con el texto que ya existía en la portada y en la página de contacto). Las secciones siguientes están en `TODO_CONTENIDO` y **no se muestran** hasta que haya contenido:

| Campo | Qué se necesita |
|---|---|
| `mission`, `vision` | Misión y visión del programa (es/en). |
| `curriculum.summary` y `curriculum.url` | Resumen del plan de estudios y/o enlace al documento oficial (malla curricular, créditos, duración, título que otorga). |
| `graduateProfile` | Perfil del egresado (es/en). |
| `accreditation` (detalle) | Ver la tabla de arriba. |
| `contact.email` | Es `microbiologia@unicesar.edu.co`, tomado de la página de contacto. Confirmar que es el correo del programa. |

- **Fecha de "Última actualización":** `lastUpdated` (21 de octubre de 2026) es la fecha de esta edición del contenido. **Hay que actualizarla a mano** cada vez que se cambie `program.json`.
- Todo texto de `program.json` está en español; el inglés es `TODO_TRADUCCION`.

### Impacto en la sociedad (`/program/impact`, `src/assets/data/impact.json`)

La página existe y aparece en el menú Programa, como se pidió, pero **no hay ningún contenido en el repositorio** (`impact.json` está vacío) y muestra "Próximamente". Se necesita cada iniciativa de extensión / proyección social: `id`, `title` y `description` (es/en), imagen opcional (archivo en `src/assets/images/impact/`) y `url` opcional. Al cargar la primera, la página se llena sola. Si se prefiere no mostrarla en el menú hasta tener contenido, poner `ready: false` en `site-map.ts`.

### Labs y semilleros: de /program a /research

Por indicación, labs y semilleros viven en **`/research/labs`** (Investigación), no en `/program/labs` como decía el plan. `/research-labs` y `/program/labs` redirigen allí. `/program/about` ya no existe como página aparte: es `/program` y redirige.

### Portada

- **Hero breve** + 4 bloques con imagen (Investigación, Personas, Estudiantes, Impacto en la sociedad) + destacados, noticias y eventos (se conservan). El texto largo y las áreas de especialización pasaron a `/program`.
- **Imágenes de los bloques:** no hay fotos nuevas. Se reutilizaron, recortadas y reducidas (44 a 92 KB cada una, en `src/assets/images/home/`), cuatro imágenes que ya estaban en el proyecto (`group_slide_biotecgen`, `group_slide_magya`, `group_slide_zoobios`, `img_semilleros`). **Confirmar que son adecuadas** o sustituirlas por fotos reales del programa, con autorización de uso de imagen de las personas que aparezcan. Son decorativas (`alt=""`).
- **Eventos vacíos:** la sección "Eventos" de la portada no muestra nada porque todos los eventos de `event.service.ts` son de 2025 y ya pasaron. Se necesitan eventos vigentes.
- **Noticias y eventos siguen en TypeScript:** sus títulos y resúmenes están escritos en `news.service.ts` y `event.service.ts`, solo en español. Pasan a JSON bilingüe en la Fase 7.
- **Peso de las fotos de noticias:** `news/international_conference.jpg` (2,4 MB), `new_lab.jpg` (750 KB) y `students.jpg` (390 KB) se cargan en la portada. Hay que reducirlas (Fase 9). `news/research.jpg` no existe (404).

## Fase 5B — Opciones de grado

Todo el contenido de las 8 páginas sale del modal original (histórico de git); no se agregó ningún requisito ni paso. Ver `docs/DIAGNOSTICO_GRADO.md`.

### Incoherencias del contenido original que debes revisar (se dejaron tal cual)

| Dónde | Qué pasa |
|---|---|
| `excelencia-academica` | La tarjeta dice "promedio igual o superior a **4.5**"; la descripción dice "promedio mínimo acumulado o general de **4.5**, sin haber perdido asignaturas"; pero el **requisito** dice "Promedio acumulado mínimo de **4.0**". Confirmar cuál es el correcto. |
| `productos-nuevo-conocimiento`, paso 1 | "Diligenciar el formulario de solicitud de opción de grado **para anteproyecto de trabajo**": parece copiado de Trabajo de grado. |
| `trabajos-investigativos`, pasos 1 y 2 | Igual que lo anterior, y el paso 2 dice "así como **el libro**, informe técnico…" (parece copiado de Productos). |
| `productos-nuevo-conocimiento`, paso 2 | Menciona "el libro, capítulo de libro, informe de patente o prototipo según sea el caso" (correcto), pero la mezcla con la plantilla de anteproyecto del paso 1. |
| `diplomado-actualizacion` | El párrafo principal estaba duplicado en el original. Se muestra una vez. |
| `pasantia-investigacion` | "centros de investigación regionales, nacionales **a** internacionales" (¿"o"?). |
| `trabajos-investigativos` | "reconocido por la comunidad **academia** nacional e internacional" (¿"académica"?). |
| Erratas en varias opciones | "capitúlo", "protipo", "estár", "Capitulo", "via", "asi". No se corrigieron para no alterar el texto oficial; se arreglan editando `src/assets/data/graduation-options.json`. |

### Enlaces de documentos a formatos (por confirmar)
Cuatro documentos enlazan al formato real que ya existía en `resources.json` (no se creó ninguna URL). La correspondencia la hizo la IA por el nombre; confirmar que es correcta:

| Documento de la opción | Enlaza a |
|---|---|
| "Formulario de solicitud de selección de opción de grado ante comité de investigación del programa" | `formato-solicitud-opcion-grado` |
| "Formulario web de solicitud de opción de grado" | `formulario-seleccion-opcion-grado` |
| "Anteproyecto de trabajo de grado (si aplica)" | `formato-anteproyecto` |
| "Trabajo de grado final (si aplica)" | `formato-trabajo-grado-final` |

Sin enlace (no hay URL en el repositorio): reporte de anti-plagio y de IA en Turnitin, informe técnico (pasantía, productos, trabajos investigativos), carta de aval, libro/patente/prototipo. Si existen formatos o guías, agregarlos a `resources.json` y poner su `resourceId` en el documento.

### Información que no existe (no se muestra)
Ninguna opción tiene hoy: **contacto propio**, responsable, costos o derechos pecuniarios (el Diplomado menciona "pago de los derechos pecuniarios" sin monto), duración típica de cada trámite, ni ejemplos o casos de éxito. Si se quieren mostrar, hay que aportarlos y agregar el campo al modelo.

### Cronograma desactualizado
Los 6 ciclos de `cicles` son de **agosto a noviembre de 2025** y ya pasaron. Hay que cargar los ciclos vigentes (fechas en texto, es/en) en `graduation-options.json`.

### Traducciones
Los 8 contenidos (títulos, descripciones, requisitos, documentos, pasos), las preguntas frecuentes y el cronograma tienen `"en": "TODO_TRADUCCION"` y se ven en español en la versión en inglés. El texto de interfaz (títulos de sección, procedimiento general, botones, título de pestaña y meta descripción) **sí** está traducido; revisar con una persona la traducción técnica (por ejemplo "Defensa" para "Sustentación", "Grado por promedio").

### Otros
- La meta descripción y el título por página son una primera versión (`SeoService`); la Fase 8 los amplía a Open Graph y canonical.
- El título de cada opción se usa tal cual como `<title>` y migas de pan.

## Fase 7 — Internacionalización

Estado: **no queda texto fijo en las plantillas ni `TODO_TRADUCCION` en `src/assets/data`**. Lo verifica `npm run i18n:check` (se ejecuta antes de `npm test`) y las pruebas de `src/app/i18n.spec.ts`. Las traducciones al inglés las redactó la IA: **requieren revisión humana**, sobre todo las técnicas y normativas.

### Traducciones que requieren revisión humana (prioridad alta)

| Dónde | Qué revisar |
|---|---|
| `graduation-options.json` (8 opciones, FAQ) | Texto reglamentario del Acuerdo 005 de 2025 traducido sin apoyo jurídico: "Sustentación" → *defense*; "jurados" → *examiners / examining panel*; "aval" → *endorsement*; "anteproyecto" → *degree project proposal*; "derechos pecuniarios" → *fees*; "opción de grado" → *graduation option*; "Grado por promedio" → *Graduation by grade point average*; "Pasantía" → *internship*; "Diplomado" → *diploma course*; "Comité de Investigación" → *Research Committee*. Conviene que quien conoce el acuerdo valide el inglés o indique la versión oficial. |
| `nav-research-labs`, `labs-title`, `nav-semilleros` | "Semillero de investigación" no tiene equivalente exacto: se usó *research seedbed* (con "semilleros" entre paréntesis en `desc-research-labs`). Confirmar el término o conservar "semillero". |
| `research-groups.json`, `labs.json` | Nombres de grupos y labs traducidos (p. ej. "Millennium Parasitology and Agroecology"). Los **nombres oficiales** y siglas (PAM, MAGYA, CINBIOS, BIOTECGEN, ZOOBIOS) no se tradujeron; confirmar si los grupos tienen nombre oficial en inglés. GERMINAR, BIOMOL, ONE HEALTH y SIBIMOL se dejaron igual. |
| `research-groups.json` → categorías | "Convocatoria 957 de 2024" → *Call 957 of 2024*. |
| `research-lines.json` | Textos largos de las 5 líneas; "Una sola salud" → *One Health*; "bioeconomía territorial" → *territorial bioeconomy*. |
| `program.json` | Presentación y áreas. Las cifras y la acreditación siguen **sin confirmar** (ver Fase 6): "more than 30 active projects", "accredited program". |
| `wellness.json` | Protocolo de maltrato, acoso y discriminación; "Oficina de Atención a la Comunidad" → *Community Care Office*; "Bienestar Universitario" → *Student Welfare*. Confirmar los nombres oficiales de las oficinas. |
| `resources.json` | Títulos de formatos y del "Acuerdo 005". |
| `news.json`, `events.json` | Traducción literal. Ver "Contenido de muestra" abajo. |

### Textos de interfaz (prioridad media)
`src/assets/i18n/en.json` contiene ~235 textos. Revisar el tono, en especial: `grade-step-*` (procedimiento general), `contact-*` (formulario y horarios) y `desc-*` (descripciones de sección). El texto `contact-hours-value` mantiene el formato "8:00 AM - 5:00 PM" del original en ambos idiomas.

### Cambios al contenido original hechos en esta fase
- Los 6 ciclos de grado pasaron de texto ("15 de agosto de 2025") a fecha ISO para formatearse por idioma; el contenido es el mismo.
- Eventos: las horas "05:00 PM" pasaron a `17:00`. En español se ven "5:00 p. m." y en inglés "5:00 PM".
- `research-lines.json`: se corrigieron dos palabras pegadas en la línea Bioindicadores ("herramientaeficiente", "dichasactividades"), que venían de una concatenación del código original.
- `en.json`: "Mail" → "Email", "Our Research Groups" (para "Explorar Grupos") → "Explore Groups", "Frequent Asked Questions" → "Frequently Asked Questions".
- La página de Labs tenía un botón "Más información" sin ninguna acción; ahora es un enlace a la ficha del responsable ("Ver ficha del responsable").
- Noticias: se descartó el campo `content` (texto de relleno en inglés como "Detailed content about…", que ninguna página mostraba).

### Contenido de muestra que parece falso (revisar antes de publicar)
- `news.json`: "Inicio de clases 2026-1" dice "inicia el ciclo académico **2025-5**"; fechas de 2024 y 2025; la noticia "Nueva Investigación Publicada" aparece **dos veces** idéntica (ids 4 y 8); `news/research.jpg` no existe (la imagen sale rota). Parece contenido de ejemplo: confirmar si son noticias reales.
- `events.json`: los eventos 4 a 7 son **idénticos** ("Sustentaciones de Grado", 16-abr-2026); el evento 3 usa el correo `comitedeinvestigacionmicro@` y los demás `comiteinvestigacionmicro@` (¿errata?); **todos son anteriores a hoy**, así que la página de eventos muestra "No hay eventos próximos".

### Aún en un solo idioma (a propósito)
- Nombres de personas, siglas, correos, URL y "DOI".
- Los enlaces a Facebook, X e Instagram de Contacto siguen sin destino (`href="#"`).
- `faqs.json`: las respuestas son `TODO_CONTENIDO` (no hay texto que traducir).
- `people.json`: cargo y biografía son `TODO_CONTENIDO`; al llenarlos hay que escribir `es` y `en`.

### Notas técnicas
- Los números se formatean con `es-CO` (separador de miles "." desde 4 cifras: `2.026`) y `en-US`. **Los años no deben pasar por el pipe `localizedNumber`.**
- `ngx-translate` está configurado en `app.config.ts` pero **ninguna parte de la app lo usa**: la traducción la hace `LanguageService` con `es.json` y `en.json`. Se dejó sin tocar; se puede retirar del proyecto.
- El idioma inicial sigue al navegador **sin guardarlo** hasta que la persona elige uno con el selector; entonces se guarda en `localStorage` (`language`).

## Ajustes de Investigación (resumen, líneas y banner)

### Más información para las líneas de investigación (`src/assets/data/research-lines.json`)
Cada línea tiene hoy solo **nombre, descripción, ícono y grupos**. Su página `/research/lines/:id` ya muestra, sin cargar nada más, los **grupos** y los **labs/semilleros** relacionados (se calculan solos desde `groupIds` y desde `researchLineIds` de cada lab). Para enriquecerla, el modelo acepta estos campos opcionales; cada sección aparece sola al llenarlos:

| Campo | Qué se necesita | Dónde |
|---|---|---|
| `keywords` | Palabras clave de la línea (es/en) | `research-lines.json` |
| `projectIds` | Ids de los proyectos reales de la línea | `research-lines.json` + `projects.json` (hoy vacío) |
| `publicationIds` | Ids de las publicaciones de la línea | `research-lines.json` + `publications.json` (hoy vacío) |

Si quieres otro tipo de dato (objetivos, justificación, imagen, responsables, convenios, resultados), dímelo y se agrega el campo al modelo; **no hay ninguno de esos datos en el repositorio**, así que no se inventó nada. Las 5 líneas están en las 5 en `TODO` de contenido: ninguna tiene aún palabras clave, proyectos ni publicaciones.

- **ZOOBIOS no figura en ninguna línea**: su filtro en `/research/lines?group=zoobios` da vacío. Confirmar si debe asociarse a alguna (ya estaba pendiente desde la Fase 3).
- Las tarjetas muestran un extracto de la descripción (5 líneas); la descripción completa está en la página de cada línea.

### Resumen de Investigación (`/research`)
- Banner de grupos arriba y, debajo, tarjetas a **Labs y semilleros**, **Líneas de investigación**, **Proyectos** y **Publicaciones** (las dos últimas "Próximamente" hasta tener datos). Los grupos no se repiten como tarjeta porque ya están en el banner.
- El texto sobre qué es un semillero (con la cifra **"14 semilleros"**, aún **sin confirmar**; `labs.json` tiene 15) se movió a `/research/labs`, bajo el título. Sigue pendiente confirmar esa cifra.

### Banner de grupos
- **Estaba roto**: su carrusel dependía del JS de Bootstrap, quitado en `ecd33ea`, así que solo se veía la primera diapositiva. Ahora usa el carrusel de `ng-bootstrap`: avanza solo cada 7 s (se pausa al pasar el mouse o enfocar), tiene flechas, indicadores y teclado.
- Cada diapositiva de grupo carga una **imagen PNG de 5 a 12 MB** (`group_slide_*.png`, 4825×1536) y son 6 en total (~49 MB). Se cargan de forma diferida (la 2ª en adelante solo al mostrarse), pero conviene reexportarlas (p. ej. 1600 px en WebP). Se aborda en la Fase 9.
- Las diapositivas usan `alt=""` porque el nombre del grupo ya está escrito en el texto de cada una.

### Imagen de la página de semilleros (`/research/labs`)
Se mostraba a su tamaño natural (1792×1792 px) porque el CSS de imágenes de Bootstrap no estaba importado. Se corrigió y se generó una versión liviana, `src/assets/images/research/semilleros_640.jpg` (640×480, 84 KB; la original pesaba 400 KB). **Confirmar que esa foto es adecuada** o sustituirla por una real de los semilleros, con autorización de uso de imagen. `img_semilleros.jpg` ya no se usa en ninguna página.

## Fase 8 — SEO, prerenderizado y despliegue

### Por confirmar o aportar
| Qué | Detalle |
|---|---|
| **URL del sitio** | Se usa `https://microunicesar.github.io` (la que responde hoy, con `<base href="/">`). Está en `src/site.config.json`; si el sitio se mueve a un dominio propio, es el único lugar que hay que cambiar (o definir `SITE_URL` en el build). |
| **Imagen para compartir (Open Graph)** | Hoy es `assets/images/home/research.jpg` (640×480, recorte de una foto del proyecto). Las redes recomiendan **1200×630 px**, que muestre el nombre del programa o su logo, y que tenga **autorización de uso de imagen**. Se cambia en `src/site.config.json` (`ogImage`). |
| **Textos de SEO** | `seo-home-description`, `seo-contact-description` y `seo-person-description` (en `es.json`/`en.json`) los redactó la IA como frases genéricas. Revisar el tono. |
| **Descripción de cada docente** | Mientras biografía y cargo sean `TODO_CONTENIDO`, la meta descripción de cada ficha es una frase genérica ("Docente del programa…"), idéntica en todas. Mejora sola al cargar la biografía. |
| **Search Console** | Verificar el sitio y enviar el sitemap (ver README, "Después de publicar"). Requiere una cuenta del programa. |

### Decisiones y limitaciones (no son pendientes de contenido)
- **El HTML prerenderizado está solo en español.** El idioma se elige en el navegador sobre la misma URL; los buscadores indexan la versión en español. Alternativa: rutas por idioma (`/en/…`) con `hreflang`; implica reestructurar el enrutamiento y el menú, y no se hizo.
- **Las páginas "Próximamente" salen con `noindex`** y fuera del `sitemap.xml` (Proyectos, Publicaciones, Estudiantes, Personal de apoyo, Preguntas frecuentes, Recursos sin datos). Se indexan solas cuando tengan contenido.
- **Noticias y eventos de muestra**: al estar en el sitemap y prerenderizados, los buscadores los verán. Ver la advertencia de la Fase 7 sobre su contenido (fechas de 2024-2025, duplicados).
- **La raíz `/` es ahora la portada** y `/home` redirige a `/` (antes `/` redirigía a `/home`): una página de redirección no sirve para las vistas previas al compartir.
- **ngx-translate** sigue configurado en `app.config.ts` y sin uso (la traducción la hace `LanguageService`). No interviene en el prerender. Se puede retirar del proyecto y de `package.json`.
- **Versiones**: `@angular/ssr` (20.1.5) y `@angular/platform-server` (20.1.6) van **fijadas** porque el rango `^20.1.0` permitiría 20.3.x, que exige `@angular/core` 20.3.x exacto. Se instalaron con `--legacy-peer-deps` solo para evitar que npm intentara subir `@angular/router` a 20.3. Al actualizar Angular, actualizar todos los paquetes `@angular/*` a la vez.
- **Node**: Angular 20.1 pide Node `^20.19`, `^22.12` o `>=24`. El workflow actual usa `'20'` a secas; la propuesta usa 22.

### Corregido en esta fase (datos tuyos)
- `people.json`: el registro de Albert Tafur Rangel conservaba cuatro valores de la plantilla que se publicaban (foto `PLANTILLA-nombre-apellido.jpg`, sitio `https://example.org/PLANTILLA` y dos integrantes "PLANTILLA - …"). Se quitaron en un commit aparte (`d5e3521`). **Falta su foto real**: copiarla a `src/assets/images/people/` y poner su nombre en `photo`.

### Despliegue
Existe un workflow activo en la rama `github-pages` (no en `develop`). Es compatible con el prerenderizado, pero su paso "Copy index.html to 404.html" sobrescribe el `404.html` correcto. La versión mejorada está en `../.github` (**inactiva**; no se aplicó ni se tocó `github-pages`).

## Ajuste: listado y ficha de docentes
- people.json: el campo `bio` ahora se llama `research` ("Nuestra investigación"). Falta el texto real de los 16 docentes (Albert Tafur ya tiene el suyo; los otros 15 siguen en TODO_CONTENIDO).
- `summary` (texto corto, 2-3 líneas, es/en): lo muestra la tarjeta del listado. `research` (texto largo): lo muestra la ficha del docente. Ambos pendientes en los 18 registros; la tarjeta no usa `research` de respaldo.
- Nuevo `phone` (opcional) por docente, p. ej. "+57 605 584 5555". Ninguno está cargado.
- "Categoría" en la ficha usa `role` (hoy TODO_CONTENIDO en 15 de 16 docentes).

## Fase 9 — Calidad y entrega
- **Fotos de las autoridades** (Aura Parada Castro, Yesid Acevedo Duran): copiar a `src/assets/images/people/` y poner `photo` en `people.json`.
- **Imágenes del equipo sin uso** en `src/assets/images/news/` (`destacado_1/2/3.jpg`): confirmar si se usan o se retiran.
- **Imagen de la noticia 4** (`news.json`): apunta a `home/research.jpg` porque `news/research.jpg` no existía; subir la imagen real.
- **Enlaces externos sin verificar** (bloquean a los robots): ResearchGate y Scopus de Albert Tafur; abrirlos a mano una vez.
- **Contenido que aún no se ve** (marcado `TODO_CONTENIDO`; el build garantiza que no aparece): docentes (15 de 16 sin cargo, `research` ni `summary`), 15 labs sin descripción, 5 preguntas frecuentes sin respuesta, 4 apartados del programa.
- **Noticias y eventos** son de ejemplo (fechas y textos de plantilla): reemplazar por reales.
- **Decisiones técnicas abiertas** (ver `docs/INFORME_FINAL.md`): actualizar Angular a 20.3.x, quitar dependencias sin uso, aplicar el workflow de despliegue propuesto, rutas `/en/...`.
