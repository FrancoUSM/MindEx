======COMMIT 07/05 - FRANCO H.======

Tecnologías:

- Backend: Java 17 - Spring Boot: 3.5.13 - Flyway 10.0.1
- Base de Datos: PostgreSQL 16
- Frontend: Typescript - React - Vite
- Servidor: Nginx:alpine
--------------------------------------------------
Descripción base:

Directorio:
   - backend: BD, lógica de negocio
   - frontend: visualización de la página y contacto directo con el usuario
   - docker: correr el sistema, compartimentarlo 
Archivos:
   - Mindexa_BD.drawio: visualización de la base de datos (SQL)

--------------------------------------------------
Instrucciones para correrlo:

*Se requiere tener instalado Docker Desktop y Git*

1. Abra CMD en la directorio deseado y copie este repositorio de github con los comandos:
   git init
   git clone <ENLACE REPOSITORIO>
   
2. En la misma CMD escriba docker compose up --build

La instalación de npm debería hacerse automáticamente.

3. Para abrir el frontend funcional del proyecto, en Docker Desktop, presione la imagen 'frontend'.

El proyecto estará listo para probarse.

--------------------------------------------------
Anotación:
Se entiende que tener el .env en la carpeta del frontend es una mala práctica, pero ahora, por su facilidad, he hecho así.