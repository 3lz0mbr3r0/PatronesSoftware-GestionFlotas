PATRÓN MEMENTO
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Memento es un patrón de diseño de comportamiento que permite capturar y externalizar el estado interno de un objeto sin violar la encapsulación, de modo que el objeto pueda restaurarse a ese estado posteriormente. Este patrón es fundamental para implementar funcionalidades de deshacer (undo) y rehacer (redo) en aplicaciones, ya que permite mantener un historial de estados sin exponer la estructura interna de los objetos.

El patrón Memento se compone de tres elementos principales. El Originator es el objeto cuyo estado se desea guardar y restaurar. El Originator crea instancias de Memento que contienen una instantánea de su estado actual, y puede restaurar su estado a partir de un Memento recibido. El Memento es un objeto inmutable que almacena el estado interno del Originator. El Caretaker es el encargado de administrar los Mementos, manteniendo un historial de ellos sin acceder a su contenido interno.

La principal ventaja del patrón Memento es que preserva la encapsulación del Originator. Aunque el Memento almacena el estado interno, solo el Originator tiene acceso a él. El Caretaker manipula los Mementos sin conocer su estructura interna, simplemente los almacena y los pasa al Originator cuando es necesario restaurar un estado.

En el contexto del frontend del Sistema de Gestión de Flotas, el patrón Memento se implementó para permitir la navegación hacia adelante y hacia atrás en el historial de consultas de vehículos. Cada vez que el usuario selecciona un vehículo diferente en la página Historial por Vehículo, se guarda un snapshot del estado completo (información del vehículo, reportes, órdenes, proyección), permitiendo al usuario navegar entre las consultas anteriores mediante botones de deshacer y rehacer.

PROBLEMA QUE RESUELVE
El componente HistorialVehiculo.jsx permite a los usuarios seleccionar un vehículo de un dropdown y ver toda su información consolidada: datos del vehículo, reportes de mantenimiento, órdenes de transporte y proyección de mantenimiento. Cada vez que el usuario selecciona un vehículo diferente, el componente realiza consultas al backend y reemplaza completamente la información mostrada.

Este comportamiento presentaba un problema importante de experiencia de usuario: no había forma de volver a la información de un vehículo consultado anteriormente sin volver a seleccionarlo manualmente en el dropdown. Si el usuario consultaba el vehículo ABC-123, luego el DEF-456 y luego el GHI-789, no podía regresar rápidamente a ABC-123 sin navegar por el dropdown y esperar las consultas API nuevamente.

El problema se agravaba porque las consultas al backend son asíncronas y pueden tomar varios segundos dependiendo de la cantidad de datos. Volver a consultar un vehículo implicaba esperar nuevamente la respuesta del servidor. Además, no existía un historial visual de las consultas realizadas, por lo que el usuario no tenía forma de saber qué vehículos había consultado previamente.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón Memento en tres archivos de la carpeta frontend/src/patterns/memento/. Se creó la clase MementoHistorial que actúa como el Memento, almacenando el estado completo de la vista en un campo privado #estado que solo es accesible mediante el método getEstado(). Se creó la clase OriginadorHistorial que actúa como el Originator, manteniendo el estado actual y proporcionando los métodos crearMemento() y restaurar(). Se creó la clase CuidadorHistorial que actúa como el Caretaker, administrando las pilas de undo y redo.

La clase MementoHistorial almacena cinco campos en su estado privado: placa del vehículo seleccionado, datos del vehículo (objeto completo), lista de reportes de mantenimiento, lista de órdenes de transporte y datos de proyección de mantenimiento. El constructor recibe el estado y un nombre descriptivo para el snapshot, y utiliza deepClone (JSON.parse(JSON.stringify)) para asegurar que el estado almacenado sea una copia independiente y no una referencia al estado original.

La clase OriginadorHistorial mantiene una propiedad estado con la misma estructura que el Memento. Su método setEstado(nuevoEstado) actualiza el estado actual. Su método crearMemento(nombre) genera un nuevo MementoHistorial a partir del estado actual y retorna el snapshot. Su método restaurar(memento) recibe un MementoHistorial, extrae el estado mediante getEstado() y actualiza el estado actual.

La clase CuidadorHistorial recibe en su constructor una referencia al OriginadorHistorial y un tamaño máximo de historial (por defecto 20). Mantiene dos pilas: undoStack para los snapshots anteriores y redoStack para los snapshots que se han deshecho. El método guardar(nombre) limpia la pila de redo (ya que al guardar un nuevo estado, los estados rehechos pierden validez), crea un nuevo Memento a través del Originator, lo agrega a undoStack y limita el tamaño máximo. El método deshacer() verifica que haya al menos 2 elementos en undoStack (el actual y al menos uno anterior), guarda el estado actual en redoStack, remueve el último de undoStack, restaura el anterior a través del Originator y lo retorna. El método rehacer() verifica que redoStack no esté vacío, guarda el estado actual en undoStack, obtiene el siguiente de redoStack, lo restaura y lo retorna.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Memento se encuentra en tres archivos de la carpeta frontend/src/patterns/memento/. La clase MementoHistorial utiliza el campo privado #estado de JavaScript (private class fields) para almacenar el snapshot. Esto garantiza que el estado solo sea accesible mediante el método público getEstado(), preservando la encapsulación. El método getEstado() también utiliza deepClone para retornar una copia del estado, evitando que el Caretaker pueda modificar el Memento indirectamente.

La clase OriginadorHistorial se inicializa con un estado vacío. El método setEstado() reemplaza completamente el estado actual con los nuevos valores. El método crearMemento() crea un nuevo MementoHistorial pasando el estado actual y un nombre descriptivo. El método restaurar() extrae el estado del Memento mediante getEstado() y lo asigna al estado actual.

La clase CuidadorHistorial recibe el Originator en su constructor. El método guardar() es llamado automáticamente después de cada cambio de vehículo en el componente. El método deshacer() es llamado cuando el usuario hace clic en el botón "◀ Anterior". El método rehacer() es llamado cuando el usuario hace clic en "Siguiente ▶". Los métodos puedeDeshacer() y puedeRehacer() determinan si los botones deben estar habilitados o deshabilitados.

En el componente HistorialVehiculo.jsx, la integración se realiza mediante un hook useRef que mantiene la instancia del OriginadorHistorial y otra ref para el CuidadorHistorial. Se utiliza un efecto que se ejecuta después de cargar los datos de un vehículo (loadingDetail pasa de true a false), momento en el cual se guarda automáticamente un snapshot con el nombre "Vehículo: [placa]".

Los botones "◀ Anterior" y "Siguiente ▶" se renderizan condicionalmente según los métodos puedeDeshacer() y puedeRehacer(). Cuando el usuario hace clic en ellos, se llama a deshacer() o rehacer(), y el estado restaurado se utiliza para actualizar la UI sin necesidad de consultar el backend nuevamente. Adicionalmente, se muestra un historial visual (snapshotHistory) que lista todos los snapshots guardados con su nombre y timestamp, permitiendo al usuario ver el historial de vehículos consultados.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Memento implementado en el sistema:

@startuml
title Patrón Memento - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

class MementoHistorial {
  - #estado : Object
  + nombre : String
  + timestamp : String
  + id : Number
  + getNombre() : String
  + getTimestamp() : String
  + getId() : Number
  + getEstado() : Object
  - #deepClone(obj) : Object
}

note top of MementoHistorial
  Almacena el estado completo de la
  vista (vehículo, reportes, órdenes,
  proyección) en un campo privado #estado.
  Solo el Originador accede al estado
  mediante getEstado().
end note

class OriginadorHistorial {
  + estado : Object
  + setEstado(nuevoEstado) : void
  + crearMemento(nombre) : MementoHistorial
  + restaurar(memento) : void
}

note right of OriginadorHistorial
  Mantiene el estado actual de la
  vista. crearMemento() genera un
  snapshot. restaurar(memento)
  recupera un estado anterior.
end note

class CuidadorHistorial {
  - originador : OriginadorHistorial
  - undoStack : List<MementoHistorial>
  - redoStack : List<MementoHistorial>
  - maxHistorial : int
  + guardar(nombre) : MementoHistorial
  + deshacer() : MementoHistorial
  + rehacer() : MementoHistorial
  + puedeDeshacer() : boolean
  + puedeRehacer() : boolean
  + obtenerHistorial() : List<MementoHistorial>
  + obtenerRedoHistorial() : List<MementoHistorial>
  + obtenerNombreUltimo() : String
}

note right of CuidadorHistorial
  Administra las pilas undo/redo.
  Al guardar, limpia redoStack.
  undo: pop undoStack -- push redoStack.
  redo: pop redoStack -- push undoStack.
  Máximo 20 snapshots.
end note

OriginadorHistorial --> MementoHistorial : "crea"
CuidadorHistorial --> MementoHistorial : "gestiona"
CuidadorHistorial --> OriginadorHistorial : "usa"
@enduml

El diagrama muestra claramente la estructura del patrón Memento. MementoHistorial almacena el estado con un campo privado #estado. OriginadorHistorial crea y restaura Mementos. CuidadorHistorial administra las pilas undo/redo. La relación "crea" conecta Originador con Memento, "gestiona" conecta Cuidador con Memento, y "usa" conecta Cuidador con Originador.

PRUEBAS
La implementación del patrón Memento fue probada mediante la interacción directa con la interfaz de usuario y la verificación de la consola del navegador.

La primera prueba consistió en navegar a la página Historial por Vehículo y seleccionar un vehículo del dropdown. Se verificó que la información se cargara correctamente y que apareciera el snapshot en el historial visual con el nombre "Vehículo: [placa]". En la consola se registró "[Memento] 📸 Snapshot guardado: \"Vehículo: ABC-123\"".

La segunda prueba consistió en seleccionar tres vehículos diferentes secuencialmente: ABC-123, DEF-456 y GHI-789. Se verificó que el historial visual mostrara los tres snapshots en orden. Se verificó que el botón "◀ Anterior" estuviera habilitado.

La tercera prueba consistió en hacer clic en "◀ Anterior" dos veces. La primera pulsación restauró el vehículo DEF-456 y la segunda restauró ABC-123. Se verificó que la información mostrada correspondiera al vehículo restaurado en cada caso, sin realizar nuevas consultas al backend. En la consola se registró "[Memento] ↩ Restaurando: \"Vehículo: DEF-456\"" y luego "[Memento] ↩ Restaurando: \"Vehículo: ABC-123\"".

La cuarta prueba consistió en hacer clic en "Siguiente ▶" después de haber navegado hacia atrás. Se verificó que avanzara a DEF-456 y luego a GHI-789, restaurando los estados correctamente. El botón "Siguiente ▶" se deshabilitó al llegar al último snapshot.

La quinta prueba consistió en hacer clic en "◀ Anterior" hasta que el botón se deshabilitara, indicando que no hay más snapshots para deshacer. Se verificó que en la consola apareciera "[Memento] No hay más snapshots para deshacer".

La sexta prueba consistió en seleccionar un nuevo vehículo después de haber navegado hacia atrás. Se verificó que la pila de redo se limpiara (como establece el comportamiento del patrón Memento: al guardar un nuevo estado, los estados rehechos pierden validez).

CONCLUSIONES
La implementación del patrón Memento en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para proporcionar navegación hacia adelante y hacia atrás en el historial de consultas de vehículos.

Los principales beneficios observados fueron la preservación de la encapsulación, ya que el estado se almacena en campos privados #estado y solo es accesible mediante getEstado() que retorna una copia profunda; la navegación instantánea entre consultas anteriores, porque los snapshots se almacenan en memoria y no requieren nuevas consultas al backend; el control de tamaño del historial, gracias al límite máximo de 20 snapshots configurable en el Cuidador; la visualización del historial mediante snapshotHistory, que muestra al usuario qué vehículos ha consultado y en qué orden; y la gestión correcta de las pilas undo/redo, incluyendo la limpieza de redoStack al guardar un nuevo snapshot.

El patrón Memento se integra con los demás patrones del frontend. El patrón Observer podría utilizarse para notificar cuando se restaura un snapshot, permitiendo que otros componentes reaccionen a los cambios de selección. El patrón State determina el estado de los vehículos que se muestran en los snapshots. El patrón Command podría encapsular las operaciones de deshacer y rehacer como comandos en el historial de comandos.

La implementación demuestra que el patrón Memento puede implementarse efectivamente en JavaScript moderno utilizando private class fields (#) para garantizar la encapsulación. La combinación de Originador, Memento y Cuidador proporciona una arquitectura limpia y mantenible para la funcionalidad de historial de navegación entre vehículos.
