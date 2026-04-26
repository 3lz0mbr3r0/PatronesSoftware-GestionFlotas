PATRÓN de DISEÑO FACADE (Fachada)
Escenario sin Facade

o Un caso del sistema de gestión académica: “Registrar matrícula de
estudiante”, donde un cliente debe coordinar muchas clases:
EstudianteService, CursoService, HorarioService, PagoService,
NotificacionService, etc.
o Pseudocódigo de un controlador o UI que hace demasiadas llamadas
directas a múltiples servicios (alta complejidad, muchos imports, difícil
de testear).
// Controlador o capa de UI para el caso de uso "Registrar matrícula"
class MatriculaController {
// Dependencias directas a múltiples servicios del subsistema
EstudianteService estudianteService
CursoService cursoService
HorarioService horarioService
PagoService pagoService
NotificacionService notificacionService
method registrarMatricula(idEstudiante, idCurso, datosPago, preferenciasHorario):
// 1. Obtener entidades básicas
estudiante = estudianteService.buscarPorId(idEstudiante)
if estudiante == null:
mostrarError("Estudiante no encontrado")
return
curso = cursoService.buscarPorId(idCurso)
if curso == null:
mostrarError("Curso no encontrado")
return
// 2. Validar cupos del curso
tieneCupos = cursoService.tieneCupos(curso)
if not tieneCupos:
mostrarError("No hay cupos disponibles para el curso")
return
// 3. Validar conflictos de horario
horarioActual = horarioService.obtenerHorarioDeEstudiante(estudiante)
horarioCurso = horarioService.obtenerHorarioDeCurso(curso)

existeConflicto = horarioService.hayConflicto(horarioActual, horarioCurso, preferenciasHorario)
if existeConflicto:
mostrarError("Conflicto de horario con otras materias inscritas")
return
// 4. Procesar pago
pagoExitoso = pagoService.procesarPago(estudiante, curso, datosPago)
if not pagoExitoso:
mostrarError("No fue posible procesar el pago de la matrícula")
return
// 5. Registrar la inscripción del estudiante en el curso
try:
cursoService.inscribirEstudianteEnCurso(curso, estudiante)
catch Exception e:
// En un sistema real se haría rollback de pago, etc.
mostrarError("Error al registrar la matrícula: " + e.mensaje)
return
// 6. Registrar actualización de horario
horarioService.actualizarHorarioEstudiante(estudiante, horarioCurso)
// 7. Enviar notificación de confirmación
notificacionService.enviarCorreoConfirmacionMatricula(estudiante, curso)
notificacionService.enviarNotificacionApp(estudiante, "Matrícula confirmada en " + curso.nombre)
// 8. Mostrar resultado en la UI
mostrarMensaje("Matrícula registrada exitosamente para el curso " + curso.nombre)
redirigirAResumenMatricula(estudiante)

Discusión

o ¿Qué problemas ven?: alto acoplamiento, dificultad para cambiar
servicios internos, código duplicado en distintos puntos de entrada
(web, batch, API externa).
o Idea intuitiva de una “fachada”: un único punto de entrada simplificado
que orquesta la lógica compleja.
2. Definición formal y estructura

Definición conceptual

o Propósito: “Proporcionar una interfaz unificada y simplificada a un
subsistema de interfaces más complejas.”
o NO agrega funcionalidad nueva, sino que encapsula complejidad y
reduce acoplamiento entre cliente y subsistema.
Elementos clave (desde la perspectiva GoF)
o Participantes:
▪ Cliente: código que usa la fachada.
▪ Facade: clase que expone operaciones de alto nivel.
▪ Subsistema (clases internas): servicios, repositorios, APIs que
realizan el trabajo real.
o Colaboraciones:
▪ El cliente solo conoce la fachada.
▪ La fachada conoce y coordina los componentes del subsistema.
Diagrama UML simple
o El patrón no prohíbe que el cliente use directamente las clases del
subsistema, pero en una buena arquitectura se minimiza ese
acoplamiento.
Comparaciones rápidas para evitar confusiones
o Facade vs. Adapter:
▪ Facade simplifica un conjunto de interfaces; Adapter hace
compatible una interfaz existente con otra esperada.
o Facade vs. Mediator:
▪ Facade organiza el acceso a un subsistema; Mediator coordina
la interacción entre objetos pares.
3. Ejemplo en Java
Objetivo: Cómo se implementa y qué beneficios trae al código.

Diseñar un mini-subsistema del sistema de gestión académica
o Clases sugeridas:
▪ EstudianteService: registrarEstudiante(), obtenerHistorial().
▪ CursoService: verificarCupos(), inscribirEstudiante().
▪ PagoService: registrarPago(), validarEstadoPago().
▪ NotificacionService: enviarCorreoConfirmacion().
o Presentar primero la visión “sin fachada”: el controlador o capa UI
llamando a todas esas clases directamente.
Implementar la Facade
o Crear una clase: SistemaAcademicoFacade o MatriculaFacade.
o Métodos típicos de fachada:
▪ registrarMatricula(Estudiante e, Curso c)
▪ cancelarMatricula(Estudiante e, Curso c)
o Dentro de registrarMatricula:
▪ Llamar a verificarCupos(), validarEstadoPago(),
inscribirEstudiante(), enviarCorreoConfirmacion(), manejando
excepciones y orden adecuado.
Mostrar código antes y después
o Antes:
▪ Controlador con 10–15 líneas de orquestación, múltiples
dependencias a servicios.
o Después:
▪ Controlador que solo invoca facade.registrarMatricula(e, c).
o Discutir:
▪ Menos acoplamiento a clases concretas del subsistema.
▪ Punto único para cambiar el flujo de negocio sin tocar a los
clientes.
▪ Mejora en testabilidad: se puede mockear la Facade en vez de
todos los servicios internos.
Buenas prácticas en la implementación
o La fachada suele estar en una capa de aplicación (application service)
o “servicio de orquestación”.
o No meter toda la lógica del dominio en la fachada; mantener regla: la
fachada coordina, las reglas siguen viviendo en servicios/entidades de
dominio.
o Relación con DI/IoC: inyectar dependencias (servicios internos) en la
fachada en lugar de crearlas con new.
4. Aplicación al proyecto integrador
Objetivo: aterrizar el patrón en el proyecto de curso y generar evidencia práctica
según la lógica del plan (portafolio de código y UML).

Conexión con el proyecto integrador
o Recordar que están desarrollando un sistema de gestión académica
que debe aplicar patrones estructurales.
o Pedir que identifiquen algún módulo donde hoy el controlador/UI esté
altamente acoplado a muchos servicios (matrículas, generación de
reportes académicos, gestión de horarios, etc.).
o Breve explicación escrita (5–10 líneas):
▪ ¿Qué problema resolvió la fachada?
▪ ¿Qué cambió en términos de acoplamiento y mantenibilidad?
Preguntas de cierre para discusión
o ¿Qué impacto tiene Facade en la curva de aprendizaje de un nuevo
desarrollador que entra al proyecto?
o ¿Qué riesgos hay si se hace una “super-Facade” demasiado grande?
o ¿Cómo se combina Facade con otros patrones estructurales (p. ej.
Adapter, Composite) en el mismo subsistema?