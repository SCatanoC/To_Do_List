
# To-Do List

Aplicación de lista de tareas (To-Do List) con backend en Node.js + Express y frontend en HTML, CSS y JavaScript.
Permite crear, editar, eliminar y marcar tareas como completadas, además de categorizarlas y filtrarlas.


## Tecnologías Utilizadas


**Node.js**: Entorno de ejecución para el backend.

**Express**: Para crear el servidor y manejar rutas.

**MySQL**: Base de datos para almacenar las tareas.

**MySQL2**:	Para conectar Node.js con MySQL.

**Postman**: Probador de API para verificar endpoints.

**npm**: Gestor de paquetes de Node.js.

**HTML/CSS/JS**: Frontend de la aplicación.



## Instalación

1. Clona el repositorio
 ```bash
git clone https://github.com/SCatanoC/To_Do_List.git
cd Back
```

2. Requisitos previos
Node.js (v16+)

MySQL (v5.7+)

3. Intalar Dependencias:

```bash
 npm install
npm install mysql2
```
4. Configurar la base de datos:

Crear una base de datos MySQL con nombre "todo_app" (o modificar el nombre en db.js).

Ejecutar el script SQL para crear la tabla tasks:

```bash
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taskTitle VARCHAR(255) NOT NULL,
  complete BOOLEAN DEFAULT FALSE,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL DEFAULT NULL
);
```

5. Configurar las variables de entorno:
Crear un archivo .env en la raíz del proyecto con:
```bash
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=todo_app

``


## Ejecución del Proyecto

1.Iniciar el servidor (Backend)

```bash
  node server.js
```
El servidor se ejecutará en: http://localhost:3000
Abre esa URL en tu navegador para usar la aplicación.

API Endpoints

| Método | Endpoint            | Descripción                  | Body (JSON) |
|--------|---------------------|------------------------------|-------------|
| `GET`  | `/api/tasks`        | Obtener todas las tareas     | -           |
| `POST` | `/api/tasks`        | Crear una nueva tarea        | `{ "taskTitle": "string", "category": "string" }` |
| `PUT`  | `/api/tasks/:id`    | Actualizar una tarea         | `{ "taskTitle": "string", "complete": boolean }` |
| `DELETE` | `/api/tasks/:id`  | Eliminar una tarea           | -           |

