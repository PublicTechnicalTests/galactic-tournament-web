# Galactic Tournament Web

Aplicación web SPA desarrollada en Angular para visualizar y gestionar el torneo galáctico, incluyendo el dashboard principal, listado de especies y ranking de participantes.

## Descripción breve

Galactic Tournament Web es una interfaz frontend para explorar la información del torneo galáctico:

- Dashboard con simulación de torneo y combate.
- Gestión y visualización de especies.
- Ranking de participantes.

La app utiliza Angular 21, TypeScript y rutas lazy-loaded para organizar las funcionalidades por módulos.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 20 o superior
- npm 10 o superior
- Angular CLI 21 (se puede instalar con `npm install -g @angular/cli@21`)

Opcional:

- Docker y Docker Compose, si deseas ejecutar la aplicación en contenedor.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd galactic-tournament-web
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Ejecución

### Modo desarrollo

Inicia el servidor de desarrollo con:

```bash
npm start
```

Luego abre la siguiente URL en tu navegador:

```text
http://localhost:4200/
```

La aplicación se recargará automáticamente al modificar archivos fuente.

### Compilación para producción

Para generar la versión lista para despliegue:

```bash
npm run build
```

Los artefactos se generarán en la carpeta `dist/galactic-tournament-web/`.

### Pruebas

Ejecuta la suite de pruebas con:

```bash
npm test
```

### Ejecución con Docker

Si prefieres ejecutar la aplicación en un contenedor:

```bash
docker compose up --build
```

La aplicación quedará disponible en:

```text
http://localhost/
```

