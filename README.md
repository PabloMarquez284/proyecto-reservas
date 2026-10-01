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
7. **API en Node.js (Express)**, en la carpeta **api/**, con dos funciones: listar reservas y crear reservas. Se conecta a la base de datos usando las variables del **.env**, sin contraseñas escritas en el código.
8. **Dockerfile de la API**: construye el contenedor con una imagen con versión concreta (**node:22-alpine**) y la ejecuta con un usuario normal, no como administrador (root).
9. Fichero **.dockerignore**: evita copiar al contenedor ficheros innecesarios o privados, como el **.env**.
10. **Nginx** como único punto de entrada: es el servidor web que recibe las peticiones del navegador y reenvía a la API las que empiezan por **/api/**.
11. **Seguridad básica**: solo Nginx tiene un puerto abierto hacia fuera (el 80). La API y la base de datos solo son accesibles desde dentro de Docker. Nginx además oculta su versión.

## Cómo arrancarlo
1. Tener Docker Desktop abierto y funcionando.
2. Levantar la base de datos, usando usuario y contraseña propias: **docker compose up -d**.
3. Construir y levantar todo: **docker compose up -d --build**
4. Comprobar que los tres servicios están en marcha: **docker compose ps**
5. Abrir **http://localhost** en el navegador.

Para pararlo: **docker compose down**. No usar **docker compose down -v**, porque borraría también los datos.


## Cómo comprobar que los datos no se pierden
1. Crear una tabla de prueba con un dato dentro.
2. Parar y volver a crear el contenedor con **docker compose down** y **docker compose up -d**.
3. Consultar la tabla para ver que el dato sigue ahí.

El resultado de esta prueba está guardado en **docs/persistencia.txt**.

## Cómo comprobar que la API funciona
Con todo levantado, estas pruebas se hacen desde la terminal:
1. Estado de la API: **curl http://localhost/api/health**.
2. Ver las reservas: **curl http://localhost/api/reservas**.
3. Crear una reserva:
**curl -X POST -H "Content-Type: application/json" -d '{"actividad":"Concierto","nombre":"Pablo","fecha":"2026-10-15"}' http://localhost/api/reservas**.

Los resultados están guardados en **docs/api-pruebas.txt** (probado desde dentro del contenedor de la API) y en **docs/nginx-pruebas.txt** (probado a través de Nginx).

## Estructura del repositorio
```
proyecto-reservas/
├── api/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
├── db/              # Base de datos
├── docs/            # Pruebas y evidencias
├── nginx/
│   ├── default.conf
│   └── html/
│       └── index.html
├── .env.example     # Plantilla de variables
├── .gitignore
├── docker-compose.yml
└── README.md
```
