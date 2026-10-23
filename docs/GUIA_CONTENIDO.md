# Guía de contenido

Cómo agregar o cambiar información del sitio **sin programar**. Todo el contenido son archivos de texto (JSON) dentro
del repositorio; no hay panel de administración ni base de datos.

**En esta guía:** [Antes de empezar](#antes-de-empezar) · [Docente](#1-agregar-un-docente) ·
[Grupo](#2-agregar-un-grupo-de-investigación) · [Proyecto](#3-agregar-un-proyecto) · [Noticia](#4-agregar-una-noticia) ·
[Recurso](#5-agregar-un-recurso) · [Traducción](#6-agregar-o-corregir-una-traducción) ·
[Imágenes](#7-imágenes) · [Comprobar y publicar](#8-comprobar-y-publicar) · [Errores frecuentes](#9-errores-frecuentes)

---

## Antes de empezar

### Dónde está cada cosa

| Qué | Archivo (dentro de `src/assets/`) |
|---|---|
| Docentes, estudiantes, personal y autoridades | `data/people.json` |
| Grupos de investigación | `data/research-groups.json` |
| Labs y semilleros | `data/labs.json` |
| Líneas de investigación | `data/research-lines.json` |
| Proyectos | `data/projects.json` |
| Publicaciones | `data/publications.json` |
| Noticias | `data/news.json` |
| Eventos | `data/events.json` |
| Recursos y formatos para estudiantes | `data/resources.json` |
| Opciones de grado | `data/graduation-options.json` |
| Preguntas frecuentes | `data/faqs.json` |
| Textos de los botones, menús y títulos | `i18n/es.json` y `i18n/en.json` |
| Fotos e imágenes | `images/` |

Para editar usa cualquier editor de texto (VS Code, IntelliJ, el editor de GitHub…). Si el archivo tiene un error de
escritura el editor lo marca en rojo.

### Reglas que valen para todos los archivos

1. **Cada dato en dos idiomas.** Los textos se escriben así: `{ "es": "Texto en español", "en": "Text in English" }`.
2. **Un dato que no tienes se borra o se marca `TODO_CONTENIDO`; nunca se inventa.** Lo que falta (o dice `TODO_CONTENIDO`)
   **no se muestra** en la web: la sección simplemente no aparece. Así nunca se ve texto de relleno.
3. **Todavía no tienes la traducción:** pon el texto en español y en `"en"` escribe `"TODO_TRADUCCION"`. La web mostrará
   el español mientras tanto (y `npm run i18n:check` te lo recordará).
4. **El `id` identifica el registro y forma su dirección web.** Va en minúsculas, sin tildes ni espacios, con guiones
   (`maria-perez-lopez`). **No se repite y no se cambia** después de publicar (cambiarlo rompe los enlaces).
5. **Las listas separan cada elemento con coma, pero sin coma después del último.** Esa coma sobrante o faltante es el
   error más común (ver [Errores frecuentes](#9-errores-frecuentes)).
6. **Párrafos:** dentro de un texto largo, deja **una línea en blanco** (escribe `\n\n`) entre un párrafo y otro. Un solo
   salto de línea no se ve.
7. Los **enlaces** se escriben completos, empezando por `https://`.

---

## 1. Agregar un docente

1. Abre `data/people.template.json`. Es una plantilla con **todos** los campos posibles (la web **no** la lee).
2. Copia el bloque completo (de `{` a `}`) y pégalo al final de la lista en `data/people.json`, con una coma después del bloque anterior.
3. Reemplaza **todos** los valores que dicen `PLANTILLA` y **borra las líneas de los campos que no tengas**.
4. Si hay foto, cópiala a `images/people/` y escribe su nombre en `photo` (ver [Imágenes](#7-imágenes)).
5. [Comprueba](#8-comprobar-y-publicar) y revisa `/people/faculty` y la ficha `/people/faculty/<id>`.

### Qué significa cada campo

| Campo | ¿Obligatorio? | Qué poner |
|---|---|---|
| `id` | Sí | `nombre-apellido-apellido`. Es la dirección de la ficha (`/people/faculty/maria-perez-lopez`). |
| `fullName` | Sí | Nombre completo como debe verse. |
| `role` | Sí | **Cargo / categoría** (es y en): Profesor asistente / Assistant Professor. Se ve como "Categoría" en la ficha. |
| `category` | Sí | `faculty` (docente), `student` (estudiante), `staff` (personal de apoyo), `alumni` (egresado) o `admin` (autoridad). **Solo los docentes tienen ficha propia.** Las autoridades (`admin`) salen en el panel "Administración" del listado de docentes, en el orden en que están en el archivo. |
| `email` | No | Correo institucional. |
| `phone` | No | Teléfono tal como debe verse: `+57 605 584 5555`. |
| `photo` | No | Nombre del archivo en `images/people/` (`maria-perez-lopez.jpg`). |
| `summary` | Recomendado | **Texto corto** (2–3 líneas, máx. ~250 caracteres) sobre en qué trabaja. Es lo que se ve en la **tarjeta del listado**. |
| `research` | Recomendado | **"Nuestra investigación"**: texto largo y detallado, en varios párrafos. Se ve en la **ficha**. |
| `groupIds` | Sí | Grupos a los que pertenece, por su id: `["pam", "magya"]`. Si ninguno: `[]`. Ids actuales: `pam`, `magya`, `cinbios`, `zoobios`, `biotecgen`. |
| `researchLines` | Sí | Líneas de trabajo (es/en), una por elemento. Si no hay: `[]`. |
| `links` | Sí | Perfiles: `orcid` (basta `0000-0002-1234-5678`), `googleScholar`, `cvlac`, `scopus`, `researchGate`, `website`. Solo los que existan; si ninguno: `{}`. |
| `education` | No | Formación, una línea por título (es/en). Se ve junto al contacto y los grupos. |
| `courses` | No | Cursos que dicta (es/en). |
| `featuredPublications` | No | Artículos destacados: `id`, `title`, `authors` (lista), `year`, `journal`, `doi` (solo el número, `10.1000/xyz123`). |
| `teamMembers` | No | Equipo: `name`, `role` (es/en) y `status` (`current` o `alumni`). Si la persona también está en `people.json`, agrega su `personId` y se enlaza a su ficha. |

> **Tarjeta vs. ficha:** `summary` (corto) y `research` (largo) son dos textos distintos. La tarjeta no usa `research`:
> si falta `summary`, la tarjeta no muestra descripción.

### Relación con grupos y labs
- Al poner un id en `groupIds`, la persona aparece en la página de ese grupo y el grupo en su ficha. También funciona al
  revés: si el grupo la lista como `leaderId` o en `memberIds`, aparece el grupo en su ficha.
- Un lab (`labs.json`) enlaza a su docente responsable con `piId` (el `id` del docente).

### Ejemplo mínimo (datos ficticios)
```json
{
  "id": "maria-perez-lopez",
  "fullName": "María Pérez López",
  "role": { "es": "Profesora asociada", "en": "Associate Professor" },
  "category": "faculty",
  "email": "mperez@example.org",
  "groupIds": ["pam"],
  "researchLines": [],
  "summary": { "es": "Estudia hongos del suelo.", "en": "Studies soil fungi." },
  "research": {
    "es": "Primer párrafo.\n\nSegundo párrafo.",
    "en": "First paragraph.\n\nSecond paragraph."
  },
  "links": {}
}
```

---

## 2. Agregar un grupo de investigación

Edita `data/research-groups.json` y agrega un bloque al final de la lista (copia uno existente como modelo).

| Campo | Qué poner |
|---|---|
| `id` | Corto, minúsculas: `pam`. Forma la dirección `/research/groups/pam`. |
| `abr` | Siglas: `PAM`. |
| `name` | Nombre completo (es/en). |
| `image` | Nombre del archivo en `images/research/` (`group_slide_pam.webp`). Imagen ancha (ver [Imágenes](#7-imágenes)). |
| `gruplac` | Enlace al GrupLAC de MinCiencias. |
| `category` | Categoría del grupo (es/en): "B - MinCiencias…". |
| `briefDescription` | Descripción corta (es/en): se ve en la tarjeta. |
| `description` | Descripción completa (es/en). |
| `researchLines` | Líneas del grupo (es/en), una por elemento. |
| `leaderId` | `id` de la persona líder (debe estar en `people.json`). Opcional. |
| `memberIds` | Lista de `id` de los integrantes: `["maria-perez-lopez"]`. Si ninguno: `[]`. |
| `projectIds` | Ids de sus proyectos (de `projects.json`). Si ninguno: `[]`. |
| `publicationIds` | Ids de sus publicaciones (de `publications.json`). Si ninguna: `[]`. |
| `contact` | Correo de contacto del grupo. Opcional. |

La página del grupo, su tarjeta en `/research/groups` y su ruta prerenderizada **aparecen solas**: no hay que registrar
nada más. Después agrega el id del grupo en `groupIds` de cada integrante.

> **Labs y semilleros:** van en `data/labs.json`. Un semillero es un lab con `"isSemillero": true`. Campos: `id`, `abr`,
> `name`, `description`, `researchLineIds` (ids de `research-lines.json`), `isSemillero`, `pi` (nombre del responsable),
> `piId`, `contact`, `projectIds`.

---

## 3. Agregar un proyecto

1. Agrega un bloque a `data/projects.json` (hoy la lista está vacía: `[]`):

```json
{
  "id": "proyecto-ejemplo",
  "title": { "es": "Título del proyecto", "en": "Project title" },
  "description": { "es": "Descripción.", "en": "Description." },
  "groupIds": ["pam"],
  "status": "active",
  "startYear": 2025
}
```
   `status` es `active` (en curso) o `finished` (terminado, con `endYear`). `startYear` y `endYear` son opcionales.
2. En `research-groups.json`, agrega el id del proyecto (`"proyecto-ejemplo"`) a `projectIds` de cada grupo
   participante: así sale en la página del grupo.
3. **Mostrar la sección en el menú.** Mientras no haya proyectos, `/research/projects` dice "Próximamente". Para
   activarla, pide a quien programa que cambie `ready: false` por `ready: true` en la línea de `/research/projects` de
   `src/app/shared/constants/site-map.ts` (un cambio de una palabra). Lo mismo aplica a Publicaciones, Estudiantes,
   Personal y Preguntas frecuentes cuando tengan contenido.

Las **publicaciones** funcionan igual con `data/publications.json` (`id`, `title`, `authors`, `year`, `journal`, `doi`,
`personIds`, `groupIds`, `labIds`).

---

## 4. Agregar una noticia

Agrega un bloque al final de `data/news.json`:

```json
{
  "id": 9,
  "title": { "es": "Título de la noticia", "en": "News title" },
  "summary": { "es": "Resumen de dos o tres líneas.", "en": "Two or three line summary." },
  "date": "2026-03-15",
  "image": "assets/images/news/mi-noticia.webp",
  "category": "research",
  "isHighlight": false
}
```

- `id`: un **número que no se repita** (usa el siguiente al más alto).
- `date`: **AAAA-MM-DD**. Las noticias se ordenan solas, la más reciente primero.
- `image`: ruta completa empezando por `assets/images/news/` (copia ahí la imagen, ver [Imágenes](#7-imágenes)).
- `isHighlight: true` hace que la noticia salga en "Destacados" de la portada. Es opcional.

**Eventos** (`data/events.json`): `id` (número), `title`, `date` (AAAA-MM-DD), `time` (`17:00`), `type` (`deadline`,
`seminar`, `evaluation` o `defense`), `description`, `location` (los tres últimos en es/en) y, opcionales,
`registration_link` y `more_info`.

---

## 5. Agregar un recurso

Los recursos son los formatos, reglamentos y enlaces de la página de Estudiantes (`/students/resources`). Agrega un
bloque a `data/resources.json`:

```json
{
  "id": "formato-ejemplo",
  "category": "grade-formats",
  "type": "pdf",
  "title": { "es": "Formato de ejemplo", "en": "Sample form" },
  "description": { "es": "Para qué sirve (opcional).", "en": "What it is for (optional)." },
  "url": "https://dominio.edu.co/archivo.pdf"
}
```

- `category` (una de estas): `grade-formats` (formatos de grado), `regulations` (reglamentos), `academic-calendar`
  (calendario), `lab-guides` (guías de laboratorio), `institutional-links` (enlaces institucionales).
- `type`: `pdf`, `doc`, `form` (formulario web) o `link`.
- `url`: dirección completa donde está el documento. `file` (opcional) es el nombre con el que se descarga.
- Todos los recursos salen en `/students/resources`. Para que además salga en la página de **opciones de grado**, su `id`
  debe estar en `resourceIds` de `graduation-options.json`; y para que una opción lo pida como documento, se escribe
  su `id` como `resourceId` dentro de `documents` de esa opción.

---

## 6. Agregar o corregir una traducción

Hay **dos lugares** donde viven los textos:

**a) Textos de la interfaz (menús, botones, títulos): `i18n/es.json` y `i18n/en.json`.**
Son listas `"clave": "texto"`. Para corregir un texto, busca la clave (o el texto) en `es.json` y cambia el valor; haz lo
mismo en `en.json` con la **misma clave**. Para un texto nuevo, la clave debe existir **en los dos archivos**: si falta
en uno, `npm run i18n:check` y `npm test` fallan.

**b) Textos del contenido (docentes, grupos, noticias…): dentro de cada JSON de `data/`,** como `{ "es": "…", "en": "…" }`.
Corrige el valor de `"en"` directamente en el registro.

- Si no tienes la traducción: `"en": "TODO_TRADUCCION"` (se mostrará el español).
- Las traducciones técnicas conviene que las revise alguien que domine el tema.
- **Corregir** un texto de la interfaz solo requiere editar los dos archivos. **Agregar** un texto de interfaz
  completamente nuevo (un botón o título nuevo) requiere a quien programa, que debe usar la clave en la página.

Para revisar que no falte nada: `npm run i18n:check`.

---

## 7. Imágenes

| Para qué | Carpeta | Formato y tamaño |
|---|---|---|
| Foto de docente | `images/people/` | JPG o WebP, cuadrada o casi (mín. 400 × 400 px), **menos de 300 KB**. Debe tener la **autorización** de la persona. |
| Banner de grupo | `images/research/` | **WebP**, ancho 2400 px como máximo, **menos de 250 KB**. |
| Imagen de noticia | `images/news/` | **WebP**, ancho 1200–1600 px, menos de 250 KB. |
| Imagen al compartir en redes (Open Graph) | `images/` + `src/site.config.json` | 1200 × 630 px. |

**Convertir y reducir una imagen** (Mac: `brew install webp`):
```bash
cwebp -q 80 -resize 1600 0 original.jpg -o nueva.webp
```
Las fotos de 5–12 MB que salen de una cámara o de una presentación **no se pueden subir tal cual**: hacen el sitio muy lento.

---

## 8. Comprobar y publicar

1. **Revisa que el sitio compile y que los datos estén bien:**
   ```bash
   npm run build
   ```
   Esto también revisa el HTML de cada página. Si algo está mal, el mensaje dice **qué ruta** y **qué problema**.
2. **Pruebas automáticas** (revisan ids repetidos, referencias a grupos/personas que no existen, traducciones):
   ```bash
   npx ng test --watch=false --browsers=ChromeHeadless
   ```
3. **Enlaces rotos:** `npm run links:check` (internos e imágenes) o `npm run links:check:external` (también los externos).
4. **Míralo en el navegador:** `npm start` y abre http://localhost:4200.
5. **Publica** con el flujo del [README](../README.md#despliegue): cambios en `develop` y, cuando estén aprobados, merge a
   `github-pages`.

---

## 9. Errores frecuentes

| Síntoma | Causa y solución |
|---|---|
| La web (o `npm start`) no carga una lista | Falta o sobra una **coma**, falta una comilla o una llave `}` en el JSON. Abre el archivo en un editor: marca la línea con el error. |
| La prueba dice `unique ids` o un id repetido | Dos registros con el mismo `id`. Cambia uno. |
| La prueba dice `-> grupo xxx` / `-> proyecto xxx` | Escribiste un id que no existe (`"pamm"` en vez de `"pam"`). Corrígelo. |
| La ficha del docente no aparece | `category` no es `faculty`, o el `id` tiene mayúsculas, tildes o espacios. |
| Una sección no aparece en la página | El dato está vacío o es `TODO_CONTENIDO`; es lo esperado. Pon el dato real. |
| El texto largo sale en un solo bloque | Separa los párrafos con una **línea en blanco** (`\n\n`), no con un solo salto. |
| La imagen no se ve | El nombre del archivo no coincide exactamente (mayúsculas, extensión) o no está en la carpeta correcta. `npm run links:check` la detecta. |
| `npm run build` falla con "TODO_CONTENIDO visible" | Un dato pendiente aparece en pantalla. Revisa el campo que se muestra sin pasar por la traducción. |
| Una página nueva no sale en el buscador | Pasa solo cuando se publica y Google la rastrea; envía el sitemap en Search Console. |

Cualquier duda sobre un campo que no está aquí: mira el modelo en `src/app/shared/models/<nombre>.model.ts`; cada campo
tiene un comentario que lo explica.
