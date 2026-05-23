PATRÓN OBSERVER
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Observer es un patrón de diseño de comportamiento que define una dependencia uno-a-muchos entre objetos, de modo que cuando un objeto cambia su estado, todos los objetos dependientes son notificados y actualizados automáticamente. Este patrón también se conoce como Publisher-Subscriber o Event Listener, y es fundamental para construir sistemas desacoplados donde los componentes no necesitan conocer los detalles internos de otros componentes para reaccionar a sus cambios.

El patrón Observer se compone de dos elementos principales. El Subject mantiene una lista de sus observadores y proporciona métodos para suscribir y desuscribir observadores. Cuando ocurre un cambio en el Subject, este notifica a todos los observadores suscritos llamando a un método específico. Los Observers son objetos que desean ser notificados sobre cambios en el Subject. Cada observer implementa un método de actualización que el Subject invoca durante la notificación.

En el contexto del Sistema de Gestión de Flotas, el patrón Observer se implementó en el frontend utilizando JavaScript vanilla, sin librerías externas. Se creó una clase EventBus que actúa como el Subject central de la aplicación. Internamente, EventBus delega en la API nativa de CustomEvent del navegador (window.dispatchEvent y window.addEventListener), evitando listeners manuales y aprovechando el sistema de eventos del DOM. Esta clase permite que cualquier componente publique eventos y que cualquier otro componente se suscriba a ellos, logrando una comunicación completamente desacoplada entre las diferentes partes del sistema.

PROBLEMA QUE RESUELVE
En la aplicación frontend de gestión de flotas, existían múltiples componentes que necesitaban estar sincronizados entre sí. Por ejemplo, cuando el usuario creaba un nuevo vehículo desde la página de Vehículos, el Dashboard debía reflejar inmediatamente ese cambio en sus estadísticas y en la sección de actividad reciente. De igual forma, al crear una orden de transporte o un reporte de mantenimiento, el Dashboard y otras vistas debían actualizarse automáticamente.

Antes de implementar el patrón Observer, la única forma de mantener los datos sincronizados era recargar manualmente la página del navegador o implementar un polling que consultara el backend cada cierto intervalo de tiempo. Ambas soluciones eran ineficientes y proporcionaban una mala experiencia de usuario. La recarga manual interrumpía el flujo de trabajo, mientras que el polling generaba tráfico innecesario hacia el servidor y tenía latencia variable.

El problema fundamental era que los componentes estaban fuertemente acoplados entre sí. El Dashboard necesitaba conocer específicamente qué otros componentes podían modificar los datos, y viceversa. Agregar un nuevo componente que modificara datos requería modificar el Dashboard para que también escuchara los cambios de ese componente. Esto violaba el principio de abierto/cerrado y dificultaba el mantenimiento del sistema.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar la clase EventBus como un singleton que actúa como el Subject central del sistema. Esta clase se apoya en la API nativa de CustomEvent del navegador: el método emit llama a window.dispatchEvent(new CustomEvent(...)) con los datos en detail, y el método subscribe usa window.addEventListener con una función wrapper que extrae e.detail antes de invocar el callback original. Para poder desuscribir correctamente, EventBus mantiene un Map que relaciona cada callback original con su wrapper, requisito indispensable de la API addEventListener/removeEventListener que exige la misma referencia de función para ambas operaciones.

La estructura de EventBus es simple pero poderosa. El método subscribe recibe el nombre del evento y la función callback que se ejecutará cuando el evento ocurra. Internamente, crea una función wrapper que se registra con addEventListener y guarda la relación callback→wrapper en un Map. El método subscribe retorna una función de limpieza que, al ser ejecutada, desuscribe automáticamente el wrapper usando removeEventListener. Esto es especialmente útil en React, donde los componentes pueden llamar esta función de limpieza en el return del useEffect para evitar fugas de memoria.

El método emit recibe el nombre del evento y un objeto de datos opcional. Cuando se invoca, llama a window.dispatchEvent(new CustomEvent(event, { detail: data })), lo que dispara el evento en el sistema nativo del navegador y notifica a todos los listeners registrados con addEventListener. Esto asegura que todos los observers sean notificados simultáneamente cuando ocurre un cambio.

Los eventos definidos en el sistema son: vehiculo:created cuando se crea un nuevo vehículo, vehiculo:deleted cuando se elimina un vehículo, vehiculo:estadoChanged cuando se cambia el estado de un vehículo, orden:created cuando se crea una nueva orden de transporte, y reporte:created cuando se genera un reporte de mantenimiento.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Observer se encuentra en el archivo frontend/src/services/EventBus.js. La clase EventBus se implementa como una exportación por defecto, creando una instancia única que es compartida por toda la aplicación.

La clase EventBus contiene tres métodos principales. El método subscribe(event, callback) registra un callback para un evento específico usando addEventListener con una función wrapper, y retorna una función que al ser ejecutada desuscribe el wrapper mediante removeEventListener. El método unsubscribe(event, callback) busca el wrapper asociado al callback en el Map interno y lo remueve con removeEventListener. El método emit(event, data) dispara un CustomEvent en window usando dispatchEvent, notificando a todos los suscriptores del evento.

El patrón Observer cuenta con dos observers concretos en el sistema. El primero es Dashboard.jsx, que se suscribe a los cinco eventos mediante un hook useEffect. Durante la inicialización del componente, se carga la primera tanda de datos y se suscriben cinco callbacks que invocan la función cargarDatos() para recargar toda la información del Dashboard. Dashboard está siempre montado en la aplicación (oculto con CSS display:none cuando no está en la ruta raíz), por lo que las suscripciones se mantienen activas permanentemente sin necesidad de reconectarse al navegar entre rutas.

El segundo observer es ToastContainer.jsx, un componente ligero montado directamente en App.jsx que se mantiene visible en cualquier ruta de la aplicación. Este componente se suscribe a los mismos cinco eventos, pero en lugar de recargar datos, muestra una notificación visual animada (toast) en la esquina superior derecha de la pantalla durante 3 segundos. Esto permite que el usuario reciba retroalimentación inmediata de sus acciones sin importar en qué página se encuentre.

Los componentes ListaVehiculos.jsx, ListaOrdenes.jsx y Reportes.jsx no utilizan EventBus directamente. En su lugar, los comandos (del patrón Command) emiten los eventos correspondientes después de ejecutar las operaciones exitosamente. Esto centraliza la lógica de emisión de eventos y asegura que solo las operaciones exitosas generen notificaciones.

El flujo completo funciona de la siguiente manera: el usuario realiza una acción como crear un vehículo desde la página Vehículos. Un CrearVehiculoCommand ejecuta la llamada API, y si es exitosa, emite vehiculo:created a través de EventBus. El Dashboard, que está suscrito a ese evento, ejecuta su callback que recarga los datos automáticamente, mientras que ToastContainer muestra la notificación "Nuevo vehículo registrado — [placa]" en la esquina superior derecha. El usuario ve los cambios reflejados y recibe retroalimentación inmediata sin necesidad de recargar la página.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Observer implementado en el sistema:

@startuml
title Patrón Observer - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

class EventBus {
    - wrappers : Map<String, Map<Function, Function>>
    + subscribe(event: String, callback: Function) : Function
    + unsubscribe(event: String, callback: Function)
    + emit(event: String, data: Object)
}

note left of EventBus
  Única instancia global en la aplicación.
  Internamente usa window.dispatchEvent(
  new CustomEvent()) y window.addEventListener.
  Mantiene un Map callback→wrapper para
  poder desuscribir con removeEventListener.
  Método subscribe retorna función de limpieza.
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
  Siempre montado (oculto con
  display:none en otras rutas).
  Se suscribe en useEffect a 5 eventos.
  Al recibir cualquier evento, recarga
  todos los datos automáticamente.
  Retorna función de limpieza que
  desuscribe todos los listeners.
end note

EventBus -left-> Dashboard : "notifica eventos (recarga datos)"

class ToastContainer {
    - toast : Object
    + mostrarNotificacion() : void
}

note right of ToastContainer
  Montado en App.jsx, visible en
  cualquier ruta. Se suscribe a los
  5 eventos y muestra un toast
  animado por 3 segundos.
end note

EventBus --> ToastContainer : "notifica eventos (muestra toast)"

class CommandHistory {
    - history : List<Command>
    + ejecutar(command: Command) : Object
    + deshacer() : void
    + getHistorial() : List<Command>
    + onCambio(callback: Function) : Function
}

CommandHistory --> EventBus : "emite eventos"

@enduml

El diagrama muestra claramente la estructura del patrón Observer. EventBus actúa como el Subject central, apoyándose en la API nativa de CustomEvent del navegador. ListaVehiculos, ListaOrdenes y Reportes son los sujetos concretos que emiten eventos a través del CommandHistory. Dashboard y ToastContainer son los observers concretos: Dashboard recarga los datos al recibir cualquier evento, mientras que ToastContainer muestra notificaciones visuales al usuario. La relación de uno a muchos se evidencia en que EventBus puede tener múltiples suscriptores para cada evento, y un mismo componente puede suscribirse a múltiples eventos.

PRUEBAS
La implementación del patrón Observer fue probada mediante la interacción directa con la interfaz de usuario. La prueba consistió en abrir el Dashboard y realizar operaciones desde diferentes páginas del sistema, verificando tanto la recarga de datos como las notificaciones visuales.

La primera prueba consistió en crear un nuevo vehículo desde la página de Vehículos. Inmediatamente después de la creación exitosa, se verificó que el Dashboard reflejara el cambio (el contador de vehículos activos se incrementó) y que apareciera el toast "Nuevo vehículo registrado — [placa]" en la esquina superior derecha, visible incluso desde la misma página Vehículos.

La segunda prueba consistió en crear una nueva orden de transporte desde la página de Órdenes. Se verificó que el Dashboard actualizara el contador de órdenes del día y que el toast "Nueva orden creada — [código]" apareciera en la página actual.

La tercera prueba consistió en generar un reporte de mantenimiento desde la página de Reportes. Se verificó que el Dashboard reflejara el cambio y que el toast "Reporte generado — [placa] · [tipo]" se mostrara correctamente.

La cuarta prueba verificó la persistencia de las suscripciones a través de la navegación. A diferencia de la implementación anterior, Dashboard ahora permanece siempre montado (oculto con CSS display:none). Se navegó entre las páginas Dashboard, Vehículos, Órdenes y Reportes, y se verificó que al crear elementos desde cualquier página, el Dashboard continuara actualizando sus datos y los toasts aparecieran sin importar la ruta activa. Esto demuestra que el patrón Observer mantiene sus suscripciones activas independientemente de la navegación del usuario.

CONCLUSIONES
La implementación del patrón Observer en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para mantener los componentes sincronizados sin acoplamiento directo entre ellos.

Los principales beneficios observados fueron la comunicación desacoplada, ya que los componentes emisores no necesitan conocer qué componentes están escuchando, ni los listeners necesitan conocer quién emitió el evento; la actualización en tiempo real, porque el Dashboard refleja los cambios inmediatamente sin necesidad de recargar la página manualmente ni implementar polling; la gestión automática de memoria, ya que cada suscripción retorna una función de limpieza que permite desuscribir los callbacks cuando el componente se desmonta; la centralización de la emisión de eventos en los comandos, lo que asegura que solo las operaciones exitosas generen notificaciones y mantiene la lógica de eventos en un solo lugar; y las notificaciones visuales en cualquier página, gracias a ToastContainer como segundo observer independiente del Dashboard.

La implementación con JavaScript vanilla, apoyándose en la API nativa de CustomEvent del navegador en lugar de un mapa de listeners manual, mantiene el proyecto ligero y sin dependencias innecesarias. La simplicidad de la implementación (aproximadamente 30 líneas de código) demuestra que no siempre se necesita una solución compleja para lograr comunicación desacoplada entre componentes.

El patrón Observer complementa los demás patrones implementados en el proyecto. Mientras que el patrón State encapsula el comportamiento de los estados de los vehículos, el patrón Observer propaga los cambios de estado a través del sistema. El patrón Strategy proporciona algoritmos de filtrado intercambiables, y el patrón Observer asegura que los resultados se actualicen cuando los datos cambian.
