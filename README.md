# Despliegue de la plataforma de reservas

## Introducción

Esta actividad trata de una plataforma de reservas de actividades culturales de Sevilla, desplegada con Docker.
La idea es que toda la aplicación se pueda arrancar con un solo comando: **docker compose up --build**.

## Pasos:
1. **Repositorio en GitHub** con una estructura de carpetas ordenada: **nginx/**, **api/**, **db/** y **docs/**.
2. Fichero **.gitignore**: evita que el fichero **.env** (con el usuario y contraseña real) se suba al repositorio.
3. Fichero **.env.example**: plantilla con los nombres de las variables que hay que rellenar, con valores de ejemplo.
4. **Base de datos PostgreSQL 16.4** en un contenedor definido en **docker-compose.yml**.
5. **Datos guardados en un volumen** (**db_data**) para que los datos no se pierdan aunque el contenedor se borre y se vuelva a crear.
6. **Base de datos protegida**: no tiene el puerto publicado hacia fuera, solo se podrá llegar a ella desde otros contenedores.

## Cómo arrancarlo
1. Tener Docker Desktop abierto y funcionando.
2. Levantar la base de datos: **docker compose up -d**.
3. Comprobar que está en marcha: **docker compose ps**.

## Cómo comprobar que los datos no se pierden
1. Crear una tabla de prueba con un dato dentro.
2. Parar y volver a crear el contenedor con **docker compose down** y **docker compose up -d**.
3. Consultar la tabla para ver que el dato sigue ahí.

El resultado de esta prueba está guardado en **docs/persistencia.txt**.

## Estructura del repositorio
```
proyecto-reservas/
├── api/             # API
├── db/              # Base de datos
├── docs/            # Pruebas y evidencias
├── nginx/           # Servidor web
├── .env.example     # Plantilla de variables
├── .gitignore
├── docker-compose.yml
└── README.md
```
