PATRÓN COMPOSITE
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Composite es un patrón de diseño estructural que permite tratar objetos individuales y composiciones de objetos de manera uniforme. Este patrón organiza los objetos en una estructura de árbol jerárquica, donde coexisten tres elementos principales: el Component (interfaz común), el Leaf (objeto individual) y el Composite (objeto que contiene otros objetos).

La principal ventaja del patrón Composite radica en su capacidad de simplificar el código cliente, permitiendo que este trabaje con objetos simples y compuestos sin necesidad de distinguir entre ellos. Esto resulta especialmente útil en sistemas donde existen estructuras jerárquicas naturales, como sistemas de archivos, interfaces de usuario, organizaciones empresariales o, como en nuestro caso, sistemas de rutas de transporte.

En el contexto del Sistema de Gestión de Flotas, el patrón Composite se implementó para resolver un problema específico relacionado con el manejo de rutas compuestas, permitiendo calcular de manera uniforme la distancia total de múltiples segmentos de ruta que conforman una orden de transporte completa.

PROBLEMA QUE RESUELVE
En el sistema original de gestión deflotas, el flujo de una orden de transporte seguía un patrón simple: se buscaba el vehículo más cercano al origen de la orden y se generaba una única ruta desde la ubicación del vehículo hasta el destino final. Este enfoque, aunque funcional, no reflejaba la realidad operativa del transporte logístico.

En la práctica, una orden de transporte involucra dos segmentos distinctos de ruta. El primer segmento corresponde al recorrido que realiza el vehículo desde su ubicación actual hasta el punto de origen donde debe recoger la carga. El segundo segmento corresponde al recorrido desde el punto de origen hasta el destino final donde se entrega la carga. Ambos segmentos tienen características y distancias diferentes que deben ser calculados y sumados para obtener la distancia total del viaje.

El problema surge cuando necesitamos calcular la distancia total de una orden de transporte completa, ya que esta distancia no es simplemente la suma de dos valores independientes, sino que debe considerar cada segmento de manera individual y luego agregarlos para obtener un total. Además, el sistema debe ser capaz de aplicar decoradores (como ajustes por tráfico, peajes o condiciones climáticas) tanto a segmentos individuales como al conjunto completo de la ruta.

Antes de implementar el patrón Composite, el código carecía de una estructura que permitiera manejar estos múltiples segmentos de manera uniforme. Cada segmento de ruta se procesaba de forma independiente y el cálculo de la distancia total requería lógica adicional en el servicio de órdenes.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón Composite en el paquete com.flotasytransportes.aplicacion.rutas.composite, creando una estructura que permite representar tanto rutas simples como rutas compuestas mediante una interfaz común.

La implementación se estructura en tres clases principales que siguen la estructura clásica del patrón:

RutaComponent (Component): Esta interfaz define el contrato común que deben cumplir tanto las rutas simples como las rutas compuestas. Además de heredar el método procesarRuta de la interfaz RutaComponent del patrón Decorator (para mantener la compatibilidad),define métodos adicionales como getDistanciaTotal(), getDescripcionRuta(), getSegmentos(), addSegmento() y removeSegmento(). Esta interfaz también incluye el método isCompuesto() para identificar si un componente es una hoja o un compuesto.

RutaSimpleComponent (Leaf): Esta clase representa una ruta simple, es decir, un segmento individual de ruta. Cada instancia de esta clase contiene un objeto Ruta del dominio y puede tener un ajuste adicional de distancia. Los métodos addSegmento() y removeSegmento() lanzan una excepción UnsupportedOperationException, ya que una hoja no puede contener otros componentes. El método getDistanciaTotal() retorna la distancia de la ruta más cualquier ajuste adicional.

RutaCompuestaComponent (Composite): Esta clase representa una ruta compuesta que contiene múltiples segmentos. Mantiene una lista de objetos RutaComponent y proporciona métodos para agregar, remover y gestionar segmentos. El método getDistanciaTotal() calcula la distancia total sumando las distancias de todos los segmentos mediante una operación stream. El método getDescripcionRuta() genera una descripción formateada que muestra cada segmento con su distancia individual y el total.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Composite en el proyecto de gestión de flotas se encuentra en el paquete aplicacion/rutas/composite/. Este paquete fue creado específicamente para contener las clases del patrón y mantener una separación clara de responsabilidades.

La interfaz RutaComponent extiende la interfaz RutaComponent del paquete decorator, lo que permite la integración con los decoradores existentes (TraficoDecorator, PeajeDecorator, ClimaDecorator). Esta decisión de diseño fue fundamental para lograr que los decoradores pudieran envolver tanto componentes simples como compuestos de manera transparente.

En la clase RutaSimpleComponent, cada instancia representa un segmento de ruta específico. El constructor recibe un objeto Ruta que contiene la información del recorrido (origen, destino y distancia). Esta clase implementa todos los métodos de la interfaz RutaComponent, proporcionando el comportamiento apropiado para una ruta individual.

La clase RutaCompuestaComponent utiliza una lista internally para almacenar los segmentos que la conforman. El método addSegmento() permite agregar nuevos segmentos a la composición, mientras que getDistanciaTotal() utiliza programación funcional con streams para calcular la suma de las distancias de todos los segmentos de manera recursiva.

La integración con el servicio de órdenes se realizó en la clase OrdenService. El flujo ahora genera dos rutas separadas: una desde la ubicación del vehículo hasta el origen de la orden, y otra desde el origen hasta el destino. Cada una de estas rutas se envuelve en un RutaSimpleComponent y se agrega a un RutaCompuestaComponent. El código cliente puede entonces trabajar con la ruta compuesta de la misma manera que trabajaría con una ruta simple.

La aplicación de decoradores sobre el composite demuestra la flexibilidad del patrón. Los decoradores pueden envolver cualquier componente que implemente la interfaz RutaComponent, ya sea una hoja (RutaSimpleComponent) o un compuesto (RutaCompuestaComponent). Esto permite que los ajustes por tráfico, peajes o condiciones climáticas se apliquen de manera uniforme sobre la estructura completa de la ruta.

La arquitectura hexagonal del proyecto se respeta completamente, ya que el patrón Composite se implementa en la capa de aplicación y no en el dominio. Las clases del dominio (como Ruta) permanecen sin cambios, y los componentes del patrón Composite actúan como orquestadores de la lógica de negocio relacionada con el procesamiento de rutas.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Composite implementado en el sistema:

@startuml
title Patrón Composite - Sistema de Rutas (Gestión de Flotas)

skinparam classAttributeIconSize 0

interface RutaComponent {
    + procesarRuta(ruta: Ruta) : Ruta
    + getDistanciaTotal() : double
    + getDescripcionRuta() : String
    + getSegmentos() : List<RutaComponent>
    + addSegmento(segmento: RutaComponent)
    + removeSegmento(segmento: RutaComponent)
    + isCompuesto() : boolean
}

class RutaSimpleComponent {
    - ruta : Ruta
    - ajusteDistancia : double
    + procesarRuta(ruta: Ruta) : Ruta
    + getDistanciaTotal() : double
    + getDescripcionRuta() : String
    + getSegmentos() : List<RutaComponent>
    + addSegmento(segmento: RutaComponent)
    + removeSegmento(segmento: RutaComponent)
    + isCompuesto() : boolean
    + getRuta() : Ruta
}

RutaComponent <|.. RutaSimpleComponent

class RutaCompuestaComponent {
    - nombreRuta : String
    - segmentos : List<RutaComponent>
    + procesarRuta(ruta: Ruta) : Ruta
    + getDistanciaTotal() : double
    + getDescripcionRuta() : String
    + getSegmentos() : List<RutaComponent>
    + addSegmento(segmento: RutaComponent)
    + removeSegmento(segmento: RutaComponent)
    + isCompuesto() : boolean
    + getCantidadSegmentos() : int
}

RutaComponent <|.. RutaCompuestaComponent
RutaCompuestaComponent o-- "*" RutaComponent : segmentos

class Ruta {
    - origen : String
    - destino : String
    - distancia : double
}

class OrdenService {
    - vehiculoRepository : VehiculoRepositoryPort
    - distanciaService : DistanciaServicePort
    - servicioRutas : ServicioRutas
    + crearYAsignarOrden(orden: OrdenTransporte) : OrdenTransporte
}

OrdenService --> RutaComponent : usa

@enduml

El diagrama muestra claramente la estructura del patrón Composite. La interfaz RutaComponent define el contrato común que implementan tanto RutaSimpleComponent (la hoja) como RutaCompuestaComponent (el compuesto). La relación de composición entre RutaCompuestaComponent y RutaComponent se representa mediante la agregación de múltiples segmentos. La clase OrdenService interactúa con los componentes de ruta de manera uniforme, sin necesidad de conocer si está trabajando con una ruta simple o compuesta.

PRUEBAS
Durante la implementación del patrón Composite se realizaron diversas pruebas para verificar su funcionamiento correcto dentro del sistema de gestión de flotas.

La primera prueba consistió en compilar el proyecto después de crear las clases del patrón. El resultado inicial fue un error de compilación relacionado con la ambigüedad de las interfaces RutaComponent. Existían dos interfaces con el mismo nombre en paquetes diferentes: com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent y com.flotasytransportes.aplicacion.rutas.composite.RutaComponent. Este conflicto impedía que el compilador determinara cuál interfaz debía utilizar la variable declarada en OrdenService.

La solución a este problema fue hacer que la interfaz RutaComponent del paquete composite heredara de la interfaz RutaComponent del paquete decorator. Esto se logró mediante la declaración: public interface RutaComponent extends com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent. Esta solución permitió mantener la compatibilidad con los decoradores existentes y resolver la ambigüedad.

Después de resolver el conflicto de interfaces, el proyecto compiló exitosamente. La segunda prueba consistió en ejecutar el servicio de órdenes a través del endpoint REST /ordenes/asignar para verificar el funcionamiento completo del patrón.

El flujo de ejecución demostró que el patrón Composite funciona correctamente dentro del sistema. El proceso inicia seleccionando el vehículo más cercano, luego genera dos rutas separadas mediante el patrón Bridge, construye la ruta compuesta agregando los segmentos correspondientes, calcula la distancia total de manera recursiva, y finalmente aplica los decoradores sobre el composite para obtener la ruta final con todos los ajustes.

La integración del patrón Composite con los patrones existentes (Bridge y Decorator) se demostró exitosa. Los decoradores pueden envolver tanto componentes simples como compuestos gracias a la interfaz común, y el cálculo de distancia total se realiza de manera uniforme sin importar la estructura interna de los componentes.

CONCLUSIONES
La implementación del patrón Composite en el Sistema de Gestión de Flotas demostró ser una solución efectiva para el manejo de rutas compuestas. El patrón permitió estructurar las rutas de transporte como estructuras jerárquicas donde cada segmento de ruta (vehículo a origen, origen a destino) se representa como un componente individual que puede ser combinado en estructuras más complejas.

Las principales ventajas observadas fueron las siguientes: código cliente simplificado que puede trabajar con rutas simples y compuestas de manera uniforme mediante la interfaz común; cálculo de distancia total mediante el método getDistanciaTotal() que agrega recursivamente las distancias de todos los segmentos; extensibilidad del sistema que permite agregar nuevos tipos de componentes o modificar la estructura de las rutas sin modificar el código existente; y integración perfecta con el patrón Decorator existente, ya que los decoradores pueden envolver cualquier implementación de la interfaz.

El patrón Composite complementa perfectamente los otros patrones implementados en el proyecto. El patrón Bridge genera las rutas base que se convierten en componentes, el patrón Decorator extiende la funcionalidad de los componentes de ruta, y el patrón Composite permite estructurar múltiples segmentos de ruta como una unidad lógica.

La arquitectura hexagonal del proyecto se mantuvo intacta, ya que el patrón Composite se implementó en la capa de aplicación sin modificar las clases del dominio. Esto demuestra que el patrón puede ser incorporado a sistemas existentes sin afectar su estructura fundamental, siempre cuando se respete la separación de responsabilidades entre capas.

La implementación del patrón Composite representa una mejora significativa en la capacidad del sistema para representar operaciones de transporte realistas, donde una orden puede involucrar múltiples segmentos de ruta que deben ser gestionados de manera unified.