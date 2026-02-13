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
- [Testing](#-testing)
- [Arquitectura](#-arquitectura)
- [Performance](#-performance)
- [Contribución](#-contribución)
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
npm run build           # Build optimizado

# Testing
npm test                # Ejecutar tests unitarios
npm test -- --code-coverage  # Tests con cobertura
```

---

## 🏗️ Build

### Build de Producción

```bash
npm run build -- --configuration production
```

**Métricas del Bundle:**
```
Bundle inicial:  ~424 KB ✅
Reducción:       55% vs versión inicial
Status:          Dentro del presupuesto (< 500 KB)
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

**Archivos:** `src/assets/i18n/`

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

## 🚀 Deployment

**GitHub Pages:** https://microunicesar.github.io/MicroUnicesar.github.io/

### Deploy Manual

```bash
npm run build -- --configuration production
# Los archivos están en dist/webpage-micro-unicesar/
```

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
