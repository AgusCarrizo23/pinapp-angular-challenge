# PinApp Angular Challenge

Aplicación web desarrollada con Angular 15 para la gestión de clientes.

## Demo

URL pública:https://pinapp-angular-challenge.web.app

## Tecnologías

- Angular 15
- TypeScript
- Angular Material
- Firebase Firestore
- Firebase Authentication
- Firebase Hosting
- SCSS
- Git / GitHub

## Funcionalidades

- Login con Firebase Authentication
- Rutas protegidas con Auth Guard
- Dashboard con métricas de clientes
- Alta de clientes
- Listado de clientes
- Filtro y ordenamiento
- Detalle de cliente mediante modal
- Edición de cliente mediante modal
- Eliminación de cliente mediante modal
- Cálculo de promedio de edad
- Cálculo de desviación estándar
- Página 404
- Loading global
- Manejo de errores

## Instalación

npm install
Ejecutar en local
ng serve

Abrir:

http://localhost:4200

Build
ng build
Firebase

El proyecto utiliza Firebase para:

Authentication
Firestore
Hosting
Estructura del proyecto
src/app/
  core/
  shared/
  layout/
  features/
    auth/
    dashboard/
    customers/

    
Decisiones técnicas
Arquitectura por features

La aplicación se organizó por funcionalidades para facilitar escalabilidad y mantenimiento.

Angular Material

Se utilizó Angular Material para mantener una UI consistente, accesible y responsive.

Modales para acciones de clientes

Las acciones de detalle, edición y eliminación se implementaron con MatDialog porque son acciones simples y contextuales sobre un cliente existente.

Reactive Forms

El formulario de clientes utiliza Reactive Forms para manejar validaciones de forma clara y escalable.

Firebase

Firestore se utiliza como base de datos y Firebase Authentication para proteger rutas privadas.

Validaciones

El formulario de cliente valida:

Nombre obligatorio
Apellido obligatorio
Edad obligatoria
Edad entre 1 y 120
Fecha de nacimiento obligatoria
Fecha no futura
Consistencia entre edad y fecha de nacimiento
Scripts útiles
npm start
npm run build

## Autor

María Agustina Carrizo
