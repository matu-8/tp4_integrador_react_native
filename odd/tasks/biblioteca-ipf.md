# ODD Tasks: Biblioteca IPF

Feature: TP4 Biblioteca IPF - App integradora React Native + Expo Router
Tracking ODD specification and tasks.

## Specs

- S1: "App sencilla en React Native + Expo (última versión disponible del SDK) que integre: componentes, estado y efectos; Expo Router; pilas y colas; permisos móviles."
- S2: "Rutas requeridas: /, /libro/[isbn], /buscar?q=, /escanear, /reservar/[isbn], /reservas, /permisos/[recurso], /login, /mostrador, /reserva (Redirect a /reservas), +not-found.tsx."
- S3: "Datos y API simulada: src/types/index.ts y src/lib/api.ts copiados tal cual; src/data/libros.ts con al menos 15 libros (dos con ISBN real, algunos con ejemplares: 0, al menos dos con lista de espera inicial)."
- S4: "Estructuras y estado global: Pila y Cola con #items, getter tamanio, aArray(), Cola sin shift(); Context en layout raíz."
- S5: "Catálogo y Detalle: useLibros() con estados (cargando, error con reintento, vacío); vistos recientemente con Pila (3 del tope sin duplicar); detalle validado (13 dígitos y existencia)."
- S6: "Buscador en URL (/buscar?q=): useLocalSearchParams + router.setParams sin condiciones de carrera."
- S7: "Permisos y Escáner: pantalla previa /permisos/[recurso], usePermiso con 4 estados, escáner cámara EAN-13 con ingreso manual alternativo."
- S8: "Recordatorio y Mostrador: notificaciones locales a los 15s con canal prestamos; Stack.Protected para /login y /mostrador."
- S9: "Buenas prácticas: StyleSheet.create en todos lados, src/constants/tema.ts, sin estilos en línea, sin any, tsc y lint limpios."

## Tasks

- T1 [S3, S9]: Limpieza de boilerplate, sistema de diseño src/constants/tema.ts, types y api.ts [inline] (done - a810e31)
- T2 [S3]: Catálogo de libros src/data/libros.ts con 15 libros incluyendo los 2 reales y alumno.ts [inline] (done - a810e31)
- T3 [S4]: Estructuras Pila y Cola con pruebas de invariantes [inline] (done - 667b8b0)
- T4 [S5, S7]: Hooks useLibros (estados y limpieza) y usePermiso (4 estados y canal Android) [inline] (done - d344bdc)
- T5 [S2, S8]: Layouts de navegación Expo Router y rutas protegidas [inline] (done - aaeefab)
- T6 [S5, S6]: Pantallas de Catálogo, Detalle y Buscador [inline] (done - aaeefab)
- T7 [S7]: Pantallas de Permisos y Escáner [inline] (done - aaeefab, ingreso manual y validación de catálogo completados en T9)
- T8 [S8]: Pantallas de Reservas, Login y Mostrador [inline] (done - aaeefab, lógica de aviso del mostrador completada en T9)
- T9 [S9]: Verificación integral (tsc, lint, accesibilidad, README) [inline] (done - app.json plugins/permisos, escáner manual, 404 con URL, navegación post-reserva, README; tsc y lint limpios)

## Log

- L1: "Leer el archivo REGLAS_DURAS.md y brindar informacion sobre lo que falta definir en cuanto a paleta de colores, estilos, y datos (ISBN real, informacion personal)"
- L2: Plan aprobado por el usuario (plan_definicion_estilos_y_datos.md).
- L3: Typed routes regeneradas al iniciar Metro; sin eso tsc rechazaba los router.push de rutas dinámicas.
- L4: app.json con plugins de cámara y notificaciones, mínimo privilegio y blockedPermissions justificados en el README.
- L5: Mostrador avisa por notificación o aviso in-app solo si la persona desencolada es el usuario de la app.
- L6: Pendiente del usuario: ISBN reales de dos libros y nombre/apellido en ALUMNO; probar en Expo Go y completar commits chicos.
