Documento de Diseño de Sistema (SDD)

Proyecto: Astryx

1. Resumen Ejecutivo y Reglas de Desarrollo

Aplicación web mobile-first (PWA) diseñada como un "segundo cerebro" y anclaje
de realidad para un usuario con Trauma Complejo (CPTSD), aprendizaje paralelo y
tendencias multitasking. El sistema prioriza la persistencia de la memoria, baja
carga cognitiva y seguridad emocional de los datos.

REGLA DE ORO PARA EL DESARROLLO (LANGUAGE RULE):

  - Todo el código fuente (nombres de variables, funciones, base de datos,
    modelos de Prisma, comentarios, commits) DEBE estar estrictamente en INGLÉS.
  - Toda la Interfaz de Usuario (UI) (textos, botones, alertas, placeholders que
    el usuario ve en pantalla) DEBE estar estrictamente en ESPAÑOL.

2. Stack Tecnológico e Infraestructura

  - Framework: Next.js (App Router).
  - Base de Datos: PostgreSQL alojada en Neon.
  - ORM: Prisma.
  - Hosting: Vercel.
  - Estilos: Tailwind CSS + shadcn/ui.
  - PWA y Offline: Configuración nativa como Progressive Web App (instalable).
    Implementación de caché local (ej. IndexedDB/Zustand) para Modo Offline
    básico: permite crear registros o ver notas sin internet, y sincroniza con
    Neon DB al recuperar conexión.

3. Filosofía UI/UX y Estética (Minimalismo Extremo)

  - Tema: Dark Mode (Modo Oscuro) forzado y único.
  - Paleta: Fondos negros/grises muy oscuros. Color de acento principal: Morado
    (purple-500 / purple-600).
  - Tipografía: Fuente limpia sin serifas (Inter o Roboto). Tamaños grandes
    (Large/XL) para garantizar legibilidad sin esfuerzo.
  - Animaciones: Solo fade-in/fade-out suaves. Cero animaciones bruscas o
    rebotes.
  - Interactividad (Optimistic UI): La interfaz debe reaccionar instantáneamente
    al marcar tareas o guardar datos, actualizando la DB en segundo plano para
    evitar esperas que generen ansiedad.

4. Arquitectura de Navegación (Mobile First)

  - Bottom Tab Bar (Navegación Inferior):
    1.  Hoy (Today): Panel diario y triggers.
    2.  Mapa (Map): Categorías y Puntos de Guardado.
    3.  Deriva (Drift): Randomizer.
  - Top-Right Dropdown (Menú Desplegable): Ícono superior derecho para acceder
    a: Archivo (Archive), Perfil, Historial completo. En desktop, esto actúa
    como Sidebar.
  - Botón Flotante (FAB): Un botón (+) morado, grande y accesible siempre, para
    agregar notas rápidas, puntos de guardado o tareas sin importar la pantalla
    actual.

5. Funcionalidades Core (Características)

A. Gestión de Tiempo y Autenticación

  - Auth: Sistema privado. Login simple con Username y Password.
  - Manejo de Fechas: Huso horario forzado a Argentina
    (America/Argentina/Buenos_Aires). El día termina estrictamente a las 00:00.

B. Registro Psicológico y Trauma (Daily Log)

  - Métricas del Día (Sliders 1 al 5):
      - Batería Social (Social Battery)
      - Nivel de Disociación (Dissociation Level)
      - Nivel de Tranquilidad (Tranquility Level)
  - Triggers (Anclaje de Realidad): Campo de texto siempre visible en el tab
    "Hoy" para anotar si algo cambió o si la realidad se alteró.
  - Autenticidad: Al marcar una tarea como "Hecha", un pop-up suave centrado
    pregunta: "¿Lo hiciste por gusto o por obligación?" (Genuine Interest vs
    Obligation).

C. El "Punto de Guardado" (Save Point)

  - Formato: Texto plano con saltos de línea. Si el usuario incluye una URL (ej.
    YouTube, docs), el sistema debe renderizarla como un enlace clickeable
    (etiqueta <a> con target="_blank").
  - Visualización: En la vista de categoría, solo se muestra el último punto
    guardado. Se provee un botón para "Ver Historial" (View History).

D. Categorías y Tareas

  - Flexibilidad: El usuario asigna un color personalizado a cada categoría al
    crearla.
  - Rutina vs Técnica: Separación clara dentro de la categoría entre tareas
    repetitivas y aprendizaje técnico.
  - Pendientes (Pending): Tareas no completadas a las 00:00 NO se borran. Pasan
    a estado PENDING para retomarse sin culpa.
  - Archivo (Archive): Categorías inactivas se mandan a "Habilidades en Reposo".
    No se borran.

E. Modo Deriva (Drift / Randomizer)

  - Si el usuario no sabe qué hacer, selecciona su nivel de energía actual
    (Baja, Media, Alta).
  - El sistema sugiere 1 actividad basada en las tareas pendientes o categorías
    que coincidan con esa energía.
  - Botones gigantes: "Aceptar" o "Tirar de nuevo".

F. Seguridad de Datos (Protección contra Disociación)

  - Edición del Pasado: El usuario puede navegar a cualquier día previo y
    editar/agregar información libremente.
  - Confirmación Destructiva: Cualquier intento de eliminar (tarea, categoría,
    registro) requiere un pop-up de doble confirmación ("¿Estás seguro?").

6. Esquema de Base de Datos (Prisma)

Se provee el modelo en inglés para el agente.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // Hashed
  createdAt DateTime @default(now())
}

model Category {
  id           String      @id @default(cuid())
  name         String      @unique
  colorHex     String      // e.g., "#8B5CF6"
  energyLevel  EnergyLevel @default(MEDIUM)
  isArchived   Boolean     @default(false)
  createdAt    DateTime    @default(now())
  
  tasks        Task[]
  savePoints   SavePoint[]
}

model SavePoint {
  id          String   @id @default(cuid())
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  content     String   // Plain text with line breaks
  link        String?  // Optional clickable URL
  createdAt   DateTime @default(now()) // Acts as history tracker
}

model DailyLog {
  id                String   @id @default(cuid())
  date              DateTime @unique // Locked to Argentina Time (00:00 to 23:59)
  socialBattery     Int?     // 1 to 5
  dissociationLevel Int?     // 1 to 5
  tranquilityLevel  Int?     // 1 to 5
  triggersContent   String?  // Always visible anchor text
  
  tasks             Task[]
}

model Task {
  id            String          @id @default(cuid())
  title         String
  type          TaskType        // ROUTINE or TECHNICAL
  energyLevel   EnergyLevel     @default(MEDIUM)
  
  categoryId    String?
  category      Category?       @relation(fields: [categoryId], references: [id])
  
  dailyLogId    String
  dailyLog      DailyLog        @relation(fields: [dailyLogId], references: [id])
  
  status        TaskStatus      @default(PLANNED)
  motivation    MotivationType? // Filled via pop-up on completion
  
  createdAt     DateTime        @default(now())
}

enum EnergyLevel {
  LOW
  MEDIUM
  HIGH
}

enum TaskType {
  ROUTINE
  TECHNICAL
}

enum TaskStatus {
  PLANNED
  COMPLETED
  PENDING
}

enum MotivationType {
  GENUINE_INTEREST
  OBLIGATION
}
