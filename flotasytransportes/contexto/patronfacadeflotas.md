PATRÓN FACADE
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Facade es un patrón de diseño estructural que proporciona una interfaz unificada y simplificada a un conjunto de subsistemas más complejos. Su objetivo principal es ocultar la complejidad interna de un sistema tras un punto de entrada único y reducido, permitiendo que los clientes interactúen con el sistema sin necesidad de conocer los detalles de implementación subyacentes.

El patrón Facade no agrega nueva funcionalidad al sistema; simplemente encapsula la complejidad existente y reduce el acoplamiento entre los clientes y los componentes internos del subsistema. Este patrón es particularmente útil cuando se tiene un sistema con múltiples dependencias que deben ser coordinadas para realizar operaciones complejas, como es el caso del Sistema de Gestión de Flotas donde el flujo de creación y asignación de órdenes involucra la interacción de varios servicios, repositorios y patrones de diseño.

En el contexto del proyecto de gestión de flotas, la implementación del patrón Facade permite simplificar significativamente la interacción entre los controladores y los servicios internos, proporcionando un punto de entrada único para operaciones que antes requerían el conocimiento de múltiples componentes del sistema.

PROBLEMA QUE RESUELVE
El sistema de gestión de flotas, tal como estaba diseñado originalmente, presentaba un problema de acoplamiento excesivo entre los controladores y los servicios internos. El flujo de creación y asignación de órdenes de transporte era especialmente complejo, involucrando la coordinación de múltiples componentes que el controlador debía conocer y gestionar directamente.

El flujo original requería que el controlador inyectara directamente el servicio OrdenService, el cual a su vez dependía de tres componentes adicionales: VehiculoRepositoryPort para la gestión de vehículos, DistanciaServicePort para el cálculo de distancias y ServicioRutas para la generación de rutas. Además, el servicio OrdenService implementaba internamente la orquestación de múltiples patrones de diseño como Bridge, Composite y Decorator para procesar las rutas de transporte.

Este diseño generaba varios problemas fundamentales. El primero era el alto acoplamiento entre capas, donde el controlador debía conocer la existencia de múltiples servicios y cómo coordinarlos para realizar operaciones complejas. El segundo problema era la exposición de complejidad interna, ya que los clientes externos tenían acceso directo a servicios específicos como ServicioRutas, DistanciaServicePort y VehiculoRepositoryPort, violando el principio de encapsulamiento. El tercer problema radicaba en la dificultad de mantenimiento, porque cualquier cambio en la estructura de las rutas o en la lógica de selección de vehículos requería modificaciones directas en el servicio, afectando potencialmente a todos los clientes que lo utilizaban.

Finalmente, existía un problema de testabilidad, ya que para probar el controlador era necesario mockear todas las dependencias del servicio, complicando el proceso de pruebas unitarias y de integración.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón Facade mediante la creación de una nueva clase chamada OrdenTransporteFacade en el paquete com.flotasytransportes.aplicacion.facade. Esta fachada actúa como un punto de entrada único que encapsula toda la complejidad del flujo de órdenes de transporte, ocultando los detalles internos de coordinación entre servicios y patrones de diseño.

La fachada mantiene una referencia al servicio OrdenService y delegation las llamadas a los métodos correspondientes, añadiendo únicamente lógica adicional de logging para mostrar el flujo de ejecución. De esta manera, el controlador deja de conocer los detalles internos del servicio y simplemente interactúa con la fachada mediante una interfaz simplificada.

La implementación del patrón Facade en el proyecto de gestión de flotas sigue las mejores prácticas descritas en la literatura de patrones de diseño. La fachada se implementa como un componente de la capa de aplicación, exactamente donde deberían residir los servicios de orquestación según los principios de arquitectura limpia. La fachada coordina pero no contiene lógica de negocio, ya que las reglas de negocio permanecen en los servicios y entidades del dominio.

La inyección de dependencias se utiliza para gestionar las dependencias internas de la fachada, en lugar de crear instancias con new, lo que permite mantener el acoplamiento bajo y facilitar la sustitución de implementaciones durante las pruebas.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Facade se encuentra en el paquete aplicacion/facade/, específicamente en la clase OrdenTransporteFacade. Esta clase fue diseñada siguiendo los principios de diseño orientado a objetos y las mejores prácticas de Spring Framework para la creación de componentes gestionados.

La clase OrdenTransporteFacade está anotada con @Component, lo que permite que Spring la gestione como un bean y la inyecte automáticamente en los controladores que la requieran. El constructor recibe una instancia de OrdenService como dependencia, estableciendo así la relación entre la fachada y el servicio subyacente.

El método principal de la fachada es crearYAsignarOrden, que recibe una instancia de OrdenTransporte y retorna el resultado del procesamiento. Este método actúa como un wrapper alrededor del método correspondiente del servicio, añadiendo mensajes de logging que permiten visualizar el flujo de ejecución sin modificar la lógica de negocio subyacente.

La modificación del controlador fue minimalista pero significativa. El OrdenController ahora inyecta la fachada en lugar del servicio directamente, lo que reduce su dependencia de los detalles internos del sistema. El endpoint POST /ordenes/asignar permanece sin cambios en su firma, pero su implementación ahora delega en la fachada, que a su vez coordina todos los componentes necesarios para procesar la orden.

La arquitectura hexagonal del proyecto se respeta completamente, ya que la fachada se implementa en la capa de aplicación y no modifica la lógica del dominio. Los servicios internos y los repositorios permanecen intactos, y la fachada simplemente proporciona una capa de coordinación adicional que simplifica la interacción para los clientes externos.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Facade implementado en el sistema:

@startuml
title Patrón Facade - Sistema de Gestión de Flotas

skinparam classAttributeIconSize 0

class OrdenController {
    - ordenTransporteFacade : OrdenTransporteFacade
    + crearYAsignar(orden: OrdenTransporte) : OrdenTransporte
}

class OrdenTransporteFacade {
    - ordenService : OrdenService
    + crearYAsignarOrden(orden: OrdenTransporte) : OrdenTransporte
}

class OrdenService {
    - vehiculoRepository : VehiculoRepositoryPort
    - distanciaService : DistanciaServicePort
    - servicioRutas : ServicioRutas
    + crearYAsignarOrden(orden: OrdenTransporte) : OrdenTransporte
}

class VehiculoRepositoryPort {
    + buscarDisponibles() : List<Vehiculo>
    + guardar(vehiculo: Vehiculo)
}

class DistanciaServicePort {
    + calcularDistancia(lat1, lng1, lat2, lng2) : double
}

class ServicioRutas {
    + generarRuta(origen, destino) : Ruta
}

class OrdenTransporte {
    - codigoOrden : String
    - origenLat, origenLng : Double
    - destinoLat, destinoLng : Double
    - vehiculoPlaca : String
}

class Ruta {
    - origen : String
    - destino : String
    - distancia : double
}

OrdenController --> OrdenTransporteFacade : usa
OrdenTransporteFacade --> OrdenService : delega
OrdenService --> VehiculoRepositoryPort : consulta
OrdenService --> DistanciaServicePort : calcula
OrdenService --> ServicioRutas : genera rutas

@enduml

El diagrama muestra claramente la estructura del patrón Facade. El OrdenController interactúa únicamente con la OrdenTransporteFacade, que a su vez coordina el acceso al subsistema compuesto por OrdenService y sus dependencias. Esta estructura permite que el cliente desconozca la complejidad interna del sistema y trabaje con una interfaz simplificada.

PRUEBAS
La implementación del patrón Facade fue verificada mediante la compilación del proyecto, la cual demostró que todas las clases del patrón se integran correctamente con el resto del sistema sin generar conflictos de dependencias ni errores de compilación.

El proceso de compilación reveló que la estructura del proyecto se mantiene consistente después de la implementación de la fachada. El número de archivos compilados aumentó de 49 a 50, reflejando la incorporación del nuevo archivo de la fachada. La compilación fue exitosa, lo que indica que la implementación cumple con los requisitos de tipo y coherencia estructural del proyecto.

La fachada proporciona beneficios significativos en términos de testabilidad. Ahora es posible mockear la fachada en lugar de todos los servicios internos del subsistema, lo que simplifica enormemente la escritura de pruebas unitarias para los controladores. Un desarrollador que necesite probar el controlador puede simplemente crear un mock de la fachada que retorne los datos necesarios, sin necesidad de configurar el comportamiento de múltiples servicios dependientes.

La implementación también facilita la evolución del sistema. Si en el futuro se decide modificar la lógica de procesamiento de órdenes, ya sea cambiando los patrones de diseño utilizados o añadiendo nuevas funcionalidades, los controladores no se verán afectados ya que dependen únicamente de la interfaz de la fachada. Los cambios queden centralizados en un único lugar, reduciendo el riesgo de introducir errores en otras partes del sistema.

CONCLUSIONES
La implementación del patrón Facade en el Sistema de Gestión de Flotas demostró ser una solución efectiva para reducir el acoplamiento entre la capa de presentación y los servicios internos del sistema. La fachada proporciona un punto de entrada único y simplificado que oculta la complejidad de la orchestration de servicios y patrones de diseño subyacentes.

Los principales beneficios observados fueron la reducción del acoplamiento, ya que los controladores ahora dependen únicamente de la fachada en lugar de conocer los servicios internos; la mejora en el mantenimiento, porque cualquier cambio en la lógica de procesamiento de órdenes se centraliza en la fachada sin afectar a los clientes; el incremento en la testabilidad, dado que las pruebas unitarias pueden mockear fácilmente la fachada en lugar de múltiples dependencias; y la mejora en la mantenibilidad del código, ya que la separación de responsabilidades queda más claramente definida.

El patrón Facade complementa perfectamente los otros patrones implementados en el proyecto. Mientras que los patrones Bridge, Composite y Decorator resuelven problemas específicos en el procesamiento de rutas, el patrón Facade proporciona una capa de abstracción adicional que simplifica la interacción con estos componentes para los clientes externos.

La implementación respects la arquitectura hexagonal del proyecto al colocar la fachada en la capa de aplicación, donde los servicios de orchestación deben residir según los principios de diseño limpio. La fachada coordina pero no contiene lógica de negocio significativa; las reglas de negocio permanecen en los servicios del dominio, manteniendo así la integridad de la separación de capas.

El patrón Facade representa una mejora significativa en la calidad del código del sistema de gestión de flotas, proporcionando una interfaz más limpia y easier de usar para los clientes externos mientras mantiene la flexibilidad necesaria para evolucionar y adaptarse a futuros requisitos del sistema.