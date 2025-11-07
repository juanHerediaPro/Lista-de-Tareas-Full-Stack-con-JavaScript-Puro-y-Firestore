# To-Do List (Firebase) — Vanilla JS

Pequeña aplicación To-Do usando HTML/CSS/JS (módulos ES) con Firebase Authentication y Cloud Firestore.

Características
- Autenticación: Email/Password y Google Sign-In
- Persistencia: Cloud Firestore
- Lista en tiempo real (onSnapshot)
- Agregar, marcar completada y eliminar tareas

Archivos principales
- `index.html` — entrada y vistas
- `css/style.css` — estilos
- `js/firebase-config.js` — Pegar aquí tu configuración de Firebase (reemplazar valores)
- `js/firebase-init.js` — inicializa Firebase y exporta `auth`, `provider`, `db`
- `js/auth.js` — funciones de autenticación
- `js/db.js` — funciones para Firestore (add/listen/update/delete)
- `js/app.js` — lógica que conecta UI y la lógica

Configuración de Firebase
1. Ve a https://console.firebase.google.com y crea un proyecto.
2. Añade una app Web y copia la configuración (apiKey, authDomain, projectId, appId, etc.).
3. Habilita en la consola > Authentication > Sign-in method: Email/Password y Google.
4. Habilita Firestore (modo de prueba o con reglas que prefieras).
5. Abre `js/firebase-config.js` y reemplaza los valores con los de tu app.

Probar localmente
Puedes abrir `index.html` directamente en el navegador, pero algunos navegadores restringen módulos ES si se abre con el esquema `file://`. Se recomienda servirlo con un servidor local.

PowerShell (si tienes Python 3 instalado):

```powershell
# desde la carpeta del proyecto
cd 'C:/Users/Lenovo/Downloads/firebase'
python -m http.server 5500
# luego visita http://localhost:5500
```

O usa la extensión Live Server en VS Code.

Notas
- Cada documento en la colección `tasks` contiene al menos: `title` (string), `isCompleted` (boolean), `userId` (string).
- Si necesitas ordenar por fecha, Firestore guarda `createdAt` como timestamp en las tareas nuevas.
