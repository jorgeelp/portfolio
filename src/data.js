// Todo el contenido de la web. Para editar textos, solo hay que tocar este archivo.

export const contact = {
  email: 'jorgelnprz@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jorgelei',
  github: 'https://github.com/jorgeelp',
  githubUser: 'jorgeelp',
  cv: './CV_Jorge_Lei_Leon.pdf',
}

export const projects = [
  {
    repo: 'plan_x_bar',
    name: 'PlanBar',
    tag: 'TFG',
    stack: ['Kotlin', 'Android', 'PHP', 'API REST', 'SQL'],
    desc: {
      es: 'Aplicación Android para la gestión de comandas, conectada a una API REST propia en PHP con base de datos SQL.',
      en: 'Android app for managing orders, connected to a custom PHP REST API backed by a SQL database.',
    },
  },
  {
    repo: 'biblioteca_lanuza',
    name: 'Biblioteca Juan de Lanuza',
    tag: 'FCT',
    stack: ['React', 'Node.js', 'Express', 'MariaDB', 'Tailwind'],
    desc: {
      es: 'Aplicación web completa para la biblioteca del Colegio Juan de Lanuza: catálogo público, préstamos con avisos por email, usuarios, actividades y estadísticas.',
      en: 'Full web app for the Juan de Lanuza school library: public catalogue, loans with email reminders, users, activities and statistics.',
    },
    // Página de detalle: /#/proyecto/biblioteca_lanuza
    detail: {
      period: { es: 'Mar 2026 – May 2026 · Prácticas (FCT)', en: 'Mar 2026 – May 2026 · Internship' },
      context: {
        es: ['Una herramienta local, a propósito', 'Lo acordé con el colegio: necesitaban una herramienta interna para su biblioteca, no un producto publicado en internet ni pensado para el mercado. Por eso la aplicación funciona en la red local del colegio y por HTTP, y los emails automáticos (confirmaciones, recordatorios y recuperación de contraseña) solo se envían cuando se usa desde dentro del propio colegio, porque el servidor de correo solo es accesible desde su red.'],
        en: ['A local tool, on purpose', 'Agreed with the school: they needed an internal tool for their library, not a product published on the internet or built for the market. That is why the app runs on the school’s local network over HTTP, and the automatic emails (confirmations, reminders and password recovery) are only sent when it is used from inside the school, because the mail server is only reachable from its network.'],
      },
      role: { es: 'Proyecto individual: análisis, diseño, frontend, backend y base de datos', en: 'Solo project: analysis, design, frontend, backend and database' },
      // Capas de la arquitectura, de arriba (usuario) a abajo (datos)
      layers: [
        { name: 'React 18 SPA', note: 'React Router · Tailwind · Vite' },
        { name: 'Nginx', note: 'LAN · HTTP · /api → Express' },
        { name: 'Express API', note: 'Node.js · JWT · PM2', side: ['node-cron', 'nodemailer → SMTP'] },
        { name: 'MariaDB', note: 'mysql2 · transacciones' },
      ],
      // Las 10 tablas del esquema real, con todas sus columnas (claves foráneas declaradas con →)
      tables: [
        { name: 'usuario', fields: ['id · PK', 'codigo · UQ', 'nombre', 'apellidos', 'email · UQ', 'password', 'rol', 'ubicacion', 'activo', 'fecha_alta', 'fecha_baja'] },
        { name: 'libro', fields: ['id · PK', 'codigo · UQ', 'titulo', 'autor', 'editorial', 'volumen', 'idioma', 'genero', 'estanteria', 'categoria', 'estado', 'nombre_foto', 'etiquetado'] },
        { name: 'prestamo', fields: ['id · PK', 'codigo · UQ', 'id_usuario → usuario', 'id_libro → libro', 'fecha_inicio', 'fecha_devolucion_prevista', 'fecha_devolucion_real', 'devuelto', 'codigo_lote', 'created_at'] },
        { name: 'recordatorio', fields: ['id · PK', 'id_prestamo', 'codigo_lote', 'enviar_en', 'enviado', 'created_at'] },
        { name: 'registro', fields: ['id · PK', 'nombre', 'codigo_usuario', 'curso', 'fecha'] },
        { name: 'actividad', fields: ['id · PK', 'nombre', 'fecha', 'idioma', 'tipo', 'subtipo', 'duracion', 'destinatario', 'curso_destinatario', 'objetivos', 'reflexiones'] },
        { name: 'actividad_foto', fields: ['id · PK', 'id_actividad → actividad', 'nombre_foto'] },
        { name: 'password_reset', fields: ['id · PK', 'id_usuario', 'token · UQ', 'expires_at', 'usado', 'created_at'] },
        { name: 'estanteria', fields: ['id · PK', 'nombre · UQ'] },
        { name: 'config', fields: ['clave · PK', 'valor'] },
      ],
      code: {
        file: 'server/src/controllers/prestamosController.js',
        snippet: `exports.create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // … validaciones: usuario activo y libro disponible
    const codigo = await generarCodigoPrestamo(conn);
    const [result] = await conn.query(
      'INSERT INTO prestamo (codigo, id_usuario, id_libro, fecha_inicio, fecha_devolucion_prevista) VALUES (?,?,?,?,?)',
      [codigo, id_usuario, id_libro, fecha_inicio, fecha_devolucion_prevista || null]
    );
    await conn.query('UPDATE libro SET estado = "prestado" WHERE id = ?', [id_libro]);
    await programarRecordatorio(conn, { id_prestamo: result.insertId, fecha_devolucion_prevista });
    await conn.commit();
    // … email de confirmación con QR
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};`,
      },
      facts: [
        { value: '~14.000', label: { es: 'líneas de código', en: 'lines of code' } },
        { value: '60+', label: { es: 'endpoints REST', en: 'REST endpoints' } },
        { value: '14', label: { es: 'pantallas', en: 'screens' } },
        { value: '4', label: { es: 'roles de usuario', en: 'user roles' } },
      ],
      // Lista completa de funcionalidades, por apartado de la aplicación (sacada del código)
      modules: [
        {
          title: { es: 'Catálogo público', en: 'Public catalogue' },
          es: [
            'Accesible sin iniciar sesión, desde el móvil o el ordenador',
            'Buscador por título, autor o código del libro',
            'Filtros por estado, género, idioma, editorial y estantería',
            'Ordenación por título, autor o editorial, de la A a la Z o al revés',
            'Etiqueta de estado en cada portada: disponible, prestado, extraviado o no disponible',
            'Carga progresiva con el botón "Cargar más libros"',
            'Portada por defecto cuando un libro no tiene foto',
            'Ficha de cada libro con todos sus datos y su código QR',
          ],
          en: [
            'Open without logging in, on phone or desktop',
            'Search by title, author or book code',
            'Filters by status, genre, language, publisher and shelf',
            'Sort by title, author or publisher, A–Z or Z–A',
            'Status badge on every cover: available, borrowed, lost or unavailable',
            'Progressive loading with a "Load more books" button',
            'Default cover when a book has no photo',
            'Detail page for every book with all its data and QR code',
          ],
        },
        {
          title: { es: 'Cuentas y acceso', en: 'Accounts and access' },
          es: [
            'Registro de cuenta como alumno, profesorado o personal',
            'Solo se admiten emails del dominio @juandelanuza.org',
            'Profesorado y personal necesitan un código de registro que genera la biblioteca',
            'Inicio de sesión con opción de mostrar u ocultar la contraseña',
            '"¿Olvidaste tu contraseña?": enlace por email válido 1 hora y de un solo uso',
            'La sesión se mantiene al recargar y se cierra sola si el token deja de ser válido',
            'Cuatro roles con permisos distintos; el panel de gestión solo lo ve la biblioteca',
          ],
          en: [
            'Sign-up as student, teacher or staff',
            'Only @juandelanuza.org email addresses are accepted',
            'Teachers and staff need a registration code generated by the library',
            'Login with show/hide password',
            '"Forgot your password?": single-use email link valid for 1 hour',
            'Session survives reloads and ends automatically if the token is no longer valid',
            'Four roles with different permissions; only the library sees the management panel',
          ],
        },
        {
          title: { es: 'Mi espacio (alumnos y profesorado)', en: 'My space (students and teachers)' },
          es: [
            'Perfil con nombre, email, rol, curso y fecha de alta',
            'Contadores de préstamos activos, devueltos y vencidos',
            'Tarjeta de usuario con QR, lista para imprimir',
            'Cambio de contraseña desde el perfil',
            'Historial de préstamos con filtros: todos, activos, vencidos y devueltos',
            'Buscador y ordenación por cualquier columna',
            'QR de cada préstamo para enseñarlo al devolver el libro',
          ],
          en: [
            'Profile with name, email, role, year group and sign-up date',
            'Counters for active, returned and overdue loans',
            'Printable user card with QR code',
            'Password change from the profile',
            'Loan history with filters: all, active, overdue and returned',
            'Search and sort by any column',
            'QR code for every loan to show when returning the book',
          ],
        },
        {
          title: { es: 'Panel (dashboard)', en: 'Dashboard' },
          es: [
            'Libros disponibles, prestados, extraviados y no disponibles',
            'Préstamos activos y visitas registradas hoy',
            'Tabla con las devoluciones previstas para esta semana',
          ],
          en: [
            'Available, borrowed, lost and unavailable books',
            'Active loans and visits logged today',
            'Table of returns due this week',
          ],
        },
        {
          title: { es: 'Gestión de libros', en: 'Book management' },
          es: [
            'Alta, edición y borrado de libros, con código L_N automático',
            'Subida de la foto de portada y vista ampliada',
            'Filtros por estado, género, idioma, editorial, estantería y etiquetado',
            'Selección múltiple, también de un rango con Mayús + clic',
            'Imprimir etiquetas con QR, de un libro o de una hoja A4 entera',
            'Marcar como etiquetados los libros seleccionados',
            'Importar libros desde CSV',
            'Exportar a CSV la vista filtrada o todo el catálogo, compatible con Excel',
            'Gestión de estanterías: al renombrar una, se actualizan todos sus libros',
            'Borrado múltiple; no deja borrar un libro con préstamos activos',
            'Tabla ordenable y paginada de 50 en 50',
          ],
          en: [
            'Create, edit and delete books with an automatic L_N code',
            'Cover photo upload and enlarged view',
            'Filters by status, genre, language, publisher, shelf and labelling',
            'Multi-select, including ranges with Shift + click',
            'Print QR labels for one book or a full A4 sheet',
            'Mark selected books as labelled',
            'Import books from CSV',
            'Export the filtered view or the whole catalogue to Excel-friendly CSV',
            'Shelf management: renaming a shelf updates all its books',
            'Bulk delete; books with active loans cannot be deleted',
            'Sortable table paginated 50 at a time',
          ],
        },
        {
          title: { es: 'Préstamos', en: 'Loans' },
          es: [
            'Préstamo individual escribiendo o escaneando el código del usuario (U_N) y del libro (L_N)',
            'Comprobación en vivo de cada código, mostrando a quién o qué libro corresponde',
            'Préstamo múltiple (lote): varios libros a la vez para una clase, con un solo QR de lote',
            'No deja prestar a usuarios inactivos ni libros que no estén disponibles',
            'Devolución con un clic, que vuelve a dejar el libro disponible',
            'Edición y borrado de préstamos, también múltiple',
            'Pestañas de activos, vencidos, devueltos y todos, con su contador',
            'Filtro por mes o por rango de fechas, y búsqueda por código, lote, nombre o título',
            'Exportación a CSV de la vista o de todo el historial',
          ],
          en: [
            'Single loan by typing or scanning the user (U_N) and book (L_N) codes',
            'Live check of each code, showing which user or book it belongs to',
            'Batch loan: several books at once for a class, with a single batch QR',
            'Blocks loans to inactive users and of books that are not available',
            'One-click return that makes the book available again',
            'Edit and delete loans, including bulk delete',
            'Active, overdue, returned and all tabs with counters',
            'Filter by month or date range; search by code, batch, name or title',
            'CSV export of the current view or the full history',
          ],
        },
        {
          title: { es: 'Emails automáticos', en: 'Automatic emails' },
          es: [
            'Confirmación de cada préstamo, con el QR para devolverlo',
            'Confirmación de préstamo en lote, con la lista de libros y el QR del lote',
            'Recordatorio el día antes de la fecha de devolución, individual o por lote',
            'Tarea programada que revisa cada 5 minutos los recordatorios pendientes',
            'Si se devuelve el libro antes, el recordatorio se cancela',
            'Email de recuperación de contraseña',
            'Plantillas HTML con los colores del colegio',
            'Solo se envían desde dentro de la red del colegio: el servidor de correo (SMTP) solo es accesible desde ella',
          ],
          en: [
            'Confirmation for every loan, with the QR to return it',
            'Batch loan confirmation with the list of books and the batch QR',
            'Reminder the day before the due date, single or batch',
            'Scheduled job that checks pending reminders every 5 minutes',
            'Reminders are cancelled if the book is returned early',
            'Password recovery email',
            'HTML templates in the school colours',
            'Only sent from inside the school network: the mail server (SMTP) is only reachable from it',
          ],
        },
        {
          title: { es: 'Usuarios', en: 'Users' },
          es: [
            'Alta, edición y borrado de usuarios, con código U_N automático',
            'Activar o desactivar una cuenta con un clic; los inactivos se pueden ocultar',
            'Antes de borrar, avisa de cuántos préstamos tiene el usuario',
            'No deja borrar usuarios con préstamos activos; en el borrado múltiple dice cuáles han fallado',
            'Importar usuarios desde CSV, con una contraseña inicial común',
            '"Subida de curso": pasa a todos los alumnos al curso siguiente y da de baja a los de 2º de Bachillerato',
            'Generar un nuevo código de registro, que invalida el anterior',
            'Filtros por rol y curso, buscador y exportación a CSV',
          ],
          en: [
            'Create, edit and delete users with an automatic U_N code',
            'Activate or deactivate an account in one click; inactive users can be hidden',
            'Warns how many loans a user has before deleting',
            'Users with active loans cannot be deleted; bulk delete reports which ones failed',
            'Import users from CSV with a shared initial password',
            '"Year promotion": moves every student up a year and deactivates final-year students',
            'Generate a new registration code, invalidating the previous one',
            'Filters by role and year group, search and CSV export',
          ],
        },
        {
          title: { es: 'Registro diario de visitas', en: 'Daily visit log' },
          es: [
            'Modo escáner: se lee el QR de la tarjeta del alumno con un lector y queda registrado al momento',
            'El campo del escáner mantiene el foco solo, sin tocar el ratón',
            'Avisa si el código no es válido o si el usuario no es alumno',
            'Modo manual: buscar al alumno por nombre o código, con vista previa antes de registrar',
            'Listado por fecha con filtro por curso, búsqueda y ordenación',
            'Borrado de entradas con confirmación y paginación de 50 en 50',
          ],
          en: [
            'Scanner mode: the QR on the student card is read with a scanner and logged instantly',
            'The scanner field keeps focus by itself, no mouse needed',
            'Warns if the code is not valid or the user is not a student',
            'Manual mode: find the student by name or code, with a preview before logging',
            'List by date with year-group filter, search and sorting',
            'Delete entries with confirmation; paginated 50 at a time',
          ],
        },
        {
          title: { es: 'Actividades', en: 'Activities' },
          es: [
            'Alta, edición y borrado de actividades de la biblioteca',
            'Tipos: PYP (con sus 6 líneas), escritura creativa, indagación libre, taller de lectura, charla y otros',
            'Destinatario: un curso, el profesorado o las familias',
            'Idioma, duración, objetivos y reflexiones posteriores',
            'Subida de fotos de cada actividad, con visor ampliado y borrado',
            'Filtros por tipo, destinatario y rango de fechas, búsqueda y exportación a CSV',
          ],
          en: [
            'Create, edit and delete library activities',
            'Types: PYP (with its 6 themes), creative writing, free inquiry, reading workshop, talk and other',
            'Audience: a year group, teachers or families',
            'Language, duration, objectives and follow-up reflections',
            'Photo upload for each activity, with enlarged viewer and delete',
            'Filters by type, audience and date range; search and CSV export',
          ],
        },
        {
          title: { es: 'Estadísticas (19 informes)', en: 'Statistics (19 reports)' },
          es: [
            'Préstamos: libros más prestados, alumnos más activos, préstamos por mes y por curso, libros nunca prestados, tasa de devolución, tiempo medio de préstamo y alumnos con más retrasos',
            'Visitas: por mes, cursos con más visitas y por día de la semana',
            'Actividades: resumen general, por tipo, líneas PYP, por destinatario, por curso, evolución mensual y por idioma',
            'Periodo: este mes, trimestre, este año, curso escolar, todo o fechas personalizadas',
            'Rankings con top 5, 10, 20 o 50',
          ],
          en: [
            'Loans: most borrowed books, most active students, loans per month and per year group, never-borrowed books, return rate, average loan time and students with most delays',
            'Visits: per month, year groups with most visits and per weekday',
            'Activities: overview, by type, PYP themes, by audience, by year group, monthly trend and by language',
            'Period: this month, quarter, this year, school year, all time or custom dates',
            'Rankings with top 5, 10, 20 or 50',
          ],
        },
        {
          title: { es: 'Detalles de la interfaz', en: 'Interface details' },
          es: [
            'Menú lateral plegable y redimensionable, que recuerda cómo lo dejaste',
            'Avisos emergentes (toasts) y ventanas de confirmación antes de borrar',
            'Pie con horario, ubicación y contacto de la biblioteca',
          ],
          en: [
            'Collapsible, resizable sidebar that remembers its state',
            'Toast notifications and confirmation dialogs before deleting',
            'Footer with library hours, location and contact',
          ],
        },
      ],
      // Flujo completo de un préstamo, de principio a fin (img: captura de la galería que lo ilustra)
      flowIntro: { es: 'Ejemplo con datos de prueba: Noa García Esteban, alumna de 2º ESO, se lleva El Quijote.', en: 'Example with test data: Noa García Esteban, a Year 8 student, borrows El Quijote.' },
      flow: [
        {
          actor: 'alumno', img: './proyectos/biblioteca/login.webp',
          es: ['Crea su cuenta', 'Se registra con su email @juandelanuza.org y elige su rol y su curso. Profesorado y personal necesitan además el código de registro de la biblioteca. La biblioteca también puede darle de alta a mano o importar la clase entera desde CSV.'],
          en: ['Creates an account', 'Signs up with a @juandelanuza.org email and picks role and year group. Teachers and staff also need the library registration code. The library can also add users by hand or import a whole class from CSV.'],
        },
        {
          actor: 'alumno', img: './proyectos/biblioteca/mi-perfil.webp',
          es: ['Imprime su tarjeta', 'En "Mi espacio" tiene su tarjeta de usuario con un QR que lleva su código (U_37). La imprime con un clic y ya puede usarla en la biblioteca.'],
          en: ['Prints the library card', 'In "My space" there is a user card with a QR holding the user code (U_37). It prints in one click and is ready to use at the library.'],
        },
        {
          actor: 'alumno', img: './proyectos/biblioteca/movil-quijote.webp',
          es: ['Busca el libro desde el móvil', 'Busca El Quijote en el catálogo público, sin iniciar sesión, y en su ficha ve que está disponible y en qué estantería está.'],
          en: ['Looks the book up on the phone', 'Searches for El Quijote in the public catalogue, without logging in, and its page shows it is available and on which shelf.'],
        },
        {
          actor: 'biblioteca', img: './proyectos/biblioteca/registro-escaneo.webp',
          es: ['Registra su visita', 'Al llegar, el bibliotecario pasa la tarjeta por el lector QR. La app reconoce al alumno, muestra su nombre y curso, y con "Añadir entrada" queda apuntada la visita del día. Si el código no es de un alumno, avisa.'],
          en: ['Logs the visit', 'On arrival, the librarian scans the card with the QR reader. The app recognises the student, shows name and year group, and "Add entry" logs the visit. It warns if the code is not a student.'],
        },
        {
          actor: 'biblioteca', img: './proyectos/biblioteca/prestamo-nuevo.webp',
          es: ['Hace el préstamo', 'Escanea la tarjeta (U_37) y la etiqueta QR del libro (L_3). La app comprueba al momento que el alumno está activo y el libro disponible. Al pulsar "Crear", en una sola transacción se guarda el préstamo, el libro pasa a "prestado" y se programa el recordatorio.'],
          en: ['Creates the loan', 'Scans the card (U_37) and the book QR label (L_3). The app instantly checks the student is active and the book available. On "Create", a single transaction saves the loan, marks the book as borrowed and schedules the reminder.'],
        },
        {
          actor: 'sistema', img: './proyectos/biblioteca/email-confirmacion.webp',
          es: ['Envía la confirmación', 'Noa recibe un email con el libro, la fecha límite de devolución y un QR del préstamo. Como el servidor de correo solo es accesible desde la red del colegio, los emails salen cuando la app se usa allí.'],
          en: ['Sends the confirmation', 'Noa gets an email with the book, the due date and a QR code for the loan. Since the mail server is only reachable from the school network, emails go out when the app is used there.'],
        },
        {
          actor: 'alumno', img: './proyectos/biblioteca/mis-prestamos.webp',
          es: ['Sigue su préstamo', 'En "Mis préstamos" ve el préstamo activo con su fecha de devolución, junto al historial de todos los anteriores.'],
          en: ['Tracks the loan', 'In "My loans" the active loan appears with its due date, next to the full history.'],
        },
        {
          actor: 'sistema', img: './proyectos/biblioteca/email-recordatorio.webp',
          es: ['Recuerda la devolución', 'El día antes del vencimiento, la tarea programada le envía un recordatorio con el QR del préstamo.'],
          en: ['Reminds the return', 'The day before the due date, the scheduled job sends a reminder with the loan QR.'],
        },
        {
          actor: 'biblioteca', img: './proyectos/biblioteca/prestamo-devolucion.webp',
          es: ['Recoge el libro', 'Noa enseña el QR del préstamo (QX7M4K), desde el email o desde "Mi espacio". El bibliotecario lo escanea en el buscador de préstamos y pulsa "Devolver": el libro vuelve a estar disponible y, si quedaba un recordatorio pendiente, se cancela.'],
          en: ['Takes the book back', 'Noa shows the loan QR (QX7M4K) from the email or "My space". The librarian scans it into the loan search and clicks "Return": the book is available again and any pending reminder is cancelled.'],
        },
        {
          actor: 'biblioteca', img: './proyectos/biblioteca/estadisticas-tasa.webp',
          es: ['Queda en las estadísticas', 'La visita y el préstamo cuentan en los informes: libros más prestados, alumnos más activos, tasa de devolución a tiempo, visitas por curso…'],
          en: ['Feeds the statistics', 'The visit and the loan count in the reports: most borrowed books, most active students, on-time return rate, visits per year group…'],
        },
      ],
      images: [
        { src: './proyectos/biblioteca/catalogo.webp', alt: { es: 'Catálogo público con buscador y filtros', en: 'Public catalogue with search and filters' } },
        { src: './proyectos/biblioteca/libro.webp', alt: { es: 'Ficha de libro con su código QR', en: 'Book page with its QR code' } },
        { src: './proyectos/biblioteca/dashboard.webp', alt: { es: 'Panel de gestión con métricas', en: 'Management dashboard with metrics' } },
        { src: './proyectos/biblioteca/gestion-libros.webp', alt: { es: 'Gestión de libros: importar CSV, exportar, estanterías', en: 'Book management: CSV import, export, shelves' } },
        { src: './proyectos/biblioteca/prestamos.webp', alt: { es: 'Préstamos activos, vencidos y devueltos', en: 'Active, overdue and returned loans' } },
        { src: './proyectos/biblioteca/estadisticas.webp', alt: { es: '19 informes estadísticos', en: '19 statistical reports' } },
        { src: './proyectos/biblioteca/estadisticas-tasa.webp', alt: { es: 'Tasa de devolución y puntualidad', en: 'Return rate and punctuality' } },
        { src: './proyectos/biblioteca/actividades.webp', alt: { es: 'Gestión de actividades de la biblioteca', en: 'Library activity management' } },
        { src: './proyectos/biblioteca/registro-cuenta.webp', alt: { es: 'Creación de cuenta con rol y curso', en: 'Sign-up with role and year group' } },
        { src: './proyectos/biblioteca/registro-escaneo.webp', alt: { es: 'Registro de visita escaneando la tarjeta del alumno', en: "Visit log by scanning the student's card" } },
        { src: './proyectos/biblioteca/prestamo-nuevo.webp', alt: { es: 'Nuevo préstamo con comprobación en vivo de los códigos', en: 'New loan with live code check' } },
        { src: './proyectos/biblioteca/prestamo-devolucion.webp', alt: { es: 'Devolución: se escanea el QR del préstamo y se pulsa Devolver', en: 'Return: scan the loan QR and click Return' } },
        { src: './proyectos/biblioteca/email-confirmacion.webp', alt: { es: 'Email automático de confirmación del préstamo con QR', en: 'Automatic loan confirmation email with QR' }, mobile: true },
        { src: './proyectos/biblioteca/mi-perfil.webp', alt: { es: 'Mi espacio del alumno: perfil y tarjeta con QR', en: 'Student area: profile and QR card' } },
        { src: './proyectos/biblioteca/mis-prestamos.webp', alt: { es: 'Historial de préstamos del alumno', en: "Student's loan history" } },
        { src: './proyectos/biblioteca/email-recordatorio.webp', alt: { es: 'Email automático: recordatorio de devolución con QR', en: 'Automatic email: return reminder with QR' }, mobile: true },
        { src: './proyectos/biblioteca/email-lote.webp', alt: { es: 'Email de préstamo en lote para una clase', en: 'Batch loan email for a whole class' }, mobile: true },
        { src: './proyectos/biblioteca/email-reset.webp', alt: { es: 'Email de recuperación de contraseña', en: 'Password recovery email' }, mobile: true },
        { src: './proyectos/biblioteca/login.webp', alt: { es: 'Inicio de sesión', en: 'Login' } },
        { src: './proyectos/biblioteca/movil.webp', alt: { es: 'Catálogo en el móvil', en: 'Catalogue on mobile' }, mobile: true },
        { src: './proyectos/biblioteca/movil-quijote.webp', alt: { es: 'Ficha de un libro en el móvil', en: 'Book page on mobile' }, mobile: true },
      ],
      es: {
        summary: 'Durante mis prácticas en el Colegio Juan de Lanuza desarrollé desde cero, yo solo, la aplicación para gestionar su biblioteca. Cualquier alumno puede consultar el catálogo desde el móvil, y el personal de biblioteca gestiona libros, préstamos, usuarios, visitas y actividades desde un panel privado.',
        problem: 'La biblioteca necesitaba una herramienta propia para saber qué libros tiene, dónde están, quién los tiene prestados y cuándo vencen, además de medir el uso de la biblioteca a lo largo del curso.',
        features: [
          'Catálogo público con buscador y filtros por estado, género, idioma, editorial y estantería',
          'Préstamos individuales y en lote (para una clase entera) con devoluciones y vencidos',
          'Recordatorios automáticos por email el día antes de la devolución (tareas programadas con node-cron)',
          'Etiquetas con código QR para cada libro, listas para imprimir en A4',
          'Importación y exportación de libros y usuarios en CSV',
          '"Subida de curso": pasa a todos los alumnos al curso siguiente con un clic al acabar el año',
          'Registro de visitas diarias y gestión de actividades con fotos',
          '19 informes estadísticos: libros más prestados, tasa de devolución, visitas por día…',
          'Cuatro roles (alumno, profesorado, personal, biblioteca) y recuperación de contraseña por email',
        ],
        architecture: 'El frontend es una SPA en React 18 con React Router, Tailwind y Vite. Se comunica por HTTP con una API REST en Node.js y Express, que guarda los datos en MariaDB. Se despliega en un servidor dentro de la red local del colegio: Nginx sirve el build de React por HTTP y redirige /api al servidor Express, que se mantiene activo con PM2.',
        codeText: 'Crear un préstamo toca tres tablas: el préstamo, el estado del libro y el recordatorio. Todo va en una transacción: o se guarda todo, o nada. Así nunca queda un libro marcado como prestado sin su préstamo.',
        security: [
          'Autenticación con JWT y rutas protegidas por rol en el servidor, no solo en la interfaz',
          'Contraseñas cifradas con bcrypt',
          'Login limitado a 20 intentos cada 15 minutos por IP (express-rate-limit)',
          'Cabeceras de seguridad HTTP con helmet',
          'Recuperación de contraseña con token aleatorio de un solo uso que caduca en 1 hora',
          'La recuperación responde igual exista o no el email, para no revelar qué cuentas hay',
          'Consultas SQL parametrizadas en toda la API y columnas de ordenación validadas con lista blanca',
        ],
        next: [
          'Tests automáticos de la API y de los flujos principales',
          'Contenedores Docker para levantar todo con un comando',
          'Integración continua (CI) que pase los tests en cada cambio',
        ],
        challenges: [
          { title: 'Recordatorios fiables', text: 'Los avisos se programan dentro de la misma transacción que crea el préstamo, así nunca hay un préstamo sin su recordatorio ni un recordatorio huérfano.' },
          { title: 'Etiquetas imprimibles', text: 'Generar una hoja A4 de etiquetas con QR directamente desde el navegador, con estilos de impresión propios.' },
          { title: 'Datos de un curso entero', text: 'Importar libros y usuarios en bloque desde CSV y hacer la "subida de curso" de todos los alumnos sin errores.' },
        ],
      },
      en: {
        summary: 'During my internship at Colegio Juan de Lanuza I single-handedly built, from scratch, the application to run the school library. Any student can browse the catalogue from their phone, while library staff manage books, loans, users, visits and activities from a private dashboard.',
        problem: 'The library needed its own tool to know which books it has, where they are, who has borrowed them and when they are due, and to measure library usage throughout the school year.',
        features: [
          'Public catalogue with search and filters by status, genre, language, publisher and shelf',
          'Single and batch loans (for a whole class) with returns and overdue tracking',
          'Automatic email reminders the day before the due date (scheduled jobs with node-cron)',
          'QR code labels for every book, ready to print on A4',
          'CSV import and export for books and users',
          '"Year promotion": moves every student up a year with one click',
          'Daily visit log and activity management with photos',
          '19 statistical reports: most borrowed books, return rate, visits per weekday…',
          'Four roles (student, teacher, staff, library) and password recovery by email',
        ],
        architecture: 'The frontend is a React 18 SPA with React Router, Tailwind and Vite. It talks over HTTP to a Node.js + Express REST API backed by MariaDB. It is deployed on a server inside the school’s local network: Nginx serves the React build over HTTP and proxies /api to Express, kept alive with PM2.',
        codeText: 'Creating a loan touches three tables: the loan, the book status and the reminder. It all runs in one transaction: either everything is saved or nothing is, so a book is never marked as borrowed without its loan.',
        security: [
          'JWT authentication and role-protected routes on the server, not just in the UI',
          'Passwords hashed with bcrypt',
          'Login limited to 20 attempts per 15 minutes per IP (express-rate-limit)',
          'HTTP security headers with helmet',
          'Password recovery with a random single-use token that expires in 1 hour',
          'Recovery answers the same whether or not the email exists, so accounts are not revealed',
          'Parameterised SQL queries across the whole API, with whitelisted sort columns',
        ],
        next: [
          'Automated tests for the API and main flows',
          'Docker containers to start everything with one command',
          'Continuous integration (CI) running the tests on every change',
        ],
        challenges: [
          { title: 'Reliable reminders', text: 'Reminders are scheduled inside the same transaction that creates the loan, so there is never a loan without its reminder or an orphan reminder.' },
          { title: 'Printable labels', text: 'Generating an A4 sheet of QR labels straight from the browser with custom print styles.' },
          { title: 'A whole school year of data', text: 'Bulk-importing books and users from CSV and promoting every student to the next year without errors.' },
        ],
      },
    },
  },
]

export const skills = {
  dev: ['Kotlin', 'Java', 'JavaScript', 'React.js', 'Node.js', 'PHP', 'SQL', 'APIs REST', 'Android', 'Unity', 'POO', 'Testing'],
  tools: ['Git', 'GitHub', 'Fork', 'VS Code', 'IntelliJ IDEA', 'Android Studio', 'Eclipse', 'Unity'],
  it: ['Hardware', 'Soporte técnico', 'Diagnóstico de averías', 'Gestión de incidencias', 'Diseño de BD'],
}

const es = {
  nav: { about: 'Sobre mí', projects: 'Proyectos', experience: 'Trayectoria', skills: 'Habilidades', contact: 'Contacto' },
  hero: {
    hello: 'Hola, soy',
    roles: ['Desarrollador de software', 'Técnico de soporte', 'Desarrollador Android', 'Desarrollador web'],
    location: 'Zaragoza, España',
    cta: 'Ver proyectos',
    cv: 'Descargar CV',
    contact: 'Contactar',
  },
  about: {
    title: 'Sobre mí',
    text: 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma con experiencia como técnico informático y de soporte. Me apasiona el desarrollo de software: aprendo rápido, me gusta resolver problemas y me adapto bien a nuevos entornos tecnológicos. Creo que toda experiencia profesional aporta valor.',
    stats: [
      { value: '2+', label: 'años en soporte IT' },
      { value: '4', label: 'experiencias laborales' },
      { value: 'DAM', label: 'Técnico Superior' },
    ],
    traits: ['Calidad y rapidez', 'Trabajo en equipo', 'Pensamiento analítico', 'Aprendizaje continuo', 'Atención al detalle'],
    languages: [{ name: 'Castellano', level: 'Nativo' }, { name: 'Inglés', level: 'Medio-Alto' }],
    hobbies: 'Fuera del código: enduro, BJJ, MMA y cultura audiovisual.',
  },
  projects: { title: 'Proyectos', code: 'Código', updated: 'Actualizado', more: 'Ver proyecto', back: 'Volver al portfolio', summary: 'Resumen', problem: 'El problema', features: 'Qué hace', gallery: 'Capturas', architecture: 'Arquitectura', challenges: 'Retos', dataModel: 'Modelo de datos', allFeatures: 'Todas las funcionalidades', flow: 'Un préstamo de principio a fin', actors: { alumno: 'Alumno', biblioteca: 'Biblioteca', sistema: 'Automático' }, security: 'Seguridad', codeTitle: 'Código destacado', next: 'Siguientes pasos', close: 'Cerrar', prev: 'Anterior', next: 'Siguiente' },
  experience: {
    title: 'Trayectoria',
    work: 'Experiencia',
    education: 'Formación',
    now: 'Actualidad',
    jobs: [
      { role: 'Técnico de soporte', org: 'Cadwork Ibérica y Latinoamérica', date: 'Sep 2026 – Actualidad', points: [] },
      { role: 'Desarrollador de Software en Prácticas', org: 'Colegio Juan de Lanuza', date: 'Mar 2026 – May 2026', points: ['Desarrollo de una aplicación web de gestión bibliotecaria con React.js y Node.js'] },
      { role: 'Mozo de almacén', org: 'Frutas Sanagustín Visiedo Hijo S.L.', date: 'Jul 2025 – Ago 2025', points: [] },
      { role: 'Técnico Informático', org: 'Escuela Profesional Salesiana', date: 'Jul 2023 – Jun 2025', points: ['Mantenimiento y reparación de equipos informáticos', 'Soporte técnico presencial a usuarios internos', 'Diagnóstico y resolución de averías de hardware y software', 'Gestión de incidencias y seguimiento de tickets'] },
    ],
    studies: [
      { role: 'CFGS Desarrollo de Aplicaciones Multiplataforma', org: 'Colegio Montessori', date: '2024 – 2026', points: [] },
      { role: 'CFGM Sistemas Microinformáticos y Redes', org: 'Colegio Montessori', date: '2021 – 2023', points: [] },
    ],
  },
  skills: { title: 'Habilidades', dev: 'Desarrollo', tools: 'Herramientas', it: 'Sistemas y soporte' },
  contact: {
    title: '¿Hablamos?',
    text: 'Estoy abierto a nuevas oportunidades como desarrollador. Escríbeme y te respondo lo antes posible.',
    copy: 'Copiar email',
    copied: '¡Copiado!',
  },
  footer: 'Hecho con React y Vite',
  theme: 'Cambiar tema',
}

const en = {
  nav: { about: 'About', projects: 'Projects', experience: 'Journey', skills: 'Skills', contact: 'Contact' },
  hero: {
    hello: "Hi, I'm",
    roles: ['Software developer', 'Support technician', 'Android developer', 'Web developer'],
    location: 'Zaragoza, Spain',
    cta: 'See projects',
    cv: 'Download CV (ES)',
    contact: 'Get in touch',
  },
  about: {
    title: 'About me',
    text: 'Higher Technician in Multiplatform Application Development with experience as an IT and support technician. I am passionate about software development: I learn fast, enjoy solving problems and adapt well to new tech environments. I believe every professional experience adds value.',
    stats: [
      { value: '2+', label: 'years in IT support' },
      { value: '4', label: 'work experiences' },
      { value: 'DAM', label: 'Higher Technician' },
    ],
    traits: ['Quality and speed', 'Teamwork', 'Analytical thinking', 'Continuous learning', 'Attention to detail'],
    languages: [{ name: 'Spanish', level: 'Native' }, { name: 'English', level: 'Upper-intermediate' }],
    hobbies: 'Away from code: enduro, BJJ, MMA and film & TV.',
  },
  projects: { title: 'Projects', code: 'Code', updated: 'Updated', more: 'View project', back: 'Back to portfolio', summary: 'Overview', problem: 'The problem', features: 'What it does', gallery: 'Screenshots', architecture: 'Architecture', challenges: 'Challenges', dataModel: 'Data model', allFeatures: 'Every feature', flow: 'A loan from start to finish', actors: { alumno: 'Student', biblioteca: 'Library', sistema: 'Automatic' }, security: 'Security', codeTitle: 'Code highlight', next: 'Next steps', close: 'Close', prev: 'Previous', next: 'Next' },
  experience: {
    title: 'Journey',
    work: 'Experience',
    education: 'Education',
    now: 'Present',
    jobs: [
      { role: 'Support Technician', org: 'Cadwork Ibérica y Latinoamérica', date: 'Sep 2026 – Present', points: [] },
      { role: 'Software Developer Intern', org: 'Colegio Juan de Lanuza', date: 'Mar 2026 – May 2026', points: ['Built a library management web app with React.js and Node.js'] },
      { role: 'Warehouse Operative', org: 'Frutas Sanagustín Visiedo Hijo S.L.', date: 'Jul 2025 – Aug 2025', points: [] },
      { role: 'IT Technician', org: 'Escuela Profesional Salesiana', date: 'Jul 2023 – Jun 2025', points: ['Computer maintenance and repair', 'On-site technical support for internal users', 'Hardware and software troubleshooting', 'Incident management and ticket tracking'] },
    ],
    studies: [
      { role: 'Higher VET in Multiplatform App Development (DAM)', org: 'Colegio Montessori', date: '2024 – 2026', points: [] },
      { role: 'VET in Microcomputer Systems and Networks (SMR)', org: 'Colegio Montessori', date: '2021 – 2023', points: [] },
    ],
  },
  skills: { title: 'Skills', dev: 'Development', tools: 'Tools', it: 'Systems & support' },
  contact: {
    title: "Let's talk",
    text: "I'm open to new opportunities as a developer. Drop me a line and I'll get back to you soon.",
    copy: 'Copy email',
    copied: 'Copied!',
  },
  footer: 'Built with React and Vite',
  theme: 'Toggle theme',
}

export const texts = { es, en }
