# 🔬 Micrositio - Programa de Microbiología UPC

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.1.0-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple?style=flat-square&logo=bootstrap)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

Sitio web oficial del programa de **Microbiología** de la **Universidad Popular del Cesar**.

[🌐 Ver Sitio](https://microunicesar.github.io/MicroUnicesar.github.io/) | [📐 Arquitectura](src/app/README.md) | [🐛 Reportar Bug](../../issues)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Instalación](#-instalación)
- [Desarrollo](#-desarrollo)
- [Build](#-build)
- [SEO y prerenderizado](#-seo-y-prerenderizado)
- [Testing](#-testing)
- [Arquitectura](#-arquitectura)
- [Performance](#-performance)
- [Contribución](#-contribución)
- [Deployment](#-deployment)
- [Licencia](#-licencia)

---

## 🔬 Descripción

Este micrositio proporciona información completa sobre el programa de Microbiología de la Universidad Popular del Cesar, incluyendo:

- 🏠 **Información General** - Presentación del programa
- 🔍 **Investigación** - Grupos y líneas de investigación
- 🎓 **Opciones de Grado** - Modalidades para obtener el título
- 📰 **Noticias** - Últimas novedades del programa
- 📅 **Eventos** - Calendario de eventos académicos
- 🧪 **Laboratorios** - Infraestructura de investigación
- 💚 **Bienestar** - Recursos de bienestar universitario

---

## ✨ Características

### 🌍 Multiidioma
- ✅ Español / English
- ✅ Cambio dinámico de idioma
- ✅ Persistencia en localStorage

### 🚀 Performance Optimizado
- ✅ Bundle inicial: ~424 KB (55% reducción)
- ✅ Lazy loading de rutas
- ✅ Tree-shaking automático
- ✅ Optimización de recursos

### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Bootstrap 5 responsive grid
- ✅ Diseño adaptativo

### ♿ Accesibilidad
- ✅ Semántica HTML5
- ✅ ARIA labels
- ✅ Navegación por teclado

### 🎨 UI/UX Moderna
- ✅ Bootstrap 5.3.7
- ✅ Bootstrap Icons
- ✅ Animaciones suaves
- ✅ Diseño limpio y profesional

---

## 🛠️ Tecnologías

### Core
```json
{
  "framework": "Angular 20.1.0",
  "language": "TypeScript 5.x",
  "runtime": "Node.js 20+",
  "packageManager": "npm"
}
```

### UI/UX
```json
{
  "styling": "SCSS + Bootstrap 5.3.7 (modular)",
  "icons": "Bootstrap Icons 1.13.1",
  "components": "@ng-bootstrap/ng-bootstrap 19.0.1"
}
```

### Internacionalización
```json
{
  "i18n": "@ngx-translate/core 17.0.0",
  "loader": "@ngx-translate/http-loader 17.0.0"
}
```

### Testing
```json
{
  "framework": "Jasmine 5.8.0",
  "runner": "Karma 6.4.0"
}
```

---

## 📦 Instalación

### Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** >= 20.x ([Descargar](https://nodejs.org/))
- **npm** >= 9.x (incluido con Node.js)

Verifica las versiones:
```bash
node --version   # v20.x.x o superior
npm --version    # 9.x.x o superior
```

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/MicroUnicesar/MicroUnicesar.github.io.git
cd webpage_micro
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Verificar instalación:**
```bash
npm run build
```

---

## 💻 Desarrollo

### Iniciar Servidor de Desarrollo

```bash
npm start
```

Abre tu navegador en `http://localhost:4200/`

La aplicación se recargará automáticamente cuando cambies archivos fuente.

### Comandos Disponibles

```bash
# Desarrollo
npm start                # Servidor de desarrollo
npm run watch           # Build en modo watch

# Producción
npm run build           # Prerenderiza el sitio, verifica el HTML y genera sitemap, robots y 404

# Verificación
npm run i18n:check      # Traducciones: claves es/en, textos fijos, datos sin traducir
npm run test:scripts    # Pruebas de los scripts de build (Node, sin navegador)
npm test                # Corre las dos anteriores y luego las pruebas unitarias (Karma)
npm test -- --watch=false --browsers=ChromeHeadless   # Una sola pasada (útil en CI y scripts)
```

---

## 🏗️ Build

### Build de Producción

```bash
npm run build
```

Compila, **prerenderiza todas las páginas a HTML estático** y ejecuta `scripts/postbuild.mjs`
(ver [SEO y prerenderizado](#-seo-y-prerenderizado)). El sitio queda en `dist/webpage-micro-unicesar/browser/`.

**Métricas del Bundle (octubre 2026):**
```
Bundle inicial:  ~709 KB (157 KB transferidos)
Presupuesto:     aviso a 750 KB, error a 1 MB
Páginas HTML:    62 rutas prerenderizadas (49 indexables)
```

---

## 🧪 Testing

```bash
# Todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Tests con coverage
npm test -- --code-coverage
```

---

## 📐 Arquitectura

El proyecto sigue una **arquitectura modular** basada en mejores prácticas:

```
src/app/
├── core/           # Servicios singleton
├── shared/         # Código reutilizable
└── features/       # Módulos funcionales (lazy loaded)
```

📚 **[Ver Documentación de Arquitectura Completa](src/app/README.md)**

---

## ⚡ Performance

### Optimizaciones Implementadas

```
Bundle Size:
  Antes:  954 KB ❌
  Ahora:  424 KB ✅
  Ahorro: 530 KB (55% reducción)
```

**Técnicas:**
- ✅ Bootstrap modular
- ✅ Lazy loading de rutas
- ✅ Tree-shaking automático
- ✅ Una sola librería de íconos

---

## 🌍 Internacionalización

**Idiomas soportados:**
- 🇪🇸 Español (por defecto)
- 🇬🇧 English

**Archivos:** `src/assets/i18n/` (interfaz) y `src/assets/data/*.json` (contenido, con campos `{ "es": "...", "en": "..." }`).

La primera visita sigue el idioma del navegador (español si no es inglés ni español); la elección se guarda en
`localStorage` y `<html lang>` se actualiza. `npm run i18n:check` falla si faltan claves o traducciones.
La traducción la hace `LanguageService` (no `ngx-translate`, que está configurado pero sin uso).

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

1. Fork del proyecto
2. Crear rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

**Code Review Checklist:**
- [ ] Código sigue convenciones
- [ ] Tests implementados
- [ ] Sin errores TypeScript
- [ ] Bundle size < 500 KB
- [ ] Documentación actualizada

---

## 📁 Estructura del Proyecto

```
webpage_micro/
├── src/app/
│   ├── core/              # Servicios singleton
│   ├── shared/            # Código reutilizable
│   ├── features/          # Features (lazy loaded)
│   └── README.md          # 📐 Arquitectura
├── src/assets/
│   ├── i18n/              # Traducciones
│   └── images/            # Imágenes
├── angular.json           # Config Angular
├── tsconfig.json          # Config TypeScript
└── README.md              # Este archivo
```

---

## 🔎 SEO y prerenderizado

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
   datos (`ng-localhost`), título repetido, sin descripción, `canonical` incorrecto o sin Open Graph, o si una
   redirección apunta a una página que no existe.
2. Genera `sitemap.xml` (solo páginas indexables, sin redirecciones ni "Próximamente") y `robots.txt`.
3. Crea `404.html` (el cascarón de la app) y `.nojekyll`.

**Limitación: el HTML prerenderizado está en español.** El idioma se elige en el navegador sobre la misma URL, así
que los buscadores solo ven la versión en español. Para indexar también el inglés habría que servir rutas por idioma
(`/en/...`), con `hreflang` entre ellas: es un cambio de enrutamiento mayor que no se hizo.
Tampoco hay `hreflang` ahora, porque no hay una URL distinta por idioma.

**Probar el resultado localmente** (sin JavaScript se ve lo que ve un buscador):
```bash
npm run build
npx http-server dist/webpage-micro-unicesar/browser   # o cualquier servidor estático
```

---

## 🚀 Deployment

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

---

## 🐛 Troubleshooting

### Error al instalar dependencias
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Puerto 4200 en uso
```bash
ng serve --port 4300
```

---

## 📞 Contacto

- **Sitio Web:** https://microunicesar.github.io/MicroUnicesar.github.io/
- **Issues:** [GitHub Issues](../../issues)
- **Documentación:** [Arquitectura](src/app/README.md)

---

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para detalles.

---

## 📝 Changelog

### [1.0.0] - Febrero 2026

#### ✨ Agregado
- Arquitectura modular (core/shared/features)
- Internacionalización (ES/EN)
- 8 Features principales
- Sistema de noticias y eventos

#### ⚡ Optimizado
- Bundle size -55% (954KB → 424KB)
- Lazy loading completo
- Bootstrap modular

---

<div align="center">

**⭐ Dale una estrella si este proyecto te fue útil ⭐**

Hecho con ❤️ por el Programa de Microbiología UPC

[⬆ Volver arriba](#-micrositio---programa-de-microbiología-upc)

</div>
