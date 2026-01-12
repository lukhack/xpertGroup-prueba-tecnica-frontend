# Frontend - Aplicación de Razas de Gatos

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 20.2.1.

## Arquitectura

Esta aplicación sigue los principios de **Arquitectura Limpia (Clean Architecture)** con una clara separación de responsabilidades a través de múltiples capas:

### Estructura de Capas

```
src/app/
├── core/                    # Capa de lógica de negocio central
│   ├── guards/             # Protección de rutas (authGuard)
│   ├── interceptors/       # Interceptores HTTP (autenticación, manejo de errores)
│   └── services/           # Servicios de lógica de negocio (auth, breeds, images)
├── features/               # Módulos de funcionalidades (capa de presentación)
│   ├── auth/              # UI de autenticación (login, registro)
│   ├── dashboard/         # Dashboard principal con selección de razas
│   ├── search/            # Funcionalidad de búsqueda
│   └── profile/           # Gestión de perfil de usuario
├── shared/                # Recursos compartidos
│   ├── components/        # Componentes UI reutilizables (navbar)
│   ├── models/            # Modelos de dominio y DTOs
│   └── interfaces/        # Interfaces y contratos TypeScript
└── environments/          # Configuraciones específicas por entorno
```

### Patrones Arquitectónicos Clave

- **Componentes Standalone**: Arquitectura Angular moderna sin NgModules
- **Lazy Loading**: División de código a nivel de rutas para rendimiento óptimo
- **Inyección de Dependencias**: Servicios débilmente acoplados usando DI de Angular
- **Gestión de Estado Reactiva**: Angular Signals para flujo de datos reactivo
- **Programación Funcional**: Guards e interceptores usan enfoque funcional
- **Patrón Repository**: Los servicios actúan como repositorios para acceso a datos

### Aplicación de Principios SOLID

Este proyecto se adhiere a los principios SOLID para garantizar mantenibilidad, testabilidad y escalabilidad:

#### 1. Principio de Responsabilidad Única (SRP)
Cada clase/servicio tiene una única razón para cambiar:
- **AuthService** (`src/app/core/services/auth.service.ts`): Maneja únicamente la lógica de autenticación (login, registro, logout, gestión de tokens)
- **BreedsService** (`src/app/core/services/breeds.service.ts`): Gestiona únicamente las operaciones de datos de razas
- **ImagesService** (`src/app/core/services/images.service.ts`): Maneja únicamente la recuperación de imágenes
- **authInterceptor**: Responsable únicamente de añadir tokens de autenticación
- **errorInterceptor**: Maneja únicamente las respuestas de error HTTP

#### 2. Principio Abierto/Cerrado (OCP)
Los componentes y servicios están abiertos para extensión pero cerrados para modificación:
- **Interceptores**: Se pueden añadir nuevos interceptores a `provideHttpClient()` sin modificar los existentes
- **Guards**: Los nuevos guards pueden componerse con los existentes en la configuración de rutas
- **Servicios**: Usan interfaces e inyección de dependencias para permitir extender el comportamiento sin cambiar la lógica central
- **Componentes**: Usan `@Input()` y `@Output()` para extensibilidad

#### 3. Principio de Sustitución de Liskov (LSP)
Las implementaciones pueden sustituirse sin romper la funcionalidad:
- **HttpClient**: Puede reemplazarse con implementaciones mock en tests usando `HttpTestingController`
- **Servicios**: Los servicios inyectables pueden reemplazarse con implementaciones mock vía DI para testing
- **Guards**: Cualquier `CanActivateFn` puede sustituirse en la configuración de rutas

#### 4. Principio de Segregación de Interfaces (ISP)
Los clientes dependen solo de las interfaces que usan:
- **Modelos/Interfaces** (`src/app/shared/`): Interfaces específicas para diferentes estructuras de datos (User, Breed, Image)
- **Servicios**: Exponen solo los métodos necesarios a los componentes
- **Respuestas HTTP**: DTOs específicos para cada respuesta de endpoint API
- Los componentes importan solo los módulos específicos de Material que necesitan (no todo el bundle de Material)

#### 5. Principio de Inversión de Dependencias (DIP)
Los módulos de alto nivel no dependen de módulos de bajo nivel; ambos dependen de abstracciones:
- **Servicios**: Los componentes dependen de abstracciones de servicios vía DI, no de implementaciones concretas
- **HttpClient**: Los servicios dependen de la interfaz HttpClient de Angular, no de implementaciones HTTP directas
- **Guards**: Las rutas dependen de la interfaz `CanActivateFn`, no de implementaciones concretas de guards
- **Interceptores**: El pipeline HTTP depende de la interfaz `HttpInterceptorFn`

### Beneficios de Esta Arquitectura

- **Testabilidad**: Cada capa puede probarse independientemente con mocks
- **Mantenibilidad**: La separación clara hace que el código sea más fácil de entender y modificar
- **Escalabilidad**: Se pueden añadir nuevas funcionalidades sin afectar el código existente
- **Reutilización**: Los componentes y servicios compartidos pueden usarse en todas las funcionalidades
- **Seguridad de Tipos**: Las interfaces TypeScript garantizan el cumplimiento de contratos
- **Rendimiento**: El lazy loading reduce el tamaño del bundle inicial

## Servidor de Desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en ejecución, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques cualquiera de los archivos fuente.

## Generación de Código

Angular CLI incluye potentes herramientas de scaffolding de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component nombre-componente
```

Para una lista completa de esquemáticos disponibles (como `components`, `directives` o `pipes`), ejecuta:

```bash
ng generate --help
```

## Compilación

Para compilar el proyecto ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de compilación en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para rendimiento y velocidad.

## Ejecución de Pruebas Unitarias

Para ejecutar las pruebas unitarias con el test runner [Karma](https://karma-runner.github.io), usa el siguiente comando:

```bash
ng test
```

## Ejecución de Pruebas End-to-End

Para pruebas end-to-end (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no incluye un framework de testing end-to-end por defecto. Puedes elegir uno que se adapte a tus necesidades.

## Recursos Adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
