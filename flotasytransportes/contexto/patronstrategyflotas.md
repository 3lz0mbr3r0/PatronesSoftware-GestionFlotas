PATRÓN STRATEGY
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Strategy es un patrón de diseño de comportamiento que define una familia de algoritmos intercambiables, encapsula cada uno de ellos y los hace intercambiables en tiempo de ejecución. Este patrón permite que el algoritmo varíe independientemente de los clientes que lo utilizan, siguiendo el principio de que debe preferirse la composición sobre la herencia.

El patrón Strategy se compone de tres elementos principales. El Context mantiene una referencia a una estrategia concreta y la utiliza para ejecutar el algoritmo. La interfaz Strategy define el contrato común que todas las estrategias concretas deben implementar. Los Concrete Strategies implementan las diferentes variaciones del algoritmo.

La principal ventaja del patrón Strategy es que elimina los condicionales grandes y difíciles de mantener, reemplazándolos con objetos que encapsulan comportamientos específicos. Esto facilita la extensión del sistema, ya que agregar un nuevo algoritmo solo requiere crear una nueva clase que implemente la interfaz Strategy, sin modificar el código existente.

En el contexto del frontend del Sistema de Gestión de Flotas, el patrón Strategy se implementó para proporcionar múltiples formas de filtrar la lista de vehículos. Los usuarios pueden filtrar por tipo de vehículo, tipo de energía, estado, proximidad a mantenimiento o rango de kilometraje, todo mediante algoritmos intercambiables sin condicionales.

PROBLEMA QUE RESUELVE
La página de Vehículos del sistema de gestión de flotas muestra una lista de todos los vehículos registrados. A medida que la flota crece, la lista se vuelve más larga y los usuarios necesitan formas de filtrar los vehículos para encontrar rápidamente la información que buscan. Un despachador puede necesitar ver solo los vehículos DISPONIBLES para asignar una orden, mientras que el equipo de mantenimiento puede necesitar ver solo los vehículos que están próximos a alcanzar su límite de mantenimiento.

Antes de implementar el patrón Strategy, cualquier funcionalidad de filtrado requeriría una función grande con múltiples condicionales que verificara el tipo de filtro seleccionado y aplicara la lógica correspondiente. Esta función violaría el principio de responsabilidad única al tener que conocer todos los criterios de filtrado posibles. Además, agregar un nuevo criterio implicaría modificar esta función, arriesgando introducir errores en los filtros existentes.

El problema se agravaba porque los criterios de filtrado dependen de los datos actuales. Por ejemplo, si actualmente solo hay vehículos de tipo CAMION y MOTO en la flota, no tendría sentido ofrecer un filtro para FURGON. Los filtros disponibles deben generarse dinámicamente según los vehículos existentes en cada momento.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón Strategy en el archivo frontend/src/patterns/FiltroVehiculoStrategy.js. Se creó una clase base FiltroStrategy que define el contrato con dos métodos: getNombre() que retorna una etiqueta legible para mostrar en la interfaz, y filtrar(vehiculos) que recibe la lista completa de vehículos y retorna la lista filtrada según el criterio específico.

Se implementaron seis estrategias concretas. FiltroTodosStrategy retorna la lista completa sin filtrar, sirviendo como opción por defecto. FiltroPorTipoStrategy recibe un tipo de vehículo (CAMION, MOTO, FURGON) en su constructor y filtra los vehículos que coinciden con ese tipo. FiltroPorEnergiaStrategy filtra por tipo de energía (GASOLINA, ELECTRICO). FiltroPorEstadoStrategy filtra por estado (DISPONIBLE, EN_RUTA, MANTENIMIENTO). FiltroProximoMantenimientoStrategy recibe un umbral porcentaje (default 70%) y filtra los vehículos cuyo kilometraje actual supera ese porcentaje de su límite de mantenimiento. FiltroPorKilometrajeStrategy filtra los vehículos cuyo kilometraje está dentro de un rango específico.

La función crearEstrategiasDisponibles(vehiculos) actúa como una fábrica que analiza los datos actuales y genera dinámicamente las estrategias disponibles. Esta función extrae los tipos, energías y estados únicos de la lista de vehículos, y crea una estrategia para cada valor único. También agrega las estrategias predefinidas como FiltroTodosStrategy, FiltroProximoMantenimientoStrategy y FiltroPorKilometrajeStrategy.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Strategy se encuentra en el archivo frontend/src/patterns/FiltroVehiculoStrategy.js. La clase base FiltroStrategy define los métodos getNombre() y filtrar() con implementaciones por defecto que retornan la lista sin filtrar.

Cada estrategia concreta extiende FiltroStrategy y recibe los parámetros necesarios en su constructor. Por ejemplo, FiltroPorTipoStrategy recibe el tipo de vehículo como parámetro y su método filtrar utiliza filter de JavaScript para retornar solo los vehículos que coinciden con ese tipo.

La función crearEstrategiasDisponibles recibe la lista de vehículos y utiliza un conjunto (Set) para extraer los valores únicos de tipo, energía y estado. Luego crea una lista de estrategias que incluye FiltroTodosStrategy, una estrategia por cada tipo único, una por cada energía única, una por cada estado único, FiltroProximoMantenimientoStrategy y FiltroPorKilometrajeStrategy.

En el componente ListaVehiculos.jsx, la integración con el patrón Strategy se realizó en varios puntos. Se agregaron dos estados: estrategia que almacena la estrategia activa actual (inicializada con FiltroTodosStrategy), y estrategiasDisponibles que almacena la lista de estrategias disponibles generada por la fábrica.

La función cargarVehiculos fue modificada para que, después de obtener los datos del backend, llame a crearEstrategiasDisponibles(data) y almacene el resultado en estrategiasDisponibles.

En el JSX, antes del formulario de creación, se agregó una barra de filtros que itera sobre estrategiasDisponibles y renderiza un botón por cada estrategia. Cada botón muestra el nombre de la estrategia (getNombre()) y al hacer click actualiza el estado estrategia con la estrategia seleccionada. El botón activo se resalta con el color primary del tema, mientras que los inactivos se muestran en el color secundario.

La lista de vehículos ahora utiliza vehiculosFiltrados en lugar de vehiculos directamente. vehiculosFiltrados se calcula como estrategia.filtrar(vehiculos), lo que significa que cada vez que cambia la estrategia o los datos, la lista filtrada se recalcula automáticamente.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Strategy implementado en el sistema:

@startuml
title Patrón Strategy - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

class FiltroStrategy {
    + getNombre() : String
    + filtrar(vehiculos: List) : List
}

note top of FiltroStrategy
  Interfaz que define el contrato
  para todos los algoritmos de filtrado.
  getNombre() retorna la etiqueta visible
  en los botones de la UI.
end note

class FiltroTodosStrategy {
    + getNombre() : String
    + filtrar(vehiculos: List) : List
}

note bottom of FiltroTodosStrategy
  Retorna la lista completa sin filtrar.
  Nombre: "Todos"
end note

class FiltroPorTipoStrategy {
    - tipo : String
    + getNombre() : String
    + filtrar(vehiculos: List) : List
}

note bottom of FiltroPorTipoStrategy
  Filtra por tipo de vehículo:
  CAMION, MOTO o FURGON.
  Nombre: "Tipo: CAMION"
end note

class FiltroPorEnergiaStrategy {
    - energia : String
    + getNombre() : String
    + filtrar(vehiculos: List) : List
}

class FiltroPorEstadoStrategy {
    - estado : String
    + getNombre() : String
    + filtrar(vehiculos: List) : List
}

class FiltroProximoMantenimientoStrategy {
    - umbralPct : int
    + getNombre() : String
    + filtrar(vehiculos: List) : List
}

note bottom of FiltroProximoMantenimientoStrategy
  Filtra vehículos cuyo porcentaje
  kilometrajeActual/limiteMantenimiento
  supere el umbral (default 70%).
  Nombre: "Próximo a mantenimiento (≥70%)"
end note

class FiltroPorKilometrajeStrategy {
    - minKm : int
    - maxKm : int
    + getNombre() : String
    + filtrar(vehiculos: List) : List
}

FiltroStrategy <|.. FiltroTodosStrategy
FiltroStrategy <|.. FiltroPorTipoStrategy
FiltroStrategy <|.. FiltroPorEnergiaStrategy
FiltroStrategy <|.. FiltroPorEstadoStrategy
FiltroStrategy <|.. FiltroProximoMantenimientoStrategy
FiltroStrategy <|.. FiltroPorKilometrajeStrategy

class "crearEstrategiasDisponibles" as Factory {
    + {static} crearEstrategiasDisponibles(vehiculos: List) : List<FiltroStrategy>
}

note bottom of Factory
  Analiza los datos actuales y genera
  dinámicamente las estrategias disponibles.
  Ej: si hay vehículos CAMION y MOTO,
  crea FiltroPorTipoStrategy para cada uno.
end note

Factory --> FiltroStrategy : "genera"

class ListaVehiculos {
    - vehiculos : List
    - estrategia : FiltroStrategy
    - estrategiasDisponibles : List
}

note bottom of ListaVehiculos
  Renderiza botones con cada estrategia.
  Al hacer click, cambia la estrategia activa.
  vehiculosFiltrados se recalcula automáticamente
  porque es una expresión derivada del estado.
end note

ListaVehiculos --> Factory : "obtiene estrategias"
ListaVehiculos --> FiltroStrategy : "aplica filtro"

@enduml

El diagrama muestra claramente la estructura del patrón Strategy. FiltroStrategy es la interfaz que define el contrato común. Las seis clases concretas implementan diferentes algoritmos de filtrado. La función crearEstrategiasDisponibles actúa como fábrica que genera las estrategias según los datos actuales. ListaVehiculos es el contexto que utiliza la estrategia seleccionada para filtrar la lista.

PRUEBAS
La implementación del patrón Strategy fue probada mediante la interacción directa con la interfaz de usuario, verificando que cada filtro funcionara correctamente.

La primera prueba consistió en cargar la página de Vehículos y verificar que la barra de filtros se generara correctamente. Se confirmó que aparecían botones para "Todos", para cada tipo de vehículo existente, para cada tipo de energía, para cada estado, y los filtros predefinidos de proximidad a mantenimiento y kilometraje.

La segunda prueba consistió en hacer click en cada filtro y verificar que la lista se actualizara correctamente. El filtro "Todos" mostró todos los vehículos. El filtro "Tipo: CAMION" mostró solo camiones. El filtro "Estado: DISPONIBLE" mostró solo vehículos disponibles. El filtro "Próximo a mantenimiento (≥70%)" mostró los vehículos que estaban cerca del límite.

La tercera prueba consistió en verificar que el botón activo se resaltara visualmente. Se confirmó que el botón seleccionado cambia su fondo al color primary del tema y su texto se vuelve oscuro, mientras que los botones inactivos mantienen el fondo secundario.

La cuarta prueba consistió en crear un nuevo vehículo de un tipo que no existía previamente y verificar que la barra de filtros se actualizara automáticamente para incluir el nuevo tipo. Se creó una MOTO cuando solo existían CAMIONES, y el filtro "Tipo: MOTO" apareció después de la actualización de la lista.

CONCLUSIONES
La implementación del patrón Strategy en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para proporcionar filtros intercambiables sin utilizar condicionales.

Los principales beneficios observados fueron la eliminación de condicionales, ya que no existe una función central con if-else para determinar qué filtro aplicar; la extensibilidad, porque agregar un nuevo criterio de filtrado solo requiere crear una nueva clase que extienda FiltroStrategy, sin modificar el componente ni las clases existentes; la generación dinámica de filtros, ya que la fábrica analiza los datos actuales y crea solo las estrategias relevantes; y la separación clara de responsabilidades, porque cada estrategia encapsula un único algoritmo de filtrado.

El patrón Strategy se integra perfectamente con el patrón State implementado en el mismo frontend. Mientras que el patrón State determina el comportamiento de cada vehículo según su estado, el patrón Strategy permite filtrar los vehículos precisamente por ese mismo estado, entre otros criterios. Esta combinación permite a los usuarios navegar eficientemente por la flota y encontrar rápidamente los vehículos que necesitan.

La implementación demuestra cómo el patrón Strategy puede utilizarse no solo para algoritmos complejos, sino también para operaciones aparentemente simples como filtrar una lista. La clave está en reconocer que incluso las operaciones simples pueden beneficiarse del encapsulamiento y la intercambiabilidad que proporciona el patrón.
