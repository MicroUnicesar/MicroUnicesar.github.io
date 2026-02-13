# 📐 Arquitectura del Proyecto - Microbiología UPC

> Documentación técnica de la arquitectura y estructura del proyecto Angular

**Versión:** 1.0.0  
**Angular:** 20.1.0  
**Última actualización:** Febrero 2026

---

## 📋 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Estructura de Carpetas](#-estructura-de-carpetas)
3. [Capas de la Arquitectura](#-capas-de-la-arquitectura)
4. [Convenciones y Estándares](#-convenciones-y-estándares)
5. [Patrones de Diseño](#-patrones-de-diseño)
6. [Gestión de Estado](#-gestión-de-estado)
7. [Routing y Navegación](#-routing-y-navegación)
8. [Internacionalización](#-internacionalización)
9. [Guía de Desarrollo](#-guía-de-desarrollo)
10. [Performance y Optimización](#-performance-y-optimización)

---

## 🎯 Visión General

Este proyecto implementa una **arquitectura modular y escalable** basada en las mejores prácticas de Angular, siguiendo los principios de:

- **Separation of Concerns** - Separación clara de responsabilidades
- **DRY (Don't Repeat Yourself)** - Código reutilizable
- **SOLID Principles** - Principios de diseño orientado a objetos
- **Feature-Based Structure** - Organización por funcionalidades
- **Lazy Loading** - Carga diferida de módulos para mejor performance

### Tecnologías Principales

```json
{
  "framework": "Angular 20.1.0",
  "language": "TypeScript (strict mode)",
  "styling": "SCSS + Bootstrap 5.3.7 (modular)",
  "icons": "Bootstrap Icons 1.13.1",
  "ui": "@ng-bootstrap/ng-bootstrap 19.0.1",
  "i18n": "@ngx-translate 17.0.0"
}
```

---

## 📁 Estructura de Carpetas

```
src/app/
│
├── core/                          # Singleton services, infraestructura global
│   └── services/                  # Servicios fundamentales de la aplicación
│       ├── contact.service.ts     # Gestión de contactos
│       └── language.service.ts    # Gestión de idiomas (i18n)
│
├── shared/                        # Código compartido y reutilizable
│   ├── components/                # Componentes UI reutilizables
│   │   ├── header/                # Header de la aplicación
│   │   ├── footer/                # Footer de la aplicación
│   │   └── navigation/            # Barra de navegación
│   │
│   ├── constants/                 # Constantes de la aplicación
│   │   └── app.constants.ts       # Valores de configuración centralizados
│   │
│   ├── models/                    # Interfaces y tipos de datos
│   │   ├── event.model.ts         # Modelo de eventos
│   │   ├── news.model.ts          # Modelo de noticias
│   │   ├── research-*.model.ts    # Modelos de investigación
│   │   └── graduation-*.model.ts  # Modelos de opciones de grado
│   │
│   ├── pipes/                     # Pipes personalizados
│   │   └── translate-pipe.ts      # Pipe para traducciones
│   │
│   ├── services/                  # Servicios compartidos entre features
│   │   ├── event.service.ts       # Gestión de eventos
│   │   ├── news.service.ts        # Gestión de noticias
│   │   ├── research.service.ts    # Gestión de investigación
│   │   └── graduation-options.service.ts
│   │
│   └── utils/                     # Funciones utilitarias
│       └── date.util.ts           # Utilidades de fecha
│
└── features/                      # Módulos funcionales (features)
    ├── home/                      # Página principal
    │   └── pages/
    │       └── home.component.*
    │
    ├── research/                  # Feature de investigación
    │   ├── pages/
    │   │   └── research.component.*
    │   └── modals/
    │       └── research-group-modal.*
    │
    ├── graduation-option/         # Feature de opciones de grado
    │   ├── pages/
    │   │   └── graduation-option.component.*
    │   └── modals/
    │       └── graduation-option-modal.*
    │
    ├── news/                      # Feature de noticias
    │   └── pages/
    │       └── news.component.*
    │
    ├── events/                    # Feature de eventos
    │   └── pages/
    │       └── events.component.*
    │
    ├── labs/                      # Feature de laboratorios
    │   └── pages/
    │       └── labs.component.*
    │
    ├── wellness/                  # Feature de bienestar
    │   └── pages/
    │       └── wellness.component.*
    │
    └── more-info/                 # Información adicional
        └── pages/
            └── more-info.component.*
```

---

## 🏗️ Capas de la Arquitectura

### 1. **Core Layer** 🔵

**Propósito:** Servicios singleton que se cargan una sola vez en la aplicación.

**Características:**
- Servicios con `providedIn: 'root'`
- Infraestructura fundamental de la app
- No tienen dependencias de features
- Se cargan al inicio de la aplicación

**Servicios Core:**

```typescript
// language.service.ts - Gestión global de idiomas
@Injectable({ providedIn: 'root' })
export class LanguageService {
  // Maneja traducciones, localStorage, cambio de idioma
}

// contact.service.ts - Gestión de contactos
@Injectable({ providedIn: 'root' })
export class ContactService {
  // Maneja formularios de contacto, emails
}
```

**Cuándo usar Core:**
- ✅ Servicios que se usan en toda la app
- ✅ Autenticación (si se implementa)
- ✅ Guards globales
- ✅ Interceptors HTTP
- ❌ Servicios específicos de un feature

---

### 2. **Shared Layer** 🟢

**Propósito:** Código reutilizable compartido entre múltiples features.

**Componentes Compartidos:**
```typescript
// Header, Footer, Navigation
// Usados por múltiples features o en el layout principal
```

**Servicios Compartidos:**
```typescript
// Services que proveen datos a múltiples features
export class NewsService {
  getLatestNews(count: number): Observable<News[]> { }
  getAllNews(): Observable<News[]> { }
}
```

**Modelos:**
```typescript
// Interfaces de datos compartidas
export interface News {
  id: string;
  title: string;
  date: Date;
  // ...
}
```

**Constantes:**
```typescript
// app.constants.ts
export const APP_CONSTANTS = {
  PAGINATION: {
    LATEST_NEWS_COUNT: 6,
    EVENTS_PER_PAGE: 6,
    LABS_PER_PAGE: 5
  },
  LANGUAGES: {
    DEFAULT: 'es',
    AVAILABLE: ['es', 'en']
  },
  STORAGE_KEYS: {
    LANGUAGE: 'language'
  }
};
```

**Cuándo usar Shared:**
- ✅ Componentes UI usados en múltiples features
- ✅ Servicios de datos compartidos
- ✅ Pipes personalizados
- ✅ Modelos de datos
- ✅ Constantes y configuración
- ❌ Lógica específica de un solo feature

---

### 3. **Features Layer** 🟡

**Propósito:** Módulos funcionales independientes y autocontenidos.

**Estructura de un Feature:**
```
feature-name/
├── pages/              # Componentes principales del feature
│   └── feature.component.*
├── components/         # Componentes internos (opcional)
│   └── sub-component.*
├── modals/            # Modales específicos (opcional)
│   └── feature-modal.*
└── services/          # Servicios específicos (opcional)
    └── feature.service.ts
```

**Ejemplo: Research Feature**
```typescript
features/research/
├── pages/
│   └── research.component.ts      // Página principal
└── modals/
    └── research-group-modal.ts    // Modal específico de research
```

**Características de Features:**
- ✅ Lazy loaded (carga diferida)
- ✅ Autocontenidos (mínimas dependencias externas)
- ✅ Standalone components (Angular 20+)
- ✅ Rutas independientes

**Cuándo crear un Feature:**
- ✅ Funcionalidad completa y distinguible
- ✅ Puede cargarse de forma independiente
- ✅ Tiene su propia ruta
- ✅ Agrupa lógica relacionada

---

## 📝 Convenciones y Estándares

### Nomenclatura de Archivos

```bash
# Componentes
feature-name.component.ts
feature-name.component.html
feature-name.component.scss
feature-name.component.spec.ts

# Servicios
service-name.service.ts
service-name.service.spec.ts

# Modelos
model-name.model.ts

# Pipes
pipe-name.pipe.ts

# Constantes
category.constants.ts
```

### Nomenclatura de Clases

```typescript
// PascalCase para clases, interfaces, enums
export class NewsService { }
export interface News { }
export enum EventType { }

// camelCase para variables, métodos, propiedades
private newsService = inject(NewsService);
getLatestNews(): Observable<News[]> { }

// UPPER_SNAKE_CASE para constantes
export const APP_CONSTANTS = { };
const MAX_ITEMS = 10;
```

### Estructura de Componentes

```typescript
@Component({
  selector: 'app-feature-name',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterLink],
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.scss']
})
export class FeatureNameComponent implements OnInit, OnDestroy {
  // 1. Inyección de dependencias (preferir inject() sobre constructor)
  private readonly languageService = inject(LanguageService);
  private readonly dataService = inject(DataService);
  
  // 2. Propiedades públicas (usadas en template)
  items: Item[] = [];
  isLoading = false;
  
  // 3. Propiedades privadas
  private subscription?: Subscription;
  
  // 4. Constantes de clase
  private readonly ITEMS_PER_PAGE = APP_CONSTANTS.PAGINATION.ITEMS_PER_PAGE;
  
  // 5. Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  
  // 6. Métodos públicos
  loadMore(): void {
    // ...
  }
  
  // 7. Métodos privados
  private loadData(): void {
    // ...
  }
}
```

---

## 🎨 Patrones de Diseño

### 1. **Dependency Injection** (DI)

Usamos la función `inject()` de Angular 20+ en lugar de constructor injection:

```typescript
// ✅ Recomendado (Angular 16+)
export class MyComponent {
  private readonly myService = inject(MyService);
  private readonly router = inject(Router);
}

// ⚠️ Alternativa (aún válida)
export class MyComponent {
  constructor(
    private myService: MyService,
    private router: Router
  ) {}
}
```

### 2. **Observable Pattern**

Usamos RxJS para manejo reactivo de datos:

```typescript
// Service
export class NewsService {
  getLatestNews(count: number): Observable<News[]> {
    return of(this.news).pipe(
      map(news => news.slice(0, count))
    );
  }
}

// Component
ngOnInit(): void {
  this.newsService.getLatestNews(6).subscribe(news => {
    this.latestNews = news;
  });
}
```

### 3. **Singleton Pattern**

Servicios core son singleton por defecto:

```typescript
@Injectable({
  providedIn: 'root'  // Singleton global
})
export class LanguageService { }
```

### 4. **Repository Pattern**

Servicios actúan como repositorios de datos:

```typescript
export class ResearchService {
  private researchGroups: ResearchGroup[] = [ /* data */ ];
  
  getResearchGroups(): Observable<ResearchGroup[]> {
    return of(this.researchGroups);
  }
  
  getResearchGroupById(id: string): Observable<ResearchGroup | undefined> {
    return of(this.researchGroups.find(g => g.id === id));
  }
}
```

### 5. **Constants Pattern**

Centralización de valores de configuración:

```typescript
// shared/constants/app.constants.ts
export const APP_CONSTANTS = {
  PAGINATION: { /* ... */ },
  LANGUAGES: { /* ... */ }
};

// En componentes
import { APP_CONSTANTS } from '@shared/constants/app.constants';

eventsPerPage = APP_CONSTANTS.PAGINATION.EVENTS_PER_PAGE;
```

---

## 🔄 Gestión de Estado

### Estado Local (Component State)

```typescript
export class NewsComponent {
  // Estado local del componente
  allNews: News[] = [];
  displayedNews: News[] = [];
  currentPage = 1;
  hasMoreNews = true;
}
```

### Estado Compartido (Service State)

```typescript
@Injectable({ providedIn: 'root' })
export class LanguageService {
  // Estado compartido usando BehaviorSubject
  private currentLanguage = new BehaviorSubject<string>('es');
  public currentLanguage$ = this.currentLanguage.asObservable();
  
  setLanguage(lang: string): void {
    this.currentLanguage.next(lang);
    localStorage.setItem('language', lang);
  }
}
```

### Suscripción en Componentes

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private langSubscription?: Subscription;
  
  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLanguage$
      .subscribe(lang => {
        this.currentLanguage = lang;
      });
  }
  
  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }
}
```

---

## 🗺️ Routing y Navegación

### Configuración de Rutas

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'research',
    loadComponent: () => import('./features/research/pages/research.component')
      .then(m => m.ResearchComponent)
  },
  // ... más rutas
  { path: '**', redirectTo: '/home' }
];
```

### Lazy Loading

Todas las rutas usan `loadComponent()` para carga diferida:

**Beneficios:**
- ✅ Reduce bundle inicial
- ✅ Mejora tiempo de carga
- ✅ Carga bajo demanda
- ✅ Mejor performance

### Navegación Programática

```typescript
export class MyComponent {
  private router = inject(Router);
  
  navigateToResearch(): void {
    this.router.navigate(['/research']);
  }
  
  navigateWithParams(): void {
    this.router.navigate(['/news', newsId]);
  }
}
```

---

## 🌍 Internacionalización (i18n)

### Estructura

```
assets/i18n/
├── en.json    # Traducciones en inglés
└── es.json    # Traducciones en español
```

### Servicio de Idiomas

```typescript
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>('es');
  
  async setLanguage(lang: string): Promise<void> {
    await this.loadTranslations(lang);
    this.currentLanguage.next(lang);
    localStorage.setItem('language', lang);
  }
  
  translate(key: string): string {
    return this.translations[this.currentLanguage.value]?.[key] || key;
  }
}
```

### Uso en Templates

```html
<!-- Con pipe personalizado -->
<h1>{{ 'nav-home' | translate }}</h1>
<p>{{ 'welcome-message' | translate }}</p>

<!-- Con servicio directo -->
<button (click)="toggleLanguage()">
  {{ currentLanguage === 'es' ? 'English' : 'Español' }}
</button>
```

### Agregar Nuevas Traducciones

1. Agrega la clave en `assets/i18n/es.json`:
```json
{
  "new-key": "Nuevo texto en español"
}
```

2. Agrega la traducción en `assets/i18n/en.json`:
```json
{
  "new-key": "New text in English"
}
```

3. Usa en template:
```html
{{ 'new-key' | translate }}
```

---

## 👨‍💻 Guía de Desarrollo

### Crear un Nuevo Feature

1. **Crear estructura de carpetas:**
```bash
mkdir -p src/app/features/mi-feature/pages
```

2. **Generar componente:**
```bash
ng generate component features/mi-feature/pages/mi-feature --standalone
```

3. **Agregar ruta:**
```typescript
// app.routes.ts
{
  path: 'mi-feature',
  loadComponent: () => import('./features/mi-feature/pages/mi-feature.component')
    .then(m => m.MiFeatureComponent)
}
```

4. **Agregar al menú de navegación:**
```html
<!-- navigation.component.html -->
<a routerLink="/mi-feature" routerLinkActive="active">
  <i class="bi bi-icon"></i> {{ 'nav-mi-feature' | translate }}
</a>
```

### Crear un Nuevo Servicio

1. **Decidir ubicación:**
   - Core: servicios globales fundamentales
   - Shared: servicios compartidos entre features
   - Feature: servicios específicos de un feature

2. **Generar servicio:**
```bash
ng generate service shared/services/mi-servicio
```

3. **Implementar:**
```typescript
@Injectable({ providedIn: 'root' })
export class MiServicioService {
  private data: MiModelo[] = [];
  
  getData(): Observable<MiModelo[]> {
    return of(this.data);
  }
}
```

### Agregar Constantes

```typescript
// shared/constants/app.constants.ts
export const APP_CONSTANTS = {
  // ... existentes
  MI_CATEGORIA: {
    MI_CONSTANTE: 'valor'
  }
};
```

### Crear un Modelo

```typescript
// shared/models/mi-modelo.model.ts
export interface MiModelo {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: Date;
}
```

---

## ⚡ Performance y Optimización

### Bundle Optimization

**Estado Actual:**
- Bundle inicial: ~424 KB ✅
- Reducción: 55% vs versión inicial
- Status: Dentro del presupuesto (< 500 KB)

**Técnicas Aplicadas:**

1. **Lazy Loading:**
```typescript
// Todas las rutas usan loadComponent()
loadComponent: () => import('./feature')
```

2. **Bootstrap Modular:**
```scss
// Solo imports necesarios
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
// ... solo 16 módulos necesarios
```

3. **Una Librería de Íconos:**
```scss
// Solo Bootstrap Icons (eliminado FontAwesome)
@import 'bootstrap-icons/font/bootstrap-icons.css';
```

4. **Tree Shaking:**
- TypeScript strict mode habilitado
- Imports explícitos (no `import *`)
- `providedIn: 'root'` para services

### Best Practices

#### 1. Change Detection

```typescript
// Usar OnPush cuando sea posible
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

#### 2. Unsubscribe

```typescript
// Siempre limpiar suscripciones
ngOnDestroy(): void {
  this.subscription?.unsubscribe();
}
```

#### 3. TrackBy en *ngFor

```html
<!-- Usar trackBy para listas -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

```typescript
trackByFn(index: number, item: any): any {
  return item.id;
}
```

#### 4. Lazy Loading de Imágenes

```html
<img src="..." alt="..." loading="lazy">
```

---

## 🧪 Testing

### Estructura de Tests

Cada componente/servicio tiene su archivo `.spec.ts`:

```
feature.component.ts
feature.component.spec.ts    ← Tests unitarios
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Tests con coverage
npm test -- --code-coverage
```

### Ejemplo de Test

```typescript
describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load news on init', () => {
    component.ngOnInit();
    expect(component.allNews.length).toBeGreaterThan(0);
  });
});
```

---

## 📦 Build y Deployment

### Comandos Disponibles

```bash
# Desarrollo
npm start                    # Servidor de desarrollo (port 4200)
npm run watch               # Build en modo watch

# Producción
npm run build               # Build de producción optimizado
npm test                    # Ejecutar tests

# Análisis
ng build --stats-json       # Generar stats para análisis
npx webpack-bundle-analyzer dist/*/stats.json
```

### Build de Producción

El build de producción aplica:
- ✅ Minificación de código
- ✅ Tree-shaking
- ✅ Lazy loading
- ✅ Optimización de imágenes
- ✅ Hash de archivos para cache busting
- ✅ Compresión gzip

### Variables de Entorno

```typescript
// environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// environment.prod.ts (producción)
export const environment = {
  production: true,
  apiUrl: 'https://api.produccion.com'
};
```

---

## 🔐 Seguridad

### Best Practices Implementadas

1. **TypeScript Strict Mode:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

2. **Sanitización de HTML:**
Angular sanitiza automáticamente el HTML en templates.

3. **HTTPS Only:**
En producción, usar solo HTTPS.

4. **CSP Headers:**
Configurar Content Security Policy en el servidor.

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/)

### Style Guides

- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### Herramientas

- [Angular DevTools](https://angular.dev/tools/devtools)
- [Augury](https://augury.rangle.io/)
- [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

---

## 🤝 Contribución

### Workflow

1. Crear rama desde `main`:
```bash
git checkout -b feature/mi-feature
```

2. Desarrollar siguiendo convenciones

3. Ejecutar tests:
```bash
npm test
```

4. Crear Pull Request

### Code Review Checklist

- [ ] Sigue convenciones de nomenclatura
- [ ] Tests implementados
- [ ] Sin errores de TypeScript
- [ ] Bundle size dentro del límite
- [ ] Documentación actualizada
- [ ] Traducciones agregadas (es/en)

---

## 📞 Contacto y Soporte

Para preguntas sobre la arquitectura:
- Revisar este README
- Consultar documentación de Angular
- Contactar al equipo de desarrollo

---

## 📝 Changelog

### [1.0.0] - Febrero 2026

#### Added
- ✅ Arquitectura modular (core/shared/features)
- ✅ Constantes centralizadas
- ✅ Bootstrap modular
- ✅ Solo Bootstrap Icons
- ✅ Lazy loading completo
- ✅ Standalone components

#### Optimized
- ✅ Bundle size reducido 55% (954KB → 424KB)
- ✅ Eliminado FontAwesome
- ✅ Eliminado Bootstrap JS
- ✅ Bootstrap modular (16 módulos)

#### Fixed
- ✅ Consistencia en estructura de features
- ✅ Eliminados magic numbers
- ✅ Optimizaciones de performance

---

**Última actualización:** Febrero 12, 2026  
**Versión:** 1.0.0  
**Mantenido por:** Equipo de Desarrollo UPC Microbiología


