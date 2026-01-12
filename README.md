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

## Despliegue con Docker

### Prerrequisitos

- [Docker](https://www.docker.com/get-started) instalado (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (versión 2.0 o superior)

### Arquitectura del Contenedor

El proyecto utiliza una estrategia de **multi-stage build** para optimizar el tamaño de la imagen final:

1. **Etapa de Build** (`node:20-alpine`):
   - Instala las dependencias de Node.js
   - Compila la aplicación Angular para producción
   - Optimiza y minimiza los assets

2. **Etapa de Producción** (`nginx:1.25-alpine`):
   - Servidor web Nginx ligero
   - Solo contiene los archivos estáticos compilados
   - Configuración optimizada para aplicaciones SPA
   - Imagen final ~50MB (vs ~1GB con Node.js)

### Configuración

El proyecto incluye dos archivos principales para Docker:

- **`Dockerfile`**: Define la construcción de la imagen multi-stage
- **`docker-compose.yml`**: Orquesta el despliegue del contenedor
- **`nginx.conf`**: Configuración personalizada de Nginx para Angular

### Construcción y Ejecución

#### Opción 1: Usando Docker Compose (Recomendado)

```bash
# Construir y levantar el contenedor en segundo plano
docker-compose up -d --build

# Ver los logs del contenedor
docker-compose logs -f frontend

# Verificar el estado del contenedor
docker-compose ps

# Detener el contenedor
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

#### Opción 2: Usando Docker directamente

```bash
# Construir la imagen
docker build -t cat-breeds-frontend .

# Ejecutar el contenedor
docker run -d -p 4200:80 --name cat-breeds-frontend cat-breeds-frontend

# Ver logs
docker logs -f cat-breeds-frontend

# Detener y eliminar el contenedor
docker stop cat-breeds-frontend
docker rm cat-breeds-frontend
```

### Acceso a la Aplicación

Una vez que el contenedor esté en ejecución, la aplicación estará disponible en:

```
http://localhost:4200
```

### Configuración Avanzada

#### Variables de Entorno

Puedes personalizar el comportamiento del contenedor modificando el archivo `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - API_URL=http://api.ejemplo.com  # URL del backend
```

#### Puerto Personalizado

Para cambiar el puerto expuesto, modifica el mapeo en `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Ahora accesible en http://localhost:8080
```

#### Integración con Backend

Para conectar el frontend con el backend en Docker, añade el backend al mismo archivo `docker-compose.yml`:

```yaml
services:
  frontend:
    # ... configuración del frontend
    depends_on:
      - backend
    networks:
      - cat-breeds-network

  backend:
    image: cat-breeds-backend:latest
    container_name: cat-breeds-backend
    ports:
      - "3000:3000"
    networks:
      - cat-breeds-network

networks:
  cat-breeds-network:
    driver: bridge
```

### Healthcheck

El contenedor incluye un healthcheck automático que verifica cada 30 segundos si Nginx está respondiendo:

```bash
# Ver el estado de salud del contenedor
docker inspect --format='{{.State.Health.Status}}' cat-breeds-frontend
```

Estados posibles:
- `starting`: El contenedor acaba de iniciar
- `healthy`: El contenedor está funcionando correctamente
- `unhealthy`: El healthcheck ha fallado

### Solución de Problemas

#### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs frontend

# Verificar la configuración
docker-compose config
```

#### Error de puerto en uso

```bash
# En Windows (PowerShell)
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# En Linux/Mac
lsof -ti:4200 | xargs kill -9
```

#### Reconstruir desde cero

```bash
# Eliminar contenedores, imágenes y cache
docker-compose down
docker system prune -a
docker-compose up -d --build --force-recreate
```

#### Acceder al contenedor

```bash
# Abrir shell dentro del contenedor
docker exec -it cat-breeds-frontend sh

# Ver archivos servidos por Nginx
ls -la /usr/share/nginx/html

# Ver configuración de Nginx
cat /etc/nginx/nginx.conf
```

### Producción

#### Optimizaciones Recomendadas

1. **Usar Registry Privado**: Sube la imagen a un registry privado (Docker Hub, AWS ECR, etc.)

```bash
# Tag de la imagen
docker tag cat-breeds-frontend:latest tu-registry.com/cat-breeds-frontend:v1.0.0

# Push al registry
docker push tu-registry.com/cat-breeds-frontend:v1.0.0
```

2. **HTTPS con Certificados SSL**: Configura Nginx con certificados SSL/TLS

3. **Variables de Entorno**: Usa archivos `.env` para gestionar configuraciones sensibles

```bash
# Crear archivo .env
echo "API_URL=https://api.produccion.com" > .env

# Docker Compose automáticamente cargará las variables
docker-compose up -d
```

4. **Actualización sin Downtime**: Usa estrategias rolling update

```bash
# Actualizar sin detener el servicio
docker-compose up -d --no-deps --build frontend
```

#### Monitoreo

```bash
# Ver uso de recursos
docker stats cat-breeds-frontend

# Inspeccionar el contenedor
docker inspect cat-breeds-frontend

# Ver procesos en ejecución
docker top cat-breeds-frontend
```

### Seguridad

El Dockerfile implementa varias prácticas de seguridad:

- **Usuario no-root**: Nginx corre con usuario limitado
- **Imagen Alpine**: Base mínima que reduce superficie de ataque
- **Multi-stage build**: Solo incluye artefactos necesarios en producción
- **Healthcheck**: Detección temprana de problemas
- **Sin secrets en imagen**: Credenciales se pasan vía variables de entorno

### Limpieza

```bash
# Detener y eliminar el contenedor
docker-compose down

# Eliminar también la imagen
docker-compose down --rmi all

# Limpiar todo el sistema Docker (¡cuidado!)
docker system prune -a --volumes
```

## Recursos Adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
