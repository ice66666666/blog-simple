# Blog Simple - Frontend

Frontend moderno para el Blog Simple construido con React y mejores prácticas.

## 🚀 Características

- **React 18** con hooks modernos
- **React Router** para navegación
- **React Hook Form** para manejo de formularios
- **Axios** para peticiones HTTP con interceptores
- **Context API** para manejo de estado global
- **React Hot Toast** para notificaciones
- **Lucide React** para iconos modernos
- **CSS moderno** con variables CSS y diseño responsive
- **Arquitectura limpia** con separación de responsabilidades

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Layout.js       # Layout principal con navegación
│   ├── Home.js         # Página principal
│   ├── Login.js        # Formulario de login
│   ├── Register.js     # Formulario de registro
│   ├── CreatePost.js   # Formulario para crear posts
│   ├── PostCard.js     # Tarjeta de post
│   └── LoadingSpinner.js # Spinner de carga
├── contexts/           # Contextos React
│   └── AuthContext.js  # Contexto de autenticación
├── hooks/              # Hooks personalizados
│   └── usePosts.js     # Hook para manejo de posts
├── services/           # Servicios API
│   ├── api.js          # Configuración de Axios
│   ├── authService.js  # Servicio de autenticación
│   └── postsService.js # Servicio de posts
├── styles/             # Estilos CSS
│   └── index.css       # Estilos globales
├── utils/              # Utilidades
│   └── index.js        # Funciones de utilidad
├── App.js              # Componente principal
└── index.js            # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **React 18.2.0** - Biblioteca de UI
- **React Router DOM 6.8.0** - Enrutamiento
- **React Hook Form 7.43.0** - Manejo de formularios
- **Axios 1.3.0** - Cliente HTTP
- **React Hot Toast 2.4.0** - Notificaciones
- **Lucide React 0.263.1** - Iconos
- **Clsx 1.2.1** - Utilidad para clases CSS

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

## 🎨 Características de Diseño

- **Diseño Responsive** - Adaptable a todos los dispositivos
- **Tema Moderno** - Colores y tipografía actualizados
- **Animaciones Suaves** - Transiciones y efectos visuales
- **Accesibilidad** - Cumple estándares de accesibilidad web
- **UX Optimizada** - Experiencia de usuario mejorada

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Proxy de Desarrollo

El proyecto está configurado para usar un proxy hacia el backend en desarrollo:

```json
{
  "proxy": "http://localhost:5000"
}
```

## 📱 Funcionalidades

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Manejo de sesiones con tokens JWT
- Protección de rutas privadas

### Posts
- Visualización de todos los posts
- Creación de nuevos posts (usuarios autenticados)
- Diseño de tarjetas para posts
- Formateo de fechas y contenido

### UI/UX
- Navegación intuitiva
- Estados de carga
- Manejo de errores
- Notificaciones toast
- Formularios validados

## 🐳 Docker

Para construir y ejecutar con Docker:

```bash
# Construir imagen
docker build -t blog-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 blog-frontend
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
