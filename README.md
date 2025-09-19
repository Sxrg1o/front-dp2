# Sistema de Restaurante DP2

## Descripción
Sistema integral de gestión para restaurantes desarrollado con Next.js, React y Tailwind CSS.

## Tecnologías
- **Next.js 14** - Framework de React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **ESLint** - Linter de código

## Estructura del Proyecto
```
src/
├── app/                     # App Router de Next.js
│   ├── (public)/           # Rutas públicas
│   ├── (auth)/             # Autenticación
│   ├── (dashboard)/        # Panel del restaurante
│   └── api/                # API Routes
├── components/             # Componentes reutilizables
├── hooks/                  # Custom hooks
├── lib/                    # Configuraciones
├── services/               # Servicios API
├── stores/                 # Estado global
├── types/                  # Tipos TypeScript
├── utils/                  # Utilidades
└── styles/                 # Estilos
```

## Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Producción
npm start

# Linting
npm run lint

# Verificación de tipos
npm run type-check
```

## Instalación

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Ejecuta en desarrollo: `npm run dev`
4. Abre [http://localhost:3000](http://localhost:3000)

## Funcionalidades

- 📋 **Gestión de Órdenes** - Control completo de pedidos
- 🍽️ **Menú Digital** - Administración de categorías e items


## Historial
- **31/08/2025**: Instalación inicial con Next.js, React y Tailwind CSS
- **31/08/2025**: Estructura de carpetas completa y modular
# front-dp2