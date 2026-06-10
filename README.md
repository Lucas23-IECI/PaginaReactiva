# Reactiva - Catálogo Oficial de Insumos Médicos y Laboratorio

Este repositorio contiene la aplicación web del catálogo oficial para Reactiva, comercializadora de insumos médicos y laboratorio establecida en Concepción y Chiguayante, Chile.

La aplicación está construida sobre una arquitectura profesional e independiente que permite gestionar el catálogo de productos de forma dinámica, rápida y con un diseño de alta gama adaptado a dispositivos móviles y de escritorio.

## Características Principales

*   **Catálogo Digital:** Visualización de más de 90 productos clasificados por categorías con sus respectivas imágenes y códigos SKU oficiales.
*   **Buscador Integrado:** Filtrado instantáneo por texto sin retrasos ni estiramiento/distorsión de las imágenes y tarjetas de productos.
*   **Cotizaciones vía WhatsApp:** Sistema de cotización directa que redirige al cliente a WhatsApp detallando el insumo seleccionado y especificando si la cotización es por formato caja o unitario.
*   **Diseño Limpio y Profesional:** Interfaz sobria adaptada a entornos corporativos de salud y laboratorios. Incluye un sello conmemorativo estático de 23 años de trayectoria y selector de modo claro/oscuro.
*   **Panel de Administración:** Acceso privado en `/admin` con autenticación protegida por cookies para agregar, editar y eliminar insumos de la base de datos de manera intuitiva.
*   **Base de Datos Relacional:** Uso de SQLite en desarrollo y soporte para PostgreSQL en producción a través de Prisma ORM.

## Requisitos de Entorno

*   Node.js v18.0.0 o superior
*   npm como gestor de dependencias

## Instalación y Configuración

1.  Instale las dependencias del proyecto:
    ```bash
    npm install
    ```

2.  Cree un archivo de variables de entorno `.env` en la raíz del proyecto configurando las siguientes propiedades:
    ```env
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="su_secreto_para_firmar_tokens_jwt"
    ADMIN_USERNAME="admin"
    ADMIN_PASSWORD="su_contraseña_de_administración"
    ```

3.  Genere las tablas en la base de datos local utilizando Prisma:
    ```bash
    npx prisma db push
    ```

4.  Cargue los productos iniciales y la cuenta de administrador ejecutando el seed:
    ```bash
    node prisma/seed.js
    ```

## Ejecución del Proyecto

### Desarrollo
Inicie el servidor local de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Producción
Para compilar y empaquetar la aplicación de manera optimizada:
```bash
npm run build
```
Inicie el servidor en modo producción:
```bash
npm run start
```
