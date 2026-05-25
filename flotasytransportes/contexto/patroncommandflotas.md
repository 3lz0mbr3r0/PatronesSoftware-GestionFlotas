PATRÓN COMMAND
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Command es un patrón de diseño de comportamiento que convierte una solicitud en un objeto independiente que contiene toda la información sobre la solicitud. Esta transformación permite parametrizar clientes con diferentes solicitudes, encolar o registrar solicitudes, y soportar operaciones que pueden deshacerse.

El patrón Command se compone de cuatro elementos principales. El Command declara una interfaz para ejecutar una operación, generalmente con un método execute(). Los Concrete Commands implementan la interfaz y definen la relación entre un receptor y una acción específica. El Invoker se encarga de ejecutar los comandos y puede mantener un historial de los comandos ejecutados. El Receiver es el objeto que sabe cómo llevar a cabo la operación asociada al comando.

La principal ventaja del patrón Command es que separa el objeto que invoca la operación del objeto que sabe cómo realizarla. Esto permite una gran flexibilidad: los comandos pueden ser almacenados, pasados como parámetros, serializados, y lo más importante, pueden ser deshechos si se implementa el método undo().

En el contexto del frontend del Sistema de Gestión de Flotas, el patrón Command se implementó para encapsular todas las operaciones principales del sistema: crear vehículo, eliminar vehículo, cambiar estado de vehículo, crear orden de transporte y crear reporte de mantenimiento. Cada operación se encapsula en un objeto Command que sabe cómo ejecutarse y, en algunos casos, cómo deshacerse.

PROBLEMA QUE RESUELVE
En la aplicación frontend del sistema de gestión de flotas, las operaciones principales (crear vehículo, eliminar vehículo, cambiar estado, crear orden, crear reporte) estaban implementadas directamente en los componentes de React. Cada componente contenía su propia lógica para llamar a la API, manejar errores y actualizar el estado local.

Este enfoque presentaba varios problemas graves. El primer problema era la imposibilidad de deshacer operaciones, ya que no existía un historial de acciones realizadas que permitiera revertir cambios. Si un usuario cambiaba accidentalmente el estado de un vehículo, no había forma de restaurar el estado anterior. El segundo problema era la dificultad para auditar las operaciones, porque no existía un registro centralizado de las acciones realizadas en el sistema. El tercer problema era la duplicación de lógica, ya que el manejo de errores, la actualización del estado local y la notificación a otros componentes se repetían en cada operación. El cuarto problema era el acoplamiento entre la lógica de negocio y la interfaz de usuario, haciendo difícil probar y mantener las operaciones independientemente de los componentes de React.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón Command en el archivo frontend/src/patterns/comandos/index.js. Se creó una clase base Command que define la interfaz con tres métodos: execute() que ejecuta la operación, undo() que revierte la operación, y getDescripcion() que retorna una descripción legible del comando para mostrar en el historial.

Se implementaron cinco comandos concretos. CrearVehiculoCommand encapsula la creación de un vehículo. En su constructor recibe el tipo y los datos del vehículo. En execute(), llama a vehiculosService.createByTipo(), guarda la placa del vehículo creado para poder deshacer la operación, y emite el evento vehiculo:created a través de EventBus. En undo(), si existe una placa creada, elimina el vehículo del backend y emite vehiculo:deleted.

EliminarVehiculoCommand encapsula la eliminación de un vehículo. En execute(), llama a vehiculosService.delete() y emite vehiculo:deleted. Su método undo() lanza un error porque no es posible restaurar un vehículo eliminado sin tener todos sus datos almacenados.

CambiarEstadoCommand encapsula el cambio de estado de un vehículo. En su constructor recibe la placa, el nuevo estado y el estado anterior. En execute(), llama a vehiculosService.updateEstado() y emite vehiculo:estadoChanged. En undo(), restaura el estado anterior llamando nuevamente a la API, lo que lo convierte en el comando con la funcionalidad de deshacer más completa.

CrearOrdenCommand encapsula la creación de una orden de transporte. En execute(), llama a ordenesService.crearYAsignar(), guarda el resultado, y emite orden:created. Su método undo() lanza un error porque no existe un endpoint para eliminar órdenes.

CrearReporteCommand encapsula la creación de un reporte de mantenimiento. En execute(), llama a reportesService.create(), guarda el resultado, y emite reporte:created. Su método undo() lanza un error similar al de CrearOrdenCommand.

La clase CommandHistory actúa como el Invoker del patrón. Es un singleton que mantiene una lista de comandos ejecutados. Su método ejecutar(command) ejecuta el comando, lo agrega al historial y notifica a los listeners. Su método deshacer() toma el último comando del historial y ejecuta su método undo(), lanzando un error si el historial está vacío. Su método getHistorial() retorna una copia del historial para que los componentes puedan mostrar la lista de comandos ejecutados. Su método onCambio(callback) permite que los componentes se suscriban a los cambios en el historial, reciban una función de limpieza para desuscribirse cuando el componente se desmonta.

El componente CommandPanel actúa como la interfaz visual del patrón Command. Es un botón flotante con el ícono ⚡ que se muestra en la esquina inferior derecha de todas las páginas del sistema. Al hacer click, se abre un panel que muestra el historial de comandos ejecutados, ordenados del más reciente al más antiguo. Cada comando muestra su descripción obtenida mediante getDescripcion(). El último comando ejecutado tiene un botón "↩ Deshacer" que, al ser presionado, deshace el comando llamando a commandHistory.deshacer().

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Command se distribuye en dos archivos principales. El archivo frontend/src/patterns/comandos/index.js contiene la definición de la clase base Command, los cinco comandos concretos y la clase CommandHistory. El archivo frontend/src/components/Command/CommandPanel.jsx contiene el componente de React que muestra el historial de comandos.

La clase base Command se implementa como una clase de JavaScript con métodos que lanzan excepciones, indicando que deben ser sobrescritos por las subclases. Esto simula el comportamiento de una interfaz en lenguajes como Java.

Los comandos concretos extienden Command y reciben todos los parámetros necesarios en sus constructores. Por ejemplo, CambiarEstadoCommand recibe placa, nuevoEstado y estadoAnterior. El estadoAnterior es crucial para poder deshacer la operación, ya que permite restaurar el estado original.

La clase CommandHistory utiliza un array para almacenar el historial y otro array para los listeners. Cuando se ejecuta un comando, se recorre el array de listeners y se notifica a cada uno. Esto permite que CommandPanel se actualice automáticamente cuando se ejecuta o deshace un comando.

El componente CommandPanel utiliza un estado local para controlar si el panel está abierto o cerrado, y otro estado para almacenar la lista de comandos. Se suscribe a los cambios del CommandHistory mediante el método onCambio, y se desuscribe automáticamente cuando el componente se desmonta gracias a la función de limpieza retornada por onCambio.

La integración del CommandPanel en la aplicación se realizó en App.jsx, renderizando el componente fuera del sistema de rutas para que esté disponible en todas las páginas. El panel se posiciona con CSS fixed en la esquina inferior derecha, superponiéndose al contenido de la página.

Los comandos se integran en los componentes existentes reemplazando las llamadas directas a la API. Por ejemplo, en ListaVehiculos.jsx, la función handleSubmit ahora crea un CrearVehiculoCommand y lo ejecuta a través de commandHistory.ejecutar(), en lugar de llamar directamente a vehiculosService.createByTipo(). De manera similar, handleEstadoChange utiliza CambiarEstadoCommand y handleDelete utiliza EliminarVehiculoCommand.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Command implementado en el sistema:

@startuml
title Patrón Command - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

class Command {
    + execute() : Object
    + undo() : void
    + getDescripcion() : String
}

note top of Command
  Interfaz que define el contrato
  para todas las operaciones del sistema.
  execute(): ejecuta la operación.
  undo(): revierte la operación.
  getDescripcion(): texto legible para el historial.
end note

class CrearVehiculoCommand {
    - tipo : String
    - vehiculoData : Object
    - placaCreada : String
    + execute() : Object
    + undo() : void
    + getDescripcion() : String
}

class EliminarVehiculoCommand {
    - placa : String
    + execute() : Object
    + undo() : void
    + getDescripcion() : String
}

class CambiarEstadoCommand {
    - placa : String
    - nuevoEstado : String
    - estadoAnterior : String
    + execute() : Object
    + undo() : void
    + getDescripcion() : String
}

class CrearOrdenCommand {
    - ordenData : Object
    - resultado : Object
    + execute() : Object
    + undo() : void
    + getDescripcion() : String
}

class CrearReporteCommand {
    - dto : Object
    - resultado : Object
    + execute() : Object
    + undo() : void
    + getDescripcion() : String
}

Command <|.. CrearVehiculoCommand
Command <|.. EliminarVehiculoCommand
Command <|.. CambiarEstadoCommand
Command <|.. CrearOrdenCommand
Command <|.. CrearReporteCommand

class CommandHistory {
    - history : List<Command>
    - listeners : List<Function>
    + ejecutar(command: Command) : Object
    + deshacer() : void
    + getHistorial() : List<Command>
    + onCambio(callback: Function) : Function
}

note bottom of CommandHistory
  Singleton que recibe comandos,
  los ejecuta y los guarda en
  el historial. Proporciona
  deshacer() y notifica cambios
  a los listeners (CommandPanel).
end note

CommandHistory --> Command : "ejecuta/deshace"

class CommandPanel {
    - abierto : boolean
    - comandos : List<Command>
    + handleDeshacer() : void
}

note bottom of CommandPanel
  Botón flotante ⚡ en esquina
  inferior derecha. Al abrirse,
  muestra el historial de comandos
  ejecutados con botón "↩ Deshacer"
  en el último comando.
end note

CommandPanel --> CommandHistory : "observa"

note right of CrearVehiculoCommand
  Al execute(): llama vehiculosService.createByTipo(),
  guarda la placa creada, emite 'vehiculo:created'.
  Al undo(): elimina el vehículo por placa.
end note

note right of CambiarEstadoCommand
  Al execute(): llama vehiculosService.updateEstado().
  Al undo(): restaura el estadoAnterior.
  Sí tiene undo funcional.
end note

note right of EliminarVehiculoCommand
  Al execute(): llama vehiculosService.delete().
  Al undo(): lanza error porque no se puede
  restaurar un vehículo eliminado sin datos.
end note

@enduml

El diagrama muestra claramente la estructura del patrón Command. La interfaz Command define el contrato común con execute(), undo() y getDescripcion(). Los cinco comandos concretos implementan operaciones específicas del sistema. CommandHistory actúa como el Invoker, manteniendo el historial y ejecutando/deshaciendo comandos. CommandPanel es el cliente que muestra el historial visualmente y permite al usuario deshacer operaciones.

PRUEBAS
La implementación del patrón Command fue probada mediante la interacción directa con la interfaz de usuario y la verificación del panel de historial.

La primera prueba consistió en abrir el panel de comandos haciendo click en el botón ⚡. Se verificó que el panel se abriera mostrando el mensaje "No hay comandos ejecutados aún" cuando el historial estaba vacío.

La segunda prueba consistió en crear un vehículo desde la página de Vehículos. Después de la creación exitosa, se abrió el panel y se verificó que apareciera el comando "Crear vehículo CAMION - ABC-123" en el historial.

La tercera prueba consistió en cambiar el estado de un vehículo de MANTENIMIENTO a DISPONIBLE. Se verificó que apareciera el comando "Cambiar estado ABC-123 DISPONIBLE" en el historial. Luego se presionó el botón "↩ Deshacer" y se verificó que el vehículo volviera al estado MANTENIMIENTO.

La cuarta prueba consistió en eliminar un vehículo. Se verificó que apareciera el comando "Eliminar vehículo XYZ-789" en el historial. Se intentó deshacer la eliminación y se verificó que apareciera el mensaje de error "No se puede deshacer una eliminación".

La quinta prueba consistió en crear una orden y un reporte, y verificar que ambos aparecieran en el historial con sus descripciones correspondientes.

La sexta prueba verificó que el contador rojo en el botón ⚡ se actualizara correctamente, mostrando el número de comandos ejecutados.

CONCLUSIONES
La implementación del patrón Command en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para encapsular todas las operaciones del sistema como objetos independientes.

Los principales beneficios observados fueron la capacidad de deshacer operaciones, especialmente el cambio de estado de vehículos que ahora puede revertirse fácilmente; el registro centralizado de todas las operaciones en el historial, permitiendo auditar las acciones realizadas en el sistema; la separación entre la lógica de negocio y la interfaz de usuario, ya que los comandos contienen toda la lógica de ejecución y los componentes solo se encargan de la presentación; la facilidad para agregar nuevas operaciones, porque solo se necesita crear una nueva clase que extienda Command; y la integración natural con el patrón Observer, ya que cada comando emite eventos después de ejecutarse exitosamente.

El patrón Command se integra perfectamente con los otros patrones del frontend. Cada comando, después de ejecutar su operación, emite un evento a través de EventBus (Observer), lo que permite que el Dashboard se actualice automáticamente. El CommandPanel proporciona una interfaz visual que hace tangible el concepto del patrón Command, permitiendo a los usuarios ver el historial y deshacer operaciones con un solo click.

La implementación demuestra que el patrón Command puede implementarse efectivamente en JavaScript para aplicaciones React, proporcionando todos los beneficios del patrón sin la complejidad de lenguajes fuertemente tipados. La combinación de Command con Observer y el panel visual crea una arquitectura robusta y fácil de mantener que mejora significativamente la experiencia del usuario.
