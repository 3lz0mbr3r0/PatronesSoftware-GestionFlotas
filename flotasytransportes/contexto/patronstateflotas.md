PATRÓN STATE
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón State es un patrón de diseño de comportamiento que permite a un objeto alterar su comportamiento cuando su estado interno cambia. La principal característica de este patrón es que el objeto parecerá haber cambiado de clase, ya que delega el comportamiento específico del estado a objetos separados que representan cada estado posible.

El patrón State se compone de tres elementos principales. El Context mantiene una referencia al estado actual y delega el comportamiento específico del estado a dicho objeto. La interfaz State define los métodos que todos los estados concretos deben implementar. Los Concrete States implementan el comportamiento específico para cada estado del contexto.

La principal ventaja del patrón State sobre los condicionales es que elimina las estructuras if-else o switch grandes y difíciles de mantener. Cada estado se encapsula en su propia clase, siguiendo el principio de responsabilidad única. Agregar un nuevo estado solo requiere crear una nueva clase, sin modificar las existentes y sin cambiar el código del contexto.

En el contexto del frontend del Sistema de Gestión de Flotas, el patrón State se implementó para manejar el comportamiento variable de los vehículos según su estado actual (DISPONIBLE, EN_RUTA, MANTENIMIENTO). Cada estado determina aspectos visuales como el color del badge y aspectos funcionales como los permisos de edición, eliminación y acciones disponibles.

PROBLEMA QUE RESUELVE
En la interfaz de usuario del sistema de gestión de flotas, los vehículos pueden estar en tres estados diferentes: DISPONIBLE, EN_RUTA y MANTENIMIENTO. Cada estado requiere un comportamiento visual y funcional diferente. Por ejemplo, un vehículo DISPONIBLE se muestra con un badge verde, puede ser editado y eliminado, y puede ser asignado a una orden. Un vehículo EN_RUTA se muestra con un badge morado, no puede ser editado ni eliminado porque está realizando un viaje activo, y no puede ser asignado a nuevas órdenes. Un vehículo MANTENIMIENTO se muestra con un badge amarillo, no puede ser editado, pero puede ser eliminado y muestra un botón especial "✓ Disponible" para marcarlo como disponible nuevamente.

Antes de implementar el patrón State, el código del componente ListaVehiculos.jsx contenía múltiples condicionales if-else esparcidos por todo el componente. Había una función getEstadoColor que mapeaba los estados a colores, un bloque if en el JSX para mostrar el botón "✓ Disponible" solo cuando el estado era MANTENIMIENTO, y otro bloque para controlar la opacidad y habilitación del botón de eliminar.

Este enfoque presentaba varios problemas graves. El primer problema era la dispersión de la lógica de estado, ya que el conocimiento sobre lo que cada estado permite estaba distribuido en múltiples lugares del componente, dificultando su comprensión y mantenimiento. El segundo problema era la dificultad para agregar nuevos estados, ya que agregar un nuevo estado requería modificar cada uno de esos lugares dispersos, aumentando el riesgo de errores y omisiones. El tercer problema era la violación del principio de responsabilidad única, porque el componente tenía que conocer no solo cómo renderizar la interfaz, sino también las reglas de negocio asociadas a cada estado.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón State en el archivo frontend/src/patterns/VehiculoState.js. Se creó una clase base VehiculoEstado que define los métodos comunes con implementaciones por defecto, y tres clases concretas que sobrescriben los métodos según el comportamiento específico de cada estado.

La clase VehiculoEstado define los siguientes métodos con valores por defecto: getColor() retorna el color por defecto (verde), getLabel() retorna "DESCONOCIDO", canEdit() retorna false, canDelete() retorna false, canAssignOrder() retorna false, canMarkAsDisponible() retorna false, y getAcciones() retorna una lista vacía. Al tener valores por defecto, cada estado concreto solo necesita sobrescribir los métodos que son relevantes para su comportamiento.

La clase DisponibleState sobrescribe getColor() para retornar verde, getLabel() para retornar "DISPONIBLE", canEdit() y canDelete() para retornar true, y canAssignOrder() para retornar true. Esto permite que los vehículos disponibles sean editables, eliminables y asignables a órdenes.

La clase EnRutaState sobrescribe getColor() para retornar morado y getLabel() para retornar "EN_RUTA". No sobrescribe ningún método de permiso, por lo que todos retornan false. Esto asegura que los vehículos en ruta no puedan ser editados, eliminados ni asignados a nuevas órdenes.

La clase MantenimientoState sobrescribe getColor() para retornar amarillo, getLabel() para retornar "MANTENIMIENTO", canDelete() para retornar true, y canMarkAsDisponible() para retornar true. Además, sobrescribe getAcciones() para retornar una lista con la acción "✓ Disponible". Esto permite eliminar vehículos en mantenimiento y marcarlos como disponibles.

La función getVehiculoState(estado) actúa como una fábrica simple que recibe un string de estado y retorna la instancia de la clase concreta correspondiente. Utiliza un mapa estático que asocia los strings a las clases, y si el estado no existe en el mapa, retorna DisponibleState por defecto.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón State se encuentra en el archivo frontend/src/patterns/VehiculoState.js. La clase base VehiculoEstado se implementa como una clase de JavaScript con métodos que retornan valores por defecto. No se utiliza el modificador abstract de TypeScript porque el proyecto está desarrollado en JavaScript puro, pero la intención de diseño es que funcione como una clase abstracta.

Las clases concretas DisponibleState, EnRutaState y MantenimientoState extienden VehiculoEstado y sobrescriben los métodos relevantes. Cada clase es simple y contiene solo el comportamiento específico de su estado, siguiendo el principio de responsabilidad única.

El mapa stateMap asocia los strings de estado a las clases concretas. La función getVehiculoState(estado) busca la clase en el mapa, la instancia con new, y retorna la instancia. Si el estado no existe en el mapa, retorna una instancia de DisponibleState como comportamiento seguro por defecto.

En el componente ListaVehiculos.jsx, la integración con el patrón State se realizó en tres puntos específicos. El primero es el badge de estado, que ahora llama a state.getColor() para obtener los colores y a state.getLabel() para obtener el texto, reemplazando la antigua función getEstadoColor. El segundo es el botón de eliminar, que usa state.canDelete() para determinar la opacidad y mostrar el título apropiado. El tercero es el botón "✓ Disponible", que solo se renderiza si state.canMarkAsDisponible() retorna true, reemplazando el condicional anterior que verificaba vehiculo.estado === 'MANTENIMIENTO'.

La función handleDelete también fue modificada para utilizar el patrón State. Antes de eliminar, verifica state.canDelete() y si es false, muestra una alerta explicando que no se puede eliminar el vehículo en su estado actual. Esto proporciona retroalimentación clara al usuario sobre por qué la acción no está permitida.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón State implementado en el sistema:

@startuml
title Patrón State - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

class VehiculoEstado {
    + getColor() : Object
    + getLabel() : String
    + canEdit() : boolean
    + canDelete() : boolean
    + canAssignOrder() : boolean
    + canMarkAsDisponible() : boolean
    + getAcciones() : List
}

note top of VehiculoEstado
  Clase base abstracta.
  Define comportamiento por defecto:
  todos los métodos retornan false
  excepto getColor() y getLabel().
end note

class DisponibleState {
    + getColor() : Object
    + getLabel() : String
    + canEdit() : boolean
    + canDelete() : boolean
    + canAssignOrder() : boolean
}

note bottom of DisponibleState
  Color: verde (#00d4aa)
  Label: "DISPONIBLE"
  Permisos: editar, eliminar,
  asignar orden
end note

class EnRutaState {
    + getColor() : Object
    + getLabel() : String
    + canEdit() : boolean
    + canDelete() : boolean
    + canAssignOrder() : boolean
}

note bottom of EnRutaState
  Color: morado (#8b5cf6)
  Label: "EN_RUTA"
  Permisos: ninguno
end note

class MantenimientoState {
    + getColor() : Object
    + getLabel() : String
    + canDelete() : boolean
    + canMarkAsDisponible() : boolean
    + getAcciones() : List
}

note bottom of MantenimientoState
  Color: amarillo (#f59e0b)
  Label: "MANTENIMIENTO"
  Permisos: eliminar,
  marcar disponible
  Acción extra: botón "✓ Disponible"
end note

VehiculoEstado <|.. DisponibleState
VehiculoEstado <|.. EnRutaState
VehiculoEstado <|.. MantenimientoState

class "getVehiculoState(estado)" as Factory {
    + {static} getVehiculoState(estado: String) : VehiculoEstado
}

note bottom of Factory
  Retorna la instancia correcta
  según el string de estado.
  Mapeo: {DISPONIBLE, EN_RUTA,
  MANTENIMIENTO} -> clases concretas.
end note

Factory --> VehiculoEstado : "crea"

class ListaVehiculos {
    - vehiculos : List
    - estrategia : FiltroStrategy
    + renderVehiculo(vehiculo) : JSX
}

note bottom of ListaVehiculos
  Por cada vehículo llama a
  getVehiculoState(vehiculo.estado)
  para obtener color, label,
  permisos y acciones disponibles.
end note

ListaVehiculos --> Factory : "usa"

@enduml

El diagrama muestra claramente la estructura del patrón State. VehiculoEstado es la interfaz que define el contrato común. DisponibleState, EnRutaState y MantenimientoState son los estados concretos que implementan el comportamiento específico. La función getVehiculoState actúa como fábrica que retorna la instancia correcta según el string de estado. ListaVehiculos es el contexto que utiliza el estado para determinar el comportamiento visual y funcional de cada vehículo.

PRUEBAS
La implementación del patrón State fue probada mediante la interacción directa con la interfaz de usuario, verificando el comportamiento visual y funcional de cada estado.

La primera prueba consistió en crear vehículos en diferentes estados y verificar que los badges mostraran los colores correctos. Los vehículos DISPONIBLE se mostraron con badge verde, los EN_RUTA con badge morado, y los MANTENIMIENTO con badge amarillo. Los labels también se mostraron correctamente.

La segunda prueba consistió en verificar los permisos de eliminación. Se intentó eliminar un vehículo DISPONIBLE y se permitió la operación. Se intentó eliminar un vehículo EN_RUTA y apareció una alerta indicando que no se puede eliminar un vehículo en ese estado, y el botón de eliminar se mostró con opacidad reducida como indicación visual.

La tercera prueba consistió en verificar el botón "✓ Disponible". Se confirmó que solo aparece para vehículos en estado MANTENIMIENTO. Al hacer click, se ejecutó correctamente el cambio de estado a DISPONIBLE.

La cuarta prueba consistió en verificar que agregar un nuevo estado no requiriera modificar el componente ListaVehiculos. Se creó una nueva clase HipoteticoState en el archivo VehiculoState.js, se agregó al mapa stateMap, y el componente continuó funcionando sin modificaciones, demostrando que el patrón State cumple con el principio de abierto/cerrado.

CONCLUSIONES
La implementación del patrón State en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para encapsular el comportamiento variable de los vehículos según su estado.

Los principales beneficios observados fueron la eliminación de condicionales, ya que el componente ListaVehiculos ya no contiene bloques if-else para determinar el comportamiento según el estado; la centralización del comportamiento de estado en un solo archivo, donde cada clase de estado es independiente y contiene solo la lógica relevante para ese estado; la facilidad para agregar nuevos estados, ya que solo se necesita crear una nueva clase y agregarla al mapa, sin modificar el componente ni las clases existentes; y la mejora en la legibilidad del código del componente, que ahora se enfoca únicamente en la presentación y delega las decisiones de comportamiento al estado.

El patrón State se integra naturalmente con los otros patrones del frontend. El patrón Strategy proporciona algoritmos de filtrado que pueden combinarse con el estado para mostrar vehículos según su estado. El patrón Command encapsula las operaciones que cambian el estado y emite eventos a través del patrón Observer para notificar al Dashboard.

La implementación demuestra que el patrón State no solo es útil en lenguajes fuertemente tipados como Java, sino que también puede implementarse efectivamente en JavaScript moderno. La simplicidad de la solución (aproximadamente 60 líneas de código para las cuatro clases) contrasta con la complejidad que tendría el mismo comportamiento implementado con condicionales esparcidos por el componente.
