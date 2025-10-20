# ⚡ Guía de Comandos Esenciales para Next.js

Para trabajar correctamente con este proyecto, es importante conocer los comandos principales de **Next.js** y **npm**.  
Estos comandos te permitirán ejecutar, compilar y mantener la aplicación de forma adecuada durante el desarrollo y despliegue.

---

## 🚀 Comandos Básicos

### 🧩 `npm run dev`
Inicia el **servidor de desarrollo** de Next.js.  
Este comando ejecuta el proyecto en modo local y permite observar los cambios en tiempo real.  
Por defecto, la aplicación estará disponible en:

```bash
http://localhost:3000
```

> 🔹 Usa este comando mientras desarrollas nuevas funcionalidades o pruebas vistas.

---

### 🏗️ `npm run build`
Compila el proyecto para **producción**.  
Este comando optimiza todo el código, genera las páginas estáticas necesarias y prepara los archivos para el despliegue.

> ⚠️ Es recomendable ejecutar `npm run build` antes de hacer cualquier despliegue o prueba en entornos productivos.

---

### 🖥️ `npm start`
Ejecuta la aplicación **ya compilada** (modo producción).  
Este comando utiliza los archivos generados por el build y sirve el proyecto optimizado.

> ✅ Debe usarse junto con `npm run build` cuando se desea probar el entorno de producción localmente.

---

## 🧰 Otros Comandos Útiles

### 🧼 `npm run lint`
Ejecuta el analizador de código (ESLint) para detectar errores o problemas de estilo.  
Es ideal para mantener el código limpio, consistente y conforme a las buenas prácticas del equipo.

---

### 🧪 `npm run test`
Ejecuta los tests definidos en el proyecto (si existen).  
Sirve para validar el comportamiento de componentes, rutas o funcionalidades críticas.

---

## 📖 Comandos Base de Next.js

- **`next dev`** → Arranca el entorno de desarrollo.  
- **`next build`** → Crea la compilación de producción.  
- **`next start`** → Inicia el servidor de producción.  
- **`next lint`** → Analiza el código fuente con ESLint.  
- **`next info`** → Muestra información del entorno y versiones instaladas.

---

## 💡 Recomendaciones

- Antes de ejecutar cualquier comando, asegúrate de instalar las dependencias con:

```bash
npm install
```

- Mantén siempre tu entorno actualizado (Node.js y npm).  
- Si usas **TypeScript**, asegúrate de no tener errores de tipado antes de compilar.  
- En equipos colaborativos, usar `npm run lint` antes de hacer un *commit* ayuda a mantener la calidad del código.

---

> 🧠 Conocer y dominar estos comandos te permitirá desarrollar, depurar y desplegar aplicaciones Next.js de forma más eficiente y profesional.

# 📘 Guía Rápida del Proyecto Next.js

Este proyecto está desarrollado en **Next.js**, utilizando una estructura moderna organizada dentro de la carpeta principal **`src/`**.  
A continuación se describe la estructura del proyecto y el propósito de cada carpeta, para facilitar la colaboración y el mantenimiento entre los desarrolladores.

---

## 🗂 Estructura General del Proyecto

Dentro de la carpeta **`src/`** se encuentran las siguientes carpetas principales:

- **`app/`** → Contiene toda la lógica de rutas, vistas y acciones del proyecto.  
- **`components/`** → Carpeta donde se ubican los componentes reutilizables.  
- **`lib/`** → Contiene las funciones compartidas, utilidades, configuración de base de datos e imágenes.  
- **`types/`** → Define los tipos TypeScript utilizados en toda la aplicación.

---

## 📁 Carpeta `app/`

Esta carpeta es el corazón de las rutas y vistas de Next.js. Incluye:

- **`actions/`** → Contiene funciones que ejecutan **acciones del servidor**.  
  En Next.js, estas acciones permiten ejecutar lógica sin renderizar componentes, siendo ideales para validaciones, operaciones con base de datos o autenticación.

- **`admin/`** → Corresponde a la ruta `/admin`, donde se manejan las vistas y funcionalidades del panel administrativo.

- **`api/`** → Carpeta destinada a la **API local**, donde se manejan endpoints internos sin renderización de vistas.  
  Es útil para manejar peticiones o lógicas que no deben generar páginas.

- **`auth/`** → Contiene funcionalidades de autenticación, manejo de errores de carga, *loaders* y procesos de registro (`signup`).

- **`cart/`, `checkout/`, `orders/`, `products/`** → Representan rutas independientes del sitio.  
  En Next.js, **las carpetas son rutas** y **las páginas (`page.tsx`) son las vistas** que se renderizan.

> 🔹 Los archivos `actions.tsx` representan **acciones ejecutadas desde el servidor**.  
> 🔹 Los archivos `route.ts` son **rutas API** o de servidor que no renderizan vistas.

---

## 🧩 Carpeta `components/`

Aquí se encuentran todos los componentes reutilizables del proyecto.  
Dentro de esta carpeta está el subdirectorio **`ui/`**, que contiene los **componentes de Shadcn**, una colección moderna y accesible de componentes de interfaz con estilo consistente.

---

## ⚙️ Carpeta `lib/`

En esta carpeta se agrupan funcionalidades compartidas por todo el proyecto, como:

- **`utils/`** → Funciones de utilidad reutilizables.  
- **`db/`** → Configuración y conexión de la base de datos **Prisma**.  
- **`images/`** → Gestión de imágenes y funciones de optimización.

Esta carpeta sirve como núcleo de las funcionalidades que deben poder ser accedidas desde diferentes partes de la aplicación.

---

## 🧾 Carpeta `types/`

Contiene los **tipos TypeScript** usados en toda la aplicación.  
Esto mejora la seguridad del código, facilita la autocompletación y garantiza la consistencia entre los diferentes módulos y componentes.

---

## 🗃️ Base de Datos – Prisma

El proyecto utiliza **Prisma ORM** como gestor de base de datos.  
Prisma permite trabajar con una **base de datos local de pruebas**, y abstrae las consultas SQL con un modelo tipado y seguro.

### 🔑 Características principales:

- Genera automáticamente el esquema de la base de datos.  
- Permite realizar **migraciones controladas** y sincronización con el modelo definido.  
- Facilita el acceso a los datos con seguridad y eficiencia.  

La conexión a la base de datos se gestiona desde **`lib/db`**.

---

## 🖼️ Gestión de Imágenes

Para la gestión de imágenes se utiliza la carpeta **`public/`**, optimizada con un script que permite **guardar y consumir imágenes directamente desde el front-end**.  
Esto facilita el manejo de recursos estáticos y mejora el rendimiento en la carga de contenido visual dentro de la aplicación.

---

## 🤝 Buenas Prácticas de Colaboración

Para mantener una estructura limpia, colaborativa y eficiente, se recomienda:

- Mantener la estructura del proyecto organizada.  
- Crear componentes reutilizables dentro de **`components/`** siempre que sea posible.  
- Documentar las funciones y utilidades dentro de **`lib/`**.  
- Ejecutar las migraciones de Prisma de forma controlada.  
- Usar los tipos definidos en **`types/`** para mantener la integridad del código.  
- Evitar lógica compleja en las vistas (`page.tsx`); moverla a acciones o utilidades cuando sea posible.

---

> 🧠 Con esta estructura, el proyecto busca mantener un flujo de trabajo ordenado, escalable y colaborativo entre todos los miembros del equipo.

# 🧭 Guía de Configuración e Inicio de Prisma

El proyecto utiliza **Prisma ORM** como herramienta de gestión de base de datos.  
Prisma permite manejar bases locales (por ejemplo, SQLite) o remotas con facilidad, ofreciendo un modelo tipado y seguro para las consultas.

A continuación se detallan los pasos y comandos recomendados para iniciar correctamente Prisma dentro del proyecto.

---

## ⚙️ 1. Instalación y Configuración Inicial

Antes de usar Prisma, asegúrate de tener instaladas las dependencias del proyecto verifica que el archivo **`schema.prisma`** esté ubicado en la carpeta:

```
/prisma/schema.prisma
```

Este archivo define el modelo de datos, las relaciones y la configuración de conexión a la base de datos.

> 🔹 Por defecto, el proyecto usa **SQLite** como base local para pruebas.
> 🔹 Puedes cambiar el proveedor en el archivo `schema.prisma` en este caso SQLite.

---

## 🧩 2. Generar el Cliente de Prisma

Cada vez que realices cambios en el esquema (`schema.prisma`), debes regenerar el cliente de Prisma para actualizar las tipificaciones y métodos de acceso a la base de datos:

```bash
npx prisma generate
```

> ⚠️ Este comando debe ejecutarse después de modificar cualquier modelo o campo en el esquema.

---

## 🏗️ 3. Crear y Migrar la Base de Datos

Para inicializar la base de datos y aplicar el esquema definido, ejecuta:

```bash
npx prisma migrate dev --name init_schema
```

Este comando:

* Crea la base de datos local (por ejemplo, `dev.db` en `/prisma/`).
* Aplica la primera migración llamada `init_schema`.
* Sincroniza el esquema con los modelos definidos.

> 💡 Puedes reemplazar `"init_schema"` por un nombre descriptivo de tu migración (ejemplo: `"add_users_table"`).

---

## 🌱 4. Poblar la Base de Datos (Seed)

Para agregar datos iniciales (por ejemplo, usuarios de prueba, productos, etc.), ejecuta el script de *seed* incluido en el proyecto:

```bash
npx tsx prisma/seed.ts
```

Este archivo suele ubicarse en:

```
/prisma/seed.ts
```

y contiene funciones de inserción inicial de datos.
Es útil para pruebas locales y desarrollo colaborativo.

---

## 🧠 Recomendaciones Finales

* Antes de cualquier cambio en el esquema, asegúrate de **guardar y confirmar tus migraciones**.
* Ejecuta `npx prisma studio` para abrir el panel visual de Prisma y explorar tu base de datos en el navegador.
* Mantén sincronizado el cliente de Prisma ejecutando `npx prisma generate` después de cualquier actualización del esquema.
* No edites directamente el archivo `.db` de SQLite; usa Prisma o migraciones.
* Si algo falla, puedes restablecer el entorno eliminando el archivo `dev.db` y corriendo nuevamente las migraciones.

---

> ✅ Con estos pasos, tendrás tu entorno Prisma correctamente configurado, con base de datos lista, datos iniciales cargados y cliente generado para su uso dentro del proyecto Next.js.
