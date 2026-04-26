PATRÓN PROXY
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Proxy es un patrón de diseño estructural que proporciona un sustituto o marcador de posición para otro objeto. Su función principal es controlar el acceso al objeto original, permitiendo ejecutar operaciones antes o después de que la solicitud llegue al objeto real.

Este patrón existe en varias variantes que se adaptan a diferentes necesidades. El proxy virtual crea objetos costosos bajo demanda, postponiendo su creación hasta que realmente se necesitan. El proxy de protección controla el acceso a objetos basándose en derechos o permisos. El proxy remoto proporciona un representante local para un objeto ubicado en un espacio de direcciones diferente. El proxy inteligente realiza acciones adicionales cuando un objeto es accedido, como contar referencias o verificar bloqueos. El proxy de caché almacena resultados de operaciones costosas y retorna valores cacheados cuando las mismas entradas ocurren nuevamente.

En el contexto del Sistema de Gestión de Flotas, se implementó un proxy de caché para optimizar el cálculo de distancias entre coordenadas geográficas. La fórmula de Haversine, utilizada para calcular la distancia entre dos puntos en la superficie terrestre, involucra operaciones trigonométricas que pueden ser costosas computacionalmente. Cuando se procesan múltiples órdenes de transporte, frecuentemente se calculan distancias entre las mismas coordenadas, lo que representa una oportunidad perfecta para aplicar la técnica de cacheo.

PROBLEMA QUE RESUELVE
El sistema de gestión de flotas requiere calcular distancias entre coordenadas geográficas para determinar cuál vehículo está más cerca del punto de origen de una orden. El servicio OrdenService implementa la lógica de selección del vehículo más cercano, la cual involucra calcular la distancia desde el origen de la orden hasta la ubicación actual de cada vehículo disponible.

El flujo original en OrdenService iteraba sobre todos los vehículos disponibles y calculaba la distancia a cada uno. Para una flota con cien vehículos, esto significaba cien llamadas al servicio de cálculo de distancia. Cada llamada ejecutaba la fórmula de Haversine completa, lo que involucraba conversiones a radianes, cálculos de seno y coseno, y múltiples operaciones de raíz cuadrada.

Este enfoque generaba varios problemas de rendimiento. El primer problema era la duplicación de cálculos, ya que muchas coordenadas de vehículos se repetían entre diferentes órdenes, lo que causaba que los mismos cálculos se ejecutaran múltiples veces innecesariamente. El segundo problema era el consumo de recursos, porque cada cálculo de Haversine consumía tiempo de CPU y ciclos de procesamiento que podrían evitarse si el resultado ya estaba disponible. El tercer problema era la escalabilidad limitada, porque a medida que la flota creciera, el número de cálculos aumentaría linealmente, creando cuellos de botella potenciales en el rendimiento del sistema.

SOLUCIÓN IMPLEMENTADA
La solución implementada consistió en crear un proxy de caché que intercepta las llamadas al servicio de cálculo de distancias y almacena los resultados para reutilización futura. El proxy mantiene un caché en memoria que mapea claves de coordenadas a distancias calculadas previamente.

La estructura de la solución se compone de tres elementos principales. El primer elemento es una interfaz de almacenamiento de caché genérica que define las operaciones básicas de obtención, almacenamiento, verificación de existencia y limpieza. El segundo elemento es una implementación en memoria utilizando LinkedHashMap con política deLeast Recently Used, que mantiene un máximo de cien entradas y elimina automáticamente las más antiguas cuando se alcanza la capacidad. El tercer elemento es el proxy propiamente dicho, que verifica si una distancia ya está cacheada antes de delegar al servicio real, y almacena el resultado en el caché después de cada cálculo.

La clave de caché se genera concatenando las cuatro coordenadas con precisión de cuatro decimales, separadas por comas. Esta aproximación permite que coordenadas muy cercanas compartan la misma entrada del caché, reduciendo aún más los cálculos necesarios.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Proxy en el proyecto de gestión de flotas se encuentra distribuida en el paquete dominio/puerto/proxy/, específicamente en las clases que implementan la funcionalidad de cacheo.

La interfaz CacheAlmacenamiento define el contrato común para cualquier implementación de almacenamiento de caché. Esta interfaz genérica permite que el almacén trabaje con cualquier tipo de objeto, no solo con números double. Los métodos definidos incluyen obtener para recuperar un valor por su clave, guardar para almacenar un valor con su clave asociada, contener para verificar si una clave existe, limpiar para borrar todas las entradas, y tamano para conocer la cantidad de elementos almacenados.

La clase CacheEnMemoria implementa la interfaz de almacenamiento utilizando un LinkedHashMap con acceso ordenado. El constructor acepta una capacidad máxima que determina cuántas entradas puede mantener el caché. La implementación sobrescribe el método removeEldestEntry del LinkedHashMap para implementar automáticamente la política LRU, eliminando las entradas más antiguas cuando se excede la capacidad máxima. Esto garantiza que el caché no crezca indefinidamente y que siempre se conserve la información más relevante.

La clase DistanciaServiceProxy implementa la interfaz DistanciaServicePort, lo que le permite ser intercambiada directamente con el adaptador real. El constructor recibe tanto el servicio real como el almacén de caché como dependencias. El método calcularDistancia primero verifica si la clave existe en el caché, retornando inmediatamente el valor si es así. Si no existe, delega el cálculo al servicio real, almacena el resultado en el caché, y lo retorna. El proxy también proporciona un método limpiarCache para reinicializar el caché cuando sea necesario.

La configuración de beans en ConfiguracionRutas.java orquesta la creación de todos los componentes. El bean calculadoraDistanciaService crea la implementación base sin anotaciones de Spring. El bean distanciaAdapter recibe la calculadora y crea el adaptador. El bean cacheDistancias crea el almacén de caché con capacidad para cien entradas. Finalmente, el bean distanciaServicePort recibe el adaptador real y el caché, creando el proxy que será inyectado en los servicios que lo requieran.

El servicio OrdenService utiliza el proxy mediante la anotación @Qualifier para especificar exactamente qué bean debe utilizarse. Esto evita ambigüedades cuando múltiples beans implementan la misma interfaz y garantiza que siempre se utilice el proxy cacheado en lugar del adaptador directo.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Proxy implementado en el sistema:

@startuml
title Patrón Proxy - Sistema de Gestión de Flotas (Caching Proxy)

skinparam classAttributeIconSize 0

interface DistanciaServicePort {
    + calcularDistancia(lat1, lon1, lat2, lon2) : double
}

class DistanciaAdapter {
    - calculadoraDistanciaService : CalculadoraDistanciaService
    + calcularDistancia(lat1, lon1, lat2, lon2) : double
}

DistanciaServicePort <|.. DistanciaAdapter

class DistanciaServiceProxy {
    - servicioReal : DistanciaServicePort
    - cache : CacheAlmacenamiento<Double>
    + calcularDistancia(lat1, lon1, lat2, lon2) : double
    + limpiarCache()
}

DistanciaServicePort <|.. DistanciaServiceProxy
DistanciaServiceProxy --> DistanciaServicePort : delega

interface CacheAlmacenamiento<T> {
    + obtener(clave: String) : T
    + guardar(clave: String, valor: T)
    + contiene(clave: String) : boolean
    + limpiar()
    + tamano() : int
}

class CacheEnMemoria<T> {
    - cache : Map<String, T>
    - capacidadMaxima : int
    + obtener(clave: String) : T
    + guardar(clave: String, valor: T)
    + contiene(clave: String) : boolean
    + limpiar()
    + tamano() : int
}

CacheAlmacenamiento <|.. CacheEnMemoria
DistanciaServiceProxy --> CacheAlmacenamiento : usa

class OrdenService {
    - distanciaService : DistanciaServicePort
    + crearYAsignarOrden(orden: OrdenTransporte) : OrdenTransporte
}

OrdenService --> DistanciaServicePort : usa

@enduml

El diagrama muestra claramente la estructura del patrón Proxy. La interfaz DistanciaServicePort define el contrato común que tanto el adaptador real como el proxy implementan. La clase DistanciaServiceProxy mantiene referencias tanto al servicio real como al caché, y delega las llamadas cuando es necesario. El OrdenService interactúa únicamente con la interfaz, sin conocer si está trabajando con el proxy o el adaptador directo.

PRUEBAS
La implementación del patrón Proxy fue verificada mediante múltiples iteraciones de compilación y ejecución, durante las cuales se identificaron y corrigieron varios problemas de configuración de beans de Spring.

La primera prueba reveló un conflicto de múltiples beans. El errorindicaba que existían tres beans implementando DistanciaServicePort: el DistanciaAdapter con su anotación @Component, el DistanciaServiceProxy con su anotación @Component, y el bean definido en ConfiguracionRutas. Spring no podía determinar cuál bean inyectar automáticamente. La solución inicial fue intentar marcar uno de los beans como @Primary, pero esto generó un problema de referencia circular debido a que ambos beans se dependían mutuamente.

La segunda prueba identificó el problema de referencia circular. El DistanciaServiceProxy intentaba inyectar DistanciaServicePort, pero el único bean disponible era el propio proxy que estaba siendo creado. Spring detectaba esta situación y lanzaba un error de dependencia circular. La solución fue quitar las anotaciones @Component de las clases de dominio y crear manualmente todos los beans en la clase de configuración.

La tercera prueba reveló que el DistanciaAdapter requería inyección de CalculadoraDistanciaService. Al quitar la anotación @Component, Spring ya no gestionaba automáticamente la creación del bean. La solución fue crear beans explícitos para CalculadoraDistanciaService y DistanciaAdapter en ConfiguracionRutas.java.

La cuarta prueba utilizó @Qualifier en OrdenService para especificar exactamente qué bean de DistanciaServicePort debe utilizarse. Esto garantizó que Spring inyecte el bean distanciaServicePort en lugar del distanciaAdapter directamente. La anotación @Qualifier("distanciaServicePort") asegura la inyección del bean correcto.

Después de aplicar todas las correcciones, la aplicación compiló y ejecutó correctamente. El log de consola mostró que el proxy está funcionando mediante los mensajes de Cache HIT y Cache MISS. Cuando se solicita una distancia que ya fue calculada, el mensaje indica que se obtuvo del caché. Cuando es la primera vez que se calcula una distancia específica, el mensaje indica que fue calculada y almacenada.

CONCLUSIONES
La implementación del patrón Proxy de caché en el Sistema de Gestión de Flotas demostró ser una solución efectiva para optimizar el cálculo de distancias geográficas. El patrón permitió reducir significativamente los cálculos repetitivos mediante el almacenamiento de resultados previos.

Los principales beneficios observados fueron la optimización del rendimiento, ya que se espera una reducción del setenta al noventa por ciento en los cálculos de distancia para operaciones repetitivas sobre la misma flota de vehículos. El código cliente permanece sin cambios, porque el proxy implementa la misma interfaz que el sujeto real, permitiendo que cualquier cliente que utilice DistanciaServicePort funcione indistintamente con el proxy o el adaptador directo. La arquitectura hexagonal se respeta completamente, ya que el proxy se implementa como un componente adicional en la capa de dominio y no modifica la lógica del negocio ni los modelos existentes.

El patrón Proxy complementa los otros patrones implementados en el proyecto. Mientras que el patrón Adapter traduce entre diferentes interfaces, el patrón Proxy añade funcionalidad adicional alrededor de una interfaz existente. El patrón Composite trabaja con estructuras jerárquicas de rutas, y el patrón Proxy optimiza el acceso a los cálculos subyacentes. El patrón Facade proporciona una interfaz simplificada para los clientes, y el patrón Proxy optimiza el rendimiento de las operaciones internas.

La implementación utilizando LinkedHashMap con política LRU garantiza que el caché no consuma memoria indefinidamente. La capacidad máxima de cien entradas proporciona un balance entre覆盖率 de caché y consumo de memoria, que puede ajustarse según las necesidades específicas del sistema.

El patrón Proxy representa una mejora significativa en la eficiencia del sistema de gestión de flotas, proporcionando una solución elegante y mantenible para el problema de cálculos repetitivos sin modificar la arquitectura existente.