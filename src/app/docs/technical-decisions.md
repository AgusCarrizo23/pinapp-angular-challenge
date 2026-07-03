# Decisiones técnicas

## Arquitectura

Se decidió organizar el proyecto por features para separar responsabilidades y facilitar el crecimiento de la aplicación.

## Seguridad

Las rutas privadas están protegidas con Auth Guard. Si el usuario no está autenticado, se redirige al login.

## Manejo de errores

Se centralizó el manejo de errores comunes para mejorar la experiencia del usuario.

## UI/UX

Se mantuvo una estética limpia y consistente basada en Angular Material, cards, espaciados amplios y diseño responsive.

## Modales

Las acciones de detalle, edición y eliminación se resolvieron mediante modales para evitar navegación innecesaria y mantener el contexto del usuario.