PATRÓN OBSERVER
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Observer es un patrón de diseño de comportamiento que define una dependencia uno-a-muchos entre objetos, de modo que cuando un objeto cambia su estado, todos los objetos dependientes son notificados y actualizados automáticamente. Este patrón también se conoce como Publisher-Subscriber o Event Listener, y es fundamental para construir sistemas desacoplados donde los componentes no necesitan conocer los detalles internos de otros componentes para reaccionar a sus cambios.

El patrón Observer se compone de dos elementos principales. El Subject mantiene una lista de sus observadores y proporciona métodos para suscribir y desuscribir observadores. Cuando ocurre un cambio en el Subject, este notifica a todos los observadores suscritos llamando a un método específico. Los Observers son objetos que desean ser notificados sobre cambios en el Subject. Cada observer implementa un método de actualización que el Subject invoca durante la notificación.

En el contexto del Sistema de Gestión de Flotas, el patrón Observer se implementó en el frontend utilizando JavaScript vanilla, sin librerías externas. Se creó una clase EventBus que actúa como el Subject central de la aplicación. Esta clase permite que cualquier componente publique eventos y que cualquier otro componente se suscriba a ellos, logrando una comunicación completamente desacoplada entre las diferentes partes del sistema.

PROBLEMA QUE RESUELVE
En la aplicación frontend de gestión de flotas, existían múltiples componentes que necesitaban estar sincronizados entre sí. Por ejemplo, cuando el usuario creaba un nuevo vehículo desde la página de Vehículos, el Dashboard debía reflejar inmediatamente ese cambio en sus estadísticas y en la sección de actividad reciente. De igual forma, al crear una orden de transporte o un reporte de mantenimiento, el Dashboard y otras vistas debían actualizarse automáticamente.

Antes de implementar el patrón Observer, la única forma de mantener los datos sincronizados era recargar manualmente la página del navegador o implementar un polling que consultara el backend cada cierto intervalo de tiempo. Ambas soluciones eran ineficientes y proporcionaban una mala experiencia de usuario. La recarga manual interrumpía el flujo de trabajo, mientras que el polling generaba tráfico innecesario hacia el servidor y tenía latencia variable.

El problema fundamental era que los componentes estaban fuertemente acoplados entre sí. El Dashboard necesitaba conocer específicamente qué otros componentes podían modificar los datos, y viceversa. Agregar un nuevo componente que modificara datos requería modificar el Dashboard para que también escuchara los cambios de ese componente. Esto violaba el principio de abierto/cerrado y dificultaba el mantenimiento del sistema.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar la clase EventBus como un singleton que actúa como el Subject central del sistema. Esta clase mantiene un mapa de eventos, donde cada clave es el nombre del evento y cada valor es una lista de funciones callback suscritas a ese evento. Los componentes pueden suscribirse a eventos específicos utilizando el método subscribe, desuscribirse con unsubscribe, y emitir eventos con emit.

La estructura de EventBus es simple pero poderosa. El método subscribe recibe el nombre del evento y la función callback que se ejecutará cuando el evento ocurra. Internamente, si el evento no existe en el mapa, crea una nueva lista y agrega el callback. El método subscribe retorna una función de limpieza que, al ser ejecutada, desuscribe automáticamente el callback. Esto es especialmente útil en React, donde los componentes pueden llamar esta función de limpieza en el return del useEffect para evitar fugas de memoria.

El método emit recibe el nombre del evento y un objeto de datos opcional. Cuando se invoca, recorre todas las funciones callback suscritas a ese evento y las ejecuta, pasando los datos como argumento. Esto asegura que todos los observers sean notificados simultáneamente cuando ocurre un cambio.

Los eventos definidos en el sistema son: vehiculo:created cuando se crea un nuevo vehículo, vehiculo:deleted cuando se elimina un vehículo, vehiculo:estadoChanged cuando se cambia el estado de un vehículo, orden:created cuando se crea una nueva orden de transporte, y reporte:created cuando se genera un reporte de mantenimiento.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Observer se encuentra en el archivo frontend/src/services/EventBus.js. La clase EventBus se implementa como una exportación por defecto, creando una instancia única que es compartida por toda la aplicación.

La clase EventBus contiene tres métodos principales. El método subscribe(event, callback) registra un callback para un evento específico y retorna una función que al ser ejecutada desuscribe el callback automáticamente. El método unsubscribe(event, callback) remueve un callback específico de la lista de suscriptores de un evento. El método emit(event, data) notifica a todos los suscriptores de un evento, ejecutando sus callbacks con los datos proporcionados.

En el componente Dashboard.jsx, la integración con EventBus se realiza mediante un hook useEffect. Durante la inicialización del componente, se carga la primera tanda de datos y se suscriben cinco callbacks a los eventos correspondientes. Cada callback invoca la función cargarDatos() que recarga toda la información del Dashboard. El hook useEffect retorna una función de limpieza que desuscribe todos los callbacks, asegurando que no haya fugas de memoria cuando el componente se desmonta.

Los componentes ListaVehiculos.jsx, ListaOrdenes.jsx y Reportes.jsx no utilizan EventBus directamente. En su lugar, los comandos (del patrón Command) emiten los eventos correspondientes después de ejecutar las operaciones exitosamente. Esto centraliza la lógica de emisión de eventos y asegura que solo las operaciones exitosas generen notificaciones.

El flujo completo funciona de la siguiente manera: el usuario realiza una acción como crear un vehículo. Un CrearVehiculoCommand ejecuta la llamada API, y si es exitosa, emite vehiculo:created a través de EventBus. El Dashboard, que está suscrito a ese evento, ejecuta su callback que recarga los datos automáticamente. El usuario ve los cambios reflejados sin necesidad de recargar la página.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Observer implementado en el sistema:

@startuml
title Patrón Observer - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

class EventBus {
    - listeners : Map<String, List<Function>>
    + subscribe(event: String, callback: Function) : Function
    + unsubscribe(event: String, callback: Function)
    + emit(event: String, data: Object)
}

note left of EventBus
  Única instancia global en la aplicación.
  Método subscribe retorna una función
  de limpieza para el unsubscribe automático.
end note

note "Eventos emitidos:\n
  vehiculo:created\n
  vehiculo:deleted\n
  vehiculo:estadoChanged\n
  orden:created\n
  reporte:created" as eventos
EventBus .. eventos

class ListaVehiculos {
    + crearVehiculo() : void
    + eliminarVehiculo() : void
    + cambiarEstado() : void
}

class ListaOrdenes {
    + crearOrden() : void
}

class Reportes {
    + crearReporte() : void
}

ListaVehiculos -right-> EventBus : "emite eventos"
ListaOrdenes -right-> EventBus : "emite eventos"
Reportes -right-> EventBus : "emite eventos"

class Dashboard {
    - vehiculos : List
    - ordenes : List
    - reportes : List
    + cargarDatos() : void
}

note bottom of Dashboard
  Se suscribe en useEffect a 5 eventos.
  Al recibir cualquier evento, recarga
  todos los datos automáticamente.
  Retorna función de limpieza que
  desuscribe todos los listeners.
end note

EventBus -left-> Dashboard : "notifica eventos"

class CommandHistory {
    - history : List<Command>
    + ejecutar(command: Command) : Object
    + deshacer() : void
    + getHistorial() : List<Command>
    + onCambio(callback: Function) : Function
}

CommandHistory --> EventBus : "emite eventos"

@enduml

El diagrama muestra claramente la estructura del patrón Observer. EventBus actúa como el Subject central. ListaVehiculos, ListaOrdenes y Reportes son los sujetos concretos que emiten eventos a través del CommandHistory. Dashboard es el observer concreto que se suscribe a los eventos y actualiza su estado. La relación de uno a muchos se evidencia en que EventBus puede tener múltiples suscriptores para cada evento, y un mismo componente puede suscribirse a múltiples eventos.

PRUEBAS
La implementación del patrón Observer fue probada mediante la interacción directa con la interfaz de usuario. La prueba consistió en abrir el Dashboard y otra página del sistema en pestañas separadas del navegador, simulando el uso real de la aplicación.

La primera prueba consistió en crear un nuevo vehículo desde la página de Vehículos. Inmediatamente después de la creación exitosa, se verificó que el Dashboard en la otra pestaña reflejara el cambio. El contador de vehículos activos se incrementó y el nuevo vehículo apareció en la sección de actividad reciente.

La segunda prueba consistió en crear una nueva orden de transporte desde la página de Órdenes. Se verificó que el Dashboard actualizara el contador de órdenes del día y mostrara la nueva orden en la actividad reciente.

La tercera prueba consistió en generar un reporte de mantenimiento desde la página de Reportes. Se verificó que el Dashboard reflejara el cambio en sus secciones correspondientes.

La cuarta prueba fue la desuscripción. Se navegó fuera del Dashboard y se verificó que al crear nuevos elementos, el Dashboard no recibiera notificaciones (comportamiento esperado ya que el componente se desmonta). Al regresar al Dashboard, este cargó los datos frescos y se suscribió nuevamente a los eventos.

CONCLUSIONES
La implementación del patrón Observer en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para mantener los componentes sincronizados sin acoplamiento directo entre ellos.

Los principales beneficios observados fueron la comunicación desacoplada, ya que los componentes emisores no necesitan conocer qué componentes están escuchando, ni los listeners necesitan conocer quién emitió el evento; la actualización en tiempo real, porque el Dashboard refleja los cambios inmediatamente sin necesidad de recargar la página manualmente ni implementar polling; la gestión automática de memoria, ya que cada suscripción retorna una función de limpieza que permite desuscribir los callbacks cuando el componente se desmonta; y la centralización de la emisión de eventos en los comandos, lo que asegura que solo las operaciones exitosas generen notificaciones y mantiene la lógica de eventos en un solo lugar.

El patrón Observer se integra perfectamente con el patrón Command implementado en el mismo frontend. Cada comando, después de ejecutar exitosamente su operación, emite el evento correspondiente a través de EventBus. Esto crea una arquitectura donde las acciones del usuario se encapsulan en comandos, se ejecutan a través de un historial, y las notificaciones se propagan automáticamente a todos los componentes interesados.

La implementación con JavaScript vanilla, sin depender de librerías externas como Redux o MobX, mantiene el proyecto ligero y sin dependencias innecesarias. La simplicidad de la implementación (aproximadamente 25 líneas de código) demuestra que no siempre se necesita una solución compleja para lograr comunicación desacoplada entre componentes.

El patrón Observer complementa los demás patrones implementados en el proyecto. Mientras que el patrón State encapsula el comportamiento de los estados de los vehículos, el patrón Observer propaga los cambios de estado a través del sistema. El patrón Strategy proporciona algoritmos de filtrado intercambiables, y el patrón Observer asegura que los resultados se actualicen cuando los datos cambian.
