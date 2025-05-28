# Aplicación Frontend de Gestión de Gimnasio

Una aplicación web moderna y responsiva para la gestión eficiente de gimnasios. Este proyecto frontend proporciona una interfaz intuitiva para propietarios de gimnasios y administradores para gestionar miembros, membresías, pagos y registros de entrada.

Se integra perfectamente con la [aplicación backend](https://github.com/cajimenez96/gym-management-front.git).

## Tabla de Contenidos

1. [Características](#características)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Resumen de Arquitectura](#resumen-de-arquitectura)
4. [Primeros Pasos](#primeros-pasos)
5. [Ejecutar la Aplicación](#ejecutar-la-aplicación)
6. [Pruebas](#pruebas)
7. [Estructura de Componentes](#estructura-de-componentes)
8. [Gestión de Estado](#gestión-de-estado)
9. [Estilos](#estilos)
10. [Calidad de Código y Formateo](#calidad-de-código-y-formateo)
11. [Licencia](#licencia)
12. [Información de Contacto](#información-de-contacto)

## Características

- Registro y gestión de miembros
- Creación y gestión de planes de membresía
- Procesamiento de pagos con integración de Stripe
- Sistema de registro de entrada de miembros

## Tecnologías Utilizadas

- TypeScript
- Vite
- React 18
- Tanstack Router
- Material-UI (MUI) para componentes de UI
- React Query para gestión de estado del servidor
- Axios para peticiones API
- Vitest y React Testing Library para pruebas
- MSW (Mock Service Worker) para simulación de API en pruebas
- Date-fns para manipulación de fechas

## Resumen de Arquitectura

Este proyecto sigue un enfoque de Arquitectura Limpia modificada. La aplicación está construida usando Vite, TypeScript y React, y está organizada en módulos de características.

Cada módulo tiene algunos o todos los siguientes componentes:

- Modelos: Modelos de datos que representan objetos de negocio principales
- Repositorios: Implementaciones para acceso y manipulación de datos
- Servicios: Implementaciones para lógica de negocio
- Páginas: Componentes React que representan una página o vista
- Hooks: Hooks personalizados para lógica utilizada en las páginas
- Componentes: Componentes React utilizados en las páginas
- Archivo Índice: Archivo barrel que actúa como interfaz pública para el módulo

## Primeros Pasos

### Prerrequisitos

- Node.js (v20 o posterior)
- npm (v10 o posterior)

### Instalación

1. Clonar el repositorio:

   ```
   git clone https://github.com/cajimenez96/gym-management-front.git
   ```

2. Navegar al directorio del proyecto:

   ```
   cd gym-management-front
   ```

3. Instalar dependencias:
   ```
   npm install
   ```

### Configuración del Entorno

1. Copiar el archivo `.env.example` a `.env`:

   ```
   cp .env.example .env
   ```

2. Editar `.env` y configurar las variables de entorno requeridas:
   ```
   VITE_API_BASE_URL=http://localhost:3001
   VITE_STRIPE_PUBLISHABLE_KEY=tu_clave_publica_stripe
   ```

La URL base de la API debe ser donde estés ejecutando el proyecto gym-management-server correspondiente.

Tu clave pública de Stripe puede ser obtenida desde tu panel de control de Stripe.

Por favor, asegúrate de que el modo de prueba esté habilitado y que obtengas la clave correspondiente. Debe comenzar con pk*test*.

## Ejecutar la Aplicación

Para ejecutar la aplicación en modo de desarrollo:

```
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Pruebas

Este proyecto utiliza Vitest para pruebas unitarias e de integración, junto con React Testing Library para pruebas de componentes.

Para ejecutar pruebas:

```
npm test
```

Para modo de observación:

```
npm run test:watch
```

## Estructura de Componentes

La aplicación sigue una estructura de componentes modular:

- `src/components`: Componentes React utilizados en toda la aplicación.
- `src/context`: Contextos React y hooks acompañantes.
- `src/modules`: Módulos de características, cada uno conteniendo un conjunto de componentes, hooks, páginas y lógica relacionados.
- `src/routes`: Rutas de la aplicación que referencian componentes de página.

## Gestión de Estado

Esta aplicación utiliza una combinación de:
- **React Query**: Para la gestión de estado del servidor (datos obtenidos de la API, cacheo, actualizaciones asíncronas).
- **Zustand**: Para la gestión de estado global del cliente (ej. estado de autenticación, notificaciones de UI).
- **Estado local de React (`useState`)**: Para estado de UI específico de componentes (ej. control de diálogos, entradas de formularios).

Este enfoque ayuda a separar las preocupaciones del estado y a utilizar la herramienta adecuada para cada tipo de estado, mejorando la organización y el rendimiento.

## Estilos

Los estilos se manejan principalmente a través de Material-UI (MUI), que proporciona un sistema de diseño consistente y personalizable.

## Calidad de Código y Formateo

Para asegurar calidad y consistencia del código, este proyecto utiliza:

- **Prettier**: Para formateo consistente del código

    - Configuración en `.prettierrc`
    - Ejecutar formateador: `npm run format`

- **ESLint**: Para análisis estático del código

    - Configuración en `.eslintrc.js`
    - Ejecutar linter: `npm run lint`

- **lint-staged**: Para ejecutar linters en archivos de git staged

    - Configuración en `package.json`

- **Husky**: Para ejecutar hooks de git
    - Hook pre-commit para ejecutar lint-staged